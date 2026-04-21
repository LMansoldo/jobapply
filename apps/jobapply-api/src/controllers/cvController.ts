import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import CV, { CVLocale } from '../models/CV';
import Job from '../models/Job';
import User from '../models/User';
import PublishedCV from '../models/PublishedCV';
import { tailorCV as tailorCVService, generateCoverLetter as generateCoverLetterLLM, generateVideoScript as generateVideoScriptLLM } from '../services/llmService';
import { analyzeWithATS, generateCVWithATS, analyzeLinkedInWithATS } from '../services/atsService'
import { sanitizeUserInput } from '../utils/sanitize'
import { generateInterviewPrep } from '../services/interviewPrepService';

const VALID_LOCALES: CVLocale[] = ['en', 'pt-BR'];

export async function createCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await CV.findOne({ user: req.user.id });
    if (existing) { res.status(409).json({ message: 'CV already exists for this user' }); return; }

    const cv = await new CV({ user: req.user.id, ...req.body }).save();
    await User.findByIdAndUpdate(req.user.id, { cv: cv._id });
    res.status(201).json({ cv });
  } catch (err) {
    next(err);
  }
}

export async function getCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const locale = req.query.locale as string | undefined;
    if (locale) {
      if (!VALID_LOCALES.includes(locale as CVLocale)) {
        res.status(400).json({ message: `Invalid locale. Use: ${VALID_LOCALES.join(', ')}` });
        return;
      }
      const version = cv.localeVersions.find(v => v.locale === locale);
      if (!version) { res.status(404).json({ message: `No ${locale} version found for this CV` }); return; }
      const cvObj = cv.toObject();
      res.json({
        cv: {
          ...cvObj,
          ...(version.objective !== undefined && { objective: version.objective }),
          ...(version.summary !== undefined && { summary: version.summary }),
          ...(version.skills?.length && { skills: version.skills }),
          ...(version.experience?.length && { experience: version.experience }),
          ...(version.education?.length && { education: version.education }),
          locale,
        },
      });
      return;
    }

    res.json({ cv });
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'CastError') { res.status(404).json({ message: 'CV not found' }); return; }
    next(err);
  }
}

export async function updateCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const { user: _u, tailoredVersions: _tv, localeVersions: _lv, ...allowed } = req.body as Record<string, unknown>;
    Object.assign(cv, allowed);
    await cv.save();
    res.json({ cv });
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'CastError') { res.status(404).json({ message: 'CV not found' }); return; }
    next(err);
  }
}

export async function deleteCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    await cv.deleteOne();
    await User.findByIdAndUpdate(req.user.id, { cv: null });
    res.json({ message: 'CV deleted' });
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'CastError') { res.status(404).json({ message: 'CV not found' }); return; }
    next(err);
  }
}

export async function publishCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const user = await User.findById(req.user.id);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const { locale, ...overrides } = req.body as Record<string, unknown> & { locale?: string };

    const resolved = locale ? applyLocale(cv.toObject(), locale) : cv.toObject();

    const published = await PublishedCV.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          user: req.user.id,
          public_id: user.public_id,
          fullName: (overrides.fullName ?? resolved.fullName) as string,
          email: (overrides.email ?? resolved.email) as string,
          phone: overrides.phone ?? resolved.phone,
          location: overrides.location ?? resolved.location,
          linkedin: overrides.linkedin ?? resolved.linkedin,
          github: overrides.github ?? resolved.github,
          portfolio: overrides.portfolio ?? resolved.portfolio,
          objective: overrides.objective ?? resolved.objective,
          summary: overrides.summary ?? resolved.summary,
          skills: overrides.skills ?? resolved.skills,
          experience: overrides.experience ?? resolved.experience,
          education: overrides.education ?? resolved.education,
          languages: overrides.languages ?? resolved.languages,
          certifications: overrides.certifications ?? resolved.certifications,
          projects: overrides.projects ?? resolved.projects,
          published_at: new Date(),
        },
        $unset: { expertise: '', tailoredVersions: '', localeVersions: '' },
      },
      { upsert: true, new: true }
    );

    res.json({ published, public_id: user.public_id });
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'CastError') { res.status(404).json({ message: 'CV not found' }); return; }
    next(err);
  }
}

export async function tailorCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const { jobId } = req.body as { jobId?: string };
    if (!jobId) { res.status(400).json({ message: 'jobId is required' }); return; }

    const job = await Job.findById(jobId);
    if (!job) { res.status(404).json({ message: 'Job not found' }); return; }

    const tailoredContent = await tailorCVService(stripInternalFields(cv.toObject()), job.description);
    cv.tailoredVersions.push({
      jobId: new mongoose.Types.ObjectId(jobId),
      tailoredContent,
      createdAt: new Date(),
    });
    await cv.save();

    res.json({ tailoredCV: tailoredContent });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.name === 'CastError') { res.status(404).json({ message: 'Resource not found' }); return; }
    if (e.status) { res.status(502).json({ message: 'LLM service error', detail: e.message }); return; }
    next(err);
  }
}

const PT_BR_SIGNALS = [
  'você', 'empresa', 'vaga', 'cargo', 'equipe', 'nosso', 'nossa', 'será',
  'requisitos', 'experiência', 'habilidades', 'conhecimentos', 'responsabilidades',
  'profissional', 'oportunidade', 'candidato', 'benefícios', 'remuneração',
  'inglês', 'português', 'área', 'atuação', 'regime', 'contratação',
];

function detectLocale(text: string): 'pt-BR' | 'en' {
  const lower = text.toLowerCase();
  const ptMatches = PT_BR_SIGNALS.filter(w => lower.includes(w)).length;
  const hasAccents = /[ãçêáéíóúàâêîôûõ]/i.test(text);
  return (ptMatches >= 3 || (ptMatches >= 1 && hasAccents)) ? 'pt-BR' : 'en';
}

function stripInternalFields(cv: object): Record<string, unknown> {
  const { localeVersions: _lv, tailoredVersions: _tv, user: _u, __v: _v, ...clean } = cv as Record<string, unknown>;
  return clean;
}

function applyLocale(cv: ReturnType<typeof CV.prototype.toObject>, locale: string) {
  const version = (cv as { localeVersions?: Array<{ locale: string; objective?: string; summary?: string; skills?: unknown[]; experience?: unknown[]; education?: unknown[] }> }).localeVersions?.find(v => v.locale === locale);
  if (!version) return cv;
  return {
    ...cv,
    ...(version.objective !== undefined && { objective: version.objective }),
    ...(version.summary !== undefined && { summary: version.summary }),
    ...(version.skills?.length && { skills: version.skills }),
    ...(version.experience?.length && { experience: version.experience }),
    ...(version.education?.length && { education: version.education }),
  };
}

export async function analyzeCVWithATS(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const { jobId, jobDescription, cvMarkdown, locale } = req.body as {
      jobId?: string;
      jobDescription?: string;
      cvMarkdown?: string;
      locale?: string;
    };

    if (!jobId && !jobDescription) { res.status(400).json({ message: 'jobId or jobDescription is required' }); return; }
    if (!cvMarkdown) { res.status(400).json({ message: 'cvMarkdown is required' }); return; }

    let description = jobDescription;
    if (!description) {
      const job = await Job.findById(jobId);
      if (!job) { res.status(404).json({ message: 'Job not found' }); return; }
      description = job.description;
    }

    const sanitizedJD = sanitizeUserInput(description);
    const sanitizedMarkdown = sanitizeUserInput(cvMarkdown);

    const resolvedLocale = locale ?? detectLocale(description);
    const report = await analyzeWithATS(sanitizedMarkdown, sanitizedJD, resolvedLocale);

    res.json({ report, locale: resolvedLocale });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.name === 'CastError') { res.status(404).json({ message: 'Resource not found' }); return; }
    if (e.status) { res.status(502).json({ message: 'ATS agent error', detail: e.message }); return; }
    next(err);
  }
}

export async function coverLetterCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const { jobId, jobDescription, locale, rawVoiceInput, recipientName } = req.body as {
      jobId?: string;
      jobDescription?: string;
      locale?: string;
      rawVoiceInput?: { label: string; answer: string }[];
      recipientName?: string;
    };
    if (!jobId && !jobDescription) { res.status(400).json({ message: 'jobId or jobDescription is required' }); return; }

    let description = jobDescription;
    if (!description) {
      const job = await Job.findById(jobId);
      if (!job) { res.status(404).json({ message: 'Job not found' }); return; }
      description = job.description;
    }

    const resolvedLocale = locale ?? detectLocale(description);
    const cvData = stripInternalFields(applyLocale(cv.toObject(), resolvedLocale));
    const coverLetter = await generateCoverLetterLLM(cvData, description, {
      lang: resolvedLocale,
      rawVoiceInput,
      recipientName,
    });

    res.json({ coverLetter, locale: resolvedLocale });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.name === 'CastError') { res.status(404).json({ message: 'Resource not found' }); return; }
    if (e.status) { res.status(502).json({ message: 'LLM service error', detail: e.message }); return; }
    next(err);
  }
}

export async function videoScriptCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const { jobId, jobDescription, locale } = req.body as { jobId?: string; jobDescription?: string; locale?: string };
    if (!jobId && !jobDescription) { res.status(400).json({ message: 'jobId or jobDescription is required' }); return; }

    let description = jobDescription;
    if (!description) {
      const job = await Job.findById(jobId);
      if (!job) { res.status(404).json({ message: 'Job not found' }); return; }
      description = job.description;
    }

    const resolvedLocale = locale ?? detectLocale(description);
    const cvData = stripInternalFields(applyLocale(cv.toObject(), resolvedLocale));
    const script = await generateVideoScriptLLM(cvData, description);

    res.json({ script, locale: resolvedLocale });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.name === 'CastError') { res.status(404).json({ message: 'Resource not found' }); return; }
    if (e.status) { res.status(502).json({ message: 'LLM service error', detail: e.message }); return; }
    next(err);
  }
}

export async function interviewPrepCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const { jobId, jobDescription, locale } = req.body as { jobId?: string; jobDescription?: string; locale?: string };
    if (!jobId && !jobDescription) { res.status(400).json({ message: 'jobId or jobDescription is required' }); return; }

    let description = jobDescription;
    if (!description) {
      const job = await Job.findById(jobId);
      if (!job) { res.status(404).json({ message: 'Job not found' }); return; }
      description = job.description;
    }

    const resolvedLocale = locale ?? detectLocale(description);
    const cvData = stripInternalFields(applyLocale(cv.toObject(), resolvedLocale));
    const interviewPrep = await generateInterviewPrep(cvData, description, resolvedLocale);

    res.json({ interviewPrep, locale: resolvedLocale });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.name === 'CastError') { res.status(404).json({ message: 'Resource not found' }); return; }
    if (e.status) { res.status(502).json({ message: 'ATS agent error', detail: e.message }); return; }
    next(err);
  }
}

export async function upsertCVLocaleVersion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const locale = req.params.locale as CVLocale;
    if (!VALID_LOCALES.includes(locale)) {
      res.status(400).json({ message: `Invalid locale. Use: ${VALID_LOCALES.join(', ')}` });
      return;
    }

    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const { objective, summary, skills, experience, education } = req.body;

    const versionData = {
      locale,
      ...(objective !== undefined && { objective }),
      ...(summary !== undefined && { summary }),
      ...(skills !== undefined && { skills }),
      ...(experience !== undefined && { experience }),
      ...(education !== undefined && { education }),
    };

    const idx = cv.localeVersions.findIndex(v => v.locale === locale);
    if (idx >= 0) {
      cv.localeVersions[idx] = versionData as typeof cv.localeVersions[0];
    } else {
      cv.localeVersions.push(versionData as typeof cv.localeVersions[0]);
    }

    await cv.save();
    res.json({ localeVersion: cv.localeVersions.find(v => v.locale === locale) });
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'CastError') { res.status(404).json({ message: 'CV not found' }); return; }
    next(err);
  }
}

export async function deleteCVLocaleVersion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const locale = req.params.locale as CVLocale;
    if (!VALID_LOCALES.includes(locale)) {
      res.status(400).json({ message: `Invalid locale. Use: ${VALID_LOCALES.join(', ')}` });
      return;
    }

    const cv = await CV.findById(req.params.id);
    if (!cv) { res.status(404).json({ message: 'CV not found' }); return; }
    if (cv.user.toString() !== req.user.id) { res.status(403).json({ message: 'Access denied' }); return; }

    const idx = cv.localeVersions.findIndex(v => v.locale === locale);
    if (idx < 0) { res.status(404).json({ message: `No ${locale} version found` }); return; }

    cv.localeVersions.splice(idx, 1);
    await cv.save();
    res.json({ message: `${locale} version deleted` });
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'CastError') { res.status(404).json({ message: 'CV not found' }); return; }
    next(err);
  }
}

export async function analyzeCVDirect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { cv, jobDescription, locale } = req.body as {
      cv: object;
      jobDescription: string;
      locale?: 'en' | 'pt-BR';
    };

    if (!cv || !jobDescription) {
      res.status(400).json({ message: 'cv and jobDescription are required' });
      return;
    }

    const resolvedLocale = locale ?? detectLocale(jobDescription);
    const report = await analyzeWithATS(cv, jobDescription, resolvedLocale);

    res.json({ report, locale: resolvedLocale });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.status) {
      res.status(502).json({ message: 'ATS agent error', detail: e.message });
      return;
    }
    next(err);
  }
}

export async function generateCVDirect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { cv, jobDescription, locale } = req.body as {
      cv: object;
      jobDescription: string;
      locale?: 'en' | 'pt-BR';
    };

    if (!cv || !jobDescription) {
      res.status(400).json({ message: 'cv and jobDescription are required' });
      return;
    }

    const resolvedLocale = locale ?? detectLocale(jobDescription);
    const result = await generateCVWithATS(cv, jobDescription, resolvedLocale);

    res.json({ ...(result as Record<string, unknown>), locale: resolvedLocale });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.status) {
      res.status(502).json({ message: 'ATS agent error', detail: e.message });
      return;
    }
    next(err);
  }
}

export async function analyzeLinkedInDirect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { profile, targetRole, locale, voiceAnswers } = req.body as {
      profile: {
        headline: string;
        about: string;
        experience: string;
        skills: string;
        education: string;
        certifications?: string;
      };
      targetRole?: string;
      locale?: 'en' | 'pt-BR';
      voiceAnswers?: { label: string; answer: string }[];
    };

    if (!profile) {
      res.status(400).json({ message: 'profile is required' });
      return;
    }

    const resolvedLocale = locale ?? (targetRole ? detectLocale(targetRole) : detectLocale(profile.headline));
    const analysis = await analyzeLinkedInWithATS(profile, targetRole, resolvedLocale, voiceAnswers);

    res.json({ ...(analysis as Record<string, unknown>), locale: resolvedLocale });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.status) {
      res.status(502).json({ message: 'ATS agent error', detail: e.message });
      return;
    }
    next(err);
  }
}

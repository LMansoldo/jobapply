import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import CV, { CVLocale } from '../models/CV';
import Job from '../models/Job';
import User from '../models/User';
import PublishedCV from '../models/PublishedCV';
import { tailorCV as tailorCVService } from '../services/llmService';

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
          objective: version.objective ?? cvObj.objective,
          summary: version.summary ?? cvObj.summary,
          skills: version.skills ?? cvObj.skills,
          expertise: version.expertise?.length ? version.expertise : cvObj.expertise,
          experience: version.experience?.length ? version.experience : cvObj.experience,
          education: version.education ?? cvObj.education,
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

    const body = req.body as Partial<typeof cv>;

    const published = await PublishedCV.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        public_id: user.public_id,
        fullName: body.fullName ?? cv.fullName,
        email: body.email ?? cv.email,
        phone: body.phone ?? cv.phone,
        location: body.location ?? cv.location,
        linkedin: body.linkedin ?? cv.linkedin,
        objective: body.objective ?? cv.objective,
        summary: body.summary ?? cv.summary,
        skills: body.skills ?? cv.skills,
        expertise: body.expertise ?? cv.expertise,
        experience: body.experience ?? cv.experience,
        education: body.education ?? cv.education,
        languages: body.languages ?? cv.languages,
        published_at: new Date(),
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

    const tailoredContent = await tailorCVService(cv.toObject(), job.description);
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

    const { objective, summary, skills, expertise, experience, education } = req.body;

    const versionData = {
      locale,
      ...(objective !== undefined && { objective }),
      ...(summary !== undefined && { summary }),
      ...(skills !== undefined && { skills }),
      ...(expertise !== undefined && { expertise }),
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

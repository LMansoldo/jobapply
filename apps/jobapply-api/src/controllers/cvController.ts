import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import CV from '../models/CV';
import Job from '../models/Job';
import User from '../models/User';
import PublishedCV from '../models/PublishedCV';
import { tailorCV as tailorCVService } from '../services/llmService';

export async function createCV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await CV.findOne({ user: req.user.id });
    if (existing) { res.status(409).json({ message: 'CV already exists for this user' }); return; }

    const cv = await new CV({ user: req.user.id, ...req.body }).save();
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

    const { user: _u, tailoredVersions: _tv, ...allowed } = req.body as Record<string, unknown>;
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

    const { fullName, email, phone, summary, skills, experience, education, languages } = req.body as Partial<typeof cv>;

    const published = await PublishedCV.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        public_id: user.public_id,
        fullName: fullName ?? cv.fullName,
        email: email ?? cv.email,
        phone: phone ?? cv.phone,
        summary: summary ?? cv.summary,
        skills: skills ?? cv.skills,
        experience: experience ?? cv.experience,
        education: education ?? cv.education,
        languages: languages ?? cv.languages,
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

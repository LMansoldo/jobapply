import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Job from '../models/Job';
import { tailorJobDescription } from '../services/llmService';

export async function bulkCreate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { jobs } = req.body as { jobs?: unknown[] };
    if (!Array.isArray(jobs) || jobs.length === 0) {
      res.status(400).json({ message: 'jobs must be a non-empty array' });
      return;
    }

    const result = await Job.insertMany(jobs, { ordered: false });
    res.status(201).json({ inserted: result.length, jobs: result });
  } catch (err: unknown) {
    const bulkErr = err as { name?: string; insertedDocs?: unknown[] };
    if (bulkErr.name === 'MongoBulkWriteError' && bulkErr.insertedDocs) {
      res.status(201).json({ inserted: bulkErr.insertedDocs.length, jobs: bulkErr.insertedDocs });
      return;
    }
    next(err);
  }
}

export async function getJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) { res.status(404).json({ message: 'Job not found' }); return; }
    res.json({ job });
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'CastError') { res.status(404).json({ message: 'Job not found' }); return; }
    next(err);
  }
}

export async function deleteJob(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) { res.status(404).json({ message: 'Job not found' }); return; }
    res.json({ message: 'Job deleted' });
  } catch (err: unknown) {
    if ((err as { name?: string }).name === 'CastError') { res.status(404).json({ message: 'Job not found' }); return; }
    next(err);
  }
}

export async function listJobs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, company, location, status, tags, page = '1', limit = '20', sort = 'newest' } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};

    if (title) filter.title = { $regex: title, $options: 'i' };
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (status) filter.status = status;
    if (tags) filter.tags = { $in: tags.split(',').map(t => t.trim()) };

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const skip = (Number(page) - 1) * Number(limit);
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({ total, page: Number(page), limit: Number(limit), jobs });
  } catch (err) {
    next(err);
  }
}

export async function tailorDescription(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) { res.status(404).json({ message: 'Job not found' }); return; }

    const tailored = await tailorJobDescription(job.description);
    job.tailoredDescription = tailored;
    await job.save();

    res.json({ jobId: job._id, tailoredDescription: tailored });
  } catch (err: unknown) {
    const e = err as { name?: string; status?: number; message?: string };
    if (e.name === 'CastError') { res.status(404).json({ message: 'Job not found' }); return; }
    if (e.status) { res.status(502).json({ message: 'LLM service error', detail: e.message }); return; }
    next(err);
  }
}

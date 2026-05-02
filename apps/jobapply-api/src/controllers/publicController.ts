import { Request, Response, NextFunction } from 'express';
import PublishedCV from '../models/PublishedCV';

export async function getPublicCV(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const published = await PublishedCV.findOne({ public_id: req.params.public_id });
    if (!published) { res.status(404).json({ message: 'Public profile not found' }); return; }
    res.json({ cv: published });
  } catch (err) {
    next(err);
  }
}

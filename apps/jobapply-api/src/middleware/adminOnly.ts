import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';

export async function adminOnly(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    const user = await User.findById(req.user.id);
    if (!user || !admins.includes(user.email.toLowerCase())) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
}

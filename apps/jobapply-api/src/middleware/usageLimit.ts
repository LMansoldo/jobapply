import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';

const DAILY_LIMIT = 10;

function isToday(date: Date | null): boolean {
  if (!date) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export async function usageLimit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user.id);
    if (!user) { res.status(401).json({ message: 'User not found' }); return; }

    if (user.access_type === 'ultimate') { next(); return; }

    if (user.is_restricted) {
      res.status(403).json({ message: 'Account is restricted' });
      return;
    }

    if (!isToday(user.daily_usage.date)) {
      user.daily_usage.count = 0;
      user.daily_usage.date = new Date();
    }

    if (user.daily_usage.count >= DAILY_LIMIT) {
      res.status(429).json({
        message: 'Daily usage limit reached',
        limit: DAILY_LIMIT,
        resets_at: 'midnight',
      });
      return;
    }

    user.daily_usage.count += 1;
    await user.save();

    next();
  } catch (err) {
    next(err);
  }
}

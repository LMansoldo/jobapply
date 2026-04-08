import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';

const DAILY_LIMITS: Record<string, number> = {
  free: 5,
  premium: 50,
  ultimate: Infinity,
};

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

    if (user.is_restricted) {
      res.status(403).json({ message: 'Account is restricted' });
      return;
    }

    const limit = DAILY_LIMITS[user.access_type] ?? 5;
    if (limit === Infinity) { next(); return; }

    if (!isToday(user.daily_usage.date)) {
      user.daily_usage.count = 0;
      user.daily_usage.date = new Date();
    }

    if (user.daily_usage.count >= limit) {
      res.status(429).json({
        message: 'Daily usage limit reached',
        limit,
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

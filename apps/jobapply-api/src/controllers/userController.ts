import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
    if (!name || !email || !password) {
      res.status(400).json({ message: 'name, email and password are required' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const user = await new User({ name, email, password }).save();
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, cv: user.cv ?? null } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ message: 'email and password are required' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, cv: user.cv ?? null } });
  } catch (err) {
    next(err);
  }
}

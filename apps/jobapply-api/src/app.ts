import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/jobRoutes';
import cvRoutes from './routes/cvRoutes';
import voucherRoutes from './routes/voucherRoutes';
import publicRoutes from './routes/publicRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, try again later' },
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/users', authLimiter, userRoutes);
app.use('/jobs', jobRoutes);
app.use('/cv', cvRoutes);
app.use('/vouchers', voucherRoutes);
app.use('/public', publicRoutes);
app.use('/auth', authRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const status = err.status ?? 500;
  const message = status < 500 ? err.message : 'Internal server error';
  res.status(status).json({ message });
});

export default app;

import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/jobRoutes';
import cvRoutes from './routes/cvRoutes';
import voucherRoutes from './routes/voucherRoutes';
import publicRoutes from './routes/publicRoutes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/cv', cvRoutes);
app.use('/vouchers', voucherRoutes);
app.use('/public', publicRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status ?? 500).json({ message: err.message ?? 'Internal server error' });
});

export default app;

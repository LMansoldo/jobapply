import { Router, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { createVoucher, redeemVoucher, listVouchers, getVoucher } from '../controllers/voucherController';

const router = Router();

router.use(authMiddleware);

router.post('/', adminOnly as unknown as RequestHandler, createVoucher as unknown as RequestHandler);
router.post('/redeem', redeemVoucher as unknown as RequestHandler);
router.get('/', adminOnly as unknown as RequestHandler, listVouchers as unknown as RequestHandler);
router.get('/:code', adminOnly as unknown as RequestHandler, getVoucher as unknown as RequestHandler);

export default router;

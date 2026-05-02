import { Router, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createVoucher, redeemVoucher, listVouchers, getVoucher } from '../controllers/voucherController';

const router = Router();

router.use(authMiddleware);

router.post('/', createVoucher as unknown as RequestHandler);
router.post('/redeem', redeemVoucher as unknown as RequestHandler);
router.get('/', listVouchers as unknown as RequestHandler);
router.get('/:code', getVoucher as unknown as RequestHandler);

export default router;

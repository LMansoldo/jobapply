import { Router, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth';
import { usageLimit } from '../middleware/usageLimit';
import { createCV, getCV, updateCV, deleteCV, tailorCV, publishCV } from '../controllers/cvController';

const router = Router();

router.use(authMiddleware);

router.post('/', createCV as unknown as RequestHandler);
router.get('/:id', getCV as unknown as RequestHandler);
router.put('/:id', updateCV as unknown as RequestHandler);
router.delete('/:id', deleteCV as unknown as RequestHandler);
router.post('/:id/tailor', usageLimit as unknown as RequestHandler, tailorCV as unknown as RequestHandler);
router.post('/:id/publish', publishCV as unknown as RequestHandler);

export default router;

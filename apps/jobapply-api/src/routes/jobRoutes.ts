import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { usageLimit } from '../middleware/usageLimit';
import { bulkCreate, deleteJob, getJob, listJobs, tailorDescription } from '../controllers/jobController';
import { AuthRequest } from '../types';
import { RequestHandler } from 'express';

const router = Router();

router.use(authMiddleware);

router.post('/bulk', bulkCreate as unknown as RequestHandler);
router.get('/', listJobs as unknown as RequestHandler);
router.get('/:id', getJob as unknown as RequestHandler);
router.delete('/:id', deleteJob as unknown as RequestHandler);
router.post('/:id/tailor-description', usageLimit as unknown as RequestHandler, tailorDescription as unknown as RequestHandler);

export default router;

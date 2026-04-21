import { Router, RequestHandler } from 'express';
import { linkedinRedirect, linkedinCallback } from '../controllers/authController';

const router = Router();

router.get('/linkedin', linkedinRedirect as RequestHandler);
router.post('/linkedin/callback', linkedinCallback as RequestHandler);

export default router;

import { Router } from 'express';
import { getPublicCV } from '../controllers/publicController';

const router = Router();

router.get('/:public_id', getPublicCV);

export default router;

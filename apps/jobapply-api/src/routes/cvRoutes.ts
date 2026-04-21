import { Router, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth';
import { usageLimit } from '../middleware/usageLimit';
import { createCV, getCV, updateCV, deleteCV, tailorCV, publishCV, upsertCVLocaleVersion, deleteCVLocaleVersion, analyzeCVWithATS, coverLetterCV, videoScriptCV, interviewPrepCV, analyzeCVDirect, generateCVDirect, analyzeLinkedInDirect } from '../controllers/cvController';

const router = Router();

router.use(authMiddleware);

router.post('/analyze', usageLimit as unknown as RequestHandler, analyzeCVDirect as unknown as RequestHandler);
router.post('/generate', usageLimit as unknown as RequestHandler, generateCVDirect as unknown as RequestHandler);
router.post('/linkedin/analyze', usageLimit as unknown as RequestHandler, analyzeLinkedInDirect as unknown as RequestHandler);

router.post('/', createCV as unknown as RequestHandler);
router.get('/:id', getCV as unknown as RequestHandler);
router.put('/:id', updateCV as unknown as RequestHandler);
router.delete('/:id', deleteCV as unknown as RequestHandler);
router.post('/:id/tailor', usageLimit as unknown as RequestHandler, tailorCV as unknown as RequestHandler);
router.post('/:id/analyze', usageLimit as unknown as RequestHandler, analyzeCVWithATS as unknown as RequestHandler);
router.post('/:id/cover-letter', usageLimit as unknown as RequestHandler, coverLetterCV as unknown as RequestHandler);
router.post('/:id/video-script', usageLimit as unknown as RequestHandler, videoScriptCV as unknown as RequestHandler);
router.post('/:id/interview-prep', usageLimit as unknown as RequestHandler, interviewPrepCV as unknown as RequestHandler);
router.post('/:id/publish', publishCV as unknown as RequestHandler);
router.put('/:id/version/:locale', upsertCVLocaleVersion as unknown as RequestHandler);
router.delete('/:id/version/:locale', deleteCVLocaleVersion as unknown as RequestHandler);

export default router;

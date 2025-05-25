import { Router } from 'express';
import { storeTranscript, storeMCQs } from '../controllers/ai.controller';

const router = Router();

router.post('/store-transcript', storeTranscript);
router.post('/store-mcqs', storeMCQs);

export default router;

import express from 'express';
import { uploadVideo, getVideoResults } from '../controllers/upload.controller';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), uploadVideo);
router.get('/:videoId/results', getVideoResults);

export default router;
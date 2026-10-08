import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { uploadSingle, uploadMultiple } from '../middleware/upload';
import * as uploadController from '../controllers/uploadController';

const router = Router();

router.post('/image', authenticate, authorize('admin', 'editor'), uploadSingle('image'), uploadController.uploadImage);
router.post('/images', authenticate, authorize('admin', 'editor'), uploadMultiple('images', 10), uploadController.uploadMultipleImages);
router.delete('/image', authenticate, authorize('admin', 'editor'), uploadController.deleteImage);

export default router;
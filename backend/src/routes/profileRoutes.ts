import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { uploadSingle, uploadMultiple } from '../middleware/upload';
import * as profileController from '../controllers/profileController';
import * as validators from '../validators';

const router = Router();

router.get('/', profileController.getProfile);
router.put('/', authenticate, authorize('admin', 'editor'), validate(validators.profileSchema), profileController.updateProfile);
router.post('/avatar', authenticate, authorize('admin', 'editor'), uploadSingle('avatar'), profileController.uploadAvatar);
router.post('/resume', authenticate, authorize('admin', 'editor'), uploadSingle('resume'), profileController.uploadResume);

export default router;
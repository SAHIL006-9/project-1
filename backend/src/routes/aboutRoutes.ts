import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as aboutController from '../controllers/aboutController';
import * as validators from '../validators';

const router = Router();

router.get('/', aboutController.getAbout);
router.put('/', authenticate, authorize('admin', 'editor'), validate(validators.aboutSchema), aboutController.updateAbout);

router.post('/skills', authenticate, authorize('admin', 'editor'), aboutController.addSkill);
router.put('/skills/:skillId', authenticate, authorize('admin', 'editor'), aboutController.updateSkill);
router.delete('/skills/:skillId', authenticate, authorize('admin', 'editor'), aboutController.deleteSkill);

export default router;
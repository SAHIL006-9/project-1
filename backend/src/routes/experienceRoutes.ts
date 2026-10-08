import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as experienceController from '../controllers/experienceController';
import * as validators from '../validators';

const router = Router();

router.get('/', experienceController.getExperiences);
router.get('/featured', experienceController.getExperiences); // Can filter featured in query
router.get('/:id', validate(validators.idParamSchema), experienceController.getExperience);

router.post('/', authenticate, authorize('admin', 'editor'), validate(validators.experienceSchema), experienceController.createExperience);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(validators.idParamSchema), validate(validators.experienceSchema), experienceController.updateExperience);
router.delete('/:id', authenticate, authorize('admin', 'editor'), validate(validators.idParamSchema), experienceController.deleteExperience);
router.put('/reorder', authenticate, authorize('admin', 'editor'), experienceController.reorderExperiences);

export default router;
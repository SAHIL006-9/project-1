import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as projectController from '../controllers/projectController';
import * as validators from '../validators';

const router = Router();

router.get('/', projectController.getProjects);
router.get('/featured', projectController.getFeaturedProjects);
router.get('/tech-stack', projectController.getTechStack);
router.get('/slug/:slug', validate(validators.slugParamSchema), projectController.getProject);
router.get('/:id', validate(validators.idParamSchema), projectController.getProjectById);

router.post('/', authenticate, authorize('admin', 'editor'), validate(validators.projectSchema), projectController.createProject);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(validators.idParamSchema), validate(validators.projectSchema), projectController.updateProject);
router.delete('/:id', authenticate, authorize('admin', 'editor'), validate(validators.idParamSchema), projectController.deleteProject);
router.put('/reorder', authenticate, authorize('admin', 'editor'), projectController.reorderProjects);

export default router;
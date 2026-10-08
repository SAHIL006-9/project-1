import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as certificationController from '../controllers/certificationController';
import * as validators from '../validators';

const router = Router();

router.get('/', certificationController.getCertifications);
router.get('/active', certificationController.getActiveCertifications);
router.get('/:id', validate(validators.idParamSchema), certificationController.getCertification);

router.post('/', authenticate, authorize('admin', 'editor'), validate(validators.certificationSchema), certificationController.createCertification);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(validators.idParamSchema), validate(validators.certificationSchema), certificationController.updateCertification);
router.delete('/:id', authenticate, authorize('admin', 'editor'), validate(validators.idParamSchema), certificationController.deleteCertification);
router.put('/reorder', authenticate, authorize('admin', 'editor'), certificationController.reorderCertifications);

export default router;
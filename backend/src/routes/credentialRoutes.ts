import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as credentialController from '../controllers/credentialController';
import * as validators from '../validators';

const router = Router();

router.get('/', credentialController.getCredentials);
router.get('/:id', validate(validators.idParamSchema), credentialController.getCredential);

router.post('/', authenticate, authorize('admin', 'editor'), validate(validators.credentialSchema), credentialController.createCredential);
router.put('/:id', authenticate, authorize('admin', 'editor'), validate(validators.idParamSchema), validate(validators.credentialSchema), credentialController.updateCredential);
router.delete('/:id', authenticate, authorize('admin', 'editor'), validate(validators.idParamSchema), credentialController.deleteCredential);
router.put('/reorder', authenticate, authorize('admin', 'editor'), credentialController.reorderCredentials);

export default router;
import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as validators from '../validators';

const router = Router();

router.post('/register', authLimiter, validate(validators.registerSchema), authController.register);
router.post('/login', authLimiter, validate(validators.loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, validate(validators.updateProfileSchema), authController.updateProfile);
router.put('/password', authenticate, validate(validators.changePasswordSchema), authController.changePassword);

export default router;
import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import aboutRoutes from './aboutRoutes';
import experienceRoutes from './experienceRoutes';
import projectRoutes from './projectRoutes';
import credentialRoutes from './credentialRoutes';
import certificationRoutes from './certificationRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/about', aboutRoutes);
router.use('/experience', experienceRoutes);
router.use('/projects', projectRoutes);
router.use('/credentials', credentialRoutes);
router.use('/certifications', certificationRoutes);
router.use('/upload', uploadRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

export default router;
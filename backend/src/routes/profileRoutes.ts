import { Router } from 'express';
import { body } from 'express-validator';
import { profileController } from '../config/dependencyInjector';
import { validate } from '../middlewares/validateMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', profileController.getProfile);
router.put('/', [body('name').optional().trim().isLength({ max: 50 })], validate, profileController.updateProfile);
router.patch('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], validate, profileController.changePassword);

export default router;

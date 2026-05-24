import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../config/dependencyInjector';
import { validate } from '../middlewares/validateMiddleware';
import { authRateLimiter } from '../middlewares/rateLimiter';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', authRateLimiter, registerValidation, validate, authController.register);
router.post('/login', authRateLimiter, loginValidation, validate, authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me', authMiddleware, authController.getMe);

export default router;

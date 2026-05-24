import { Router } from 'express';
import { body } from 'express-validator';
import { habitController } from '../config/dependencyInjector';
import { validate } from '../middlewares/validateMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware);

const createValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('frequency').optional().isIn(['daily', 'weekly']).withMessage('Invalid frequency'),
  body('targetDays').optional().isArray(),
  body('category').optional().isIn(['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'other']),
];

router.post('/', createValidation, validate, habitController.createHabit);
router.get('/', habitController.getHabits);
router.get('/:id', habitController.getHabitById);
router.put('/:id', createValidation, validate, habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);
router.patch('/:id/toggle', habitController.toggleCompletion);
router.get('/:id/logs', habitController.getHabitLogs);

export default router;

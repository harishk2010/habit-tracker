import { Router } from 'express';
import { dashboardController } from '../config/dependencyInjector';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware);
router.get('/', dashboardController.getDashboard);

export default router;

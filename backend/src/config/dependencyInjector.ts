// Dependency Injector — manual constructor injection
// Flow: Repository → Service → Controller

import { UserRepository } from '../repositories/user/userRepository';
import { HabitRepository } from '../repositories/habit/habitRepository';
import { HabitLogRepository } from '../repositories/habitLog/habitLogRepository';

import { AuthService } from '../services/auth/authService';
import { HabitService } from '../services/habit/habitService';
import { DashboardService } from '../services/dashboard/dashboardService';
import { ProfileService } from '../services/profile/profileService';

import { AuthController } from '../controllers/auth/authController';
import { HabitController } from '../controllers/habit/habitController';
import { DashboardController } from '../controllers/dashboard/dashboardController';
import { ProfileController } from '../controllers/profile/profileController';

// ── Repositories ─────────────────────────────────────────────────────────────
const userRepository = new UserRepository();
const habitRepository = new HabitRepository();
const habitLogRepository = new HabitLogRepository();

// ── Services ──────────────────────────────────────────────────────────────────
const authService = new AuthService(userRepository);
const habitService = new HabitService(habitRepository, habitLogRepository);
const dashboardService = new DashboardService(habitRepository, habitLogRepository);
const profileService = new ProfileService(userRepository);

// ── Controllers ───────────────────────────────────────────────────────────────
export const authController = new AuthController(authService);
export const habitController = new HabitController(habitService);
export const dashboardController = new DashboardController(dashboardService);
export const profileController = new ProfileController(profileService);

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export type HabitFrequency = 'daily' | 'weekly';
export type HabitCategory = 'health' | 'fitness' | 'learning' | 'productivity' | 'mindfulness' | 'other';

export interface Habit {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  targetDays: number[];
  color: string;
  icon: string;
  category: HabitCategory;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  isActive: boolean;
  completedToday: boolean;
  createdAt: string;
}

export interface HabitLog {
  _id: string;
  habitId: string;
  userId: string;
  completedAt: string;
  note?: string;
}

export interface DailyStats { date: string; completed: number; total: number; rate: number; }
export interface HabitStreak { habitId: string; title: string; icon: string; color: string; currentStreak: number; }

export interface DashboardData {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  totalStreaks: number;
  longestStreak: number;
  weeklyProgress: DailyStats[];
  topStreaks: HabitStreak[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CreateHabitInput {
  title: string;
  description?: string;
  frequency: HabitFrequency;
  targetDays?: number[];
  color?: string;
  icon?: string;
  category?: HabitCategory;
}

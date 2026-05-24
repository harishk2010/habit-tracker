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

export interface IDashboardService {
  getDashboardData(userId: string): Promise<DashboardData>;
}

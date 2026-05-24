import {
  IDashboardService,
  DashboardData,
  DailyStats,
  HabitStreak,
} from "../interfaces/IDashboardService";
import { IHabitRepository } from "../../repositories/interfaces/IHabitRepository";
import { IHabitLogRepository } from "../../repositories/interfaces/IHabitLogRepository";
import {
  getWeekDates,
  startOfDay,
  endOfDay,
  isSameDay,
} from "../../utils/streakCalculator";

export class DashboardService implements IDashboardService {
  private habitRepository: IHabitRepository;
  private habitLogRepository: IHabitLogRepository;

  constructor(
    habitRepository: IHabitRepository,
    habitLogRepository: IHabitLogRepository,
  ) {
    this.habitRepository = habitRepository;
    this.habitLogRepository = habitLogRepository;
  }

  async getDashboardData(userId: string): Promise<DashboardData> {
    const habits = await this.habitRepository.findActiveByUserId(userId);
    const totalHabits = habits.length;

    const today = new Date();
    const todayLogs = await this.habitLogRepository.findByUserAndDate(
      userId,
      startOfDay(today),
      endOfDay(today),
    );

    const completedTodayHabitIds = new Set(
      todayLogs.map((l) => String(l.habitId)),
    );
    const completedToday = completedTodayHabitIds.size;
    const completionRate =
      totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    const weekDates = getWeekDates();
    const weekStart = weekDates[0];
    const weekEnd = endOfDay(weekDates[weekDates.length - 1]);
    const weekLogs = await this.habitLogRepository.findByUserAndDate(
      userId,
      weekStart,
      weekEnd,
    );

    const weeklyProgress: DailyStats[] = weekDates.map((date) => {
      const dayLogs = weekLogs.filter((l) =>
        isSameDay(new Date(l.completedAt), date),
      );
      const completed = new Set(dayLogs.map((l) => String(l.habitId))).size;
      const rate =
        totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;
      return {
        date: date.toISOString().split("T")[0],
        completed,
        total: totalHabits,
        rate,
      };
    });

    const totalStreaks = habits.reduce((sum, h) => sum + h.currentStreak, 0);
    const longestStreak = habits.reduce(
      (max, h) => Math.max(max, h.longestStreak),
      0,
    );

    const topStreaks: HabitStreak[] = habits
      .filter((h) => h.currentStreak > 0)
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 5)
      .map((h) => ({
        habitId: String(h._id),
        title: h.title,
        icon: h.icon,
        color: h.color,
        currentStreak: h.currentStreak,
      }));

    return {
      totalHabits,
      completedToday,
      completionRate,
      totalStreaks,
      longestStreak,
      weeklyProgress,
      topStreaks,
    };
  }
}

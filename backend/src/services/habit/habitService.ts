import mongoose from "mongoose";
import {
  IHabitService,
  CreateHabitPayload,
  HabitWithStatus,
} from "../interfaces/IHabitService";
import { IHabitRepository } from "../../repositories/interfaces/IHabitRepository";
import { IHabitLogRepository } from "../../repositories/interfaces/IHabitLogRepository";
import { IHabit } from "../../models/habitModel";
import { IHabitLog } from "../../models/habitLogModel";
import { HabitMessages } from "../../utils/constants";
import { StatusCode } from "../../utils/enums";
import { calculateStreak } from "../../utils/streakCalculator";

class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class HabitService implements IHabitService {
  private habitRepository: IHabitRepository;
  private habitLogRepository: IHabitLogRepository;

  constructor(
    habitRepository: IHabitRepository,
    habitLogRepository: IHabitLogRepository,
  ) {
    this.habitRepository = habitRepository;
    this.habitLogRepository = habitLogRepository;
  }

  private async verifyOwnership(
    habitId: string,
    userId: string,
  ): Promise<IHabit> {
    const habit = await this.habitRepository.findById(habitId);
    if (!habit)
      throw new AppError(HabitMessages.NOT_FOUND, StatusCode.NOT_FOUND);
    if (String(habit.userId) !== userId)
      throw new AppError(HabitMessages.UNAUTHORIZED, StatusCode.FORBIDDEN);
    return habit;
  }

  async createHabit(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<IHabit> {
    return await this.habitRepository.create({
      ...payload,
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  async getHabits(userId: string): Promise<HabitWithStatus[]> {
    const habits = await this.habitRepository.findActiveByUserId(userId);
    const results = await Promise.all(
      habits.map(async (habit) => {
        const todayLog = await this.habitLogRepository.getTodayLog(
          String(habit._id),
          userId,
        );
        return { ...habit, completedToday: !!todayLog } as HabitWithStatus;
      }),
    );
    return results;
  }

  async getHabitById(habitId: string, userId: string): Promise<IHabit> {
    return await this.verifyOwnership(habitId, userId);
  }

  async updateHabit(
    habitId: string,
    userId: string,
    payload: Partial<CreateHabitPayload>,
  ): Promise<IHabit> {
    await this.verifyOwnership(habitId, userId);
    const updated = await this.habitRepository.update(habitId, payload);
    if (!updated)
      throw new AppError(HabitMessages.NOT_FOUND, StatusCode.NOT_FOUND);
    return updated;
  }

  async deleteHabit(habitId: string, userId: string): Promise<void> {
    await this.verifyOwnership(habitId, userId);
    await this.habitRepository.delete(habitId);
    await this.habitLogRepository.deleteMany({
      habitId: new mongoose.Types.ObjectId(habitId),
    });
  }

  async toggleHabitCompletion(
    habitId: string,
    userId: string,
  ): Promise<{ completed: boolean; habit: IHabit }> {
    const habit = await this.verifyOwnership(habitId, userId);
    const todayLog = await this.habitLogRepository.getTodayLog(habitId, userId);

    if (todayLog) {
      // Undo completion
      await this.habitLogRepository.delete(String(todayLog._id));
      const allLogs = await this.habitLogRepository.findAllByHabitId(habitId);
      const { currentStreak, longestStreak } = calculateStreak(allLogs);
      const updatedHabit = await this.habitRepository.incrementStreak(
        habitId,
        currentStreak,
        longestStreak,
        Math.max(0, habit.totalCompletions - 1),
      );
      return { completed: false, habit: updatedHabit! };
    } else {
      // Mark complete
      await this.habitLogRepository.create({
        habitId: new mongoose.Types.ObjectId(habitId),
        userId: new mongoose.Types.ObjectId(userId),
        completedAt: new Date(),
      });
      const allLogs = await this.habitLogRepository.findAllByHabitId(habitId);
      const { currentStreak, longestStreak } = calculateStreak(allLogs);
      const updatedHabit = await this.habitRepository.incrementStreak(
        habitId,
        currentStreak,
        Math.max(longestStreak, habit.longestStreak),
        habit.totalCompletions + 1,
      );
      return { completed: true, habit: updatedHabit! };
    }
  }

  async getHabitLogs(habitId: string, userId: string): Promise<IHabitLog[]> {
    await this.verifyOwnership(habitId, userId);
    return await this.habitLogRepository.findAllByHabitId(habitId);
  }
}

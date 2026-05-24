import { GenericRepository } from '../GenericRepository';
import { IHabitLogRepository } from '../interfaces/IHabitLogRepository';
import { IHabitLog, HabitLogModel } from '../../models/habitLogModel';
import { startOfDay, endOfDay } from '../../utils/streakCalculator';

export class HabitLogRepository extends GenericRepository<IHabitLog> implements IHabitLogRepository {
  constructor() {
    super(HabitLogModel);
  }

  async findByHabitAndDate(habitId: string, startDate: Date, endDate: Date): Promise<IHabitLog[]> {
    return await this.model
      .find({ habitId, completedAt: { $gte: startDate, $lte: endDate } })
      .sort({ completedAt: -1 })
      .lean() as unknown as IHabitLog[];
  }

  async findByUserAndDate(userId: string, startDate: Date, endDate: Date): Promise<IHabitLog[]> {
    return await this.model
      .find({ userId, completedAt: { $gte: startDate, $lte: endDate } })
      .sort({ completedAt: -1 })
      .lean() as unknown as IHabitLog[];
  }

  async findAllByHabitId(habitId: string): Promise<IHabitLog[]> {
    return await this.model
      .find({ habitId })
      .sort({ completedAt: -1 })
      .lean() as unknown as IHabitLog[];
  }

  async getTodayLog(habitId: string, userId: string): Promise<IHabitLog | null> {
    const today = new Date();
    return await this.model.findOne({
      habitId,
      userId,
      completedAt: { $gte: startOfDay(today), $lte: endOfDay(today) },
    });
  }
}

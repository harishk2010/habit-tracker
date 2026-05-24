import { IGenericRepository } from '../GenericRepository';
import { IHabitLog } from '../../models/habitLogModel';

export interface IHabitLogRepository extends IGenericRepository<IHabitLog> {
  findByHabitAndDate(habitId: string, startDate: Date, endDate: Date): Promise<IHabitLog[]>;
  findByUserAndDate(userId: string, startDate: Date, endDate: Date): Promise<IHabitLog[]>;
  findAllByHabitId(habitId: string): Promise<IHabitLog[]>;
  getTodayLog(habitId: string, userId: string): Promise<IHabitLog | null>;
}

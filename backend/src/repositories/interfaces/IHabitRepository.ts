import { IGenericRepository } from '../GenericRepository';
import { IHabit } from '../../models/habitModel';

export interface IHabitRepository extends IGenericRepository<IHabit> {
  findByUserId(userId: string): Promise<IHabit[]>;
  findActiveByUserId(userId: string): Promise<IHabit[]>;
  incrementStreak(id: string, currentStreak: number, longestStreak: number, totalCompletions: number): Promise<IHabit | null>;
  resetStreak(id: string): Promise<IHabit | null>;
}

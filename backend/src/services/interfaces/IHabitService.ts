import { IHabit } from '../../models/habitModel';
import { IHabitLog } from '../../models/habitLogModel';

export interface CreateHabitPayload {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  targetDays?: number[];
  color?: string;
  icon?: string;
  category?: 'health' | 'fitness' | 'learning' | 'productivity' | 'mindfulness' | 'other';
}

export interface HabitWithStatus extends IHabit {
  completedToday: boolean;
}

export interface IHabitService {
  createHabit(userId: string, payload: CreateHabitPayload): Promise<IHabit>;
  getHabits(userId: string): Promise<HabitWithStatus[]>;
  getHabitById(habitId: string, userId: string): Promise<IHabit>;
  updateHabit(habitId: string, userId: string, payload: Partial<CreateHabitPayload>): Promise<IHabit>;
  deleteHabit(habitId: string, userId: string): Promise<void>;
  toggleHabitCompletion(habitId: string, userId: string): Promise<{ completed: boolean; habit: IHabit }>;
  getHabitLogs(habitId: string, userId: string): Promise<IHabitLog[]>;
}

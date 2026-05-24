import api from './api';
import { Habit, CreateHabitInput, HabitLog } from '../types';

export const habitService = {
  getHabits: async (): Promise<Habit[]> => {
    const res = await api.get('/habits');
    return res.data.data.habits;
  },
  getHabit: async (id: string): Promise<Habit> => {
    const res = await api.get(`/habits/${id}`);
    return res.data.data.habit;
  },
  createHabit: async (data: CreateHabitInput): Promise<Habit> => {
    const res = await api.post('/habits', data);
    return res.data.data.habit;
  },
  updateHabit: async (id: string, data: Partial<CreateHabitInput>): Promise<Habit> => {
    const res = await api.put(`/habits/${id}`, data);
    return res.data.data.habit;
  },
  deleteHabit: async (id: string): Promise<void> => { await api.delete(`/habits/${id}`); },
  toggleCompletion: async (id: string): Promise<{ completed: boolean; habit: Habit }> => {
    const res = await api.patch(`/habits/${id}/toggle`);
    return res.data.data;
  },
  getHabitLogs: async (id: string): Promise<HabitLog[]> => {
    const res = await api.get(`/habits/${id}/logs`);
    return res.data.data.logs;
  },
};

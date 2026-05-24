import api from './api';
import { User } from '../types';

export const profileService = {
  getProfile: async (): Promise<User> => {
    const res = await api.get('/profile');
    return res.data.data.user;
  },
  updateProfile: async (data: { name?: string; avatar?: string }): Promise<User> => {
    const res = await api.put('/profile', data);
    return res.data.data.user;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.patch('/profile/password', data);
  },
};

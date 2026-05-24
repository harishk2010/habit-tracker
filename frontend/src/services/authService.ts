import api from './api';
import { User } from '../types';

export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post('/auth/register', data);
    return res.data.data.user as User;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/login', data);
    return res.data.data.user as User;
  },
  logout: async () => { await api.post('/auth/logout'); },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data.user as User;
  },
};

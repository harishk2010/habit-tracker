import { IUser } from '../../models/userModel';

export interface UpdateProfilePayload { name?: string; avatar?: string; }
export interface ChangePasswordPayload { currentPassword: string; newPassword: string; }

export interface IProfileService {
  getProfile(userId: string): Promise<IUser>;
  updateProfile(userId: string, payload: UpdateProfilePayload): Promise<IUser>;
  changePassword(userId: string, payload: ChangePasswordPayload): Promise<void>;
}

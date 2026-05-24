import { IUser } from '../../models/userModel';

export interface RegisterPayload { name: string; email: string; password: string; }
export interface LoginPayload { email: string; password: string; }
export interface AuthTokens { accessToken: string; refreshToken: string; }
export interface AuthResult { user: Partial<IUser>; tokens: AuthTokens; }

export interface IAuthService {
  register(payload: RegisterPayload): Promise<AuthResult>;
  login(payload: LoginPayload): Promise<AuthResult>;
  refreshTokens(refreshToken: string): Promise<AuthTokens>;
  getProfile(userId: string): Promise<IUser>;
}

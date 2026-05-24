import {
  IAuthService,
  RegisterPayload,
  LoginPayload,
  AuthResult,
  AuthTokens,
} from "../interfaces/IAuthService";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { IUser } from "../../models/userModel";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { AuthMessages } from "../../utils/constants";
import { StatusCode } from "../../utils/enums";

class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private generateTokenPair(user: IUser): AuthTokens {
    const payload = {
      id: String(user._id),
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const existing = await this.userRepository.findByEmail(payload.email);
    if (existing)
      throw new AppError(AuthMessages.EMAIL_EXISTS, StatusCode.CONFLICT);

    const user = await this.userRepository.create(payload);
    const tokens = this.generateTokenPair(user);
    const userObj = user.toObject() as Record<string, unknown>;
    const { password: _pw, ...safeUser } = userObj;
    return { user: safeUser as Partial<IUser>, tokens };
  }

  async login(payload: LoginPayload): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user)
      throw new AppError(
        AuthMessages.INVALID_CREDENTIALS,
        StatusCode.UNAUTHORIZED,
      );

    const isMatch = await user.comparePassword(payload.password);
    if (!isMatch)
      throw new AppError(
        AuthMessages.INVALID_CREDENTIALS,
        StatusCode.UNAUTHORIZED,
      );

    const tokens = this.generateTokenPair(user);
    const userObj = user.toObject() as Record<string, unknown>;
    const { password: _pw, ...safeUser } = userObj;
    return { user: safeUser as Partial<IUser>, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(payload.id);
      if (!user)
        throw new AppError(
          AuthMessages.USER_NOT_FOUND,
          StatusCode.UNAUTHORIZED,
        );
      return this.generateTokenPair(user);
    } catch {
      throw new AppError(AuthMessages.INVALID_TOKEN, StatusCode.UNAUTHORIZED);
    }
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId, "-password");
    if (!user)
      throw new AppError(AuthMessages.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  }
}

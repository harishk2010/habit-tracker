import {
  IProfileService,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../interfaces/IProfileService";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { IUser, UserModel } from "../../models/userModel";
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

export class ProfileService implements IProfileService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await this.userRepository.findById(userId, "-password");
    if (!user)
      throw new AppError(AuthMessages.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  }

  async updateProfile(
    userId: string,
    payload: UpdateProfilePayload,
  ): Promise<IUser> {
    const user = await this.userRepository.update(userId, payload);
    if (!user)
      throw new AppError(AuthMessages.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    return user;
  }

  async changePassword(
    userId: string,
    { currentPassword, newPassword }: ChangePasswordPayload,
  ): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user)
      throw new AppError(AuthMessages.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      throw new AppError(AuthMessages.WRONG_PASSWORD, StatusCode.BAD_REQUEST);
    user.password = newPassword;
    await user.save();
  }
}

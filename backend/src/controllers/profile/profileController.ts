import { Request, Response, NextFunction } from "express";
import { IProfileController } from "../interfaces/IProfileController";
import { IProfileService } from "../../services/interfaces/IProfileService";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthMessages } from "../../utils/constants";
import { StatusCode } from "../../utils/enums";

export class ProfileController implements IProfileController {
  private profileService: IProfileService;

  constructor(profileService: IProfileService) {
    this.profileService = profileService;
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.profileService.getProfile(req.user!.id);
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success("Profile fetched", { user }));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.profileService.updateProfile(
        req.user!.id,
        req.body,
      );
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success(AuthMessages.PROFILE_UPDATED, { user }));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.profileService.changePassword(req.user!.id, req.body);
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success(AuthMessages.PASSWORD_CHANGED));
    } catch (error) {
      next(error);
    }
  }
}

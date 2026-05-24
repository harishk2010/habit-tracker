import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interfaces/IAuthController";
import { IAuthService } from "../../services/interfaces/IAuthService";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthMessages } from "../../utils/constants";
import { StatusCode } from "../../utils/enums";
import { cookieOptions } from "../../utils/jwt";

export class AuthController implements IAuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.getMe = this.getMe.bind(this);
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user, tokens } = await this.authService.register(req.body);
      res.cookie("accessToken", tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res
        .status(StatusCode.CREATED)
        .json(ApiResponse.success(AuthMessages.REGISTER_SUCCESS, { user }));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokens } = await this.authService.login(req.body);
      res.cookie("accessToken", tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success(AuthMessages.LOGIN_SUCCESS, { user }));
    } catch (error) {
      next(error);
    }
  }

  async logout(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success(AuthMessages.LOGOUT_SUCCESS));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = req.cookies["refreshToken"];
      if (!token) {
        res
          .status(StatusCode.UNAUTHORIZED)
          .json(ApiResponse.error(AuthMessages.NO_REFRESH_TOKEN));
        return;
      }
      const tokens = await this.authService.refreshTokens(token);
      res.cookie("accessToken", tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(StatusCode.OK).json(ApiResponse.success("Tokens refreshed"));
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.authService.getProfile(req.user!.id);
      res
        .status(StatusCode.OK)
        .json(ApiResponse.success("Profile fetched", { user }));
    } catch (error) {
      next(error);
    }
  }
}

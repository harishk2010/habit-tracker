import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, cookieOptions } from '../utils/jwt';
import { AuthMessages } from '../utils/constants';
import { StatusCode } from '../utils/enums';
import { ApiResponse } from '../utils/ApiResponse';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const accessToken = req.cookies['accessToken'];
  const refreshToken = req.cookies['refreshToken'];

  if (!accessToken) {
    res.status(StatusCode.UNAUTHORIZED).json(ApiResponse.error(AuthMessages.NO_ACCESS_TOKEN));
    return;
  }

  try {
    const payload = verifyAccessToken(accessToken);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      if (!refreshToken) {
        res.status(StatusCode.UNAUTHORIZED).json(ApiResponse.error(AuthMessages.NO_REFRESH_TOKEN));
        return;
      }
      try {
        const refreshPayload = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken({
          id: refreshPayload.id,
          email: refreshPayload.email,
          role: refreshPayload.role,
        });
        res.cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        req.user = { id: refreshPayload.id, email: refreshPayload.email, role: refreshPayload.role };
        next();
      } catch {
        res.status(StatusCode.UNAUTHORIZED).json(ApiResponse.error(AuthMessages.INVALID_TOKEN));
      }
    } else {
      res.status(StatusCode.UNAUTHORIZED).json(ApiResponse.error(AuthMessages.INVALID_TOKEN));
    }
  }
};

export default authMiddleware;

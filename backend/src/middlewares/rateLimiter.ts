import rateLimit from 'express-rate-limit';
import { StatusCode } from '../utils/enums';
import { ApiResponse } from '../utils/ApiResponse';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(StatusCode.TOO_MANY_REQUESTS).json(ApiResponse.error('Too many requests. Please try again later.'));
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(StatusCode.TOO_MANY_REQUESTS).json(ApiResponse.error('Too many auth attempts. Please try again in 15 minutes.'));
  },
});

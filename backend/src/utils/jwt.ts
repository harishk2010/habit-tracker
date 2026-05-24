import jwt, { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload & TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload & TokenPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload & TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload & TokenPayload;
};

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
};

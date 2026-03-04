import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AppError } from '../../middleware/errorHandler';
import { serializeBigInt } from '../../utils/serializeBigInt';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const result = await authService.register(email, password, name);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      accessToken: result.accessToken,
      user: serializeBigInt(result.user),
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken: result.accessToken,
      user: serializeBigInt(result.user),
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError('Refresh token not found', 401);
  }

  const result = await authService.refresh(refreshToken);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: result.accessToken,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    domain: process.env.COOKIE_DOMAIN,
  });

  res.json({
    success: true,
    message: 'Logout successful',
  });
};

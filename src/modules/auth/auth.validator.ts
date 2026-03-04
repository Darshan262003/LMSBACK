import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';

export const validateRegister = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  // Validate email
  if (!email || typeof email !== 'string') {
    throw new AppError('Email is required', 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    throw new AppError('Password is required', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new AppError('Name is required', 400);
  }

  next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    throw new AppError('Email is required', 400);
  }

  if (!password || typeof password !== 'string') {
    throw new AppError('Password is required', 400);
  }

  next();
};

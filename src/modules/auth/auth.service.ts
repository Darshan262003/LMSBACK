import prisma from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import crypto from 'crypto';

class AuthService {
  async register(email: string, password: string, name: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id.toString(), email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id.toString(), email: user.email });

    // Hash refresh token and store in database
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id.toString(), email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id.toString(), email: user.email });

    // Hash refresh token and store in database
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Hash the token to find in database
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      // Find refresh token in database
      const tokenRecord = await prisma.refreshToken.findFirst({
        where: {
          userId: BigInt(payload.id),
          tokenHash: refreshTokenHash,
          revokedAt: null,
        },
      });

      if (!tokenRecord) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Check if token is expired
      if (tokenRecord.expiresAt < new Date()) {
        throw new AppError('Refresh token expired', 401);
      }

      // Generate new access token
      const accessToken = generateAccessToken({ id: payload.id, email: payload.email });

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      // Revoke the refresh token
      await prisma.refreshToken.updateMany({
        where: {
          userId: BigInt(payload.id),
          tokenHash: refreshTokenHash,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    } catch (error) {
      // Ignore errors - token might be invalid already
    }
  }
}

export const authService = new AuthService();

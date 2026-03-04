import { Request, Response } from 'express';
import { progressService } from './progress.service';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/authMiddleware';
import { serializeBigInt } from '../../utils/serializeBigInt';

export const getSubjectProgress = async (req: AuthRequest, res: Response) => {
  const { subjectId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const progress = await progressService.getSubjectProgress(BigInt(subjectId as string), userId);

  res.json({
    success: true,
    data: serializeBigInt(progress),
  });
};

export const getVideoProgress = async (req: AuthRequest, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const progress = await progressService.getVideoProgress(BigInt(videoId as string), userId);

  res.json({
    success: true,
    data: serializeBigInt(progress),
  });
};

export const updateVideoProgress = async (req: AuthRequest, res: Response) => {
  const { videoId } = req.params;
  const { lastPositionSeconds, isCompleted } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  if (lastPositionSeconds === undefined || typeof lastPositionSeconds !== 'number') {
    throw new AppError('lastPositionSeconds is required and must be a number', 400);
  }

  const progress = await progressService.updateVideoProgress(
    BigInt(videoId as string),
    userId,
    lastPositionSeconds,
    isCompleted
  );

  res.json({
    success: true,
    message: 'Progress updated successfully',
    data: serializeBigInt(progress),
  });
};

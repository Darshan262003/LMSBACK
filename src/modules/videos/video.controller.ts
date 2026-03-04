import { Request, Response } from 'express';
import { videoService } from './video.service';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/authMiddleware';
import { serializeBigInt } from '../../utils/serializeBigInt';

export const getVideo = async (req: AuthRequest, res: Response) => {
  const { videoId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const videoData = await videoService.getVideoWithDetails(BigInt(videoId as string), userId);

  if (!videoData) {
    throw new AppError('Video not found', 404);
  }

  res.json({
    success: true,
    data: serializeBigInt(videoData),
  });
};

export const getFirstVideo = async (req: Request, res: Response) => {
  const { subjectId } = req.params;

  const firstVideo = await videoService.getFirstVideoBySubject(BigInt(subjectId as string));

  if (!firstVideo) {
    throw new AppError('No videos found for this subject', 404);
  }

  res.json({
    success: true,
    data: {
      videoId: Number(firstVideo.id),
    },
  });
};

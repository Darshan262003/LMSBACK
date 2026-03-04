import prisma from '../../config/db';

export class ProgressRepository {
  async getSubjectProgress(subjectId: bigint, userId: bigint) {
    // Get all videos in the subject
    const videos = await prisma.video.findMany({
      where: {
        section: {
          subjectId,
        },
      },
      select: {
        id: true,
      },
    });

    const totalVideos = videos.length;

    if (totalVideos === 0) {
      return {
        totalVideos: 0,
        completedVideos: 0,
        percentComplete: 0,
        lastVideoId: null,
        lastPositionSeconds: 0,
      };
    }

    // Get progress for all videos
    const progressRecords = await prisma.videoProgress.findMany({
      where: {
        userId,
        videoId: {
          in: videos.map((v: { id: bigint }) => v.id),
        },
      },
      select: {
        videoId: true,
        isCompleted: true,
        lastPositionSeconds: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const completedVideos = progressRecords.filter((p: { isCompleted: boolean }) => p.isCompleted).length;
    const percentComplete = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    // Get last watched video
    const lastProgress = progressRecords[0];
    const lastVideoId = lastProgress ? lastProgress.videoId : videos[0].id;
    const lastPositionSeconds = lastProgress?.lastPositionSeconds || 0;

    return {
      totalVideos,
      completedVideos,
      percentComplete,
      lastVideoId,
      lastPositionSeconds,
    };
  }

  async getVideoProgress(videoId: bigint, userId: bigint) {
    const progress = await prisma.videoProgress.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      select: {
        lastPositionSeconds: true,
        isCompleted: true,
      },
    });

    if (!progress) {
      return {
        lastPositionSeconds: 0,
        isCompleted: false,
      };
    }

    return progress;
  }

  async updateVideoProgress(
    videoId: bigint,
    userId: bigint,
    lastPositionSeconds: number,
    isCompleted?: boolean
  ) {
    // Get video duration to validate position
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { durationSeconds: true },
    });

    if (video?.durationSeconds && lastPositionSeconds > video.durationSeconds) {
      lastPositionSeconds = video.durationSeconds;
    }

    // Upsert progress record
    const progress = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      create: {
        userId,
        videoId,
        lastPositionSeconds,
        isCompleted: isCompleted || false,
        completedAt: isCompleted ? new Date() : null,
      },
      update: {
        lastPositionSeconds,
        ...(isCompleted !== undefined && {
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        }),
      },
    });

    return progress;
  }
}

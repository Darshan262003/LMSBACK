import prisma from '../../config/db';

export class VideoRepository {
  async findById(id: bigint) {
    return prisma.video.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            subject: true,
          },
        },
      },
    });
  }

  async findWithNavigation(subjectId: bigint, videoId: bigint) {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        section: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!video) return null;

    // Get all videos in the subject ordered by section and order
    const allVideos = await prisma.video.findMany({
      where: {
        section: {
          subjectId,
        },
      },
      include: {
        section: true,
      },
      orderBy: [
        { section: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    const currentIndex = allVideos.findIndex((v: { id: bigint }) => v.id === videoId);

    const previousVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
    const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;

    return {
      video,
      previousVideo,
      nextVideo,
    };
  }

  async findFirstBySubjectId(subjectId: bigint) {
    return prisma.video.findFirst({
      where: {
        section: {
          subjectId,
        },
      },
      orderBy: [
        { section: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });
  }

  async checkVideoCompletion(videoId: bigint, userId: bigint) {
    const progress = await prisma.videoProgress.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      select: {
        isCompleted: true,
      },
    });

    return progress?.isCompleted || false;
  }

  async checkPreviousVideoCompletion(sectionId: bigint, orderIndex: number, userId: bigint) {
    // Get the previous video in the same section
    const previousVideo = await prisma.video.findFirst({
      where: {
        sectionId,
        orderIndex: orderIndex - 1,
      },
    });

    if (!previousVideo) {
      // This is the first video, so it's unlocked
      return true;
    }

    // Check if user has completed the previous video
    const progress = await prisma.videoProgress.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId: previousVideo.id,
        },
      },
      select: {
        isCompleted: true,
      },
    });

    return progress?.isCompleted || false;
  }
}

import prisma from '../../config/db';

interface SubjectFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

export class SubjectRepository {
  async findAll(filters: SubjectFilters) {
    const { page = 1, pageSize = 10, search } = filters;
    const skip = (page - 1) * pageSize;

    const where = {
      isPublished: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          createdAt: true,
        },
      }),
      prisma.subject.count({ where }),
    ]);

    return {
      subjects,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findById(id: bigint) {
    return prisma.subject.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.subject.findUnique({
      where: { slug },
    });
  }

  async getSubjectTree(subjectId: bigint, userId?: bigint) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            videos: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                youtubeUrl: true,
                durationSeconds: true,
                orderIndex: true,
              },
            },
          },
        },
      },
    });

    if (!subject) return null;

    // If userId provided, calculate locked and completed status
    if (userId) {
      const progress = await prisma.videoProgress.findMany({
        where: {
          userId,
          videoId: {
            in: subject.sections.flatMap((s) => s.videos.map((v) => v.id)),
          },
        },
        select: {
          videoId: true,
          isCompleted: true,
        },
      });

      const completedVideoIds = new Set(
        progress.filter((p: { videoId: bigint; isCompleted: boolean }) => p.isCompleted).map((p: { videoId: bigint; isCompleted: boolean }) => p.videoId)
      );

      // Mark videos as locked/unlocked and completed
      // FORCE UNLOCK ALL VIDEOS - All videos are accessible
      subject.sections = subject.sections.map((section) => ({
        ...section,
        videos: section.videos.map((video) => {
          const isCompleted = completedVideoIds.has(video.id);

          return {
            ...video,
            isLocked: false, // Force unlock all videos
            isCompleted,
          };
        }),
      }));
    } else {
      // No user - all videos unlocked, none completed
      subject.sections = subject.sections.map((section) => ({
        ...section,
        videos: section.videos.map((video) => ({
          ...video,
          isLocked: false,
          isCompleted: false,
        })),
      }));
    }

    return subject;
  }
}

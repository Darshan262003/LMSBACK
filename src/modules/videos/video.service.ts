import { VideoRepository } from './video.repository';
import { AppError } from '../../middleware/errorHandler';

class VideoService {
  private repository = new VideoRepository();

  async getVideoWithDetails(videoId: bigint, userId: bigint) {
    const result = await this.repository.findWithNavigation(
      (await this.repository.findById(videoId))?.section.subjectId || 0n,
      videoId
    );

    if (!result) {
      return null;
    }

    const { video, previousVideo, nextVideo } = result;

    // Force unlock all videos - all videos are accessible
    const isLocked = false;

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      durationSeconds: video.durationSeconds,
      sectionId: video.sectionId,
      sectionTitle: video.section.title,
      subjectId: video.section.subjectId,
      subjectTitle: video.section.subject.title,
      previousVideoId: previousVideo?.id || null,
      nextVideoId: nextVideo?.id || null,
      isLocked,
    };
  }

  async getFirstVideoBySubject(subjectId: bigint) {
    return this.repository.findFirstBySubjectId(subjectId);
  }
}

export const videoService = new VideoService();

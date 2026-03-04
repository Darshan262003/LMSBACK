import { ProgressRepository } from './progress.repository';

class ProgressService {
  private repository = new ProgressRepository();

  async getSubjectProgress(subjectId: bigint, userId: bigint) {
    return this.repository.getSubjectProgress(subjectId, userId);
  }

  async getVideoProgress(videoId: bigint, userId: bigint) {
    return this.repository.getVideoProgress(videoId, userId);
  }

  async updateVideoProgress(
    videoId: bigint,
    userId: bigint,
    lastPositionSeconds: number,
    isCompleted?: boolean
  ) {
    return this.repository.updateVideoProgress(videoId, userId, lastPositionSeconds, isCompleted);
  }
}

export const progressService = new ProgressService();

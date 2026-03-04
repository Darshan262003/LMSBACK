import { SubjectRepository } from './subject.repository';

interface SubjectFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}

class SubjectService {
  private repository = new SubjectRepository();

  async findAll(filters: SubjectFilters) {
    return this.repository.findAll(filters);
  }

  async findById(id: bigint) {
    return this.repository.findById(id);
  }

  async getSubjectTree(subjectId: bigint, userId?: bigint) {
    return this.repository.getSubjectTree(subjectId, userId);
  }
}

export const subjectService = new SubjectService();

import prisma from '../../config/db';

export class SectionRepository {
  async findBySubjectId(subjectId: bigint) {
    return prisma.section.findMany({
      where: { subjectId },
      orderBy: { orderIndex: 'asc' },
    });
  }
}

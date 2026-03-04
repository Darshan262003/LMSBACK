import { Request, Response } from 'express';
import { subjectService } from './subject.service';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/authMiddleware';
import { serializeBigInt } from '../../utils/serializeBigInt';

export const listSubjects = async (req: Request, res: Response) => {
  const { page, pageSize, q } = req.query;

  const filters = {
    page: page ? parseInt(page as string, 10) : 1,
    pageSize: pageSize ? parseInt(pageSize as string, 10) : 10,
    search: q as string,
  };

  const result = await subjectService.findAll(filters);

  // Set cache control to prevent stale data
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  res.json({
    success: true,
    data: serializeBigInt(result.subjects),
    pagination: serializeBigInt(result.pagination),
  });
};

export const getSubject = async (req: Request, res: Response) => {
  const { subjectId } = req.params;

  const subject = await subjectService.findById(BigInt(subjectId as string));

  if (!subject) {
    throw new AppError('Subject not found', 404);
  }

  res.json({
    success: true,
    data: serializeBigInt(subject),
  });
};

export const getSubjectTree = async (req: AuthRequest, res: Response) => {
  const { subjectId } = req.params;
  const userId = req.user?.id;

  const tree = await subjectService.getSubjectTree(BigInt(subjectId as string), BigInt(userId));

  if (!tree) {
    throw new AppError('Subject not found', 404);
  }

  res.json({
    success: true,
    data: serializeBigInt(tree),
  });
};

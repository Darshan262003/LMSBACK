import { Router } from 'express';
import * as subjectController from './subject.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', subjectController.listSubjects);
router.get('/:subjectId', subjectController.getSubject);
router.get('/:subjectId/tree', authMiddleware, subjectController.getSubjectTree);

export default router;

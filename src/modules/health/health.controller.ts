import { Request, Response } from 'express';
import prisma from '../../config/db';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: 'All systems operational',
      data: {
        status: 'OK',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      data: {
        status: 'ERROR',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
    });
  }
};

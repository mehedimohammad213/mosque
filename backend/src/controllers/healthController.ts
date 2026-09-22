import type { Request, Response } from 'express';
import * as healthService from '../services/healthService';
import asyncHandler from '../middleware/asyncHandler';

export const check = asyncHandler(async (_req: Request, res: Response) => {
  const health = await healthService.getHealth();
  res.json(health);
});

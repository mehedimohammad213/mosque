import type { Response } from 'express';
import * as authService from '../services/authService';
import asyncHandler from '../middleware/asyncHandler';
import type { AuthenticatedRequest } from '../middleware/requireAuth';

export const login = asyncHandler(async (req, res: Response) => {
  const result = await authService.login(req.body);
  res.json(result);
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const user = await authService.getMe(req.user.sub);
  res.json(user);
});

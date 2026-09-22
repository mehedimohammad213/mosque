import type { NextFunction, Request, Response } from 'express';
import AppError from './AppError';
import { getBearerToken, verifyToken, type AuthTokenPayload } from './auth';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const token = getBearerToken(req);
    if (!token) {
      throw new AppError('Authentication required', 401);
    }
    req.user = verifyToken(token);
    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
      return;
    }
    next(new AppError('Invalid or expired token', 401));
  }
}

export { requireAuth };

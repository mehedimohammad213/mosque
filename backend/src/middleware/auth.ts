import jwt from 'jsonwebtoken';
import type { Request } from 'express';
import type { UserRole } from '../models/userModel';

export interface AuthTokenPayload {
  sub: number;
  role: UserRole;
  phone: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'mosque-dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as AuthTokenPayload;
}

function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

export { signToken, verifyToken, getBearerToken, JWT_SECRET };

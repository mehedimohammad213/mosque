import bcrypt from 'bcryptjs';
import { query } from '../config/db';
import User, { type UserRow, type UserRole } from '../models/userModel';
import AppError from '../middleware/AppError';
import { requireFields } from './helpers';
import { signToken } from '../middleware/auth';

interface UserWithPassword extends UserRow {
  password: string;
}

interface LoginInput {
  phone: string;
  password: string;
}

async function login(data: LoginInput) {
  const body = data as unknown as Record<string, unknown>;
  requireFields(body, ['phone', 'password']);

  const result = await query<UserWithPassword>(
    `SELECT ${User.safeColumns}, password
     FROM ${User.table}
     WHERE phone = $1
     LIMIT 1`,
    [data.phone]
  );

  const user = result.rows[0];
  if (!user) {
    throw new AppError('Invalid phone or password', 401);
  }

  if (!user.is_active) {
    throw new AppError('Account is inactive', 403);
  }

  const ok = await bcrypt.compare(data.password, user.password);
  if (!ok) {
    throw new AppError('Invalid phone or password', 401);
  }

  const { password: _password, ...safeUser } = user;
  const token = signToken({
    sub: safeUser.id,
    role: safeUser.role as UserRole,
    phone: safeUser.phone,
  });

  return { token, user: safeUser };
}

async function getMe(userId: number) {
  const result = await query<UserRow>(
    `SELECT ${User.safeColumns} FROM ${User.table} WHERE id = $1`,
    [userId]
  );
  const user = result.rows[0];
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
}

export { login, getMe };

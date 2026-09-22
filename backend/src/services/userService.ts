import bcrypt from 'bcryptjs';
import { query } from '../config/db';
import User, {
  type CreateUserInput,
  type UpdateUserInput,
  type UserFilters,
  type UserRow,
} from '../models/userModel';
import AppError from '../middleware/AppError';
import { optionalEnum, optionalNumber, requireFields } from './helpers';

function isPgUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === '23505'
  );
}

async function listUsers(filters: UserFilters = {}): Promise<UserRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.mosque_id) {
    params.push(filters.mosque_id);
    conditions.push(`mosque_id = $${params.length}`);
  }
  if (filters.role) {
    params.push(filters.role);
    conditions.push(`role = $${params.length}::user_role`);
  }
  if (filters.is_active !== undefined) {
    params.push(filters.is_active === 'true' || filters.is_active === true);
    conditions.push(`is_active = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query<UserRow>(
    `SELECT ${User.safeColumns} FROM ${User.table} ${where} ORDER BY id DESC`,
    params
  );
  return result.rows;
}

async function getUser(id: string | number): Promise<UserRow> {
  const result = await query<UserRow>(
    `SELECT ${User.safeColumns} FROM ${User.table} WHERE id = $1`,
    [id]
  );
  const user = result.rows[0];
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
}

async function createUser(data: CreateUserInput): Promise<UserRow> {
  const body = data as unknown as Record<string, unknown>;
  requireFields(body, ['name', 'phone', 'password']);
  optionalEnum(body, 'role', User.roles);
  optionalNumber(body, 'mosque_id');

  const { name, phone, password } = data;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await query<UserRow>(
      `INSERT INTO ${User.table} (
        mosque_id, name, phone, email, password, role, is_active
      ) VALUES (
        $1, $2, $3, $4, $5,
        COALESCE($6::user_role, 'mosque_admin'::user_role),
        COALESCE($7, TRUE)
      )
      RETURNING ${User.safeColumns}`,
      [
        data.mosque_id || null,
        name,
        phone,
        data.email || null,
        hashed,
        data.role || null,
        data.is_active ?? null,
      ]
    );
    return result.rows[0];
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      throw new AppError('Phone already registered', 409);
    }
    throw err;
  }
}

async function updateUser(
  id: string | number,
  data: UpdateUserInput
): Promise<UserRow> {
  const body = data as unknown as Record<string, unknown>;
  optionalEnum(body, 'role', User.roles);
  optionalNumber(body, 'mosque_id');

  let hashed: string | null = null;
  if (data.password) {
    hashed = await bcrypt.hash(data.password, 10);
  }

  try {
    const result = await query<UserRow>(
      `UPDATE ${User.table} SET
        mosque_id = COALESCE($1, mosque_id),
        name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        email = COALESCE($4, email),
        password = COALESCE($5, password),
        role = COALESCE($6::user_role, role),
        is_active = COALESCE($7, is_active)
      WHERE id = $8
      RETURNING ${User.safeColumns}`,
      [
        data.mosque_id ?? null,
        data.name ?? null,
        data.phone ?? null,
        data.email ?? null,
        hashed,
        data.role ?? null,
        data.is_active ?? null,
        id,
      ]
    );
    const user = result.rows[0];
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      throw new AppError('Phone already registered', 409);
    }
    throw err;
  }
}

async function deleteUser(id: string | number): Promise<{ id: number }> {
  const result = await query<{ id: number }>(
    `DELETE FROM ${User.table} WHERE id = $1 RETURNING id`,
    [id]
  );
  if (!result.rows[0]) {
    throw new AppError('User not found', 404);
  }
  return result.rows[0];
}

export { listUsers, getUser, createUser, updateUser, deleteUser };

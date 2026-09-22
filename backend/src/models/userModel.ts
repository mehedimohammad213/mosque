/**
 * User model — structure only (no queries).
 */
const User = {
  table: 'users',
  roles: ['admin', 'mosque_admin'] as const,
  safeColumns:
    'id, mosque_id, name, phone, email, role, is_active, created_at, updated_at',
  fields: {
    id: { type: 'serial', required: true },
    mosque_id: { type: 'foreign', required: false, ref: 'mosques' },
    name: { type: 'string', required: true },
    phone: { type: 'string', required: true },
    email: { type: 'string', required: false },
    password: { type: 'string', required: true },
    role: { type: 'enum', required: true, default: 'mosque_admin' },
    is_active: { type: 'boolean', required: true, default: true },
    created_at: { type: 'timestamp', required: true },
    updated_at: { type: 'timestamp', required: true },
  },
} as const;

export type UserRole = (typeof User.roles)[number];

export interface UserRow {
  id: number;
  mosque_id: number | null;
  name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  name: string;
  phone: string;
  password: string;
  mosque_id?: number | string | null;
  email?: string | null;
  role?: UserRole | null;
  is_active?: boolean | null;
}

export type UpdateUserInput = Partial<CreateUserInput>;

export interface UserFilters {
  mosque_id?: string;
  role?: string;
  is_active?: string | boolean;
}

export default User;

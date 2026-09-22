import { query } from '../config/db';
import PaymentAccount, {
  type CreatePaymentAccountInput,
  type PaymentAccountFilters,
  type PaymentAccountRow,
  type UpdatePaymentAccountInput,
} from '../models/paymentAccountModel';
import AppError from '../middleware/AppError';
import { optionalEnum, optionalNumber, requireFields } from './helpers';

async function listPaymentAccounts(
  filters: PaymentAccountFilters = {}
): Promise<PaymentAccountRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.mosque_id) {
    params.push(filters.mosque_id);
    conditions.push(`mosque_id = $${params.length}`);
  }
  if (filters.account_type) {
    params.push(filters.account_type);
    conditions.push(`account_type = $${params.length}::payment_account_type`);
  }
  if (filters.is_active !== undefined) {
    params.push(filters.is_active === 'true' || filters.is_active === true);
    conditions.push(`is_active = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query<PaymentAccountRow>(
    `SELECT * FROM ${PaymentAccount.table} ${where} ORDER BY id DESC`,
    params
  );
  return result.rows;
}

async function getPaymentAccount(
  id: string | number
): Promise<PaymentAccountRow> {
  const result = await query<PaymentAccountRow>(
    `SELECT * FROM ${PaymentAccount.table} WHERE id = $1`,
    [id]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError('Payment account not found', 404);
  }
  return row;
}

async function createPaymentAccount(
  data: CreatePaymentAccountInput
): Promise<PaymentAccountRow> {
  const body = data as unknown as Record<string, unknown>;
  requireFields(body, ['mosque_id', 'account_type', 'account_number']);
  optionalEnum(body, 'account_type', PaymentAccount.accountTypes);
  optionalNumber(body, 'mosque_id');

  const { mosque_id, account_type, account_number } = data;

  const result = await query<PaymentAccountRow>(
    `INSERT INTO ${PaymentAccount.table} (
      mosque_id, account_type, account_name, account_number,
      bank_name, branch_name, routing_number, is_verified, is_active
    ) VALUES (
      $1, $2::payment_account_type, $3, $4, $5, $6, $7,
      COALESCE($8, FALSE), COALESCE($9, TRUE)
    )
    RETURNING *`,
    [
      mosque_id,
      account_type,
      data.account_name || null,
      account_number,
      data.bank_name || null,
      data.branch_name || null,
      data.routing_number || null,
      data.is_verified ?? null,
      data.is_active ?? null,
    ]
  );
  return result.rows[0];
}

async function updatePaymentAccount(
  id: string | number,
  data: UpdatePaymentAccountInput
): Promise<PaymentAccountRow> {
  const body = data as unknown as Record<string, unknown>;
  optionalEnum(body, 'account_type', PaymentAccount.accountTypes);
  optionalNumber(body, 'mosque_id');

  const result = await query<PaymentAccountRow>(
    `UPDATE ${PaymentAccount.table} SET
      mosque_id = COALESCE($1, mosque_id),
      account_type = COALESCE($2::payment_account_type, account_type),
      account_name = COALESCE($3, account_name),
      account_number = COALESCE($4, account_number),
      bank_name = COALESCE($5, bank_name),
      branch_name = COALESCE($6, branch_name),
      routing_number = COALESCE($7, routing_number),
      is_verified = COALESCE($8, is_verified),
      is_active = COALESCE($9, is_active)
    WHERE id = $10
    RETURNING *`,
    [
      data.mosque_id ?? null,
      data.account_type ?? null,
      data.account_name ?? null,
      data.account_number ?? null,
      data.bank_name ?? null,
      data.branch_name ?? null,
      data.routing_number ?? null,
      data.is_verified ?? null,
      data.is_active ?? null,
      id,
    ]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError('Payment account not found', 404);
  }
  return row;
}

async function deletePaymentAccount(
  id: string | number
): Promise<{ id: number }> {
  const result = await query<{ id: number }>(
    `DELETE FROM ${PaymentAccount.table} WHERE id = $1 RETURNING id`,
    [id]
  );
  if (!result.rows[0]) {
    throw new AppError('Payment account not found', 404);
  }
  return result.rows[0];
}

export {
  listPaymentAccounts,
  getPaymentAccount,
  createPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount,
};

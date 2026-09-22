import { query } from '../config/db';
import FundRequest, {
  type CreateFundRequestInput,
  type FundRequestFilters,
  type FundRequestRow,
  type UpdateFundRequestInput,
} from '../models/fundRequestModel';
import AppError from '../middleware/AppError';
import { optionalEnum, optionalNumber, requireFields } from './helpers';

const fundRequestSelect = `
  fr.*,
  m.name AS mosque_name,
  pa.account_type,
  pa.account_name,
  pa.account_number,
  pa.bank_name
`;

const fundRequestFrom = `
  ${FundRequest.table} fr
  JOIN mosques m ON m.id = fr.mosque_id
  LEFT JOIN LATERAL (
    SELECT account_type, account_name, account_number, bank_name
    FROM mosque_payment_accounts
    WHERE mosque_id = fr.mosque_id AND is_active = TRUE
    ORDER BY is_verified DESC, id ASC
    LIMIT 1
  ) pa ON TRUE
`;

async function listFundRequests(
  filters: FundRequestFilters = {}
): Promise<FundRequestRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.mosque_id) {
    params.push(filters.mosque_id);
    conditions.push(`fr.mosque_id = $${params.length}`);
  }
  if (filters.status) {
    params.push(filters.status);
    conditions.push(`fr.status = $${params.length}::fund_request_status`);
  }
  if (filters.fund_year) {
    params.push(filters.fund_year);
    conditions.push(`fr.fund_year = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query<FundRequestRow>(
    `SELECT ${fundRequestSelect} FROM ${fundRequestFrom} ${where} ORDER BY fr.id DESC`,
    params
  );
  return result.rows;
}

async function getFundRequest(id: string | number): Promise<FundRequestRow> {
  const result = await query<FundRequestRow>(
    `SELECT ${fundRequestSelect} FROM ${fundRequestFrom} WHERE fr.id = $1`,
    [id]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError('Fund request not found', 404);
  }
  return row;
}

async function createFundRequest(
  data: CreateFundRequestInput
): Promise<FundRequestRow> {
  const body = data as unknown as Record<string, unknown>;
  requireFields(body, [
    'mosque_id',
    'title',
    'description',
    'fund_year',
    'required_amount',
  ]);
  optionalEnum(body, 'status', FundRequest.statuses);
  optionalNumber(body, 'mosque_id');
  optionalNumber(body, 'fund_year');
  optionalNumber(body, 'required_amount');

  const { mosque_id, title, description, fund_year, required_amount } = data;

  const result = await query<FundRequestRow>(
    `INSERT INTO ${FundRequest.table} (
      mosque_id, title, description, fund_year, required_amount,
      start_date, needed_by, contact_person, contact_phone, status, created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      COALESCE($10::fund_request_status, 'draft'::fund_request_status),
      $11
    )
    RETURNING *`,
    [
      mosque_id,
      title,
      description,
      fund_year,
      required_amount,
      data.start_date || null,
      data.needed_by || null,
      data.contact_person || null,
      data.contact_phone || null,
      data.status || null,
      data.created_by || null,
    ]
  );
  return result.rows[0];
}

async function updateFundRequest(
  id: string | number,
  data: UpdateFundRequestInput
): Promise<FundRequestRow> {
  const body = data as unknown as Record<string, unknown>;
  optionalEnum(body, 'status', FundRequest.statuses);
  optionalNumber(body, 'mosque_id');
  optionalNumber(body, 'fund_year');
  optionalNumber(body, 'required_amount');

  const result = await query<FundRequestRow>(
    `UPDATE ${FundRequest.table} SET
      mosque_id = COALESCE($1, mosque_id),
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      fund_year = COALESCE($4, fund_year),
      required_amount = COALESCE($5, required_amount),
      start_date = COALESCE($6, start_date),
      needed_by = COALESCE($7, needed_by),
      contact_person = COALESCE($8, contact_person),
      contact_phone = COALESCE($9, contact_phone),
      status = COALESCE($10::fund_request_status, status),
      created_by = COALESCE($11, created_by),
      approved_by = COALESCE($12, approved_by),
      approved_at = COALESCE($13, approved_at)
    WHERE id = $14
    RETURNING *`,
    [
      data.mosque_id ?? null,
      data.title ?? null,
      data.description ?? null,
      data.fund_year ?? null,
      data.required_amount ?? null,
      data.start_date ?? null,
      data.needed_by ?? null,
      data.contact_person ?? null,
      data.contact_phone ?? null,
      data.status ?? null,
      data.created_by ?? null,
      data.approved_by ?? null,
      data.approved_at ?? null,
      id,
    ]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError('Fund request not found', 404);
  }
  return row;
}

async function deleteFundRequest(
  id: string | number
): Promise<{ id: number }> {
  const result = await query<{ id: number }>(
    `DELETE FROM ${FundRequest.table} WHERE id = $1 RETURNING id`,
    [id]
  );
  if (!result.rows[0]) {
    throw new AppError('Fund request not found', 404);
  }
  return result.rows[0];
}

export {
  listFundRequests,
  getFundRequest,
  createFundRequest,
  updateFundRequest,
  deleteFundRequest,
};

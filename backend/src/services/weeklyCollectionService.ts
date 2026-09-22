import { query } from '../config/db';
import WeeklyCollection, {
  type CreateWeeklyCollectionInput,
  type UpdateWeeklyCollectionInput,
  type WeeklyCollectionFilters,
  type WeeklyCollectionRow,
} from '../models/weeklyCollectionModel';
import AppError from '../middleware/AppError';
import { optionalEnum, optionalNumber, requireFields } from './helpers';

async function listWeeklyCollections(
  filters: WeeklyCollectionFilters = {}
): Promise<WeeklyCollectionRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.mosque_id) {
    params.push(filters.mosque_id);
    conditions.push(`mosque_id = $${params.length}`);
  }
  if (filters.status) {
    params.push(filters.status);
    conditions.push(`status = $${params.length}::collection_status`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query<WeeklyCollectionRow>(
    `SELECT * FROM ${WeeklyCollection.table} ${where}
     ORDER BY week_start_date DESC, id DESC`,
    params
  );
  return result.rows;
}

async function getWeeklyCollection(
  id: string | number
): Promise<WeeklyCollectionRow> {
  const result = await query<WeeklyCollectionRow>(
    `SELECT * FROM ${WeeklyCollection.table} WHERE id = $1`,
    [id]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError('Weekly collection not found', 404);
  }
  return row;
}

async function createWeeklyCollection(
  data: CreateWeeklyCollectionInput
): Promise<WeeklyCollectionRow> {
  const body = data as unknown as Record<string, unknown>;
  requireFields(body, [
    'mosque_id',
    'week_start_date',
    'week_end_date',
    'amount',
  ]);
  optionalEnum(body, 'status', WeeklyCollection.statuses);
  optionalNumber(body, 'amount');
  optionalNumber(body, 'mosque_id');

  const { mosque_id, week_start_date, week_end_date, amount } = data;

  const result = await query<WeeklyCollectionRow>(
    `INSERT INTO ${WeeklyCollection.table} (
      mosque_id, week_start_date, week_end_date, amount, note, status, submitted_by
    ) VALUES (
      $1, $2, $3, $4, $5,
      COALESCE($6::collection_status, 'draft'::collection_status),
      $7
    )
    RETURNING *`,
    [
      mosque_id,
      week_start_date,
      week_end_date,
      amount,
      data.note || null,
      data.status || null,
      data.submitted_by || null,
    ]
  );
  return result.rows[0];
}

async function updateWeeklyCollection(
  id: string | number,
  data: UpdateWeeklyCollectionInput
): Promise<WeeklyCollectionRow> {
  const body = data as unknown as Record<string, unknown>;
  optionalEnum(body, 'status', WeeklyCollection.statuses);
  optionalNumber(body, 'amount');
  optionalNumber(body, 'mosque_id');

  const result = await query<WeeklyCollectionRow>(
    `UPDATE ${WeeklyCollection.table} SET
      mosque_id = COALESCE($1, mosque_id),
      week_start_date = COALESCE($2, week_start_date),
      week_end_date = COALESCE($3, week_end_date),
      amount = COALESCE($4, amount),
      note = COALESCE($5, note),
      status = COALESCE($6::collection_status, status),
      submitted_by = COALESCE($7, submitted_by)
    WHERE id = $8
    RETURNING *`,
    [
      data.mosque_id ?? null,
      data.week_start_date ?? null,
      data.week_end_date ?? null,
      data.amount ?? null,
      data.note ?? null,
      data.status ?? null,
      data.submitted_by ?? null,
      id,
    ]
  );
  const row = result.rows[0];
  if (!row) {
    throw new AppError('Weekly collection not found', 404);
  }
  return row;
}

async function deleteWeeklyCollection(
  id: string | number
): Promise<{ id: number }> {
  const result = await query<{ id: number }>(
    `DELETE FROM ${WeeklyCollection.table} WHERE id = $1 RETURNING id`,
    [id]
  );
  if (!result.rows[0]) {
    throw new AppError('Weekly collection not found', 404);
  }
  return result.rows[0];
}

export {
  listWeeklyCollections,
  getWeeklyCollection,
  createWeeklyCollection,
  updateWeeklyCollection,
  deleteWeeklyCollection,
};

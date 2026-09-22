import { query } from '../config/db';
import Mosque, {
  type CreateMosqueInput,
  type MosqueFilters,
  type MosqueRow,
  type UpdateMosqueInput,
} from '../models/mosqueModel';
import AppError from '../middleware/AppError';
import { optionalEnum, optionalNumber, requireFields } from './helpers';

async function listMosques(filters: MosqueFilters = {}): Promise<MosqueRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`status = $${params.length}::mosque_status`);
  }
  if (filters.division) {
    params.push(filters.division);
    conditions.push(`division = $${params.length}`);
  }
  if (filters.district) {
    params.push(filters.district);
    conditions.push(`district = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query<MosqueRow>(
    `SELECT * FROM ${Mosque.table} ${where} ORDER BY id DESC`,
    params
  );
  return result.rows;
}

async function getMosque(id: string | number): Promise<MosqueRow> {
  const result = await query<MosqueRow>(
    `SELECT * FROM ${Mosque.table} WHERE id = $1`,
    [id]
  );
  const mosque = result.rows[0];
  if (!mosque) {
    throw new AppError('Mosque not found', 404);
  }
  return mosque;
}

async function createMosque(data: CreateMosqueInput): Promise<MosqueRow> {
  const body = data as unknown as Record<string, unknown>;
  requireFields(body, ['name', 'division', 'district']);
  optionalEnum(body, 'status', Mosque.statuses);
  optionalNumber(body, 'latitude');
  optionalNumber(body, 'longitude');

  const { name, division, district } = data;

  const result = await query<MosqueRow>(
    `INSERT INTO ${Mosque.table} (
      name, name_bn, address, division, district, upazila, area,
      phone, email, latitude, longitude, mosque_image, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
      COALESCE($13::mosque_status, 'pending'::mosque_status)
    )
    RETURNING *`,
    [
      name,
      data.name_bn || null,
      data.address || null,
      division,
      district,
      data.upazila || null,
      data.area || null,
      data.phone || null,
      data.email || null,
      data.latitude ?? null,
      data.longitude ?? null,
      data.mosque_image || null,
      data.status || null,
    ]
  );
  return result.rows[0];
}

async function updateMosque(
  id: string | number,
  data: UpdateMosqueInput
): Promise<MosqueRow> {
  const body = data as unknown as Record<string, unknown>;
  optionalEnum(body, 'status', Mosque.statuses);
  optionalNumber(body, 'latitude');
  optionalNumber(body, 'longitude');

  const result = await query<MosqueRow>(
    `UPDATE ${Mosque.table} SET
      name = COALESCE($1, name),
      name_bn = COALESCE($2, name_bn),
      address = COALESCE($3, address),
      division = COALESCE($4, division),
      district = COALESCE($5, district),
      upazila = COALESCE($6, upazila),
      area = COALESCE($7, area),
      phone = COALESCE($8, phone),
      email = COALESCE($9, email),
      latitude = COALESCE($10, latitude),
      longitude = COALESCE($11, longitude),
      mosque_image = COALESCE($12, mosque_image),
      status = COALESCE($13::mosque_status, status)
    WHERE id = $14
    RETURNING *`,
    [
      data.name ?? null,
      data.name_bn ?? null,
      data.address ?? null,
      data.division ?? null,
      data.district ?? null,
      data.upazila ?? null,
      data.area ?? null,
      data.phone ?? null,
      data.email ?? null,
      data.latitude ?? null,
      data.longitude ?? null,
      data.mosque_image ?? null,
      data.status ?? null,
      id,
    ]
  );
  const mosque = result.rows[0];
  if (!mosque) {
    throw new AppError('Mosque not found', 404);
  }
  return mosque;
}

async function deleteMosque(
  id: string | number
): Promise<{ id: number }> {
  const result = await query<{ id: number }>(
    `DELETE FROM ${Mosque.table} WHERE id = $1 RETURNING id`,
    [id]
  );
  if (!result.rows[0]) {
    throw new AppError('Mosque not found', 404);
  }
  return result.rows[0];
}

export {
  listMosques,
  getMosque,
  createMosque,
  updateMosque,
  deleteMosque,
};

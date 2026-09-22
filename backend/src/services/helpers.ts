import AppError from '../middleware/AppError';

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

function requireFields(
  data: Record<string, unknown>,
  fields: string[]
): void {
  const missing = fields.filter((field) => isEmpty(data[field]));
  if (missing.length > 0) {
    throw new AppError(
      `${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required`,
      400
    );
  }
}

function optionalEnum(
  data: Record<string, unknown>,
  field: string,
  allowed: readonly string[]
): void {
  if (isEmpty(data[field])) return;
  if (!allowed.includes(data[field] as string)) {
    throw new AppError(
      `${field} must be one of: ${allowed.join(', ')}`,
      400
    );
  }
}

function optionalNumber(
  data: Record<string, unknown>,
  field: string
): void {
  if (isEmpty(data[field])) return;
  if (Number.isNaN(Number(data[field]))) {
    throw new AppError(`${field} must be a number`, 400);
  }
}

export { isEmpty, requireFields, optionalEnum, optionalNumber };

import { query } from '../config/db';

interface HealthRow {
  now: Date;
}

interface HealthStatus {
  status: string;
  database: string;
  time: Date;
}

async function getHealth(): Promise<HealthStatus> {
  const result = await query<HealthRow>('SELECT NOW() AS now');
  return {
    status: 'ok',
    database: 'connected',
    time: result.rows[0].now,
  };
}

export { getHealth };

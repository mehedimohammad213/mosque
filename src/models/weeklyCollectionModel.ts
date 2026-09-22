/**
 * WeeklyCollection model — structure only (no queries).
 */
const WeeklyCollection = {
  table: 'weekly_collections',
  statuses: ['draft', 'published'] as const,
  fields: {
    id: { type: 'serial', required: true },
    mosque_id: { type: 'foreign', required: true, ref: 'mosques' },
    week_start_date: { type: 'date', required: true },
    week_end_date: { type: 'date', required: true },
    amount: { type: 'decimal', required: true },
    note: { type: 'text', required: false },
    status: { type: 'enum', required: true, default: 'draft' },
    submitted_by: { type: 'foreign', required: false, ref: 'users' },
    created_at: { type: 'timestamp', required: true },
    updated_at: { type: 'timestamp', required: true },
  },
} as const;

export type WeeklyCollectionStatus = (typeof WeeklyCollection.statuses)[number];

export interface WeeklyCollectionRow {
  id: number;
  mosque_id: number;
  week_start_date: string;
  week_end_date: string;
  amount: string;
  note: string | null;
  status: WeeklyCollectionStatus;
  submitted_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateWeeklyCollectionInput {
  mosque_id: number | string;
  week_start_date: string;
  week_end_date: string;
  amount: number | string;
  note?: string | null;
  status?: WeeklyCollectionStatus | null;
  submitted_by?: number | string | null;
}

export type UpdateWeeklyCollectionInput = Partial<CreateWeeklyCollectionInput>;

export interface WeeklyCollectionFilters {
  mosque_id?: string;
  status?: string;
}

export default WeeklyCollection;

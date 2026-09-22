/**
 * FundRequest model — structure only (no queries).
 */
const FundRequest = {
  table: 'fund_requests',
  statuses: [
    'draft',
    'pending',
    'approved',
    'completed',
    'rejected',
    'cancelled',
  ] as const,
  fields: {
    id: { type: 'serial', required: true },
    mosque_id: { type: 'foreign', required: true, ref: 'mosques' },
    title: { type: 'string', required: true },
    description: { type: 'text', required: true },
    fund_year: { type: 'year', required: true },
    required_amount: { type: 'decimal', required: true },
    start_date: { type: 'date', required: false },
    needed_by: { type: 'date', required: false },
    contact_person: { type: 'string', required: false },
    contact_phone: { type: 'string', required: false },
    status: { type: 'enum', required: true, default: 'draft' },
    created_by: { type: 'foreign', required: false, ref: 'users' },
    approved_by: { type: 'foreign', required: false, ref: 'users' },
    approved_at: { type: 'timestamp', required: false },
    created_at: { type: 'timestamp', required: true },
    updated_at: { type: 'timestamp', required: true },
  },
} as const;

export type FundRequestStatus = (typeof FundRequest.statuses)[number];

export interface FundRequestRow {
  id: number;
  mosque_id: number;
  title: string;
  description: string;
  fund_year: number;
  required_amount: string;
  start_date: string | null;
  needed_by: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  status: FundRequestStatus;
  created_by: number | null;
  approved_by: number | null;
  approved_at: Date | null;
  created_at: Date;
  updated_at: Date;
  /** Joined from mosques */
  mosque_name?: string | null;
  /** Joined from mosque_payment_accounts (primary active) */
  account_type?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  bank_name?: string | null;
}

export interface CreateFundRequestInput {
  mosque_id: number | string;
  title: string;
  description: string;
  fund_year: number | string;
  required_amount: number | string;
  start_date?: string | null;
  needed_by?: string | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  status?: FundRequestStatus | null;
  created_by?: number | string | null;
  approved_by?: number | string | null;
  approved_at?: string | Date | null;
}

export type UpdateFundRequestInput = Partial<CreateFundRequestInput>;

export interface FundRequestFilters {
  mosque_id?: string;
  status?: string;
  fund_year?: string;
}

export default FundRequest;

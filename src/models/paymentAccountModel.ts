/**
 * PaymentAccount model — structure only (no queries).
 */
const PaymentAccount = {
  table: 'mosque_payment_accounts',
  accountTypes: ['bank', 'bkash', 'nagad', 'rocket', 'other'] as const,
  fields: {
    id: { type: 'serial', required: true },
    mosque_id: { type: 'foreign', required: true, ref: 'mosques' },
    account_type: { type: 'enum', required: true },
    account_name: { type: 'string', required: false },
    account_number: { type: 'string', required: true },
    bank_name: { type: 'string', required: false },
    branch_name: { type: 'string', required: false },
    routing_number: { type: 'string', required: false },
    is_verified: { type: 'boolean', required: true, default: false },
    is_active: { type: 'boolean', required: true, default: true },
    created_at: { type: 'timestamp', required: true },
    updated_at: { type: 'timestamp', required: true },
  },
} as const;

export type PaymentAccountType = (typeof PaymentAccount.accountTypes)[number];

export interface PaymentAccountRow {
  id: number;
  mosque_id: number;
  account_type: PaymentAccountType;
  account_name: string | null;
  account_number: string;
  bank_name: string | null;
  branch_name: string | null;
  routing_number: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePaymentAccountInput {
  mosque_id: number | string;
  account_type: PaymentAccountType | string;
  account_number: string;
  account_name?: string | null;
  bank_name?: string | null;
  branch_name?: string | null;
  routing_number?: string | null;
  is_verified?: boolean | null;
  is_active?: boolean | null;
}

export type UpdatePaymentAccountInput = Partial<CreatePaymentAccountInput>;

export interface PaymentAccountFilters {
  mosque_id?: string;
  account_type?: string;
  is_active?: string | boolean;
}

export default PaymentAccount;

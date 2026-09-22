export type MosqueStatus = "pending" | "verified" | "rejected" | "inactive";
export type UserRole = "admin" | "mosque_admin";
export type PaymentAccountType = "bank" | "bkash" | "nagad" | "rocket" | "other";
export type FundRequestStatus =
  | "draft"
  | "pending"
  | "approved"
  | "completed"
  | "rejected"
  | "cancelled";
export type CollectionStatus = "draft" | "published";

export interface Mosque {
  id: number;
  name: string;
  name_bn: string | null;
  address: string | null;
  division: string;
  district: string;
  upazila: string | null;
  area: string | null;
  phone: string | null;
  email: string | null;
  latitude: string | null;
  longitude: string | null;
  mosque_image: string | null;
  status: MosqueStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateMosqueInput {
  name: string;
  division: string;
  district: string;
  name_bn?: string;
  address?: string;
  upazila?: string;
  area?: string;
  phone?: string;
  email?: string;
  status?: MosqueStatus;
}

export interface User {
  id: number;
  mosque_id: number | null;
  name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  name: string;
  phone: string;
  password: string;
  mosque_id?: number | string | null;
  email?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface PaymentAccount {
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
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentAccountInput {
  mosque_id: number | string;
  account_type: PaymentAccountType;
  account_number: string;
  account_name?: string;
  bank_name?: string;
  branch_name?: string;
  routing_number?: string;
  is_verified?: boolean;
  is_active?: boolean;
}

export interface FundRequest {
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
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  mosque_name?: string | null;
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
  start_date?: string;
  needed_by?: string;
  contact_person?: string;
  contact_phone?: string;
  status?: FundRequestStatus;
  created_by?: number | string;
}

export interface WeeklyCollection {
  id: number;
  mosque_id: number;
  week_start_date: string;
  week_end_date: string;
  amount: string;
  note: string | null;
  status: CollectionStatus;
  submitted_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateWeeklyCollectionInput {
  mosque_id: number | string;
  week_start_date: string;
  week_end_date: string;
  amount: number | string;
  note?: string;
  status?: CollectionStatus;
  submitted_by?: number | string;
}

export interface HealthStatus {
  status: string;
  database: string;
  time: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiErrorBody {
  error: string;
}

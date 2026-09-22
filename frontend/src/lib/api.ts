import { getToken } from "./auth";
import type {
  ApiErrorBody,
  CreateFundRequestInput,
  CreateMosqueInput,
  CreatePaymentAccountInput,
  CreateUserInput,
  CreateWeeklyCollectionInput,
  FundRequest,
  HealthStatus,
  LoginResponse,
  Mosque,
  PaymentAccount,
  User,
  WeeklyCollection,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = (await res.json().catch(() => ({}))) as T | ApiErrorBody;

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? (data as ApiErrorBody).error
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

function toQuery(filters?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (!filters) return "";
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getApiUrl() {
  return API_URL;
}

export async function login(phone: string, password: string) {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
}

export async function getMe() {
  return request<User>("/api/auth/me");
}

export async function getHealth() {
  return request<HealthStatus>("/health");
}

export async function listMosques(filters?: Record<string, string | undefined>) {
  return request<Mosque[]>(`/api/mosques${toQuery(filters)}`);
}

export async function getMosque(id: string | number) {
  return request<Mosque>(`/api/mosques/${id}`);
}

export async function createMosque(body: CreateMosqueInput) {
  return request<Mosque>("/api/mosques", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateMosque(
  id: string | number,
  body: Partial<CreateMosqueInput>
) {
  return request<Mosque>(`/api/mosques/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteMosque(id: string | number) {
  return request<void>(`/api/mosques/${id}`, { method: "DELETE" });
}

export async function listUsers(filters?: Record<string, string | undefined>) {
  return request<User[]>(`/api/users${toQuery(filters)}`);
}

export async function getUser(id: string | number) {
  return request<User>(`/api/users/${id}`);
}

export async function createUser(body: CreateUserInput) {
  return request<User>("/api/users", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateUser(
  id: string | number,
  body: Partial<CreateUserInput>
) {
  return request<User>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteUser(id: string | number) {
  return request<void>(`/api/users/${id}`, { method: "DELETE" });
}

export async function listPaymentAccounts(
  filters?: Record<string, string | undefined>
) {
  return request<PaymentAccount[]>(`/api/payment-accounts${toQuery(filters)}`);
}

export async function getPaymentAccount(id: string | number) {
  return request<PaymentAccount>(`/api/payment-accounts/${id}`);
}

export async function createPaymentAccount(body: CreatePaymentAccountInput) {
  return request<PaymentAccount>("/api/payment-accounts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updatePaymentAccount(
  id: string | number,
  body: Partial<CreatePaymentAccountInput>
) {
  return request<PaymentAccount>(`/api/payment-accounts/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deletePaymentAccount(id: string | number) {
  return request<void>(`/api/payment-accounts/${id}`, { method: "DELETE" });
}

export async function listFundRequests(
  filters?: Record<string, string | undefined>
) {
  return request<FundRequest[]>(`/api/fund-requests${toQuery(filters)}`);
}

export async function getFundRequest(id: string | number) {
  return request<FundRequest>(`/api/fund-requests/${id}`);
}

export async function createFundRequest(body: CreateFundRequestInput) {
  return request<FundRequest>("/api/fund-requests", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateFundRequest(
  id: string | number,
  body: Partial<CreateFundRequestInput>
) {
  return request<FundRequest>(`/api/fund-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteFundRequest(id: string | number) {
  return request<void>(`/api/fund-requests/${id}`, { method: "DELETE" });
}

export async function listWeeklyCollections(
  filters?: Record<string, string | undefined>
) {
  return request<WeeklyCollection[]>(
    `/api/weekly-collections${toQuery(filters)}`
  );
}

export async function getWeeklyCollection(id: string | number) {
  return request<WeeklyCollection>(`/api/weekly-collections/${id}`);
}

export async function createWeeklyCollection(body: CreateWeeklyCollectionInput) {
  return request<WeeklyCollection>("/api/weekly-collections", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateWeeklyCollection(
  id: string | number,
  body: Partial<CreateWeeklyCollectionInput>
) {
  return request<WeeklyCollection>(`/api/weekly-collections/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteWeeklyCollection(id: string | number) {
  return request<void>(`/api/weekly-collections/${id}`, { method: "DELETE" });
}

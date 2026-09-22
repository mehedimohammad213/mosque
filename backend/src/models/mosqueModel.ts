/**
 * Mosque model — structure only (no queries).
 */
const Mosque = {
  table: 'mosques',
  statuses: ['pending', 'verified', 'rejected', 'inactive'] as const,
  fields: {
    id: { type: 'serial', required: true },
    name: { type: 'string', required: true },
    name_bn: { type: 'string', required: false },
    address: { type: 'text', required: false },
    division: { type: 'string', required: true },
    district: { type: 'string', required: true },
    upazila: { type: 'string', required: false },
    area: { type: 'string', required: false },
    phone: { type: 'string', required: false },
    email: { type: 'string', required: false },
    latitude: { type: 'decimal', required: false },
    longitude: { type: 'decimal', required: false },
    mosque_image: { type: 'string', required: false },
    status: { type: 'enum', required: true, default: 'pending' },
    created_at: { type: 'timestamp', required: true },
    updated_at: { type: 'timestamp', required: true },
  },
} as const;

export type MosqueStatus = (typeof Mosque.statuses)[number];

export interface MosqueRow {
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
  created_at: Date;
  updated_at: Date;
}

export interface CreateMosqueInput {
  name: string;
  division: string;
  district: string;
  name_bn?: string | null;
  address?: string | null;
  upazila?: string | null;
  area?: string | null;
  phone?: string | null;
  email?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  mosque_image?: string | null;
  status?: MosqueStatus | null;
}

export type UpdateMosqueInput = Partial<CreateMosqueInput>;

export interface MosqueFilters {
  status?: string;
  division?: string;
  district?: string;
}

export default Mosque;

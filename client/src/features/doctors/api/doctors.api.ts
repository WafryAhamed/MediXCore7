import { apiClient } from '../../../lib/api/client';
import { API_URLS } from '../../../lib/constants';
import type {
  ApiResponse, PaginatedResponse, Doctor,
  CreateDoctorRequest, DoctorsQueryParams,
  DoctorSchedule,
} from '../../../types';

export const doctorsApi = {
  getAll: (params: DoctorsQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Doctor>>(API_URLS.DOCTORS, { params }) as unknown as Promise<PaginatedResponse<Doctor>>,

  getById: (id: string) =>
    apiClient.get<ApiResponse<Doctor>>(`${API_URLS.DOCTORS}/${id}`) as unknown as Promise<ApiResponse<Doctor>>,

  create: (data: CreateDoctorRequest) =>
    apiClient.post<ApiResponse<Doctor>>(API_URLS.DOCTORS, data) as unknown as Promise<ApiResponse<Doctor>>,

  update: (id: string, data: Partial<CreateDoctorRequest>) =>
    apiClient.put<ApiResponse<Doctor>>(`${API_URLS.DOCTORS}/${id}`, data) as unknown as Promise<ApiResponse<Doctor>>,

  getSchedule: (id: string) =>
    apiClient.get<ApiResponse<DoctorSchedule[]>>(`${API_URLS.DOCTORS}/${id}/schedule`) as unknown as Promise<ApiResponse<DoctorSchedule[]>>,

  updateSchedule: (id: string, schedule: DoctorSchedule[]) =>
    apiClient.put<ApiResponse<DoctorSchedule[]>>(`${API_URLS.DOCTORS}/${id}/schedule`, { schedule }) as unknown as Promise<ApiResponse<DoctorSchedule[]>>,
};

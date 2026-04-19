import { apiClient } from '../../../lib/api/client';
import { API_URLS } from '../../../lib/constants';
import type {
  ApiResponse, PaginatedResponse, Appointment,
  CreateAppointmentRequest, AppointmentsQueryParams,
  TimeSlot,
} from '../../../types';

export const appointmentsApi = {
  getAll: (params: AppointmentsQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Appointment>>(API_URLS.APPOINTMENTS, { params }) as unknown as Promise<PaginatedResponse<Appointment>>,

  getById: (id: string) =>
    apiClient.get<ApiResponse<Appointment>>(`${API_URLS.APPOINTMENTS}/${id}`) as unknown as Promise<ApiResponse<Appointment>>,

  create: (data: CreateAppointmentRequest) =>
    apiClient.post<ApiResponse<Appointment>>(API_URLS.APPOINTMENTS, data) as unknown as Promise<ApiResponse<Appointment>>,

  update: (id: string, data: Partial<CreateAppointmentRequest>) =>
    apiClient.put<ApiResponse<Appointment>>(`${API_URLS.APPOINTMENTS}/${id}`, data) as unknown as Promise<ApiResponse<Appointment>>,

  cancel: (id: string) =>
    apiClient.patch<ApiResponse<Appointment>>(`${API_URLS.APPOINTMENTS}/${id}/cancel`) as unknown as Promise<ApiResponse<Appointment>>,

  complete: (id: string) =>
    apiClient.patch<ApiResponse<Appointment>>(`${API_URLS.APPOINTMENTS}/${id}/complete`) as unknown as Promise<ApiResponse<Appointment>>,

  getSlots: (doctorId: string, date: string) =>
    apiClient.get<ApiResponse<TimeSlot[]>>(`${API_URLS.APPOINTMENTS}/slots`, {
      params: { doctorId, date },
    }) as unknown as Promise<ApiResponse<TimeSlot[]>>,

  getByPatient: (patientId: string, params: AppointmentsQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Appointment>>(`${API_URLS.PATIENTS}/${patientId}/appointments`, { params }) as unknown as Promise<PaginatedResponse<Appointment>>,
};

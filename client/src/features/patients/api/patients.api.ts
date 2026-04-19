import { apiClient } from '../../../lib/api/client';
import { API_URLS } from '../../../lib/constants';
import type {
  ApiResponse, PaginatedResponse, Patient,
  CreatePatientRequest, PatientsQueryParams,
  Vitals, MedicalNote,
} from '../../../types';

export const patientsApi = {
  getAll: (params: PatientsQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Patient>>(API_URLS.PATIENTS, { params }) as unknown as Promise<PaginatedResponse<Patient>>,

  getById: (id: string) =>
    apiClient.get<ApiResponse<Patient>>(`${API_URLS.PATIENTS}/${id}`) as unknown as Promise<ApiResponse<Patient>>,

  create: (data: CreatePatientRequest) =>
    apiClient.post<ApiResponse<Patient>>(API_URLS.PATIENTS, data) as unknown as Promise<ApiResponse<Patient>>,

  update: (id: string, data: Partial<CreatePatientRequest>) =>
    apiClient.put<ApiResponse<Patient>>(`${API_URLS.PATIENTS}/${id}`, data) as unknown as Promise<ApiResponse<Patient>>,

  deactivate: (id: string) =>
    apiClient.patch<ApiResponse<Patient>>(`${API_URLS.PATIENTS}/${id}/deactivate`) as unknown as Promise<ApiResponse<Patient>>,

  // Vitals
  getVitals: (patientId: string) =>
    apiClient.get<ApiResponse<Vitals[]>>(`${API_URLS.PATIENTS}/${patientId}/vitals`) as unknown as Promise<ApiResponse<Vitals[]>>,

  addVitals: (patientId: string, data: Omit<Vitals, 'id' | 'patientId' | 'recordedAt'>) =>
    apiClient.post<ApiResponse<Vitals>>(`${API_URLS.PATIENTS}/${patientId}/vitals`, data) as unknown as Promise<ApiResponse<Vitals>>,

  // Medical Notes
  getNotes: (patientId: string) =>
    apiClient.get<ApiResponse<MedicalNote[]>>(`${API_URLS.PATIENTS}/${patientId}/notes`) as unknown as Promise<ApiResponse<MedicalNote[]>>,

  addNote: (patientId: string, content: string) =>
    apiClient.post<ApiResponse<MedicalNote>>(`${API_URLS.PATIENTS}/${patientId}/notes`, { content }) as unknown as Promise<ApiResponse<MedicalNote>>,
};

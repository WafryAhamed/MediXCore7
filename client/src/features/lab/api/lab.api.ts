import { apiClient } from '../../../lib/api/client';
import { API_URLS } from '../../../lib/constants';
import type {
  ApiResponse, PaginatedResponse, LabRequest,
  LabResultInput, LabCatalogItem, LabQueryParams,
} from '../../../types';

export const labApi = {
  getRequests: (params: LabQueryParams = {}) =>
    apiClient.get<PaginatedResponse<LabRequest>>(`${API_URLS.LAB}/requests`, { params }) as unknown as Promise<PaginatedResponse<LabRequest>>,

  getRequestById: (id: string) =>
    apiClient.get<ApiResponse<LabRequest>>(`${API_URLS.LAB}/requests/${id}`) as unknown as Promise<ApiResponse<LabRequest>>,

  updateStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<LabRequest>>(`${API_URLS.LAB}/requests/${id}/status`, { status }) as unknown as Promise<ApiResponse<LabRequest>>,

  uploadResult: (id: string, data: LabResultInput) =>
    apiClient.put<ApiResponse<LabRequest>>(`${API_URLS.LAB}/requests/${id}/results`, data) as unknown as Promise<ApiResponse<LabRequest>>,

  getCatalog: () =>
    apiClient.get<ApiResponse<LabCatalogItem[]>>(`${API_URLS.LAB}/catalog`) as unknown as Promise<ApiResponse<LabCatalogItem[]>>,

  getPatientLabResults: (patientId: string) =>
    apiClient.get<ApiResponse<LabRequest[]>>(`${API_URLS.PATIENTS}/${patientId}/lab-results`) as unknown as Promise<ApiResponse<LabRequest[]>>,
};

import { apiClient } from '../../../lib/api/client';
import { API_URLS } from '../../../lib/constants';
import type {
  ApiResponse, PaginatedResponse, Prescription,
  Medicine, CreateMedicineRequest, PharmacyQueryParams,
} from '../../../types';

export const pharmacyApi = {
  // Prescriptions
  getPendingPrescriptions: (params: PharmacyQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Prescription>>(`${API_URLS.PRESCRIPTIONS}`, {
      params: { ...params, status: 'PENDING' },
    }) as unknown as Promise<PaginatedResponse<Prescription>>,

  dispensePrescription: (id: string) =>
    apiClient.put<ApiResponse<Prescription>>(`${API_URLS.PRESCRIPTIONS}/${id}/dispense`) as unknown as Promise<ApiResponse<Prescription>>,

  getPatientPrescriptions: (patientId: string) =>
    apiClient.get<ApiResponse<Prescription[]>>(`${API_URLS.PATIENTS}/${patientId}/prescriptions`) as unknown as Promise<ApiResponse<Prescription[]>>,

  // Medicine Inventory
  getMedicines: (params: PharmacyQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Medicine>>(`${API_URLS.PHARMACY}/medicines`, { params }) as unknown as Promise<PaginatedResponse<Medicine>>,

  addMedicine: (data: CreateMedicineRequest) =>
    apiClient.post<ApiResponse<Medicine>>(`${API_URLS.PHARMACY}/medicines`, data) as unknown as Promise<ApiResponse<Medicine>>,

  updateMedicine: (id: string, data: Partial<CreateMedicineRequest>) =>
    apiClient.put<ApiResponse<Medicine>>(`${API_URLS.PHARMACY}/medicines/${id}`, data) as unknown as Promise<ApiResponse<Medicine>>,

  restockMedicine: (id: string, quantity: number) =>
    apiClient.patch<ApiResponse<Medicine>>(`${API_URLS.PHARMACY}/medicines/${id}/restock`, { quantity }) as unknown as Promise<ApiResponse<Medicine>>,

  getLowStockCount: () =>
    apiClient.get<ApiResponse<number>>(`${API_URLS.PHARMACY}/medicines/low-stock-count`) as unknown as Promise<ApiResponse<number>>,

  getExpiredCount: () =>
    apiClient.get<ApiResponse<number>>(`${API_URLS.PHARMACY}/medicines/expired-count`) as unknown as Promise<ApiResponse<number>>,
};

import { apiClient } from '../../../lib/api/client';
import { API_URLS } from '../../../lib/constants';
import type {
  ApiResponse, PaginatedResponse, Invoice,
  CreateInvoiceRequest, RecordPaymentRequest,
  BillingQueryParams, BillingSummary,
  MonthlyRevenue, RevenueByDepartment,
} from '../../../types';

export const billingApi = {
  getInvoices: (params: BillingQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Invoice>>(`${API_URLS.BILLING}/invoices`, { params }) as unknown as Promise<PaginatedResponse<Invoice>>,

  getInvoiceById: (id: string) =>
    apiClient.get<ApiResponse<Invoice>>(`${API_URLS.BILLING}/invoices/${id}`) as unknown as Promise<ApiResponse<Invoice>>,

  createInvoice: (data: CreateInvoiceRequest) =>
    apiClient.post<ApiResponse<Invoice>>(`${API_URLS.BILLING}/invoices`, data) as unknown as Promise<ApiResponse<Invoice>>,

  recordPayment: (id: string, data: RecordPaymentRequest) =>
    apiClient.put<ApiResponse<Invoice>>(`${API_URLS.BILLING}/invoices/${id}/pay`, data) as unknown as Promise<ApiResponse<Invoice>>,

  cancelInvoice: (id: string) =>
    apiClient.patch<ApiResponse<Invoice>>(`${API_URLS.BILLING}/invoices/${id}/cancel`) as unknown as Promise<ApiResponse<Invoice>>,

  getSummary: () =>
    apiClient.get<ApiResponse<BillingSummary>>(`${API_URLS.BILLING}/summary`) as unknown as Promise<ApiResponse<BillingSummary>>,

  getMonthlyRevenue: (year?: number) =>
    apiClient.get<ApiResponse<MonthlyRevenue[]>>(`${API_URLS.BILLING}/revenue/monthly`, {
      params: { year },
    }) as unknown as Promise<ApiResponse<MonthlyRevenue[]>>,

  getRevenueByDepartment: () =>
    apiClient.get<ApiResponse<RevenueByDepartment[]>>(`${API_URLS.BILLING}/revenue/department`) as unknown as Promise<ApiResponse<RevenueByDepartment[]>>,

  getPatientInvoices: (patientId: string) =>
    apiClient.get<ApiResponse<Invoice[]>>(`${API_URLS.PATIENTS}/${patientId}/invoices`) as unknown as Promise<ApiResponse<Invoice[]>>,
};

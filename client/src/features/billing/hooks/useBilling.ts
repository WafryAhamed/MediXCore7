import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import type { BillingQueryParams, CreateInvoiceRequest, RecordPaymentRequest } from '../../../types';
import { toast } from 'sonner';

export const billingKeys = {
  all: ['billing'] as const,
  invoices: () => [...billingKeys.all, 'invoices'] as const,
  invoiceList: (params: BillingQueryParams) => [...billingKeys.invoices(), params] as const,
  invoiceDetail: (id: string) => [...billingKeys.all, 'invoice', id] as const,
  summary: () => [...billingKeys.all, 'summary'] as const,
  monthlyRevenue: (year?: number) => [...billingKeys.all, 'monthly-revenue', year] as const,
  departmentRevenue: () => [...billingKeys.all, 'dept-revenue'] as const,
  patientInvoices: (patientId: string) => [...billingKeys.all, 'patient', patientId] as const,
};

export function useInvoices(params: BillingQueryParams = {}) {
  return useQuery({
    queryKey: billingKeys.invoiceList(params),
    queryFn: () => billingApi.getInvoices(params),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: billingKeys.invoiceDetail(id),
    queryFn: () => billingApi.getInvoiceById(id),
    enabled: !!id,
  });
}

export function useBillingSummary() {
  return useQuery({
    queryKey: billingKeys.summary(),
    queryFn: () => billingApi.getSummary(),
  });
}

export function useMonthlyRevenue(year?: number) {
  return useQuery({
    queryKey: billingKeys.monthlyRevenue(year),
    queryFn: () => billingApi.getMonthlyRevenue(year),
  });
}

export function useRevenueByDepartment() {
  return useQuery({
    queryKey: billingKeys.departmentRevenue(),
    queryFn: () => billingApi.getRevenueByDepartment(),
  });
}

export function usePatientInvoices(patientId: string) {
  return useQuery({
    queryKey: billingKeys.patientInvoices(patientId),
    queryFn: () => billingApi.getPatientInvoices(patientId),
    enabled: !!patientId,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) => billingApi.createInvoice(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.invoices() });
      qc.invalidateQueries({ queryKey: billingKeys.summary() });
      toast.success('Invoice generated');
    },
    onError: () => toast.error('Failed to generate invoice'),
  });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecordPaymentRequest }) =>
      billingApi.recordPayment(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.invoices() });
      qc.invalidateQueries({ queryKey: billingKeys.summary() });
      toast.success('Payment recorded');
    },
    onError: () => toast.error('Failed to record payment'),
  });
}

export function useCancelInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingApi.cancelInvoice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: billingKeys.invoices() });
      qc.invalidateQueries({ queryKey: billingKeys.summary() });
      toast.success('Invoice cancelled');
    },
    onError: () => toast.error('Failed to cancel invoice'),
  });
}

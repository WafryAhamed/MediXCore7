import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labApi } from '../api/lab.api';
import type { LabQueryParams, LabResultInput } from '../../../types';
import { toast } from 'sonner';

export const labKeys = {
  all: ['lab'] as const,
  requests: () => [...labKeys.all, 'requests'] as const,
  requestList: (params: LabQueryParams) => [...labKeys.requests(), params] as const,
  requestDetail: (id: string) => [...labKeys.all, 'request', id] as const,
  catalog: () => [...labKeys.all, 'catalog'] as const,
  patientResults: (patientId: string) => [...labKeys.all, 'patient', patientId] as const,
};

export function useLabRequests(params: LabQueryParams = {}) {
  return useQuery({
    queryKey: labKeys.requestList(params),
    queryFn: () => labApi.getRequests(params),
  });
}

export function useLabRequest(id: string) {
  return useQuery({
    queryKey: labKeys.requestDetail(id),
    queryFn: () => labApi.getRequestById(id),
    enabled: !!id,
  });
}

export function useLabCatalog() {
  return useQuery({
    queryKey: labKeys.catalog(),
    queryFn: () => labApi.getCatalog(),
  });
}

export function usePatientLabResults(patientId: string) {
  return useQuery({
    queryKey: labKeys.patientResults(patientId),
    queryFn: () => labApi.getPatientLabResults(patientId),
    enabled: !!patientId,
  });
}

export function useUpdateLabStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      labApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: labKeys.requests() });
      toast.success('Lab request status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });
}

export function useUploadLabResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LabResultInput }) =>
      labApi.uploadResult(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: labKeys.requests() });
      toast.success('Lab result uploaded');
    },
    onError: () => toast.error('Failed to upload result'),
  });
}

import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../api/patients.api';
import type { PatientsQueryParams } from '../../../types';

export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (params: PatientsQueryParams) => [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  vitals: (id: string) => [...patientKeys.all, 'vitals', id] as const,
  notes: (id: string) => [...patientKeys.all, 'notes', id] as const,
};

export function usePatients(params: PatientsQueryParams = {}) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientsApi.getAll(params),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientsApi.getById(id),
    enabled: !!id,
  });
}

export function usePatientVitals(patientId: string) {
  return useQuery({
    queryKey: patientKeys.vitals(patientId),
    queryFn: () => patientsApi.getVitals(patientId),
    enabled: !!patientId,
  });
}

export function usePatientNotes(patientId: string) {
  return useQuery({
    queryKey: patientKeys.notes(patientId),
    queryFn: () => patientsApi.getNotes(patientId),
    enabled: !!patientId,
  });
}

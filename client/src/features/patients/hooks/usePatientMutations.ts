import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from '../api/patients.api';
import { patientKeys } from './usePatientQueries';
import type { CreatePatientRequest, Vitals } from '../../../types';
import { toast } from 'sonner';

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.lists() });
      toast.success('Patient registered successfully');
    },
    onError: () => {
      toast.error('Failed to register patient');
    },
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePatientRequest> }) =>
      patientsApi.update(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: patientKeys.lists() });
      toast.success('Patient updated successfully');
    },
    onError: () => {
      toast.error('Failed to update patient');
    },
  });
}

export function useDeactivatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientsApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.lists() });
      toast.success('Patient deactivated');
    },
    onError: () => {
      toast.error('Failed to deactivate patient');
    },
  });
}

export function useAddVitals() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      data,
    }: {
      patientId: string;
      data: Omit<Vitals, 'id' | 'patientId' | 'recordedAt'>;
    }) => patientsApi.addVitals(patientId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: patientKeys.vitals(variables.patientId) });
      toast.success('Vitals recorded');
    },
    onError: () => {
      toast.error('Failed to record vitals');
    },
  });
}

export function useAddMedicalNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, content }: { patientId: string; content: string }) =>
      patientsApi.addNote(patientId, content),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: patientKeys.notes(variables.patientId) });
      toast.success('Note added');
    },
    onError: () => {
      toast.error('Failed to add note');
    },
  });
}

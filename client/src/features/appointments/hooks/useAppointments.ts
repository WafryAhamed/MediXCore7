import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments.api';
import type { AppointmentsQueryParams, CreateAppointmentRequest } from '../../../types';
import { toast } from 'sonner';

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: AppointmentsQueryParams) => [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  slots: (doctorId: string, date: string) => [...appointmentKeys.all, 'slots', doctorId, date] as const,
  byPatient: (patientId: string) => [...appointmentKeys.all, 'patient', patientId] as const,
};

export function useAppointments(params: AppointmentsQueryParams = {}) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => appointmentsApi.getAll(params),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentsApi.getById(id),
    enabled: !!id,
  });
}

export function useAppointmentSlots(doctorId: string, date: string) {
  return useQuery({
    queryKey: appointmentKeys.slots(doctorId, date),
    queryFn: () => appointmentsApi.getSlots(doctorId, date),
    enabled: !!doctorId && !!date,
  });
}

export function usePatientAppointments(patientId: string, params: AppointmentsQueryParams = {}) {
  return useQuery({
    queryKey: appointmentKeys.byPatient(patientId),
    queryFn: () => appointmentsApi.getByPatient(patientId, params),
    enabled: !!patientId,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => appointmentsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Appointment booked successfully');
    },
    onError: () => toast.error('Failed to book appointment'),
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Appointment cancelled');
    },
    onError: () => toast.error('Failed to cancel appointment'),
  });
}

export function useCompleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Appointment completed');
    },
    onError: () => toast.error('Failed to complete appointment'),
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorsApi } from '../api/doctors.api';
import type { DoctorsQueryParams, CreateDoctorRequest, DoctorSchedule } from '../../../types';
import { toast } from 'sonner';

export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (params: DoctorsQueryParams) => [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  schedule: (id: string) => [...doctorKeys.all, 'schedule', id] as const,
};

export function useDoctors(params: DoctorsQueryParams = {}) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => doctorsApi.getAll(params),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorsApi.getById(id),
    enabled: !!id,
  });
}

export function useDoctorSchedule(id: string) {
  return useQuery({
    queryKey: doctorKeys.schedule(id),
    queryFn: () => doctorsApi.getSchedule(id),
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDoctorRequest) => doctorsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: doctorKeys.lists() });
      toast.success('Doctor added successfully');
    },
    onError: () => toast.error('Failed to add doctor'),
  });
}

export function useUpdateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDoctorRequest> }) =>
      doctorsApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: doctorKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: doctorKeys.lists() });
      toast.success('Doctor updated');
    },
    onError: () => toast.error('Failed to update doctor'),
  });
}

export function useUpdateDoctorSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, schedule }: { id: string; schedule: DoctorSchedule[] }) =>
      doctorsApi.updateSchedule(id, schedule),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: doctorKeys.schedule(vars.id) });
      toast.success('Schedule updated');
    },
    onError: () => toast.error('Failed to update schedule'),
  });
}

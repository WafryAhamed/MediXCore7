import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pharmacyApi } from '../api/pharmacy.api';
import type { PharmacyQueryParams, CreateMedicineRequest } from '../../../types';
import { toast } from 'sonner';

export const pharmacyKeys = {
  all: ['pharmacy'] as const,
  prescriptions: () => [...pharmacyKeys.all, 'prescriptions'] as const,
  prescriptionList: (params: PharmacyQueryParams) => [...pharmacyKeys.prescriptions(), params] as const,
  medicines: () => [...pharmacyKeys.all, 'medicines'] as const,
  medicineList: (params: PharmacyQueryParams) => [...pharmacyKeys.medicines(), params] as const,
  lowStockCount: () => [...pharmacyKeys.all, 'low-stock-count'] as const,
  expiredCount: () => [...pharmacyKeys.all, 'expired-count'] as const,
};

export function usePendingPrescriptions(params: PharmacyQueryParams = {}) {
  return useQuery({
    queryKey: pharmacyKeys.prescriptionList(params),
    queryFn: () => pharmacyApi.getPendingPrescriptions(params),
  });
}

export function useMedicines(params: PharmacyQueryParams = {}) {
  return useQuery({
    queryKey: pharmacyKeys.medicineList(params),
    queryFn: () => pharmacyApi.getMedicines(params),
  });
}

export function useLowStockCount() {
  return useQuery({
    queryKey: pharmacyKeys.lowStockCount(),
    queryFn: () => pharmacyApi.getLowStockCount(),
  });
}

export function useExpiredCount() {
  return useQuery({
    queryKey: pharmacyKeys.expiredCount(),
    queryFn: () => pharmacyApi.getExpiredCount(),
  });
}

export function useDispensePrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pharmacyApi.dispensePrescription(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pharmacyKeys.prescriptions() });
      qc.invalidateQueries({ queryKey: pharmacyKeys.medicines() });
      toast.success('Prescription dispensed');
    },
    onError: () => toast.error('Failed to dispense prescription'),
  });
}

export function useAddMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMedicineRequest) => pharmacyApi.addMedicine(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pharmacyKeys.medicines() });
      toast.success('Medicine added');
    },
    onError: () => toast.error('Failed to add medicine'),
  });
}

export function useRestockMedicine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      pharmacyApi.restockMedicine(id, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pharmacyKeys.medicines() });
      qc.invalidateQueries({ queryKey: pharmacyKeys.lowStockCount() });
      toast.success('Medicine restocked');
    },
    onError: () => toast.error('Failed to restock medicine'),
  });
}

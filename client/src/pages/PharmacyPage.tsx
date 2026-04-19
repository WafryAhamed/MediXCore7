import React, { useState, useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { AlertTriangle, Package, Pill } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Card, CardBody } from '../components/ui/Card';
import {
  usePendingPrescriptions, useMedicines, useLowStockCount,
  useExpiredCount, useDispensePrescription, useRestockMedicine,
} from '../features/pharmacy/hooks/usePharmacy';
import type { Prescription, Medicine, PharmacyQueryParams, MedicineStatus } from '../types';

export const PharmacyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pharmacy"
        subtitle="Manage prescriptions and medicine inventory"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Pharmacy' }]}
      />

      <Tabs.Root defaultValue="prescriptions">
        <Tabs.List className="flex gap-1 border-b border-slate-700/50 mb-6">
          <Tabs.Trigger value="prescriptions" className="px-4 py-2.5 text-sm text-slate-400 border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary">
            <Pill className="h-4 w-4 inline mr-1.5" />Pending Prescriptions
          </Tabs.Trigger>
          <Tabs.Trigger value="inventory" className="px-4 py-2.5 text-sm text-slate-400 border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary">
            <Package className="h-4 w-4 inline mr-1.5" />Medicine Inventory
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="prescriptions"><PrescriptionsTab /></Tabs.Content>
        <Tabs.Content value="inventory"><InventoryTab /></Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

const PrescriptionsTab: React.FC = () => {
  const [params, setParams] = useState<PharmacyQueryParams>({ page: 0, size: 10 });
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePendingPrescriptions({ ...params, search });
  const dispense = useDispensePrescription();

  const columns = useMemo<ColumnDef<Prescription, unknown>[]>(() => [
    { accessorKey: 'prescriptionNumber', header: 'Rx#', cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span> },
    { id: 'patient', header: 'Patient', accessorFn: (r) => `${r.patient?.firstName ?? ''} ${r.patient?.lastName ?? ''}` },
    { id: 'doctor', header: 'Doctor', accessorFn: (r) => `Dr. ${r.doctor?.firstName ?? ''} ${r.doctor?.lastName ?? ''}` },
    { accessorKey: 'issuedAt', header: 'Date', cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM dd, yyyy') },
    { id: 'items', header: 'Items', accessorFn: (r) => r.items?.length ?? 0 },
    {
      accessorKey: 'status', header: 'Status',
      cell: ({ getValue }) => <Badge variant={getValue() === 'PENDING' ? 'warning' : 'success'} size="sm">{getValue() as string}</Badge>,
    },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <Button size="sm" variant="primary" onClick={() => dispense.mutate(row.original.id)} loading={dispense.isPending}>
          Dispense
        </Button>
      ),
      enableSorting: false,
    },
  ], [dispense]);

  return (
    <DataTable
      columns={columns}
      data={data?.data?.content ?? []}
      loading={isLoading}
      searchValue={search}
      onSearchChange={setSearch}
      page={data?.data?.number ?? 0}
      size={data?.data?.size ?? 10}
      totalElements={data?.data?.totalElements ?? 0}
      totalPages={data?.data?.totalPages ?? 1}
      onPageChange={(p) => setParams(prev => ({ ...prev, page: p }))}
      onSizeChange={(s) => setParams(prev => ({ ...prev, size: s, page: 0 }))}
    />
  );
};

const InventoryTab: React.FC = () => {
  const [params, setParams] = useState<PharmacyQueryParams>({ page: 0, size: 10 });
  const [search, setSearch] = useState('');
  const { data, isLoading } = useMedicines({ ...params, search });
  const { data: lowStock } = useLowStockCount();
  const { data: expired } = useExpiredCount();
  const restock = useRestockMedicine();

  const lowStockCount = (lowStock as unknown as { data: number })?.data ?? 0;
  const expiredCount = (expired as unknown as { data: number })?.data ?? 0;

  const columns = useMemo<ColumnDef<Medicine, unknown>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'genericName', header: 'Generic' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'stock', header: 'Stock', cell: ({ row }) => (
      <span className={row.original.stock <= row.original.reorderLevel ? 'text-red-400 font-semibold' : ''}>
        {row.original.stock}
      </span>
    )},
    { accessorKey: 'unit', header: 'Unit' },
    { accessorKey: 'reorderLevel', header: 'Reorder Lvl' },
    { accessorKey: 'expiryDate', header: 'Expiry', cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM yyyy') },
    {
      accessorKey: 'status', header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as MedicineStatus;
        const v = s === 'IN_STOCK' ? 'success' : s === 'LOW_STOCK' ? 'warning' : s === 'EXPIRED' ? 'danger' : 'default';
        return <Badge variant={v} size="sm">{s.replace('_', ' ')}</Badge>;
      },
    },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <Button size="sm" variant="outline" onClick={() => restock.mutate({ id: row.original.id, quantity: 50 })}>
          Restock
        </Button>
      ),
      enableSorting: false,
    },
  ], [restock]);

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="flex flex-wrap gap-3">
        {lowStockCount > 0 && (
          <Card className="border-amber-500/20 bg-amber-500/5 flex-1 min-w-[250px]">
            <CardBody className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <p className="text-sm text-amber-300">{lowStockCount} medicines below reorder level</p>
            </CardBody>
          </Card>
        )}
        {expiredCount > 0 && (
          <Card className="border-red-500/20 bg-red-500/5 flex-1 min-w-[250px]">
            <CardBody className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-sm text-red-300">{expiredCount} medicines expired</p>
            </CardBody>
          </Card>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.data?.content ?? []}
        loading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search medicines..."
        page={data?.data?.number ?? 0}
        size={data?.data?.size ?? 10}
        totalElements={data?.data?.totalElements ?? 0}
        totalPages={data?.data?.totalPages ?? 1}
        onPageChange={(p) => setParams(prev => ({ ...prev, page: p }))}
        onSizeChange={(s) => setParams(prev => ({ ...prev, size: s, page: 0 }))}
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { FlaskConical, BookOpen } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Select } from '../components/ui/Select';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { useLabRequests, useLabCatalog, useUpdateLabStatus } from '../features/lab/hooks/useLab';
import type { LabRequest, LabCatalogItem, LabQueryParams, LabRequestStatus, LabPriority } from '../types';


export const LabPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Laboratory"
        subtitle="Manage test requests and results"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Lab' }]}
      />

      <Tabs.Root defaultValue="requests">
        <Tabs.List className="flex gap-1 border-b border-slate-700/50 mb-6">
          <Tabs.Trigger value="requests" className="px-4 py-2.5 text-sm text-slate-400 border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary">
            <FlaskConical className="h-4 w-4 inline mr-1.5" />Test Requests
          </Tabs.Trigger>
          <Tabs.Trigger value="catalog" className="px-4 py-2.5 text-sm text-slate-400 border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary">
            <BookOpen className="h-4 w-4 inline mr-1.5" />Lab Catalog
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="requests"><RequestsTab /></Tabs.Content>
        <Tabs.Content value="catalog"><CatalogTab /></Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

const RequestsTab: React.FC = () => {
  const [params, setParams] = useState<LabQueryParams>({ page: 0, size: 10 });
  const [search, setSearch] = useState('');
  const { data, isLoading } = useLabRequests({ ...params, search });
  const updateStatus = useUpdateLabStatus();

  const columns = useMemo<ColumnDef<LabRequest, unknown>[]>(() => [
    { accessorKey: 'labNumber', header: 'Lab#', cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span> },
    { id: 'patient', header: 'Patient', accessorFn: (r) => `${r.patient?.firstName ?? ''} ${r.patient?.lastName ?? ''}` },
    { id: 'doctor', header: 'Doctor', accessorFn: (r) => `Dr. ${r.doctor?.firstName ?? ''} ${r.doctor?.lastName ?? ''}` },
    { accessorKey: 'testName', header: 'Test' },
    { accessorKey: 'testCategory', header: 'Category' },
    {
      accessorKey: 'priority', header: 'Priority',
      cell: ({ getValue }) => {
        const p = getValue() as LabPriority;
        const v = p === 'STAT' ? 'danger' : p === 'URGENT' ? 'warning' : 'default';
        return <Badge variant={v} size="sm">{p}</Badge>;
      },
    },
    {
      accessorKey: 'status', header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as LabRequestStatus;
        const v = s === 'COMPLETED' ? 'success' : s === 'PROCESSING' ? 'info' : 'default';
        return <Badge variant={v} size="sm">{s.replace('_', ' ')}</Badge>;
      },
    },
    { accessorKey: 'orderedAt', header: 'Ordered', cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM dd, yyyy') },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => {
        const status = row.original.status;
        const nextStatus: Record<string, string> = { ORDERED: 'SAMPLE_COLLECTED', SAMPLE_COLLECTED: 'PROCESSING', PROCESSING: 'COMPLETED' };
        const next = nextStatus[status];
        return next ? (
          <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: row.original.id, status: next })}>
            → {next.replace('_', ' ')}
          </Button>
        ) : <Badge variant="success" size="sm">Done</Badge>;
      },
      enableSorting: false,
    },
  ], [updateStatus]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select
          placeholder="Status"
          clearable
          options={['ORDERED', 'SAMPLE_COLLECTED', 'PROCESSING', 'COMPLETED'].map(s => ({ label: s.replace('_', ' '), value: s }))}
          value={params.status || ''}
          onValueChange={(v) => setParams(p => ({ ...p, status: (v || undefined) as LabRequestStatus | undefined, page: 0 }))}
          className="w-48"
        />
        <Select
          placeholder="Priority"
          clearable
          options={['ROUTINE', 'URGENT', 'STAT'].map(s => ({ label: s, value: s }))}
          value={params.priority || ''}
          onValueChange={(v) => setParams(p => ({ ...p, priority: (v || undefined) as LabPriority | undefined, page: 0 }))}
          className="w-40"
        />
      </div>

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
    </div>
  );
};

const CatalogTab: React.FC = () => {
  const { data, isLoading } = useLabCatalog();
  const catalog = (data as unknown as { data: LabCatalogItem[] })?.data ?? [];

  const grouped = catalog.reduce<Record<string, LabCatalogItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Card><CardBody><div className="text-center text-sm text-slate-500 py-8">Loading catalog...</div></CardBody></Card>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <Card key={category}>
            <CardHeader title={category} subtitle={`${items.length} tests`} />
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-700/50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Test Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">TAT</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Price</th>
                </tr></thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b border-slate-700/30 last:border-0">
                      <td className="px-4 py-2.5 text-slate-200">{item.testName}</td>
                      <td className="px-4 py-2.5 text-slate-400">{item.turnaroundTime}</td>
                      <td className="px-4 py-2.5 text-slate-200">LKR {item.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
};

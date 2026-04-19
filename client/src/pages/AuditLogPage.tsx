import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { API_URLS } from '../lib/constants';
import type { AuditLogEntry, AuditLogQueryParams, PaginatedResponse } from '../types';

function useAuditLog(params: AuditLogQueryParams = {}) {
  return useQuery({
    queryKey: ['admin', 'audit-log', params],
    queryFn: () => apiClient.get(API_URLS.AUDIT_LOG, { params }) as unknown as Promise<PaginatedResponse<AuditLogEntry>>,
  });
}

export const AuditLogPage: React.FC = () => {
  const [params, setParams] = useState<AuditLogQueryParams>({ page: 0, size: 20 });
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data, isLoading } = useAuditLog({ ...params, search });

  const columns = useMemo<ColumnDef<AuditLogEntry, unknown>[]>(() => [
    {
      accessorKey: 'timestamp', header: 'Timestamp',
      cell: ({ getValue }) => <span className="text-xs">{format(new Date(getValue() as string), 'MMM dd, yyyy HH:mm:ss')}</span>,
    },
    { accessorKey: 'userName', header: 'User' },
    {
      accessorKey: 'action', header: 'Action',
      cell: ({ getValue }) => <Badge variant="info" size="sm">{getValue() as string}</Badge>,
    },
    { accessorKey: 'resource', header: 'Resource' },
    { accessorKey: 'resourceId', header: 'Resource ID', cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span> },
    { accessorKey: 'ipAddress', header: 'IP Address', cell: ({ getValue }) => <span className="font-mono text-xs text-slate-400">{getValue() as string}</span> },
    {
      id: 'details', header: 'Details',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpandedRow(expandedRow === row.original.id ? null : row.original.id)}
        >
          {expandedRow === row.original.id ? 'Hide' : 'Show'}
        </Button>
      ),
      enableSorting: false,
    },
  ], [expandedRow]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        subtitle="System activity and change history"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Admin' }, { label: 'Audit Log' }]}
      >
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Export CSV
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <Select
          placeholder="Action"
          clearable
          options={['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW'].map(a => ({ label: a, value: a }))}
          value={params.action || ''}
          onValueChange={(v) => setParams(p => ({ ...p, action: v || undefined, page: 0 }))}
          className="w-40"
        />
        <Select
          placeholder="Resource"
          clearable
          options={['PATIENT', 'DOCTOR', 'APPOINTMENT', 'PRESCRIPTION', 'INVOICE', 'USER'].map(r => ({ label: r, value: r }))}
          value={params.resource || ''}
          onValueChange={(v) => setParams(p => ({ ...p, resource: v || undefined, page: 0 }))}
          className="w-40"
        />
        <Input
          type="date"
          value={params.dateFrom || ''}
          onChange={(e) => setParams(p => ({ ...p, dateFrom: e.target.value || undefined, page: 0 }))}
          className="w-40"
          placeholder="From"
        />
        <Input
          type="date"
          value={params.dateTo || ''}
          onChange={(e) => setParams(p => ({ ...p, dateTo: e.target.value || undefined, page: 0 }))}
          className="w-40"
          placeholder="To"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data?.content ?? []}
        loading={isLoading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setParams(p => ({ ...p, page: 0 })); }}
        page={data?.data?.number ?? 0}
        size={data?.data?.size ?? 20}
        totalElements={data?.data?.totalElements ?? 0}
        totalPages={data?.data?.totalPages ?? 1}
        onPageChange={(p) => setParams(prev => ({ ...prev, page: p }))}
        onSizeChange={(s) => setParams(prev => ({ ...prev, size: s, page: 0 }))}
      />
    </div>
  );
};

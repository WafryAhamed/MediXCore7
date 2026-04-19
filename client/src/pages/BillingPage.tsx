import React, { useState, useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Plus, Receipt, BarChart3, DollarSign, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import {
  useInvoices, useBillingSummary, useMonthlyRevenue,
  useRevenueByDepartment, useRecordPayment, useCancelInvoice,
} from '../features/billing/hooks/useBilling';
import type { Invoice, BillingQueryParams, InvoiceStatus, BillingSummary } from '../types';
import {
  ResponsiveContainer, BarChart, Bar as RechartsBar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from 'recharts';
import { cn } from '../lib/utils';

export const BillingPage: React.FC = () => {
  const { data: summaryData, isLoading: summaryLoading } = useBillingSummary();
  const summary = (summaryData as unknown as { data: BillingSummary })?.data;

  const summaryCards = [
    { icon: <DollarSign className="h-6 w-6 text-emerald-400" />, label: 'Revenue This Month', value: `LKR ${(summary?.totalRevenueThisMonth ?? 0).toLocaleString()}`, color: 'bg-emerald-500/10' },
    { icon: <Clock className="h-6 w-6 text-amber-400" />, label: 'Pending Invoices', value: summary?.pendingInvoices ?? 0, color: 'bg-amber-500/10' },
    { icon: <AlertCircle className="h-6 w-6 text-red-400" />, label: 'Overdue Invoices', value: summary?.overdueInvoices ?? 0, color: 'bg-red-500/10' },
    { icon: <CheckCircle className="h-6 w-6 text-blue-400" />, label: 'Collected Today', value: `LKR ${(summary?.collectedToday ?? 0).toLocaleString()}`, color: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        subtitle="Manage invoices and revenue"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Billing' }]}
      >
        <Button leftIcon={<Plus className="h-4 w-4" />}>Generate Invoice</Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton.Card key={i} />)
        ) : (
          summaryCards.map(card => (
            <Card key={card.label} hover>
              <CardBody className="flex items-center gap-4">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', card.color)}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="text-xl font-bold text-white">{card.value}</p>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      <Tabs.Root defaultValue="invoices">
        <Tabs.List className="flex gap-1 border-b border-slate-700/50 mb-6">
          <Tabs.Trigger value="invoices" className="px-4 py-2.5 text-sm text-slate-400 border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary">
            <Receipt className="h-4 w-4 inline mr-1.5" />Invoices
          </Tabs.Trigger>
          <Tabs.Trigger value="analytics" className="px-4 py-2.5 text-sm text-slate-400 border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary">
            <BarChart3 className="h-4 w-4 inline mr-1.5" />Revenue Analytics
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="invoices"><InvoicesTab /></Tabs.Content>
        <Tabs.Content value="analytics"><AnalyticsTab /></Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

const InvoicesTab: React.FC = () => {
  const [params, setParams] = useState<BillingQueryParams>({ page: 0, size: 10 });
  const [search, setSearch] = useState('');
  const { data, isLoading } = useInvoices({ ...params, search });
  const recordPayment = useRecordPayment();
  const cancelInvoice = useCancelInvoice();

  const columns = useMemo<ColumnDef<Invoice, unknown>[]>(() => [
    { accessorKey: 'invoiceNumber', header: 'Invoice#', cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span> },
    { id: 'patient', header: 'Patient', accessorFn: (r) => `${r.patient?.firstName ?? ''} ${r.patient?.lastName ?? ''}` },
    { accessorKey: 'issuedAt', header: 'Date', cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM dd, yyyy') },
    { id: 'items', header: 'Items', accessorFn: (r) => r.items?.length ?? 0 },
    { accessorKey: 'subtotal', header: 'Subtotal', cell: ({ getValue }) => `LKR ${(getValue() as number).toLocaleString()}` },
    { accessorKey: 'tax', header: 'Tax', cell: ({ getValue }) => `LKR ${(getValue() as number).toLocaleString()}` },
    { accessorKey: 'total', header: 'Total', cell: ({ getValue }) => <span className="font-semibold">LKR {(getValue() as number).toLocaleString()}</span> },
    {
      accessorKey: 'status', header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as InvoiceStatus;
        const v = { PAID: 'success', OVERDUE: 'danger', SENT: 'info', DRAFT: 'default', CANCELLED: 'default' }[s] ?? 'default';
        return <Badge variant={v as 'success' | 'danger' | 'info' | 'default'} size="sm">{s}</Badge>;
      },
    },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {(row.original.status === 'SENT' || row.original.status === 'OVERDUE') && (
            <Button size="sm" variant="primary" onClick={() => recordPayment.mutate({ id: row.original.id, data: { amount: row.original.total, paymentMethod: 'CASH' } })}>
              Pay
            </Button>
          )}
          {row.original.status !== 'PAID' && row.original.status !== 'CANCELLED' && (
            <Button size="sm" variant="ghost" onClick={() => cancelInvoice.mutate(row.original.id)}>
              Cancel
            </Button>
          )}
        </div>
      ),
      enableSorting: false,
    },
  ], [recordPayment, cancelInvoice]);

  return (
    <div className="space-y-4">
      <Select
        placeholder="Status"
        clearable
        options={['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'].map(s => ({ label: s, value: s }))}
        value={params.status || ''}
        onValueChange={(v) => setParams(p => ({ ...p, status: (v || undefined) as InvoiceStatus | undefined, page: 0 }))}
        className="w-40"
      />

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

const DEPT_COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AnalyticsTab: React.FC = () => {
  const { data: monthlyData } = useMonthlyRevenue();
  const { data: deptData } = useRevenueByDepartment();
  const monthly = (monthlyData as unknown as { data: Array<{ month: string; revenue: number }> })?.data ?? [];
  const departments = (deptData as unknown as { data: Array<{ department: string; revenue: number; color?: string }> })?.data ?? [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Monthly Revenue" subtitle="Last 12 months" />
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#E2E8F0' }} />
              <RechartsBar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Revenue by Department" />
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={departments} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="revenue" nameKey="department" paddingAngle={3}>
                {departments.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
};

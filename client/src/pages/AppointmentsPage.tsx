import React, { useState, useMemo } from 'react';
import { Input } from '../components/ui/Input';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Select } from '../components/ui/Select';
import { Card, CardBody } from '../components/ui/Card';
import { useAppointments } from '../features/appointments/hooks/useAppointments';
import type { Appointment, AppointmentsQueryParams, AppointmentStatus } from '../types';
import { APPOINTMENT_STATUS_COLORS } from '../lib/constants';
import { cn } from '../lib/utils';

export const AppointmentsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [params, setParams] = useState<AppointmentsQueryParams>({ page: 0, size: 10 });
  const [search, setSearch] = useState('');

  const { data, isLoading } = useAppointments({ ...params, search });
  const pageData = data?.data;

  const columns = useMemo<ColumnDef<Appointment, unknown>[]>(() => [
    {
      accessorKey: 'appointmentNumber',
      header: 'Appt #',
      cell: ({ getValue }) => <span className="font-mono text-xs text-slate-400">{getValue() as string}</span>,
    },
    {
      id: 'patient',
      header: 'Patient',
      accessorFn: (row) => `${row.patient?.firstName ?? ''} ${row.patient?.lastName ?? ''}`,
    },
    {
      id: 'doctor',
      header: 'Doctor',
      accessorFn: (row) => `Dr. ${row.doctor?.firstName ?? ''} ${row.doctor?.lastName ?? ''}`,
    },
    {
      id: 'datetime',
      header: 'Date/Time',
      cell: ({ row }) => (
        <span>{format(new Date(row.original.date), 'MMM dd, yyyy')} {row.original.time}</span>
      ),
    },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as AppointmentStatus;
        const colors: Record<string, 'success' | 'info' | 'danger' | 'warning' | 'default'> = {
          SCHEDULED: 'info', CONFIRMED: 'success', CANCELLED: 'danger', COMPLETED: 'default', NO_SHOW: 'warning',
        };
        return <Badge variant={colors[s] || 'default'} size="sm">{s}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">View</Button>
        </div>
      ),
      enableSorting: false,
    },
  ], []);

  // Calendar view - simplified weekly grid
  const CalendarView: React.FC = () => {
    const appointments = pageData?.content ?? [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <Card>
        <CardBody>
          <div className="grid grid-cols-7 gap-px bg-slate-700/30 rounded-lg overflow-hidden">
            {daysOfWeek.map((day) => (
              <div key={day} className="bg-slate-800/80 px-3 py-2 text-center text-xs font-medium text-slate-400">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayAppts = appointments.filter((a) => {
                const d = new Date(a.date).getDay();
                return d === (i % 7 === 6 ? 0 : (i % 7) + 1);
              });

              return (
                <div key={i} className="bg-slate-900 min-h-[80px] p-1.5 space-y-1">
                  <span className="text-xs text-slate-500">{(i % 31) + 1}</span>
                  {dayAppts.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      className="rounded px-1.5 py-0.5 text-[10px] text-white truncate cursor-pointer"
                      style={{ backgroundColor: APPOINTMENT_STATUS_COLORS[a.status] || '#3B82F6' }}
                    >
                      {a.time} {a.patient?.firstName}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle="Schedule and manage appointments"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Appointments' }]}
      >
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-700 overflow-hidden">
            <button
              className={cn('px-3 py-1.5 text-xs font-medium', view === 'list' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white')}
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              className={cn('px-3 py-1.5 text-xs font-medium', view === 'calendar' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white')}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />}>Book Appointment</Button>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          placeholder="Status"
          clearable
          options={['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'].map(s => ({ label: s, value: s }))}
          value={params.status || ''}
          onValueChange={(v) => setParams(p => ({ ...p, status: (v || undefined) as AppointmentStatus | undefined, page: 0 }))}
          className="w-40"
        />
        <Input
          type="date"
          value={params.dateFrom || ''}
          onChange={(e) => setParams(p => ({ ...p, dateFrom: e.target.value || undefined, page: 0 }))}
          placeholder="From"
          className="w-40"
        />
        <Input
          type="date"
          value={params.dateTo || ''}
          onChange={(e) => setParams(p => ({ ...p, dateTo: e.target.value || undefined, page: 0 }))}
          placeholder="To"
          className="w-40"
        />
      </div>

      {view === 'list' ? (
        <DataTable
          columns={columns}
          data={pageData?.content ?? []}
          loading={isLoading}
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setParams(p => ({ ...p, page: 0 })); }}
          page={pageData?.number ?? 0}
          size={pageData?.size ?? 10}
          totalElements={pageData?.totalElements ?? 0}
          totalPages={pageData?.totalPages ?? 1}
          onPageChange={(p) => setParams(prev => ({ ...prev, page: p }))}
          onSizeChange={(s) => setParams(prev => ({ ...prev, size: s, page: 0 }))}
        />
      ) : (
        <CalendarView />
      )}
    </div>
  );
};


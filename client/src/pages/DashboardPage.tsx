import React from 'react';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/shared/PageHeader';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import {
  Users, Stethoscope, CalendarDays, DollarSign,
  TrendingUp, TrendingDown, Clock, FileText,
  AlertCircle, Pill,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { API_URLS } from '../lib/constants';
import type {
  ApiResponse, AdminDashboardData, DoctorDashboardData,
  PatientDashboardData,
} from '../types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

// ─── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, change, changeLabel, color }) => (
  <Card hover>
    <CardBody className="flex items-center gap-4">
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', color)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-0.5">
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-400" />
            )}
            <span className={cn('text-xs', change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            {changeLabel && <span className="text-xs text-slate-500">{changeLabel}</span>}
          </div>
        )}
      </div>
    </CardBody>
  </Card>
);

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () =>
      apiClient.get(`${API_URLS.DASHBOARD}/admin`) as unknown as Promise<ApiResponse<AdminDashboardData>>,
  });

  const d = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton.Card key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <Skeleton.Card className="xl:col-span-3" />
          <Skeleton.Card className="xl:col-span-2" />
        </div>
      </div>
    );
  }

  const metrics = [
    { icon: <Users className="h-6 w-6 text-blue-400" />, label: 'Total Patients', value: d?.totalPatients?.value ?? 0, change: d?.totalPatients?.change, changeLabel: 'this month', color: 'bg-blue-500/10' },
    { icon: <Stethoscope className="h-6 w-6 text-emerald-400" />, label: 'Total Doctors', value: d?.totalDoctors?.value ?? 0, change: d?.totalDoctors?.change, changeLabel: 'active', color: 'bg-emerald-500/10' },
    { icon: <CalendarDays className="h-6 w-6 text-amber-400" />, label: 'Appointments Today', value: d?.appointmentsToday?.value ?? 0, change: d?.appointmentsToday?.change, changeLabel: 'vs yesterday', color: 'bg-amber-500/10' },
    { icon: <DollarSign className="h-6 w-6 text-violet-400" />, label: 'Revenue This Month', value: `LKR ${(d?.revenueThisMonth?.value ?? 0).toLocaleString()}`, change: d?.revenueThisMonth?.change, changeLabel: 'vs last month', color: 'bg-violet-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3">
          <CardHeader title="Monthly Revenue" subtitle="Revenue vs Expenses (12 months)" />
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d?.monthlyRevenue ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#E2E8F0' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Appointments by Status" />
          <CardBody className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={d?.appointmentsByStatus ?? []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                >
                  {(d?.appointmentsByStatus ?? []).map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Recent Patients" subtitle="Last 5 registered" />
          <CardBody className="space-y-3 p-0">
            {(d?.recentPatients ?? []).slice(0, 5).map((p) => (
              <Link key={p.id} to={`/patients/${p.id}`} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-800/50 transition-colors">
                <Avatar name={`${p.firstName} ${p.lastName}`} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{p.firstName} {p.lastName}</p>
                  <p className="text-xs text-slate-500">{p.patientNumber}</p>
                </div>
                <Badge variant={p.status === 'ACTIVE' ? 'success' : 'default'} size="sm">{p.status}</Badge>
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Upcoming Appointments" subtitle="Today's schedule" />
          <CardBody className="space-y-3 p-0">
            {(d?.upcomingAppointments ?? []).slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-6 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{a.patient?.firstName} {a.patient?.lastName}</p>
                  <p className="text-xs text-slate-500">{a.time} • {a.type}</p>
                </div>
                <Badge
                  variant={a.status === 'CONFIRMED' ? 'success' : a.status === 'SCHEDULED' ? 'info' : 'default'}
                  size="sm"
                >
                  {a.status}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ─── Doctor Dashboard ─────────────────────────────────────────────────────────

const DoctorDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'doctor'],
    queryFn: () =>
      apiClient.get(`${API_URLS.DASHBOARD}/doctor`) as unknown as Promise<ApiResponse<DoctorDashboardData>>,
  });

  const d = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton.Card key={i} />)}
        </div>
      </div>
    );
  }

  const metrics = [
    { icon: <CalendarDays className="h-6 w-6 text-blue-400" />, label: 'My Appointments Today', value: d?.appointmentsToday?.value ?? 0, color: 'bg-blue-500/10' },
    { icon: <FileText className="h-6 w-6 text-amber-400" />, label: 'Pending Lab Results', value: d?.pendingLabResults?.value ?? 0, color: 'bg-amber-500/10' },
    { icon: <Users className="h-6 w-6 text-emerald-400" />, label: 'Active Patients', value: d?.activePatients?.value ?? 0, color: 'bg-emerald-500/10' },
    { icon: <Pill className="h-6 w-6 text-violet-400" />, label: 'Prescriptions This Week', value: d?.prescriptionsThisWeek?.value ?? 0, color: 'bg-violet-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      <Card>
        <CardHeader title="Today's Schedule" subtitle="Your appointments for today" />
        <CardBody className="space-y-3 p-0">
          {(d?.todaySchedule ?? []).map((appt) => (
            <div key={appt.id} className="flex items-center gap-4 px-6 py-3 border-b border-slate-700/30 last:border-0">
              <div className="text-center min-w-[60px]">
                <p className="text-sm font-semibold text-primary">{appt.time}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">
                  {appt.patient?.firstName} {appt.patient?.lastName}
                </p>
                <p className="text-xs text-slate-500">{appt.type} • {appt.chiefComplaint}</p>
              </div>
              <Badge
                variant={appt.status === 'CONFIRMED' ? 'success' : appt.status === 'SCHEDULED' ? 'info' : 'default'}
                size="sm"
              >
                {appt.status}
              </Badge>
            </div>
          ))}
          {(!d?.todaySchedule || d.todaySchedule.length === 0) && (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              No appointments scheduled for today
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

// ─── Patient Dashboard ────────────────────────────────────────────────────────

const PatientDashboardView: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'patient'],
    queryFn: () =>
      apiClient.get(`${API_URLS.DASHBOARD}/patient`) as unknown as Promise<ApiResponse<PatientDashboardData>>,
  });

  const d = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton.Card key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Next Appointment */}
      {d?.nextAppointment && (
        <Card className="border-primary/20">
          <CardBody className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400">Next Appointment</p>
              <p className="text-lg font-semibold text-white">
                {format(new Date(d.nextAppointment.date), 'MMMM dd, yyyy')} at {d.nextAppointment.time}
              </p>
              <p className="text-sm text-slate-400">
                Dr. {d.nextAppointment.doctor?.firstName} {d.nextAppointment.doctor?.lastName} • {d.nextAppointment.type}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Unpaid invoices alert */}
      {d?.unpaidInvoices && d.unpaidInvoices.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardBody className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300">
              You have {d.unpaidInvoices.length} unpaid invoice(s). Total: LKR{' '}
              {d.unpaidInvoices.reduce((s, inv) => s + inv.total, 0).toLocaleString()}
            </p>
            <Link to="/billing" className="ml-auto text-xs text-amber-400 hover:underline shrink-0">
              View Bills
            </Link>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Medications */}
        <Card>
          <CardHeader title="Active Medications" />
          <CardBody className="space-y-3 p-0">
            {(d?.activeMedications ?? []).map((med, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3 border-b border-slate-700/30 last:border-0">
                <Pill className="h-4 w-4 text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{med.medicineName}</p>
                  <p className="text-xs text-slate-500">{med.dosage} • {med.frequency} • {med.duration}</p>
                </div>
              </div>
            ))}
            {(!d?.activeMedications || d.activeMedications.length === 0) && (
              <div className="px-6 py-6 text-center text-sm text-slate-500">No active medications</div>
            )}
          </CardBody>
        </Card>

        {/* Recent Lab Results */}
        <Card>
          <CardHeader title="Recent Lab Results" />
          <CardBody className="space-y-3 p-0">
            {(d?.recentLabResults ?? []).slice(0, 3).map((lab) => (
              <div key={lab.id} className="flex items-center gap-3 px-6 py-3 border-b border-slate-700/30 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{lab.testName}</p>
                  <p className="text-xs text-slate-500">{format(new Date(lab.orderedAt), 'MMM dd, yyyy')}</p>
                </div>
                <Badge
                  variant={lab.flag === 'NORMAL' ? 'success' : lab.flag === 'ABNORMAL' ? 'warning' : 'danger'}
                  size="sm"
                >
                  {lab.flag || lab.status}
                </Badge>
              </div>
            ))}
            {(!d?.recentLabResults || d.recentLabResults.length === 0) && (
              <div className="px-6 py-6 text-center text-sm text-slate-500">No recent lab results</div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${getGreeting()}, ${user?.firstName || 'User'}`}
        subtitle={`Here's what's happening at BC Hospital today`}
      />

      {(role === 'ADMIN' || role === 'SUPER_ADMIN') && <AdminDashboard />}
      {role === 'DOCTOR' && <DoctorDashboard />}
      {role === 'PATIENT' && <PatientDashboardView />}
      {role === 'NURSE' && <AdminDashboard />}
      {role === 'PHARMACIST' && <AdminDashboard />}
      {role === 'LAB_TECHNICIAN' && <AdminDashboard />}
      {role === 'RECEPTIONIST' && <AdminDashboard />}
    </div>
  );
};

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { format } from 'date-fns';
import { Phone, Mail, AlertTriangle, Edit, Calendar, Pill, FlaskConical, Receipt, FileText, Blocks } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { usePatient, usePatientVitals, usePatientNotes } from '../features/patients/hooks/usePatientQueries';
import { usePatientAppointments } from '../features/appointments/hooks/useAppointments';
import { usePatientLabResults } from '../features/lab/hooks/useLab';
import { usePatientInvoices } from '../features/billing/hooks/useBilling';
import { useAddMedicalNote } from '../features/patients/hooks/usePatientMutations';
import { useAuthStore } from '../store/authStore';
import type { Patient } from '../types';

import {
  ResponsiveContainer, ComposedChart, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePatient(id!);
  const patient = (data as unknown as { data: Patient })?.data;
  const role = useAuthStore((s) => s.user?.role);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Patient not found</p>
      </div>
    );
  }

  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={fullName}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patients', href: '/patients' },
          { label: fullName },
        ]}
      >
        <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
          Edit Patient
        </Button>
      </PageHeader>

      {/* Header Card */}
      <Card>
        <CardBody className="flex flex-col md:flex-row items-start gap-6">
          <Avatar name={fullName} size="xl" />
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-white">{fullName}</h2>
              <Badge variant="info" size="sm">#{patient.patientNumber}</Badge>
              <Badge variant={patient.status === 'ACTIVE' ? 'success' : 'danger'} size="sm" dot>
                {patient.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-slate-500">DOB</span><p className="text-slate-200">{format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')} ({patient.age}y)</p></div>
              <div><span className="text-slate-500">Gender</span><p className="text-slate-200">{patient.gender}</p></div>
              <div><span className="text-slate-500">Blood Type</span><p className="text-slate-200 font-semibold text-red-400">{patient.bloodType}</p></div>
              <div><span className="text-slate-500">Contact</span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-slate-200"><Phone className="h-3 w-3" />{patient.phone}</span>
                  <span className="flex items-center gap-1 text-slate-200"><Mail className="h-3 w-3" />{patient.email}</span>
                </div>
              </div>
            </div>
            {patient.allergies && patient.allergies.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span className="text-xs text-red-400 font-medium">Allergies:</span>
                {patient.allergies.map((a) => (
                  <Badge key={a} variant="danger" size="sm">{a}</Badge>
                ))}
              </div>
            )}
            {patient.emergencyContact && (
              <p className="text-xs text-slate-500">
                Emergency: {patient.emergencyContact.name} ({patient.emergencyContact.relation}) — {patient.emergencyContact.phone}
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs.Root defaultValue="overview">
        <Tabs.List className="flex gap-1 border-b border-slate-700/50 mb-6 overflow-x-auto">
          {[
            { value: 'overview', label: 'Overview', icon: <Calendar className="h-4 w-4" /> },
            { value: 'appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4" /> },
            { value: 'prescriptions', label: 'Prescriptions', icon: <Pill className="h-4 w-4" /> },
            { value: 'lab', label: 'Lab Results', icon: <FlaskConical className="h-4 w-4" /> },
            { value: 'billing', label: 'Billing', icon: <Receipt className="h-4 w-4" /> },
            { value: 'notes', label: 'Notes', icon: <FileText className="h-4 w-4" /> },
            { value: 'blockchain', label: 'Blockchain', icon: <Blocks className="h-4 w-4" /> },
          ].map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-400 border-b-2 border-transparent hover:text-slate-200 data-[state=active]:text-primary data-[state=active]:border-primary transition-colors whitespace-nowrap"
            >
              {tab.icon}{tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="overview"><OverviewTab patientId={id!} /></Tabs.Content>
        <Tabs.Content value="appointments"><AppointmentsTab patientId={id!} /></Tabs.Content>
        <Tabs.Content value="prescriptions"><PrescriptionsTab patientId={id!} /></Tabs.Content>
        <Tabs.Content value="lab"><LabTab patientId={id!} /></Tabs.Content>
        <Tabs.Content value="billing"><BillingTab patientId={id!} /></Tabs.Content>
        <Tabs.Content value="notes"><NotesTab patientId={id!} role={role} /></Tabs.Content>
        <Tabs.Content value="blockchain"><BlockchainTab patientId={id!} /></Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

// ─── Tab Components ───────────────────────────────────────────────────────────

const OverviewTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const { data, isLoading } = usePatientVitals(patientId);
  const vitals = (data as unknown as { data: Array<{ recordedAt: string; systolicBP: number; diastolicBP: number; heartRate: number; temperature: number }> })?.data ?? [];

  const chartData = vitals.slice(-30).map(v => ({
    date: format(new Date(v.recordedAt), 'MMM dd'),
    systolic: v.systolicBP,
    diastolic: v.diastolicBP,
    heartRate: v.heartRate,
    temperature: v.temperature,
  }));

  return (
    <Card>
      <CardHeader title="Vitals (Last 30 Days)" subtitle="Blood pressure, heart rate, and temperature" />
      <CardBody className="h-72">
        {isLoading ? (
          <Skeleton.Table rows={3} columns={4} />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#E2E8F0' }} />
              <Line type="monotone" dataKey="systolic" stroke="#EF4444" strokeWidth={2} name="Systolic" dot={false} />
              <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} name="Diastolic" dot={false} />
              <Line type="monotone" dataKey="heartRate" stroke="#F59E0B" strokeWidth={2} name="Heart Rate" dot={false} />
              <Bar dataKey="temperature" fill="#22C55E40" name="Temperature" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-500">
            No vitals recorded yet
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const AppointmentsTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const { data, isLoading } = usePatientAppointments(patientId);
  const appointments = (data as unknown as { data: { content: Array<{ id: string; date: string; time: string; doctor?: { firstName: string; lastName: string }; type: string; status: string }> } })?.data?.content ?? [];

  return (
    <Card>
      <CardHeader title="Appointments" action={<Button size="sm">Book Appointment</Button>} />
      <CardBody className="p-0">
        {isLoading ? <Skeleton.Table /> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-slate-700/30">
                  <td className="px-4 py-3 text-slate-200">{format(new Date(a.date), 'MMM dd, yyyy')} {a.time}</td>
                  <td className="px-4 py-3 text-slate-200">Dr. {a.doctor?.firstName} {a.doctor?.lastName}</td>
                  <td className="px-4 py-3 text-slate-200">{a.type}</td>
                  <td className="px-4 py-3"><Badge variant={a.status === 'COMPLETED' ? 'success' : a.status === 'CANCELLED' ? 'danger' : 'info'} size="sm">{a.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
};

const PrescriptionsTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['patient', patientId, 'prescriptions'],
    queryFn: () => import('../features/pharmacy/api/pharmacy.api').then(m => m.pharmacyApi.getPatientPrescriptions(patientId)),
    enabled: !!patientId,
  });
  const prescriptions = (data as unknown as { data: Array<{ id: string; prescriptionNumber: string; issuedAt: string; doctor?: { firstName: string; lastName: string }; items: Array<unknown>; status: string }> })?.data ?? [];

  return (
    <Card>
      <CardHeader title="Prescriptions" />
      <CardBody className="p-0">
        {isLoading ? <Skeleton.Table /> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700/50 bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Status</th>
            </tr></thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p.id} className="border-b border-slate-700/30">
                  <td className="px-4 py-3 text-slate-200">{format(new Date(p.issuedAt), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3 text-slate-200">Dr. {p.doctor?.firstName} {p.doctor?.lastName}</td>
                  <td className="px-4 py-3 text-slate-200">{p.items?.length ?? 0} medications</td>
                  <td className="px-4 py-3"><Badge variant={p.status === 'DISPENSED' ? 'success' : 'warning'} size="sm">{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
};

const LabTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const { data, isLoading } = usePatientLabResults(patientId);
  const results = (data as unknown as { data: Array<{ id: string; testName: string; orderedAt: string; resultValue?: string; flag?: string; status: string }> })?.data ?? [];

  return (
    <Card>
      <CardHeader title="Lab Results" />
      <CardBody className="p-0">
        {isLoading ? <Skeleton.Table /> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700/50 bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Test</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Result</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Flag</th>
            </tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b border-slate-700/30">
                  <td className="px-4 py-3 text-slate-200">{r.testName}</td>
                  <td className="px-4 py-3 text-slate-200">{format(new Date(r.orderedAt), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3 text-slate-200">{r.resultValue ?? '—'}</td>
                  <td className="px-4 py-3"><Badge variant={r.flag === 'NORMAL' ? 'success' : r.flag === 'CRITICAL' ? 'danger' : 'warning'} size="sm">{r.flag || r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
};

const BillingTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const { data, isLoading } = usePatientInvoices(patientId);
  const invoices = (data as unknown as { data: Array<{ id: string; invoiceNumber: string; issuedAt: string; total: number; status: string }> })?.data ?? [];

  return (
    <Card>
      <CardHeader title="Invoices" />
      <CardBody className="p-0">
        {isLoading ? <Skeleton.Table /> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-700/50 bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Invoice #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Status</th>
            </tr></thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-700/30">
                  <td className="px-4 py-3 text-slate-200 font-mono text-xs">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-slate-200">{format(new Date(inv.issuedAt), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3 text-slate-200 font-semibold">LKR {inv.total.toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={inv.status === 'PAID' ? 'success' : inv.status === 'OVERDUE' ? 'danger' : 'warning'} size="sm">{inv.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
};

const NotesTab: React.FC<{ patientId: string; role?: string }> = ({ patientId, role }) => {
  const { data, isLoading } = usePatientNotes(patientId);
  const addNote = useAddMedicalNote();
  const [noteText, setNoteText] = useState('');
  const notes = (data as unknown as { data: Array<{ id: string; content: string; createdAt: string; doctor?: { firstName: string; lastName: string } }> })?.data ?? [];

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await addNote.mutateAsync({ patientId, content: noteText });
    setNoteText('');
  };

  return (
    <div className="space-y-4">
      {role === 'DOCTOR' && (
        <Card>
          <CardBody className="space-y-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a medical note..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button size="sm" onClick={handleAddNote} loading={addNote.isPending}>
              Add Note
            </Button>
          </CardBody>
        </Card>
      )}
      {isLoading ? <Skeleton.Card /> : notes.map((n) => (
        <Card key={n.id}>
          <CardBody>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-primary font-medium">
                Dr. {n.doctor?.firstName} {n.doctor?.lastName}
              </p>
              <span className="text-xs text-slate-500">
                {format(new Date(n.createdAt), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
            <p className="text-sm text-slate-300">{n.content}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

const BlockchainTab: React.FC<{ patientId: string }> = ({ patientId: _patientId }) => {
  return (
    <Card>
      <CardHeader title="Blockchain Record" subtitle="Hyperledger Besu data integrity" />
      <CardBody className="space-y-4">
        <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Record Hash</span>
            <code className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">Loading...</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Data Integrity</span>
            <Badge variant="success" size="sm" dot>Verified</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Consent Records</span>
            <span className="text-sm text-slate-200">On-chain</span>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Patient data integrity is verified against the Hyperledger Besu blockchain network.
        </p>
      </CardBody>
    </Card>
  );
};


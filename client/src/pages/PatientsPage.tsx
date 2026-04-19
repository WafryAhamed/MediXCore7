import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, UserX } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { DataTable } from '../components/ui/DataTable';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { usePatients } from '../features/patients/hooks/usePatientQueries';
import { useCreatePatient, useDeactivatePatient } from '../features/patients/hooks/usePatientMutations';
import type { Patient, PatientsQueryParams, Gender, BloodType, PatientStatus, CreatePatientRequest } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../lib/utils';

// ─── RegisterPatientModal ─────────────────────────────────────────────────────

const patientSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  dateOfBirth: z.string().min(1, 'Required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  phone: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  allergies: z.string().optional(),
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  ecName: z.string().min(1, 'Required'),
  ecRelation: z.string().min(1, 'Required'),
  ecPhone: z.string().min(1, 'Required'),
  insProvider: z.string().optional(),
  insPolicy: z.string().optional(),
  insGroup: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

const RegisterPatientModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const createPatient = useCreatePatient();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    const request: CreatePatientRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender as Gender,
      bloodType: data.bloodType as BloodType,
      phone: data.phone,
      email: data.email,
      allergies: data.allergies ? data.allergies.split(',').map(s => s.trim()) : [],
      address: { street: data.street, city: data.city, state: data.state, zip: data.zip, country: data.country },
      emergencyContact: { name: data.ecName, relation: data.ecRelation, phone: data.ecPhone },
      insurance: data.insProvider ? { provider: data.insProvider, policyNumber: data.insPolicy || '', groupNumber: data.insGroup } : undefined,
    };
    await createPatient.mutateAsync(request);
    reset();
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    reset();
    setStep(1);
    onClose();
  };

  const stepLabels = ['Personal Info', 'Address & Emergency', 'Insurance & Review'];

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Register New Patient"
      size="lg"
      footer={
        <>
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 3 && <Button onClick={() => setStep(step + 1)}>Next</Button>}
          {step === 3 && (
            <Button onClick={handleSubmit(onSubmit)} loading={createPatient.isPending}>
              Register Patient
            </Button>
          )}
        </>
      }
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {stepLabels.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                i + 1 <= step ? 'bg-primary text-white' : 'bg-slate-700 text-slate-400'
              )}>
                {i + 1}
              </div>
              <span className={cn('text-xs hidden sm:block', i + 1 <= step ? 'text-slate-200' : 'text-slate-500')}>
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && <div className="flex-1 h-px bg-slate-700" />}
          </React.Fragment>
        ))}
      </div>

      <form className="space-y-4">
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" required error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Last Name" required error={errors.lastName?.message} {...register('lastName')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date of Birth" type="date" required error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Gender <span className="text-red-400">*</span></label>
                <select className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100" {...register('gender')}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Blood Type <span className="text-red-400">*</span></label>
                <select className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100" {...register('bloodType')}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Input label="Allergies" placeholder="Comma separated" helperText="e.g. Penicillin, Pollen" {...register('allergies')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" required error={errors.phone?.message} {...register('phone')} />
              <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Address</h4>
            <Input label="Street" required error={errors.street?.message} {...register('street')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" required error={errors.city?.message} {...register('city')} />
              <Input label="State" required error={errors.state?.message} {...register('state')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="ZIP Code" required error={errors.zip?.message} {...register('zip')} />
              <Input label="Country" required error={errors.country?.message} {...register('country')} />
            </div>
            <h4 className="text-sm font-medium text-slate-300 mt-4 mb-2">Emergency Contact</h4>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Name" required error={errors.ecName?.message} {...register('ecName')} />
              <Input label="Relation" required error={errors.ecRelation?.message} {...register('ecRelation')} />
              <Input label="Phone" required error={errors.ecPhone?.message} {...register('ecPhone')} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h4 className="text-sm font-medium text-slate-300 mb-2">Insurance (Optional)</h4>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Provider" {...register('insProvider')} />
              <Input label="Policy #" {...register('insPolicy')} />
              <Input label="Group #" {...register('insGroup')} />
            </div>
            <div className="mt-6 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
              <h4 className="text-sm font-semibold text-slate-200 mb-3">Review Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-slate-400">Name:</p>
                <p className="text-slate-200">{watch('firstName')} {watch('lastName')}</p>
                <p className="text-slate-400">DOB:</p>
                <p className="text-slate-200">{watch('dateOfBirth')}</p>
                <p className="text-slate-400">Gender:</p>
                <p className="text-slate-200">{watch('gender')}</p>
                <p className="text-slate-400">Blood Type:</p>
                <p className="text-slate-200">{watch('bloodType')}</p>
                <p className="text-slate-400">Phone:</p>
                <p className="text-slate-200">{watch('phone')}</p>
                <p className="text-slate-400">Email:</p>
                <p className="text-slate-200">{watch('email')}</p>
              </div>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

// ─── PatientsPage ─────────────────────────────────────────────────────────────

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [params, setParams] = useState<PatientsQueryParams>({ page: 0, size: 10 });
  const [search, setSearch] = useState('');

  const { data, isLoading } = usePatients({ ...params, search });
  const deactivate = useDeactivatePatient();

  const columns = useMemo<ColumnDef<Patient, unknown>[]>(() => [
    {
      accessorKey: 'patientNumber',
      header: 'Patient ID',
      cell: ({ row }) => <span className="font-mono text-xs text-slate-400">{row.original.patientNumber}</span>,
    },
    {
      id: 'name',
      header: 'Full Name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar name={`${row.original.firstName} ${row.original.lastName}`} size="xs" />
          <span className="font-medium">{row.original.firstName} {row.original.lastName}</span>
        </div>
      ),
    },
    { accessorKey: 'age', header: 'Age' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'bloodType', header: 'Blood Type' },
    { accessorKey: 'phone', header: 'Phone' },
    {
      accessorKey: 'lastVisit',
      header: 'Last Visit',
      cell: ({ getValue }) => {
        const val = getValue() as string | null;
        return val ? new Date(val).toLocaleDateString() : '—';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as PatientStatus;
        return <Badge variant={s === 'ACTIVE' ? 'success' : s === 'DECEASED' ? 'danger' : 'default'} size="sm">{s}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deactivate.mutate(row.original.id)}>
            <UserX className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ], [navigate, deactivate]);

  const pageData = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        subtitle="Manage all patient records"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Patients' }]}
      >
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowRegister(true)}>
          Register Patient
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          placeholder="Status"
          clearable
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Inactive', value: 'INACTIVE' },
            { label: 'Deceased', value: 'DECEASED' },
          ]}
          value={params.status || ''}
          onValueChange={(v) => setParams((p) => ({ ...p, status: (v || undefined) as PatientStatus | undefined, page: 0 }))}
          className="w-40"
        />
        <Select
          placeholder="Gender"
          clearable
          options={[
            { label: 'Male', value: 'MALE' },
            { label: 'Female', value: 'FEMALE' },
            { label: 'Other', value: 'OTHER' },
          ]}
          value={params.gender || ''}
          onValueChange={(v) => setParams((p) => ({ ...p, gender: (v || undefined) as Gender | undefined, page: 0 }))}
          className="w-40"
        />
        <Select
          placeholder="Blood Type"
          clearable
          options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => ({ label: t, value: t }))}
          value={params.bloodType || ''}
          onValueChange={(v) => setParams((p) => ({ ...p, bloodType: (v || undefined) as BloodType | undefined, page: 0 }))}
          className="w-40"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setParams({ page: 0, size: 10 })}
        >
          Reset
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={pageData?.content ?? []}
        loading={isLoading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setParams(p => ({ ...p, page: 0 })); }}
        searchPlaceholder="Search by name, patient ID, or phone..."
        page={pageData?.number ?? 0}
        size={pageData?.size ?? 10}
        totalElements={pageData?.totalElements ?? 0}
        totalPages={pageData?.totalPages ?? 1}
        onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
        onSizeChange={(s) => setParams((prev) => ({ ...prev, size: s, page: 0 }))}
      />

      <RegisterPatientModal open={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
};

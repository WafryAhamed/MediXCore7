import React, { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { DataTable } from '../components/ui/DataTable';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { API_URLS } from '../lib/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { User, Role, PaginationParams, PaginatedResponse, ApiResponse, InviteUserRequest } from '../types';

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useUsers(params: PaginationParams & { role?: Role; status?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => apiClient.get(API_URLS.USERS, { params }) as unknown as Promise<PaginatedResponse<User>>,
  });
}

function useInviteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteUserRequest) =>
      apiClient.post(`${API_URLS.USERS}/invite`, data) as unknown as Promise<ApiResponse<User>>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User invited successfully');
    },
    onError: () => toast.error('Failed to invite user'),
  });
}

function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      apiClient.patch(`${API_URLS.USERS}/${id}/${activate ? 'activate' : 'deactivate'}`) as unknown as Promise<ApiResponse<User>>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User status updated');
    },
    onError: () => toast.error('Failed to update user status'),
  });
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────

const inviteSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  role: z.string().min(1, 'Required'),
});

const InviteUserModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const invite = useInviteUser();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: Record<string, string>) => {
    await invite.mutateAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role as Role,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onOpenChange={() => { reset(); onClose(); }}
      title="Invite New User"
      description="Send an invitation email to a new user"
      size="sm"
      footer={
        <Button onClick={handleSubmit(onSubmit)} loading={invite.isPending}>
          Send Invitation
        </Button>
      }
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" required error={errors.firstName?.message as string} {...register('firstName')} />
          <Input label="Last Name" required error={errors.lastName?.message as string} {...register('lastName')} />
        </div>
        <Input label="Email" type="email" required error={errors.email?.message as string} {...register('email')} />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Role <span className="text-red-400">*</span></label>
          <select className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100" {...register('role')}>
            <option value="">Select role...</option>
            {['DOCTOR', 'NURSE', 'PHARMACIST', 'LAB_TECHNICIAN', 'RECEPTIONIST', 'ADMIN'].map(r => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const AdminUsersPage: React.FC = () => {
  const [showInvite, setShowInvite] = useState(false);
  const [params, setParams] = useState<PaginationParams & { role?: Role; status?: string }>({ page: 0, size: 10 });
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsers({ ...params, search });
  const toggleStatus = useToggleUserStatus();

  const columns = useMemo<ColumnDef<User, unknown>[]>(() => [
    {
      id: 'name',
      header: 'Name',
      accessorFn: (r) => `${r.firstName} ${r.lastName}`,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar name={`${row.original.firstName} ${row.original.lastName}`} size="xs" />
          <span className="font-medium">{row.original.firstName} {row.original.lastName}</span>
        </div>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role', header: 'Role',
      cell: ({ getValue }) => <Badge variant="info" size="sm">{(getValue() as string).replace('_', ' ')}</Badge>,
    },
    {
      accessorKey: 'isActive', header: 'Status',
      cell: ({ getValue }) => <Badge variant={(getValue() as boolean) ? 'success' : 'danger'} size="sm" dot>{(getValue() as boolean) ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      accessorKey: 'lastLogin', header: 'Last Login',
      cell: ({ getValue }) => { const v = getValue() as string; return v ? format(new Date(v), 'MMM dd, HH:mm') : '—'; },
    },
    {
      accessorKey: 'createdAt', header: 'Created',
      cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM dd, yyyy'),
    },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant={row.original.isActive ? 'destructive' : 'primary'}
          onClick={() => toggleStatus.mutate({ id: row.original.id, activate: !row.original.isActive })}
        >
          {row.original.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      ),
      enableSorting: false,
    },
  ], [toggleStatus]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage system users and roles"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Admin' }, { label: 'Users' }]}
      >
        <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => setShowInvite(true)}>
          Invite User
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <Select
          placeholder="Role"
          clearable
          options={['DOCTOR', 'NURSE', 'PHARMACIST', 'LAB_TECHNICIAN', 'RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].map(r => ({ label: r.replace('_', ' '), value: r }))}
          value={params.role || ''}
          onValueChange={(v) => setParams(p => ({ ...p, role: (v || undefined) as Role | undefined, page: 0 }))}
          className="w-48"
        />
        <Select
          placeholder="Status"
          clearable
          options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]}
          value={params.status || ''}
          onValueChange={(v) => setParams(p => ({ ...p, status: v || undefined, page: 0 }))}
          className="w-40"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data?.content ?? []}
        loading={isLoading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setParams(p => ({ ...p, page: 0 })); }}
        searchPlaceholder="Search by name or email..."
        page={data?.data?.number ?? 0}
        size={data?.data?.size ?? 10}
        totalElements={data?.data?.totalElements ?? 0}
        totalPages={data?.data?.totalPages ?? 1}
        onPageChange={(p) => setParams(prev => ({ ...prev, page: p }))}
        onSizeChange={(s) => setParams(prev => ({ ...prev, size: s, page: 0 }))}
      />

      <InviteUserModal open={showInvite} onClose={() => setShowInvite(false)} />
    </div>
  );
};

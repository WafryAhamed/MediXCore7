import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, DollarSign } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { useDoctors } from '../features/doctors/hooks/useDoctors';
import { useAuthStore } from '../store/authStore';
import type { Doctor, DoctorsQueryParams } from '../types';

export const DoctorsPage: React.FC = () => {
  const role = useAuthStore((s) => s.user?.role);
  const [params] = useState<DoctorsQueryParams>({ page: 0, size: 20 });
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');

  const { data, isLoading } = useDoctors({ ...params, search, specialization: specFilter || undefined });
  const doctors = data?.data?.content ?? [];

  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        subtitle="View and manage doctor profiles"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Doctors' }]}
      >
        {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Doctor</Button>
        )}
      </PageHeader>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!specFilter ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            onClick={() => setSpecFilter('')}
          >
            All
          </button>
          {specializations.map(spec => (
            <button
              key={spec}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${specFilter === spec ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              onClick={() => setSpecFilter(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton.Card key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
          {doctors.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-slate-500">
              No doctors found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const fullName = `${doctor.firstName} ${doctor.lastName}`;

  return (
    <Card hover>
      <CardBody className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar name={fullName} src={doctor.avatarUrl} size="lg" status={doctor.isAvailableToday ? 'online' : 'offline'} />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white truncate">Dr. {fullName}</h3>
            <p className="text-sm text-primary">{doctor.specialization}</p>
            <p className="text-xs text-slate-500 font-mono">{doctor.employeeNumber}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <DollarSign className="h-3.5 w-3.5" />
            <span>LKR {doctor.consultationFee?.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{doctor.maxPatientsPerDay} patients/day max</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {(doctor.availableDays ?? []).map((day) => (
            <Badge key={day} variant="outline" size="sm">{day.slice(0, 3)}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <Badge variant={doctor.isAvailableToday ? 'success' : 'default'} size="sm" dot>
            {doctor.isAvailableToday ? 'Available Today' : 'Unavailable'}
          </Badge>
          <Link to={`/doctors/${doctor.id}`}>
            <Button variant="ghost" size="sm">View Profile</Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

import type { Role } from '../types';

// ─── API Endpoints ────────────────────────────────────────────────────────────

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const API_URLS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PATIENTS: '/patients',
  DOCTORS: '/doctors',
  APPOINTMENTS: '/appointments',
  PRESCRIPTIONS: '/prescriptions',
  PHARMACY: '/pharmacy',
  LAB: '/lab',
  BILLING: '/billing',
  NOTIFICATIONS: '/notifications',
  USERS: '/admin/users',
  AUDIT_LOG: '/admin/audit-log',
  BLOCKCHAIN: '/blockchain',
  SEARCH: '/search',
  DASHBOARD: '/dashboard',
} as const;

// ─── Routes ───────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PATIENTS: '/patients',
  PATIENT_DETAIL: '/patients/:id',
  DOCTORS: '/doctors',
  DOCTOR_DETAIL: '/doctors/:id',
  APPOINTMENTS: '/appointments',
  PHARMACY: '/pharmacy',
  LAB: '/lab',
  BILLING: '/billing',
  ADMIN_USERS: '/admin/users',
  AUDIT_LOG: '/admin/audit-log',
  BLOCKCHAIN: '/admin/blockchain',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// ─── Role-Based Sidebar Nav ──────────────────────────────────────────────────

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  children?: NavItem[];
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    { label: 'Dashboard', icon: 'LayoutDashboard', href: ROUTES.DASHBOARD },
    { label: 'Patients', icon: 'Users', href: ROUTES.PATIENTS },
    { label: 'Doctors', icon: 'Stethoscope', href: ROUTES.DOCTORS },
    { label: 'Appointments', icon: 'CalendarDays', href: ROUTES.APPOINTMENTS },
    { label: 'Pharmacy', icon: 'Pill', href: ROUTES.PHARMACY },
    { label: 'Lab', icon: 'FlaskConical', href: ROUTES.LAB },
    { label: 'Billing', icon: 'Receipt', href: ROUTES.BILLING },
    { label: 'Users', icon: 'UserCog', href: ROUTES.ADMIN_USERS },
    { label: 'Audit Log', icon: 'ScrollText', href: ROUTES.AUDIT_LOG },
    { label: 'Blockchain Explorer', icon: 'Blocks', href: ROUTES.BLOCKCHAIN },
    { label: 'System Settings', icon: 'Settings', href: ROUTES.SETTINGS },
  ],
  ADMIN: [
    { label: 'Dashboard', icon: 'LayoutDashboard', href: ROUTES.DASHBOARD },
    { label: 'Patients', icon: 'Users', href: ROUTES.PATIENTS },
    { label: 'Doctors', icon: 'Stethoscope', href: ROUTES.DOCTORS },
    { label: 'Appointments', icon: 'CalendarDays', href: ROUTES.APPOINTMENTS },
    { label: 'Pharmacy', icon: 'Pill', href: ROUTES.PHARMACY },
    { label: 'Lab', icon: 'FlaskConical', href: ROUTES.LAB },
    { label: 'Billing', icon: 'Receipt', href: ROUTES.BILLING },
    { label: 'Users', icon: 'UserCog', href: ROUTES.ADMIN_USERS },
    { label: 'Audit Log', icon: 'ScrollText', href: ROUTES.AUDIT_LOG },
    { label: 'Blockchain Explorer', icon: 'Blocks', href: ROUTES.BLOCKCHAIN },
    { label: 'System Settings', icon: 'Settings', href: ROUTES.SETTINGS },
  ],
  DOCTOR: [
    { label: 'Dashboard', icon: 'LayoutDashboard', href: ROUTES.DASHBOARD },
    { label: 'My Patients', icon: 'Users', href: ROUTES.PATIENTS },
    { label: 'Appointments', icon: 'CalendarDays', href: ROUTES.APPOINTMENTS },
    { label: 'Prescriptions', icon: 'ClipboardList', href: ROUTES.PHARMACY },
    { label: 'Lab Requests', icon: 'FlaskConical', href: ROUTES.LAB },
  ],
  NURSE: [
    { label: 'Dashboard', icon: 'LayoutDashboard', href: ROUTES.DASHBOARD },
    { label: 'Patients', icon: 'Users', href: ROUTES.PATIENTS },
    { label: 'Vitals Entry', icon: 'HeartPulse', href: ROUTES.PATIENTS },
    { label: 'Appointments', icon: 'CalendarDays', href: ROUTES.APPOINTMENTS },
  ],
  PHARMACIST: [
    { label: 'Dashboard', icon: 'LayoutDashboard', href: ROUTES.DASHBOARD },
    { label: 'Pending Prescriptions', icon: 'ClipboardList', href: ROUTES.PHARMACY },
    { label: 'Medicine Inventory', icon: 'Pill', href: ROUTES.PHARMACY + '?tab=inventory' },
    { label: 'Dispensing Log', icon: 'PackageCheck', href: ROUTES.PHARMACY + '?tab=log' },
  ],
  LAB_TECHNICIAN: [
    { label: 'Dashboard', icon: 'LayoutDashboard', href: ROUTES.DASHBOARD },
    { label: 'Test Requests', icon: 'FlaskConical', href: ROUTES.LAB },
    { label: 'Results Entry', icon: 'FileText', href: ROUTES.LAB + '?tab=results' },
    { label: 'Lab Catalog', icon: 'BookOpen', href: ROUTES.LAB + '?tab=catalog' },
  ],
  RECEPTIONIST: [
    { label: 'Dashboard', icon: 'LayoutDashboard', href: ROUTES.DASHBOARD },
    { label: 'Patients', icon: 'Users', href: ROUTES.PATIENTS },
    { label: 'Appointments', icon: 'CalendarDays', href: ROUTES.APPOINTMENTS },
    { label: 'Billing', icon: 'Receipt', href: ROUTES.BILLING },
  ],
  PATIENT: [
    { label: 'My Dashboard', icon: 'LayoutDashboard', href: ROUTES.DASHBOARD },
    { label: 'My Appointments', icon: 'CalendarDays', href: ROUTES.APPOINTMENTS },
    { label: 'My Prescriptions', icon: 'ClipboardList', href: ROUTES.PHARMACY },
    { label: 'My Lab Results', icon: 'FlaskConical', href: ROUTES.LAB },
    { label: 'My Bills', icon: 'Receipt', href: ROUTES.BILLING },
    { label: 'My Profile', icon: 'UserCircle', href: ROUTES.PROFILE },
  ],
};

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  MAX_SIZE: 100,
} as const;

// ─── Status Color Maps ────────────────────────────────────────────────────────

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: '#3B82F6',
  CONFIRMED: '#22C55E',
  CANCELLED: '#EF4444',
  COMPLETED: '#6B7280',
  NO_SHOW: '#F59E0B',
};

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  DRAFT: '#6B7280',
  SENT: '#3B82F6',
  PAID: '#22C55E',
  OVERDUE: '#EF4444',
  CANCELLED: '#9CA3AF',
};

export const LAB_PRIORITY_COLORS: Record<string, string> = {
  ROUTINE: '#6B7280',
  URGENT: '#F59E0B',
  STAT: '#EF4444',
};

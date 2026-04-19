import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { ROUTES } from '../lib/constants';

// Public pages
import { LoginPage } from '../pages/LoginPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';

// Dashboard pages
import { DashboardPage } from '../pages/DashboardPage';
import { PatientsPage } from '../pages/PatientsPage';
import { PatientDetailPage } from '../pages/PatientDetailPage';
import { DoctorsPage } from '../pages/DoctorsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { PharmacyPage } from '../pages/PharmacyPage';
import { LabPage } from '../pages/LabPage';
import { BillingPage } from '../pages/BillingPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AuditLogPage } from '../pages/AuditLogPage';
import { BlockchainExplorerPage } from '../pages/BlockchainExplorerPage';

// Also keep the old pages for backward compat (landing, etc.)
import { LandingPage } from '../pages/LandingPage';

const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
  // Legacy auth route
  {
    path: '/auth',
    element: <LoginPage />,
  },

  // Authenticated dashboard routes
  {
    element: (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.PATIENTS, element: <PatientsPage /> },
      { path: ROUTES.PATIENT_DETAIL, element: <PatientDetailPage /> },
      { path: ROUTES.DOCTORS, element: <DoctorsPage /> },
      { path: '/doctors/:id', element: <DoctorsPage /> }, // Doctor detail placeholder
      { path: ROUTES.APPOINTMENTS, element: <AppointmentsPage /> },
      { path: ROUTES.PHARMACY, element: <PharmacyPage /> },
      { path: ROUTES.LAB, element: <LabPage /> },
      { path: ROUTES.BILLING, element: <BillingPage /> },
      { path: ROUTES.ADMIN_USERS, element: <AdminUsersPage /> },
      { path: ROUTES.AUDIT_LOG, element: <AuditLogPage /> },
      { path: ROUTES.BLOCKCHAIN, element: <BlockchainExplorerPage /> },
      { path: ROUTES.SETTINGS, element: <DashboardPage /> },
      { path: ROUTES.PROFILE, element: <DashboardPage /> },
    ],
  },

  // Catch-all redirect
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

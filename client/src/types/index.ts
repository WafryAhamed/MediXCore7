// ─── User Roles ───────────────────────────────────────────────────────────────

export type Role =
  | 'PATIENT'
  | 'DOCTOR'
  | 'NURSE'
  | 'PHARMACIST'
  | 'LAB_TECHNICIAN'
  | 'RECEPTIONIST'
  | 'ADMIN'
  | 'SUPER_ADMIN';

// ─── Core User ────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Spring Boot Response Shapes ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export interface PaginatedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: PaginatedData<T>;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type PatientStatus = 'ACTIVE' | 'INACTIVE' | 'DECEASED';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
}

export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  bloodType: BloodType;
  allergies: string[];
  phone: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  insurance?: Insurance;
  status: PatientStatus;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType: BloodType;
  allergies?: string[];
  phone: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  insurance?: Insurance;
}

export interface PatientsQueryParams extends PaginationParams {
  status?: PatientStatus;
  gender?: Gender;
  bloodType?: BloodType;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface DoctorSchedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  userId: string;
  user?: User;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string[];
  maxPatientsPerDay: number;
  schedule?: DoctorSchedule[];
  isAvailableToday: boolean;
  avatarUrl?: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string[];
  maxPatientsPerDay: number;
}

export interface DoctorsQueryParams extends PaginationParams {
  specialization?: string;
  isAvailable?: boolean;
}

// ─── Appointment ──────────────────────────────────────────────────────────────

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
export type AppointmentType = 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'ROUTINE_CHECKUP';

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  doctorId: string;
  patient?: Patient;
  doctor?: Doctor;
  date: string;
  time: string;
  endTime?: string;
  type: AppointmentType;
  status: AppointmentStatus;
  chiefComplaint: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: AppointmentType;
  chiefComplaint: string;
  notes?: string;
}

export interface AppointmentsQueryParams extends PaginationParams {
  doctorId?: string;
  patientId?: string;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
}

// ─── Prescription ─────────────────────────────────────────────────────────────

export type PrescriptionStatus = 'PENDING' | 'DISPENSED' | 'CANCELLED';

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  patient?: Patient;
  doctor?: Doctor;
  items: PrescriptionItem[];
  status: PrescriptionStatus;
  dispensedAt?: string;
  dispensedBy?: string;
  notes?: string;
  issuedAt: string;
  createdAt: string;
}

// ─── Pharmacy / Medicine ──────────────────────────────────────────────────────

export type MedicineStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  manufacturer: string;
  unitPrice: number;
  status: MedicineStatus;
  createdAt: string;
}

export interface CreateMedicineRequest {
  name: string;
  genericName: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  manufacturer: string;
  unitPrice: number;
}

export interface PharmacyQueryParams extends PaginationParams {
  status?: MedicineStatus;
  category?: string;
  lowStock?: boolean;
}

// ─── Lab ──────────────────────────────────────────────────────────────────────

export type LabRequestStatus = 'ORDERED' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'COMPLETED';
export type LabPriority = 'ROUTINE' | 'URGENT' | 'STAT';
export type LabFlag = 'NORMAL' | 'ABNORMAL' | 'CRITICAL';

export interface LabRequest {
  id: string;
  labNumber: string;
  patientId: string;
  doctorId: string;
  patient?: Patient;
  doctor?: Doctor;
  testName: string;
  testCategory: string;
  priority: LabPriority;
  status: LabRequestStatus;
  result?: string;
  resultValue?: string;
  unit?: string;
  referenceRange?: string;
  flag?: LabFlag;
  reportUrl?: string;
  orderedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface LabResultInput {
  resultValue: string;
  unit: string;
  referenceRange: string;
  flag: LabFlag;
  reportUrl?: string;
}

export interface LabCatalogItem {
  id: string;
  testName: string;
  category: string;
  turnaroundTime: string;
  price: number;
}

export interface LabQueryParams extends PaginationParams {
  status?: LabRequestStatus;
  priority?: LabPriority;
  patientId?: string;
  doctorId?: string;
}

// ─── Billing / Invoice ────────────────────────────────────────────────────────

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'INSURANCE' | 'BANK_TRANSFER';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patient?: Patient;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  issuedAt: string;
  createdAt: string;
}

export interface CreateInvoiceRequest {
  patientId: string;
  items: Omit<InvoiceItem, 'total'>[];
  dueDate: string;
  notes?: string;
}

export interface RecordPaymentRequest {
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface BillingQueryParams extends PaginationParams {
  status?: InvoiceStatus;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface BillingSummary {
  totalRevenueThisMonth: number;
  pendingInvoices: number;
  overdueInvoices: number;
  collectedToday: number;
}

// ─── Vitals ───────────────────────────────────────────────────────────────────

export interface Vitals {
  id: string;
  patientId: string;
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  recordedBy: string;
  recordedAt: string;
}

// ─── Medical Note ─────────────────────────────────────────────────────────────

export interface MedicalNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctor?: Doctor;
  content: string;
  createdAt: string;
}

// ─── Admin / Audit ────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  timestamp: string;
}

export interface AuditLogQueryParams extends PaginationParams {
  action?: string;
  resource?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ─── Blockchain ───────────────────────────────────────────────────────────────

export type BlockchainTxType =
  | 'PATIENT_RECORD'
  | 'CONSENT'
  | 'PRESCRIPTION'
  | 'DATA_HASH'
  | 'AUDIT';

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  from: string;
  to: string;
  type: BlockchainTxType;
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface BlockchainNetworkStatus {
  connectedNodes: number;
  blockHeight: number;
  networkId: string;
  consensus: string;
}

export interface SmartContractStatus {
  name: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardMetric {
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
}

export interface AdminDashboardData {
  totalPatients: DashboardMetric;
  totalDoctors: DashboardMetric;
  appointmentsToday: DashboardMetric;
  revenueThisMonth: DashboardMetric;
  monthlyRevenue: Array<{ month: string; revenue: number; expenses: number }>;
  appointmentsByStatus: Array<{ name: string; value: number; color: string }>;
  recentPatients: Patient[];
  upcomingAppointments: Appointment[];
}

export interface DoctorDashboardData {
  appointmentsToday: DashboardMetric;
  pendingLabResults: DashboardMetric;
  activePatients: DashboardMetric;
  prescriptionsThisWeek: DashboardMetric;
  todaySchedule: Appointment[];
  recentPatients: Patient[];
}

export interface PatientDashboardData {
  nextAppointment?: Appointment;
  activeMedications: PrescriptionItem[];
  recentLabResults: LabRequest[];
  unpaidInvoices: Invoice[];
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface InviteUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  type: 'patient' | 'doctor' | 'appointment' | 'page';
  title: string;
  subtitle?: string;
  url: string;
}

// ─── Revenue Analytics ────────────────────────────────────────────────────────

export interface RevenueByDepartment {
  department: string;
  revenue: number;
  color: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

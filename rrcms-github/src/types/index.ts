// User Types
export type UserRole = 'super_admin' | 'office_admin' | 'data_entry';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  officeId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  office?: Office;
}

// Office Types
export interface Office {
  id: string;
  officeName: string;
  officeCode?: string;
  address?: string;
  district?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Section Types
export interface Section {
  id: string;
  sectionName: string;
  sectionCode?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Pending Case Types
export interface PendingCase {
  id: string;
  caseNo: string;
  sectionId: string;
  institutionDate: Date;
  purpose: string;
  appellant: string;
  respondent: string;
  hearingDate?: Date;
  officeId: string;
  status: 'pending' | 'in_progress' | 'disposed';
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
  section?: Section;
  office?: Office;
}

// Disposed Case Types
export interface DisposedCase {
  id: string;
  caseNo: string;
  sectionId: string;
  institutionDate: Date;
  disposalDate: Date;
  purpose: string;
  appellant: string;
  respondent: string;
  officeId: string;
  disposalType?: string;
  disposalRemarks?: string;
  disposedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  section?: Section;
  office?: Office;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'hearing' | 'disposal' | 'registration' | 'system';
  isRead: boolean;
  entityId?: string;
  entityType?: string;
  createdAt: Date;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  entityType: 'case' | 'user' | 'office' | 'section';
  entityId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Import History Types
export interface ImportHistory {
  id: string;
  fileName: string;
  fileType: 'pending' | 'disposed';
  totalCount: number;
  successCount: number;
  errorCount: number;
  importedBy: string;
  status: 'pending' | 'completed' | 'failed';
  errors?: string;
  createdAt: Date;
}

// Dashboard Statistics
export interface DashboardStats {
  totalPending: number;
  totalDisposed: number;
  todayRegistrations: number;
  todayDisposals: number;
  pendingBySection: { section: string; count: number }[];
  pendingByYear: { year: number; count: number }[];
  disposalTrend: { month: string; count: number }[];
  recentCases: PendingCase[];
}

// MPR Report Types
export interface PendingMPRRow {
  sno: number;
  officeName: string;
  initialPending: number;
  newRegistered: number;
  total: number;
  decided: number;
  pendingAsOnEnd: number;
  upto6Months: number;
  sixTo12Months: number;
  oneTo2Years: number;
  twoTo3Years: number;
  threeTo5Years: number;
  fiveTo10Years: number;
  tenTo20Years: number;
  twentyTo30Years: number;
  thirtyTo40Years: number;
  moreThan40Years: number;
}

export interface DisposalMPRRow {
  sno: number;
  officeName: string;
  totalDisposal: number;
  over5Years: number;
  over3Years: number;
  over2Years: number;
  over1Year: number;
  lessThan1Year: number;
}

// Aging Categories
export type AgingCategory = 
  | 'upto6Months'
  | 'sixTo12Months'
  | 'oneTo2Years'
  | 'twoTo3Years'
  | 'threeTo5Years'
  | 'fiveTo10Years'
  | 'tenTo20Years'
  | 'twentyTo30Years'
  | 'thirtyTo40Years'
  | 'moreThan40Years';

// Filter Types
export interface CaseFilters {
  search?: string;
  officeId?: string;
  sectionId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  year?: number;
  status?: 'pending' | 'in_progress' | 'disposed';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

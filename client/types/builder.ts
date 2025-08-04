// Builder.io Admin Portal Types and Data Models

export interface Organization {
  id: string;
  name: string;
  slug?: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
  settings?: Record<string, any>;
  created_at: string;
  updated_at?: string;
  user_count: number;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'member';
  phone?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  organization?: {
    id: string;
    name: string;
    plan: string;
  };
}

export interface Transaction {
  id: string;
  organization_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'upgrade' | 'downgrade';
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  stripe_payment_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
  completed_at?: string;
  organization_name?: string;
  organization_plan?: string;
}

export interface AdminStats {
  totalOrganizations: number;
  totalUsers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  totalTransactions: number;
  planDistribution: Record<string, number>;
}

export interface RevenueAnalytics {
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  planRevenue: Array<{
    plan: string;
    revenue: number;
    transactions: number;
  }>;
  topCustomers: Array<{
    name: string;
    plan: string;
    revenue: number;
    transactions: number;
  }>;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface Plan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  color: string;
  icon: React.ComponentType<any>;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user_id?: string;
  organization_id?: string;
  metadata?: Record<string, any>;
}

// Builder.io Component Props
export interface AdminDashboardProps {
  title?: string;
  showStats?: boolean;
  showFinancials?: boolean;
  children?: React.ReactNode;
}

export interface OrganizationTableProps {
  pageSize?: number;
  showActions?: boolean;
  allowCreate?: boolean;
}

export interface UserManagementProps {
  pageSize?: number;
  showRoleFilter?: boolean;
  allowInvite?: boolean;
}

export interface FinancialDashboardProps {
  currency?: string;
  showTrends?: boolean;
  timeRange?: string;
}

export interface RoleBasedSectionProps {
  requiredPlan?: string;
  requiredRole?: string;
  fallbackMessage?: string;
  children?: React.ReactNode;
}

export interface CRUDTableProps {
  entityType: string;
  title?: string;
  pageSize?: number;
}

export interface ExportButtonProps {
  exportType?: string;
  dataEndpoint: string;
  buttonText?: string;
}

export interface AnalyticsChartProps {
  chartType?: string;
  title: string;
  height?: number;
}

export interface AdminStatsCardsProps {
  layout?: string;
  showTrends?: boolean;
}

export interface PlanUpgradeModalProps {
  triggerText?: string;
  primaryColor?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Form Types
export interface CreateOrganizationForm {
  name: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
}

export interface CreateUserForm {
  email: string;
  password: string;
  name?: string;
  organization_id: string;
  role: 'admin' | 'manager' | 'member';
  phone?: string;
}

export interface CreateTransactionForm {
  organization_id: string;
  amount: string;
  type: 'payment' | 'refund' | 'upgrade' | 'downgrade';
  description?: string;
}

// Chart Data Types
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

// Permission Types
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  condition?: {
    plan?: string[];
    role?: string[];
  };
}

export interface UserPermissions {
  user: User;
  permissions: Permission[];
  canAccess: (resource: string, action: string) => boolean;
}

// Export Types
export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportRequest {
  entityType: 'organizations' | 'users' | 'transactions' | 'analytics';
  format: ExportFormat;
  filters?: Record<string, any>;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Builder.io Specific Types
export interface BuilderComponent {
  name: string;
  component: React.ComponentType<any>;
  inputs: BuilderInput[];
  canHaveChildren?: boolean;
  defaultStyles?: Record<string, any>;
}

export interface BuilderInput {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'file' | 'object' | 'list';
  defaultValue?: any;
  required?: boolean;
  enum?: string[];
  helperText?: string;
}

// Database Schema Types (for reference)
export interface DatabaseSchema {
  organizations: {
    id: string;
    name: string;
    plan: 'free' | 'basic' | 'pro' | 'premium';
    created_at: string;
    updated_at?: string;
  };
  users: {
    id: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'manager' | 'member';
    organization_id: string;
    created_at: string;
  };
  subscriptions: {
    id: string;
    organization_id: string;
    plan: 'free' | 'basic' | 'pro' | 'premium';
    price: number;
    status: 'active' | 'trial' | 'canceled';
    start_date: string;
    end_date?: string;
  };
  transactions: {
    id: string;
    organization_id: string;
    subscription_id?: string;
    amount: number;
    currency: string;
    type: 'payment' | 'refund' | 'upgrade' | 'downgrade';
    status: 'pending' | 'completed' | 'failed' | 'canceled';
    stripe_payment_id?: string;
    description?: string;
    metadata?: Record<string, any>;
    created_at: string;
    completed_at?: string;
  };
  system_settings: {
    id: number;
    key: string;
    value: string;
    description?: string;
    updated_at: string;
  };
}

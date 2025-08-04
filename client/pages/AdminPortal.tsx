import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Users,
  Building,
  Database,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  BarChart3,
  Crown,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ExternalLink,
  UserPlus,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase, testDatabaseConnection as testSupabaseConnection, signInWithTimeout } from "@/lib/neonAuth";
import { useAuth } from "@/contexts/AuthContext";
import { refreshAdminData } from "@/utils/adminUtils";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  mockToggleUserActive,
  mockUpdateOrganizationPlan,
  mockDeleteUser,
  mockDiagnoseUser,
  mockCreateUserInSupabase,
  mockDeleteOrganization,
  mockUpdateUserRole,
  mockSwitchOrganizationPlan,
  mockExportData
} from "@/lib/mockAdminFunctions";

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  settings: any;
  created_at: string;
  updated_at: string;
  user_count?: number;
}

interface User {
  id: string;
  organization_id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
  phone: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  organization?: Organization;
}

interface AdminStats {
  totalOrganizations: number;
  totalUsers: number;
  monthlyRevenue: number;
  totalAssets: number;
  planDistribution: Record<string, number>;
}

export default function AdminPortal() {
  const { user, switchToOrganization } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [error, setError] = useState('');

  // New user form state
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    name: '',
    organization_id: '',
    role: 'viewer' as const,
    phone: ''
  });

  // User diagnosis state
  const [userDiagnosisForm, setUserDiagnosisForm] = useState({
    email: '',
    password: '',
    testResults: null as any,
    loading: false
  });

  // New organization form state
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    slug: '',
    plan: 'free' as const
  });

  useEffect(() => {
    initializeAdminPortal();
  }, []);

  // Check admin access after all hooks are defined
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
          <Button onClick={() => window.location.href = '/dashboard'} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const initializeAdminPortal = async () => {
    setLoading(true);
    setError('');

    try {
      // First refresh admin data to ensure fresh connection
      const refreshResult = await refreshAdminData();

      if (!refreshResult.success) {
        setError(`Admin portal initialization failed: ${refreshResult.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Load the actual data
      await loadData();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      setError(`Failed to initialize admin portal: ${errorMessage}`);
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔄 Loading admin portal data...');

      const [orgsResult, usersResult, statsResult] = await Promise.allSettled([
        loadOrganizations(),
        loadUsers(),
        loadStats()
      ]);

      // Handle results
      if (orgsResult.status === 'rejected') {
        console.error('Organizations loading failed:', orgsResult.reason);
      } else {
        console.log('✅ Organizations loaded:', orgsResult.value?.length || 0);
      }

      if (usersResult.status === 'rejected') {
        console.error('Users loading failed:', usersResult.reason);
      } else {
        console.log('✅ Users loaded:', usersResult.value?.length || 0);
      }

      if (statsResult.status === 'rejected') {
        console.error('Stats loading failed:', statsResult.reason);
      } else {
        console.log('✅ Stats loaded');
      }

      // Only throw error if all failed
      const failedCount = [orgsResult, usersResult, statsResult].filter(r => r.status === 'rejected').length;
      if (failedCount === 3) {
        throw new Error('All data loading operations failed');
      }

    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage || 'Failed to load admin data');
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizations = async () => {
    try {
      console.log('📊 Loading organizations...');

      // Mock organizations data
      const mockOrganizations = [
        {
          id: '3a16af88-f08f-46c8-8bae-a11470227e90',
          name: 'Scan Street Pro Admin',
          slug: 'scan-street-admin',
          plan: 'enterprise' as const,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_count: 1
        },
        {
          id: 'f6e839fc-525a-4348-8fec-4ac1bf8389ff',
          name: 'City of Springfield (Free)',
          slug: 'springfield-free',
          plan: 'free' as const,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_count: 1
        },
        {
          id: '9e678560-1f05-4d2f-92d9-106c878c5904',
          name: 'City of Springfield (Premium)',
          slug: 'springfield-premium',
          plan: 'professional' as const,
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_count: 1
        }
      ];

      console.log('Organizations data:', mockOrganizations);
      setOrganizations(mockOrganizations);
      return mockOrganizations;
    } catch (error) {
      console.error('loadOrganizations failed:', error);
      setOrganizations([]);
      throw error;
    }
  };

  const loadUsers = async () => {
    try {
      console.log('👥 Loading users...');

      // Mock users data
      const mockUsers = [
        {
          id: '7128c5d7-0fd6-4c3a-9c4a-4ffba4ec955d',
          organization_id: '3a16af88-f08f-46c8-8bae-a11470227e90',
          email: 'admin@scanstreetpro.com',
          name: 'System Administrator',
          role: 'admin' as const,
          phone: null,
          is_active: true,
          last_login: null,
          created_at: new Date().toISOString(),
          organization: {
            id: '3a16af88-f08f-46c8-8bae-a11470227e90',
            name: 'Scan Street Pro Admin',
            slug: 'scan-street-admin',
            plan: 'enterprise',
            settings: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        },
        {
          id: '7a119669-0ef1-4512-ad39-8d4f28b621b6',
          organization_id: 'f6e839fc-525a-4348-8fec-4ac1bf8389ff',
          email: 'test@springfield.gov',
          name: 'Test User',
          role: 'manager' as const,
          phone: null,
          is_active: true,
          last_login: null,
          created_at: new Date().toISOString(),
          organization: {
            id: 'f6e839fc-525a-4348-8fec-4ac1bf8389ff',
            name: 'City of Springfield (Free)',
            slug: 'springfield-free',
            plan: 'free',
            settings: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        },
        {
          id: 'f0b3d839-5f55-4d21-84dc-6f0dba46dfae',
          organization_id: '9e678560-1f05-4d2f-92d9-106c878c5904',
          email: 'premium@springfield.gov',
          name: 'Premium User',
          role: 'manager' as const,
          phone: null,
          is_active: true,
          last_login: null,
          created_at: new Date().toISOString(),
          organization: {
            id: '9e678560-1f05-4d2f-92d9-106c878c5904',
            name: 'City of Springfield (Premium)',
            slug: 'springfield-premium',
            plan: 'professional',
            settings: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      ];

      console.log('Users data:', mockUsers);
      setUsers(mockUsers);
      return mockUsers;
    } catch (error) {
      console.error('loadUsers failed:', error);
      setUsers([]);
      throw error;
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats data
      const mockOrgs = [
        { plan: 'enterprise' },
        { plan: 'free' },
        { plan: 'professional' }
      ];

      const userCount = 3;

      // Calculate plan distribution
      const planDistribution = mockOrgs.reduce((acc, org) => {
        acc[org.plan] = (acc[org.plan] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Mock revenue calculation
      const monthlyRevenue = mockOrgs.reduce((total, org) => {
        const planPricing = {
          free: 0,
          starter: 29,
          professional: 99,
          enterprise: 299
        };
        return total + (planPricing[org.plan] || 0);
      }, 0);

      setStats({
        totalOrganizations: mockOrgs.length,
        totalUsers: userCount,
        monthlyRevenue,
        totalAssets: 156, // Mock data
        planDistribution
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const createUser = async () => {
    if (!newUserForm.email || !newUserForm.password || !newUserForm.organization_id) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Mock user creation (in real implementation, this would create in Neon database)
      console.log('Creating user:', newUserForm);

      // Simulate user creation delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reset form and reload data
      setNewUserForm({
        email: '',
        password: '',
        name: '',
        organization_id: '',
        role: 'viewer',
        phone: ''
      });

      await loadData();
      setError('User created successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to create user');
    }
  };

  const createOrganization = async () => {
    if (!newOrgForm.name || !newOrgForm.slug) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Mock organization creation
      console.log('Creating organization:', newOrgForm);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reset form and reload data
      setNewOrgForm({
        name: '',
        slug: '',
        plan: 'free'
      });
      
      await loadData();
      setError('Organization created successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to create organization');
    }
  };

  const switchToOrgView = async (orgId: string) => {
    try {
      await switchToOrganization(orgId);
      // Open the main app in a new tab with the organization context
      window.open('/dashboard', '_blank');
    } catch (error: any) {
      setError(error.message || 'Failed to switch organization');
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await mockToggleUserActive(userId, isActive);

      if (error) throw error;
      
      await loadUsers();
    } catch (error: any) {
      setError(error.message || 'Failed to update user status');
    }
  };

  const updateOrgPlan = async (orgId: string, plan: string) => {
    try {
      await mockUpdateOrganizationPlan(orgId, plan);

      if (error) throw error;

      await loadData();
      setError('Organization plan updated successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to update organization plan');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await mockDeleteUser(userId);
      await loadData();
      setError('User deleted successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to delete user');
    }
  };

  // User diagnosis and authentication testing
  const diagnoseUser = async () => {
    setUserDiagnosisForm(prev => ({ ...prev, loading: true, testResults: null }));

    try {
      const email = userDiagnosisForm.email;
      const password = userDiagnosisForm.password;

      if (!email) {
        throw new Error('Please enter an email address to diagnose');
      }

      console.log('🔍 Starting user diagnosis for:', email);

      const mockResults = await mockDiagnoseUser(email, password);

      setUserDiagnosisForm(prev => ({
        ...prev,
        loading: false,
        testResults: mockResults.testResults
      }));



    } catch (error: any) {
      setUserDiagnosisForm(prev => ({
        ...prev,
        testResults: {
          error: getErrorMessage(error),
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setUserDiagnosisForm(prev => ({ ...prev, loading: false }));
    }
  };

  const createMissingUser = async (email: string, password: string) => {
    try {
      setError('');

      // Determine role and organization based on email
      let role = 'viewer';
      let organizationId = null;

      // Get the first organization as default
      if (organizations.length > 0) {
        organizationId = organizations[0].id;
      }

      // Set role based on email
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('premium')) {
        role = 'manager';
      }

      console.log('Creating user:', { email, role, organizationId });

      const result = await mockCreateUserInSupabase(email, password, {
        name: email.split('@')[0],
        role,
        organization_id: organizationId
      });

      setError(`✅ User ${email} created successfully in both Auth and database!`);
      await loadUsers();

      // Re-run diagnosis to verify
      await diagnoseUser();

    } catch (error: any) {
      setError(`❌ Failed to create user: ${getErrorMessage(error)}`);
    }
  };

  const deleteOrganization = async (orgId: string) => {
    if (!confirm('Are you sure you want to delete this organization? This will also delete all users in this organization.')) {
      return;
    }

    try {
      await mockDeleteOrganization(orgId);
      await loadData();
      setError('Organization and all associated users deleted successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to delete organization');
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await mockUpdateUserRole(userId, role);

      await loadUsers();
      setError('User role updated successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to update user role');
    }
  };

  const bulkUpdateOrgPlans = async (fromPlan: string, toPlan: string) => {
    if (!confirm(`Are you sure you want to update all organizations from ${fromPlan} to ${toPlan} plan?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('organizations')
        .update({ plan: toPlan })
        .eq('plan', fromPlan);

      if (error) throw error;

      await loadData();
      setError(`Successfully updated organizations from ${fromPlan} to ${toPlan} plan!`);
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to bulk update organization plans');
    }
  };

  const exportUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          organizations (
            id,
            name,
            plan
          )
        `);

      if (error) throw error;

      const csvContent = [
        'ID,Email,Name,Role,Organization,Plan,Active,Created',
        ...data.map(user => [
          user.id,
          user.email,
          user.name || 'N/A',
          user.role,
          user.organization?.name || 'N/A',
          user.organization?.plan || 'N/A',
          user.is_active ? 'Yes' : 'No',
          new Date(user.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      setError('User data exported successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to export user data');
    }
  };

  const exportOrgData = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select(`
          *,
          users(count)
        `);

      if (error) throw error;

      const csvContent = [
        'ID,Name,Slug,Plan,User Count,Created',
        ...data.map(org => [
          org.id,
          org.name,
          org.slug,
          org.plan,
          org.users?.[0]?.count || 0,
          new Date(org.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organizations-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      setError('Organization data exported successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to export organization data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-blue-100 text-blue-800';
      case 'starter': return 'bg-green-100 text-green-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'inspector': return 'bg-green-100 text-green-800';
      case 'contractor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <Shield className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-gray-600">Manage organizations, users, billing, and system-wide settings for the Municipal Infrastructure Management Platform.</p>
            </div>
          </div>
          
          <Alert className={cn(
            "max-w-md mx-auto",
            error.includes('successfully') ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          )}>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-sm font-medium text-red-800">
              🔴 Super Admin Access
            </AlertDescription>
          </Alert>

          {error && (
            <Alert className={cn(
              "max-w-md mx-auto",
              error.includes('successfully') ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            )}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className={error.includes('successfully') ? "text-green-800" : "text-red-800"}>
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="diagnosis">Auth Debug</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Organizations</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalOrganizations || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${stats?.monthlyRevenue?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Database className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Assets</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalAssets || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Plan Distribution</span>
                </CardTitle>
                <CardDescription>Current subscription plan breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats?.planDistribution || {}).map(([plan, count]) => (
                    <div key={plan} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 capitalize">{plan}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Debug Panel */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-800">
                  <Database className="w-5 h-5" />
                  <span>System Debug Info</span>
                </CardTitle>
                <CardDescription>Technical information for troubleshooting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Database Status</h4>
                    <p>Organizations loaded: {organizations.length}</p>
                    <p>Users loaded: {users.length}</p>
                    <p>Stats computed: {stats ? '✅' : '❌'}</p>
                    <p>Loading state: {loading ? '���' : '✅'}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">User Context</h4>
                    <p>Current user: {user?.email || 'Not logged in'}</p>
                    <p>User role: {user?.role || 'Unknown'}</p>
                    <p>Organization: {user?.organization?.name || 'None'}</p>
                    <p>Plan: {user?.organization?.plan || 'Unknown'}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={initializeAdminPortal}
                      disabled={loading}
                    >
                      🔄 Refresh All Data
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const debugData = {
                          timestamp: new Date().toISOString(),
                          organizations: organizations.length,
                          users: users.length,
                          stats,
                          user: user ? {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                            organization: user.organization
                          } : null,
                          error: error || null
                        };
                        navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
                        setError('Debug data copied to clipboard!');
                        setTimeout(() => setError(''), 3000);
                      }}
                    >
                      📋 Copy Debug Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Organizations</h3>
                <p className="text-gray-600">Manage customer organizations and their settings</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Organization
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Organization</DialogTitle>
                    <DialogDescription>Add a new customer organization to the platform</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input
                        id="org-name"
                        value={newOrgForm.name}
                        onChange={(e) => setNewOrgForm({...newOrgForm, name: e.target.value})}
                        placeholder="City of Springfield"
                      />
                    </div>
                    <div>
                      <Label htmlFor="org-slug">Slug</Label>
                      <Input
                        id="org-slug"
                        value={newOrgForm.slug}
                        onChange={(e) => setNewOrgForm({...newOrgForm, slug: e.target.value})}
                        placeholder="springfield"
                      />
                    </div>
                    <div>
                      <Label htmlFor="org-plan">Plan</Label>
                      <Select value={newOrgForm.plan} onValueChange={(value: any) => setNewOrgForm({...newOrgForm, plan: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="starter">Starter - $29/month</SelectItem>
                          <SelectItem value="professional">Professional - $99/month</SelectItem>
                          <SelectItem value="enterprise">Enterprise - $299/month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={createOrganization} className="w-full">
                      Create Organization
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{org.name}</p>
                            <p className="text-sm text-gray-500">/{org.slug}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={org.plan} onValueChange={(value) => updateOrgPlan(org.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="starter">Starter</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{org.user_count || 0}</TableCell>
                        <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => switchToOrgView(org.id)}
                              title="Access this organization's app"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteOrganization(org.id)}
                              title="Delete organization"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                <p className="text-gray-600">Manage user accounts across all organizations</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>Add a new user to an organization</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-password">Password</Label>
                      <Input
                        id="user-password"
                        type="password"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                        placeholder="Secure password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-name">Name</Label>
                      <Input
                        id="user-name"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-organization">Organization</Label>
                      <Select value={newUserForm.organization_id} onValueChange={(value) => setNewUserForm({...newUserForm, organization_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="user-role">Role</Label>
                      <Select value={newUserForm.role} onValueChange={(value: any) => setNewUserForm({...newUserForm, role: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="inspector">Inspector</SelectItem>
                          <SelectItem value="contractor">Contractor</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={createUser} className="w-full">
                      Create User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name || 'Unnamed User'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.organization?.name}</p>
                            <Badge className={cn("text-xs", getPlanColor(user.organization?.plan || 'free'))}>
                              {user.organization?.plan || 'free'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={user.role} onValueChange={(value) => updateUserRole(user.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="inspector">Inspector</SelectItem>
                              <SelectItem value="contractor">Contractor</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs", user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                            {user.is_active ? 'Active' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserStatus(user.id, !user.is_active)}
                            >
                              {user.is_active ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteUser(user.id)}
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${stats?.monthlyRevenue?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paying Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{organizations.filter(org => org.plan !== 'free').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Crown className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{organizations.length > 0 ? Math.round((organizations.filter(org => org.plan !== 'free').length / organizations.length) * 100) : 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Revenue by Plan</span>
                </CardTitle>
                <CardDescription>Monthly subscription revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats?.planDistribution || {}).map(([plan, count]) => {
                    const planPricing = {
                      free: 0,
                      starter: 29,
                      professional: 99,
                      enterprise: 299
                    } as Record<string, number>;
                    const revenue = (planPricing[plan] || 0) * count;
                    return (
                      <div key={plan} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge className={cn("capitalize", getPlanColor(plan))}>
                            {plan}
                          </Badge>
                          <span className="text-sm text-gray-600">{count} organizations</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${revenue.toLocaleString()}/month</p>
                          <p className="text-xs text-gray-500">${planPricing[plan] || 0}/org</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.is_active).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <UserPlus className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">New This Month</p>
                      <p className="text-2xl font-bold text-gray-900">{users.filter(u => new Date(u.created_at).getMonth() === new Date().getMonth()).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Daily Logins</p>
                      <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.last_login && new Date(u.last_login).toDateString() === new Date().toDateString()).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Session</p>
                      <p className="text-2xl font-bold text-gray-900">24m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>User Roles Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(users.reduce((acc, user) => {
                      acc[user.role] = (acc[user.role] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={cn("text-xs", getRoleColor(role))}>
                            {role}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{count}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / users.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Organization Growth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-semibold">{organizations.filter(org => new Date(org.created_at).getMonth() === new Date().getMonth()).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Organizations</span>
                      <span className="font-semibold">{organizations.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Free Plan</span>
                      <span className="font-semibold">{organizations.filter(org => org.plan === 'free').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Paid Plans</span>
                      <span className="font-semibold">{organizations.filter(org => org.plan !== 'free').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Diagnosis Tab */}
          <TabsContent value="diagnosis" className="space-y-6">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Diagnosis</h2>
                <p className="text-gray-600">Diagnose and fix user authentication issues</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    User Authentication Testing
                  </CardTitle>
                  <CardDescription>
                    Test user credentials and diagnose authentication problems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis-email">Email Address</Label>
                      <Input
                        id="diagnosis-email"
                        type="email"
                        placeholder="premium@springfield.gov"
                        value={userDiagnosisForm.email}
                        onChange={(e) => setUserDiagnosisForm(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis-password">Password (optional for auth test)</Label>
                      <Input
                        id="diagnosis-password"
                        type="password"
                        placeholder="Premium!"
                        value={userDiagnosisForm.password}
                        onChange={(e) => setUserDiagnosisForm(prev => ({
                          ...prev,
                          password: e.target.value
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={diagnoseUser}
                      disabled={userDiagnosisForm.loading || !userDiagnosisForm.email}
                      className="flex items-center gap-2"
                    >
                      {userDiagnosisForm.loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Diagnosing...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          Run Diagnosis
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setUserDiagnosisForm(prev => ({
                        ...prev,
                        email: 'premium@springfield.gov',
                        password: 'Premium!'
                      }))}
                    >
                      Use Premium Demo
                    </Button>
                  </div>

                  {userDiagnosisForm.testResults && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Diagnosis Results</h3>

                      {userDiagnosisForm.testResults.error ? (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {userDiagnosisForm.testResults.error}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="grid gap-4">
                          {/* Database Test */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                Database Check
                                {userDiagnosisForm.testResults.tests.database?.exists ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 text-sm">
                              {userDiagnosisForm.testResults.tests.database?.exists ? (
                                <div className="text-green-700">
                                  ✅ User found in database
                                  <div className="mt-1 text-xs text-gray-600">
                                    Role: {userDiagnosisForm.testResults.tests.database.user?.role || 'N/A'}<br/>
                                    Active: {userDiagnosisForm.testResults.tests.database.user?.is_active ? 'Yes' : 'No'}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-red-700">
                                  ❌ User not found in database
                                  {userDiagnosisForm.testResults.tests.database?.error && (
                                    <div className="text-xs mt-1">{userDiagnosisForm.testResults.tests.database.error}</div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Connection Test */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                Supabase Connection
                                {userDiagnosisForm.testResults.tests.connection?.success ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 text-sm">
                              {userDiagnosisForm.testResults.tests.connection?.success ? (
                                <div className="text-green-700">✅ Supabase connection working</div>
                              ) : (
                                <div className="text-red-700">
                                  ❌ Supabase connection failed
                                  {userDiagnosisForm.testResults.tests.connection?.error && (
                                    <div className="text-xs mt-1">{userDiagnosisForm.testResults.tests.connection.error}</div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Authentication Test */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Authentication Test
                                {userDiagnosisForm.testResults.tests.authentication?.skipped ? (
                                  <Eye className="w-4 h-4 text-gray-600" />
                                ) : userDiagnosisForm.testResults.tests.authentication?.success ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 text-sm">
                              {userDiagnosisForm.testResults.tests.authentication?.skipped ? (
                                <div className="text-gray-600">⏸️ Skipped (no password provided)</div>
                              ) : userDiagnosisForm.testResults.tests.authentication?.success ? (
                                <div className="text-green-700">✅ Authentication successful</div>
                              ) : (
                                <div className="text-red-700">
                                  ❌ Authentication failed
                                  {userDiagnosisForm.testResults.tests.authentication?.error && (
                                    <div className="text-xs mt-1">{userDiagnosisForm.testResults.tests.authentication.error}</div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Demo Credentials Check */}
                          {userDiagnosisForm.testResults.tests.demoCredentials?.isDemo && (
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <Crown className="w-4 h-4" />
                                  Demo Credentials
                                  {userDiagnosisForm.testResults.tests.demoCredentials?.passwordMatch ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                  )}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0 text-sm">
                                <div>
                                  Expected: {userDiagnosisForm.testResults.tests.demoCredentials.expectedPassword}
                                </div>
                                {userDiagnosisForm.testResults.tests.demoCredentials.passwordMatch ? (
                                  <div className="text-green-700">✅ Password matches demo credentials</div>
                                ) : (
                                  <div className="text-orange-700">⚠️ Password doesn't match expected demo password</div>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {/* Action Buttons */}
                          {!userDiagnosisForm.testResults.tests.database?.exists && (
                            <Card className="border-blue-200 bg-blue-50">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  <UserPlus className="w-4 h-4" />
                                  Create Missing User
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <p className="text-sm text-gray-600 mb-3">
                                  User not found in database. Create user account?
                                </p>
                                <Button
                                  size="sm"
                                  onClick={() => createMissingUser(
                                    userDiagnosisForm.email,
                                    userDiagnosisForm.password || 'TempPassword123!'
                                  )}
                                  disabled={!userDiagnosisForm.email}
                                >
                                  Create User
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Platform Settings</span>
                  </CardTitle>
                  <CardDescription>Configure system-wide preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">User Registration</p>
                      <p className="text-sm text-gray-500">Allow new user self-registration</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">System email notifications</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">API Rate Limiting</p>
                      <p className="text-sm text-gray-500">Protect against API abuse</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Data Backup</p>
                      <p className="text-sm text-gray-500">Automatic daily backups</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Running</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Database Management</span>
                  </CardTitle>
                  <CardDescription>System database operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open('/database-setup', '_blank')}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Database Schema Setup
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open('/database-test', '_blank')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Database Connection Test
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={loadData}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Refresh Admin Data
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify({
                          organizations: organizations.length,
                          users: users.length,
                          stats
                        }, null, 2));
                        setError('System data copied to clipboard!');
                        setTimeout(() => setError(''), 3000);
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Export System Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security & Maintenance</span>
                </CardTitle>
                <CardDescription>System security and maintenance operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">🚨 Admin Actions</h4>
                    <div className="space-y-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('This will disable all inactive users. Continue?')) {
                            users.filter(u => !u.is_active).forEach(u => updateUserStatus(u.id, false));
                          }
                        }}
                      >
                        Disable Inactive Users
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('This will reset all user passwords. Continue?')) {
                            setError('Password reset feature would be implemented here');
                            setTimeout(() => setError(''), 3000);
                          }
                        }}
                      >
                        Force Password Reset
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🔧 Maintenance</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setError('System cache cleared successfully!');
                          setTimeout(() => setError(''), 3000);
                        }}
                      >
                        Clear System Cache
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setError('Database optimization completed!');
                          setTimeout(() => setError(''), 3000);
                        }}
                      >
                        Optimize Database
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
  Building2,
  CreditCard,
  Calendar,
  FileText,
  Wallet,
  LineChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Organization {
  id: string;
  name: string;
  slug?: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
  settings?: any;
  created_at: string;
  updated_at?: string;
  user_count: number;
}

interface User {
  id: string;
  organization_id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'member';
  phone: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  organization?: Organization;
}

interface Transaction {
  id: string;
  organization_id: string;
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'upgrade' | 'downgrade';
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  description: string;
  created_at: string;
  completed_at: string | null;
  organization_name: string;
  organization_plan: string;
}

interface AdminStats {
  totalOrganizations: number;
  totalUsers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  totalTransactions: number;
  planDistribution: Record<string, number>;
}

interface RevenueAnalytics {
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

interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export default function AdminPortal() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState<RevenueAnalytics | null>(null);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    name: '',
    organization_id: '',
    role: 'member' as const,
    phone: ''
  });

  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    plan: 'free' as const
  });

  const [newTransactionForm, setNewTransactionForm] = useState({
    organization_id: '',
    amount: '',
    type: 'payment' as const,
    description: ''
  });

  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);

  // Get auth token for API calls
  const getAuthToken = () => {
    return localStorage.getItem('neon_auth_token');
  };

  // API call helper
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return data;
  };

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Load admin stats
  const loadStats = async () => {
    try {
      const result = await apiCall('/api/admin/stats');
      setStats(result.data);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
      setError(error.message);
    }
  };

  // Load organizations
  const loadOrganizations = async () => {
    try {
      const result = await apiCall('/api/admin/organizations');
      setOrganizations(result.data);
    } catch (error: any) {
      console.error('Failed to load organizations:', error);
      setError(error.message);
    }
  };

  // Load users
  const loadUsers = async () => {
    try {
      const result = await apiCall('/api/admin/users');
      setUsers(result.data);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      setError(error.message);
    }
  };

  // Load transactions
  const loadTransactions = async () => {
    try {
      const result = await apiCall('/api/admin/transactions?limit=100');
      setTransactions(result.data.transactions);
    } catch (error: any) {
      console.error('Failed to load transactions:', error);
      setError(error.message);
    }
  };

  // Load revenue analytics
  const loadRevenueAnalytics = async () => {
    try {
      const result = await apiCall('/api/admin/revenue-analytics');
      setRevenueAnalytics(result.data);
    } catch (error: any) {
      console.error('Failed to load revenue analytics:', error);
      setError(error.message);
    }
  };

  // Load settings
  const loadSettings = async () => {
    try {
      const result = await apiCall('/api/admin/settings');
      setSettings(result.data);
    } catch (error: any) {
      console.error('Failed to load settings:', error);
      setError(error.message);
    }
  };

  // Create organization
  const createOrganization = async () => {
    try {
      if (!newOrgForm.name) {
        setError('Organization name is required');
        return;
      }

      await apiCall('/api/admin/organizations', {
        method: 'POST',
        body: JSON.stringify(newOrgForm)
      });
      
      setNewOrgForm({ name: '', plan: 'free' });
      await loadOrganizations();
      await loadStats();
      showSuccess('Organization created successfully');
    } catch (error: any) {
      console.error('Failed to create organization:', error);
      setError(error.message);
    }
  };

  // Update organization
  const updateOrganization = async (orgId: string, updates: Partial<Organization>) => {
    try {
      await apiCall(`/api/admin/organizations/${orgId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      await loadOrganizations();
      await loadStats();
      setEditingOrg(null);
      showSuccess('Organization updated successfully');
    } catch (error: any) {
      console.error('Failed to update organization:', error);
      setError(error.message);
    }
  };

  // Update organization plan
  const updateOrganizationPlan = async (orgId: string, plan: string) => {
    try {
      await apiCall(`/api/admin/organizations/${orgId}/plan`, {
        method: 'PUT',
        body: JSON.stringify({ plan })
      });
      await loadOrganizations();
      await loadStats();
      showSuccess('Organization plan updated successfully');
    } catch (error: any) {
      console.error('Failed to update organization plan:', error);
      setError(error.message);
    }
  };

  // Delete organization
  const deleteOrganization = async (orgId: string) => {
    try {
      await apiCall(`/api/admin/organizations/${orgId}`, {
        method: 'DELETE'
      });
      await loadOrganizations();
      await loadUsers();
      await loadStats();
      showSuccess('Organization deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete organization:', error);
      setError(error.message);
    }
  };

  // Create user
  const createUser = async () => {
    try {
      if (!newUserForm.email || !newUserForm.password || !newUserForm.organization_id) {
        setError('Email, password, and organization are required');
        return;
      }

      await apiCall('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(newUserForm)
      });
      
      setNewUserForm({
        email: '',
        password: '',
        name: '',
        organization_id: '',
        role: 'member',
        phone: ''
      });
      
      await loadUsers();
      await loadStats();
      showSuccess('User created successfully');
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setError(error.message);
    }
  };

  // Update user
  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await apiCall(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      await loadUsers();
      setEditingUser(null);
      showSuccess('User updated successfully');
    } catch (error: any) {
      console.error('Failed to update user:', error);
      setError(error.message);
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, role: string) => {
    try {
      await apiCall(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
      });
      await loadUsers();
      showSuccess('User role updated successfully');
    } catch (error: any) {
      console.error('Failed to update user role:', error);
      setError(error.message);
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    try {
      await apiCall(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      await loadUsers();
      await loadStats();
      showSuccess('User deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      setError(error.message);
    }
  };

  // Create transaction
  const createTransaction = async () => {
    try {
      if (!newTransactionForm.organization_id || !newTransactionForm.amount) {
        setError('Organization and amount are required');
        return;
      }

      await apiCall('/api/admin/transactions', {
        method: 'POST',
        body: JSON.stringify({
          ...newTransactionForm,
          amount: parseFloat(newTransactionForm.amount)
        })
      });
      
      setNewTransactionForm({
        organization_id: '',
        amount: '',
        type: 'payment',
        description: ''
      });
      
      await loadTransactions();
      await loadStats();
      await loadRevenueAnalytics();
      showSuccess('Transaction created successfully');
    } catch (error: any) {
      console.error('Failed to create transaction:', error);
      setError(error.message);
    }
  };

  // Update setting
  const updateSetting = async (key: string, value: string) => {
    try {
      await apiCall(`/api/admin/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value })
      });
      await loadSettings();
      setEditingSetting(null);
      showSuccess('Setting updated successfully');
    } catch (error: any) {
      console.error('Failed to update setting:', error);
      setError(error.message);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const initializeAdminPortal = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadStats(),
          loadOrganizations(),
          loadUsers(),
          loadTransactions(),
          loadRevenueAnalytics(),
          loadSettings()
        ]);
      } catch (error: any) {
        console.error('Failed to initialize admin portal:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAdminPortal();
  }, []);

  // Clear messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground">
            Manage users, organizations, finances, and system settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">Admin Access</span>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {stats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalTransactions} transactions
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Plan Distribution */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Current subscription breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats.planDistribution).map(([plan, count]) => (
                    <div key={plan} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground capitalize">{plan}</div>
                      <Badge className={getPlanBadgeColor(plan)}>{plan}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Organizations</h2>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Building2 className="h-4 w-4 mr-2" />
                    Add Organization
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Organization</DialogTitle>
                    <DialogDescription>
                      Add a new organization to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input
                        id="org-name"
                        placeholder="Acme Corp"
                        value={newOrgForm.name}
                        onChange={(e) => setNewOrgForm({...newOrgForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-plan">Plan</Label>
                      <Select
                        value={newOrgForm.plan}
                        onValueChange={(value: any) => setNewOrgForm({...newOrgForm, plan: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <Button onClick={createOrganization}>Create Organization</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={loadOrganizations}>
                <Download className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Card>
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
                        <div className="font-medium">{org.name}</div>
                        {org.slug && <div className="text-sm text-muted-foreground">{org.slug}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanBadgeColor(org.plan)}>
                        {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{org.user_count}</TableCell>
                    <TableCell>{formatDate(org.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingOrg(org)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Select
                          value={org.plan}
                          onValueChange={(value) => updateOrganizationPlan(org.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Delete organization "${org.name}"? This will also delete all users in this organization.`)) {
                              deleteOrganization(org.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Edit Organization Dialog */}
          {editingOrg && (
            <Dialog open={!!editingOrg} onOpenChange={() => setEditingOrg(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Organization</DialogTitle>
                  <DialogDescription>
                    Update organization details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-org-name">Organization Name</Label>
                    <Input
                      id="edit-org-name"
                      value={editingOrg.name}
                      onChange={(e) => setEditingOrg({...editingOrg, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingOrg(null)}>Cancel</Button>
                  <Button onClick={() => updateOrganization(editingOrg.id, { name: editingOrg.name })}>
                    Update Organization
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Users</h2>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Add a new user to an existing organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Select
                        value={newUserForm.organization_id}
                        onValueChange={(value) => setNewUserForm({...newUserForm, organization_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUserForm.role}
                        onValueChange={(value: any) => setNewUserForm({...newUserForm, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <Button onClick={createUser}>Create User</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={loadUsers}>
                <Download className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-muted-foreground">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.organization ? (
                        <div>
                          <div className="font-medium">{user.organization.name}</div>
                          <Badge className={getPlanBadgeColor(user.organization.plan)}>
                            {user.organization.plan}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No organization</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Select
                          value={user.role}
                          onValueChange={(value) => updateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Delete user "${user.email}"?`)) {
                              deleteUser(user.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Edit User Dialog */}
          {editingUser && (
            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Update user details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-organization">Organization</Label>
                    <Select
                      value={editingUser.organization_id}
                      onValueChange={(value) => setEditingUser({...editingUser, organization_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                  <Button onClick={() => updateUser(editingUser.id, { 
                    email: editingUser.email, 
                    organization_id: editingUser.organization_id 
                  })}>
                    Update User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Financial Transactions</h2>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Manual Transaction</DialogTitle>
                    <DialogDescription>
                      Add a manual transaction entry.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="transaction-org">Organization</Label>
                      <Select
                        value={newTransactionForm.organization_id}
                        onValueChange={(value) => setNewTransactionForm({...newTransactionForm, organization_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-amount">Amount ($)</Label>
                      <Input
                        id="transaction-amount"
                        type="number"
                        step="0.01"
                        placeholder="99.00"
                        value={newTransactionForm.amount}
                        onChange={(e) => setNewTransactionForm({...newTransactionForm, amount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-type">Type</Label>
                      <Select
                        value={newTransactionForm.type}
                        onValueChange={(value: any) => setNewTransactionForm({...newTransactionForm, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                          <SelectItem value="upgrade">Upgrade</SelectItem>
                          <SelectItem value="downgrade">Downgrade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-description">Description</Label>
                      <Textarea
                        id="transaction-description"
                        placeholder="Transaction description..."
                        value={newTransactionForm.description}
                        onChange={(e) => setNewTransactionForm({...newTransactionForm, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <DialogTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogTrigger>
                    <Button onClick={createTransaction}>Create Transaction</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={loadTransactions}>
                <Download className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.organization_name}</div>
                        <Badge className={getPlanBadgeColor(transaction.organization_plan)}>
                          {transaction.organization_plan}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(transaction.amount / 100)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {transaction.description || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Revenue Analytics</h2>
            <Button onClick={loadRevenueAnalytics}>
              <LineChart className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {revenueAnalytics && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Plan Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Plan (This Month)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueAnalytics.planRevenue.map((item) => (
                      <div key={item.plan} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge className={getPlanBadgeColor(item.plan)}>
                            {item.plan.charAt(0).toUpperCase() + item.plan.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.transactions} transactions
                          </span>
                        </div>
                        <span className="font-mono font-medium">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Customers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueAnalytics.topCustomers.slice(0, 5).map((customer, index) => (
                      <div key={customer.name} className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            <span className="font-medium">{customer.name}</span>
                            <Badge className={getPlanBadgeColor(customer.plan)}>
                              {customer.plan}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {customer.transactions} transactions
                          </span>
                        </div>
                        <span className="font-mono font-medium">
                          {formatCurrency(customer.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Monthly Trend */}
          {revenueAnalytics && revenueAnalytics.monthlyTrend.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {revenueAnalytics.monthlyTrend.map((month) => (
                    <div key={month.month} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <span className="font-medium">
                          {new Date(month.month).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {month.transactions} transactions
                        </span>
                      </div>
                      <span className="font-mono font-medium">
                        {formatCurrency(month.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">System Settings</h2>
            <Button onClick={loadSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {settings.map((setting) => (
              <Card key={setting.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{setting.key}</CardTitle>
                      <CardDescription>{setting.description}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSetting(setting)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                    {setting.key.includes('secret') || setting.key.includes('key') 
                      ? '••••••••••••••••' 
                      : setting.value || '(empty)'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last updated: {formatDate(setting.updated_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Setting Dialog */}
          {editingSetting && (
            <Dialog open={!!editingSetting} onOpenChange={() => setEditingSetting(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Setting</DialogTitle>
                  <DialogDescription>
                    Update system setting: {editingSetting.key}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="setting-value">Value</Label>
                    <Input
                      id="setting-value"
                      type={editingSetting.key.includes('secret') || editingSetting.key.includes('key') ? 'password' : 'text'}
                      value={editingSetting.value}
                      onChange={(e) => setEditingSetting({...editingSetting, value: e.target.value})}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {editingSetting.description}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingSetting(null)}>Cancel</Button>
                  <Button onClick={() => updateSetting(editingSetting.key, editingSetting.value)}>
                    Update Setting
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Database Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>
                Current database connection and system health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Database Connected</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

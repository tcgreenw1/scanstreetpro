import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/contexts/AuthContext";

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
  settings: any;
  created_at: string;
  updated_at: string;
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

interface AdminStats {
  totalOrganizations: number;
  totalUsers: number;
  monthlyRevenue: number;
  totalAssets: number;
  planDistribution: Record<string, number>;
}

export default function AdminPortal() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New user form state
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    name: '',
    organization_id: '',
    role: 'member' as const,
    phone: ''
  });

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

  // Update organization plan
  const updateOrganizationPlan = async (orgId: string, plan: string) => {
    try {
      await apiCall(`/api/admin/organizations/${orgId}/plan`, {
        method: 'PUT',
        body: JSON.stringify({ plan })
      });
      await loadOrganizations(); // Refresh data
      await loadStats(); // Refresh stats
    } catch (error: any) {
      console.error('Failed to update organization plan:', error);
      setError(error.message);
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    try {
      await apiCall(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      await loadUsers(); // Refresh data
      await loadStats(); // Refresh stats
    } catch (error: any) {
      console.error('Failed to delete user:', error);
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
      await loadUsers(); // Refresh data
    } catch (error: any) {
      console.error('Failed to update user role:', error);
      setError(error.message);
    }
  };

  // Create new user
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
      
      // Reset form
      setNewUserForm({
        email: '',
        password: '',
        name: '',
        organization_id: '',
        role: 'member',
        phone: ''
      });
      
      await loadUsers(); // Refresh data
      await loadStats(); // Refresh stats
    } catch (error: any) {
      console.error('Failed to create user:', error);
      setError(error.message);
    }
  };

  // Delete organization
  const deleteOrganization = async (orgId: string) => {
    try {
      await apiCall(`/api/admin/organizations/${orgId}`, {
        method: 'DELETE'
      });
      await loadOrganizations(); // Refresh data
      await loadUsers(); // Refresh users (cascade deleted)
      await loadStats(); // Refresh stats
    } catch (error: any) {
      console.error('Failed to delete organization:', error);
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
          loadUsers()
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

  // Clear error when user takes action
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
            Manage users, organizations, and system settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">Admin Access</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium">Plan Distribution</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {Object.entries(stats.planDistribution).map(([plan, count]) => (
                      <div key={plan} className="flex justify-between text-sm">
                        <span className="capitalize">{plan}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Organizations</h2>
            <Button onClick={loadOrganizations}>
              <Download className="h-4 w-4 mr-2" />
              Refresh
            </Button>
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
                        <div className="text-sm text-muted-foreground">{org.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanBadgeColor(org.plan)}>
                        {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{org.user_count}</TableCell>
                    <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-2xl font-bold">System Settings</h2>
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

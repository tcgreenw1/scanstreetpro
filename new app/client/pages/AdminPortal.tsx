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
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import dataService from "@/services/dataService";

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  settings: any;
  created_at: string;
  updated_at: string;
}

interface AdminStats {
  totalOrganizations: number;
  totalUsers: number;
  totalContractors: number;
  totalAssets: number;
  totalInspections: number;
  totalRevenue: number;
  planDistribution: Record<string, number>;
}

export default function AdminPortal() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load admin data
      const [orgsResult, usersResult] = await Promise.all([
        loadOrganizations(),
        loadUsers()
      ]);
      
      // Calculate stats
      const statsData = calculateStats(orgsResult, usersResult);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizations = async () => {
    // Mock data for demo - in real app, this would be a Supabase admin query
    const mockOrgs: Organization[] = [
      {
        id: '1',
        name: 'City of Springfield',
        slug: 'springfield',
        plan: 'free',
        settings: { theme: 'light', notifications: true },
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-04-20T00:00:00Z'
      },
      {
        id: '2',
        name: 'Metro County Public Works',
        slug: 'metro-county',
        plan: 'professional',
        settings: { theme: 'dark', notifications: true },
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-04-18T00:00:00Z'
      },
      {
        id: '3',
        name: 'Riverside Municipal Services',
        slug: 'riverside',
        plan: 'starter',
        settings: { theme: 'light', notifications: false },
        created_at: '2024-03-10T00:00:00Z',
        updated_at: '2024-04-19T00:00:00Z'
      }
    ];
    setOrganizations(mockOrgs);
    return mockOrgs;
  };

  const loadUsers = async () => {
    // Mock data for demo
    const mockUsers = [
      {
        id: '1',
        name: 'John Mitchell',
        email: 'john.mitchell@springfield.gov',
        organization: 'City of Springfield',
        role: 'admin',
        plan: 'free',
        last_login: '2024-04-20T10:30:00Z',
        is_active: true
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@metrocounty.gov',
        organization: 'Metro County Public Works',
        role: 'manager',
        plan: 'professional',
        last_login: '2024-04-19T14:15:00Z',
        is_active: true
      },
      {
        id: '3',
        name: 'Mike Rodriguez',
        email: 'mike@riverside.gov',
        organization: 'Riverside Municipal Services',
        role: 'inspector',
        plan: 'starter',
        last_login: '2024-04-18T09:00:00Z',
        is_active: true
      }
    ];
    setUsers(mockUsers);
    return mockUsers;
  };

  const calculateStats = (orgs: Organization[], users: any[]): AdminStats => {
    const planDistribution = orgs.reduce((acc, org) => {
      acc[org.plan] = (acc[org.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrganizations: orgs.length,
      totalUsers: users.length,
      totalContractors: 48, // Mock data
      totalAssets: 156, // Mock data
      totalInspections: 234, // Mock data
      totalRevenue: 25600, // Mock data - monthly revenue
      planDistribution
    };
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800 border-gray-200',
      starter: 'bg-blue-100 text-blue-800 border-blue-200',
      professional: 'bg-purple-100 text-purple-800 border-purple-200',
      enterprise: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    
    return (
      <Badge className={cn(colors[plan as keyof typeof colors])}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </Badge>
    );
  };

  const handleUpgradePlan = async (orgId: string, newPlan: string) => {
    try {
      // In real app, this would update the organization's plan in Supabase
      setOrganizations(prev => prev.map(org => 
        org.id === orgId ? { ...org, plan: newPlan as any } : org
      ));
      alert(`Plan upgraded to ${newPlan} successfully!`);
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      alert('Failed to upgrade plan');
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: false } : user
      ));
      alert('User deactivated successfully!');
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      alert('Failed to deactivate user');
    }
  };

  const exportData = async (type: string) => {
    // Mock export functionality
    alert(`Exporting ${type} data...`);
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="animate-shimmer h-8 w-64 bg-slate-200 rounded mx-auto mb-4"></div>
          <div className="animate-shimmer h-4 w-96 bg-slate-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Admin Portal
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Manage organizations, users, billing, and system-wide settings for the Municipal Infrastructure Management Platform.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300">
            <Shield className="w-3 h-3 mr-1" />
            Super Admin Access
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 glass-card border-white/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Organizations</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      {stats?.totalOrganizations || 0}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Users</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      {stats?.totalUsers || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      ${stats?.totalRevenue.toLocaleString() || 0}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Assets</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      {stats?.totalAssets || 0}
                    </p>
                  </div>
                  <Database className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Distribution */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Plan Distribution</CardTitle>
              <CardDescription>Current subscription plan breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats?.planDistribution || {}).map(([plan, count]) => (
                  <div key={plan} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">{count}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">{plan}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      Metro County upgraded to Professional plan
                    </p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      New organization registered: Riverside Municipal Services
                    </p>
                    <p className="text-xs text-slate-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      Payment failed for City of Westfield - plan downgraded
                    </p>
                    <p className="text-xs text-slate-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Organizations</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => exportData('organizations')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Organization
              </Button>
            </div>
          </div>

          <Card className="glass-card border-white/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">{org.name}</div>
                          <div className="text-sm text-slate-500">/{org.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(org.plan)}</TableCell>
                      <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(org.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Crown className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upgrade Plan</DialogTitle>
                                <DialogDescription>
                                  Change the subscription plan for {org.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select new plan" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="starter">Starter ($29/month)</SelectItem>
                                    <SelectItem value="professional">Professional ($89/month)</SelectItem>
                                    <SelectItem value="enterprise">Enterprise ($299/month)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex space-x-2">
                                  <Button 
                                    onClick={() => handleUpgradePlan(org.id, 'professional')}
                                    className="flex-1"
                                  >
                                    Upgrade Plan
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Users</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => exportData('users')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card className="glass-card border-white/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.organization}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPlanBadge(user.plan)}</TableCell>
                      <TableCell>{new Date(user.last_login).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeactivateUser(user.id)}
                            disabled={!user.is_active}
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

        <TabsContent value="billing" className="space-y-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Billing Dashboard</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Revenue tracking, subscription management, and payment processing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Revenue</h3>
                  <p className="text-2xl font-bold text-green-600">$25,600</p>
                  <p className="text-sm text-slate-500">+12% from last month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Paying Customers</h3>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-slate-500">+3 new this month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Average Revenue</h3>
                  <p className="text-2xl font-bold text-purple-600">$2,133</p>
                  <p className="text-sm text-slate-500">Per customer</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">System Analytics</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Usage patterns, performance metrics, and growth insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Contractor Management</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspections</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Planning</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Citizen Reports</span>
                    <span className="font-medium">91%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>New Signups (30d)</span>
                    <span className="font-medium text-green-600">+24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Rate</span>
                    <span className="font-medium">2.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upgrade Rate</span>
                    <span className="font-medium text-green-600">18.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support Tickets</span>
                    <span className="font-medium">42</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">System Settings</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Global configuration, maintenance, and system administration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={() => exportData('all')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Sample Data
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Optimize Database
                </Button>
                <Button variant="destructive" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Maintenance Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

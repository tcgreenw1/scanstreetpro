import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  CreditCard, 
  BarChart3, 
  Shield,
  Settings,
  Database,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowRight,
  Globe,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface DashboardStats {
  totalOrganizations: number;
  totalUsers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  planDistribution: { free: number; basic: number; pro: number; premium: number };
  recentSignups: number;
  activeTrials: number;
}

const AdminPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      title: "Organization Management",
      description: "Manage organizations, plans, and subscriptions",
      icon: Building2,
      path: "/admin/organizations",
      color: "from-blue-500 to-cyan-500",
      stats: `${stats?.totalOrganizations || 0} organizations`,
      features: ["View & Edit Organizations", "Deactivate Organizations", "Plan Management", "Impersonate Users"]
    },
    {
      title: "User Management", 
      description: "Manage users, roles, and permissions",
      icon: Users,
      path: "/admin/users",
      color: "from-purple-500 to-pink-500",
      stats: `${stats?.totalUsers || 0} users`,
      features: ["User Administration", "Role Management", "Account Status", "Security Settings"]
    },
    {
      title: "Financial Management",
      description: "Revenue tracking, billing, and financial analytics",
      icon: DollarSign,
      path: "/admin/financials",
      color: "from-green-500 to-emerald-500",
      stats: `$${stats?.monthlyRevenue || 0}/month`,
      features: ["Revenue Analytics", "Billing Management", "Payment Processing", "Financial Reports"]
    },
    {
      title: "System Analytics",
      description: "Platform metrics, usage analytics, and insights",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "from-orange-500 to-red-500",
      stats: `${stats?.recentSignups || 0} new signups`,
      features: ["Usage Metrics", "Performance Analytics", "Growth Tracking", "Custom Reports"]
    },
    {
      title: "System Settings",
      description: "Configuration, security, and system administration",
      icon: Settings,
      path: "/admin/settings",
      color: "from-gray-500 to-slate-500",
      stats: "System health",
      features: ["Global Settings", "Security Configuration", "API Management", "System Monitoring"]
    },
    {
      title: "Database Management",
      description: "Database operations, backups, and maintenance",
      icon: Database,
      path: "/admin/database",
      color: "from-indigo-500 to-purple-500",
      stats: "Connected",
      features: ["Database Health", "Backup Management", "Migration Tools", "Data Export"]
    }
  ];

  return (
    <div className="min-h-screen admin-liquid-glass">
      {/* Apple Liquid Glass Background */}
      <div className="fixed inset-0 admin-glass-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="admin-glass-card rounded-3xl p-8 border border-white/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Admin Portal
                  </h1>
                  <p className="text-slate-600 text-lg">System Administration & Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <Activity className="w-3 h-3 mr-1" />
                  System Online
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Admin Access
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">{user.name}</p>
              <p className="text-slate-600">{user.email}</p>
              <p className="text-sm text-slate-500 mt-1">Last login: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Organizations</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.totalOrganizations}</p>
                  <p className="text-xs text-slate-500">+{stats.recentSignups} this month</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Users</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
                  <p className="text-xs text-slate-500">{stats.activeTrials} active trials</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-slate-800">${stats.monthlyRevenue}</p>
                  <p className="text-xs text-slate-500">Total: ${stats.totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Growth</p>
                  <p className="text-3xl font-bold text-slate-800">+15.2%</p>
                  <p className="text-xs text-slate-500">vs last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.path}
                className="admin-glass-card rounded-3xl p-8 border border-white/20 backdrop-blur-xl hover:border-white/30 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-2xl"
                onClick={() => navigate(section.path)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-2">{section.title}</h3>
                <p className="text-slate-600 mb-4">{section.description}</p>

                <div className="flex items-center justify-between mb-6">
                  <Badge className="bg-white/50 text-slate-700 border-white/30">
                    {section.stats}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {section.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* System Status */}
        <div className="admin-glass-card rounded-3xl p-8 border border-white/20 backdrop-blur-xl">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-slate-800">Database</p>
                <p className="text-sm text-slate-600">Connected & Healthy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-slate-800">API Services</p>
                <p className="text-sm text-slate-600">All Systems Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-slate-800">Scheduled Maintenance</p>
                <p className="text-sm text-slate-600">Sunday 2:00 AM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;

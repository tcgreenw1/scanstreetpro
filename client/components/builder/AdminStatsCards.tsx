'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  Activity,
  CreditCard,
  Calendar,
  BarChart3
} from "lucide-react";

interface AdminStatsCardsProps {
  layout?: string;
  showTrends?: boolean;
}

interface StatsData {
  totalOrganizations: number;
  totalUsers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  totalTransactions: number;
  planDistribution: Record<string, number>;
  trends: {
    organizations: number;
    users: number;
    revenue: number;
  };
}

export const AdminStatsCards = ({ 
  layout = 'grid',
  showTrends = true 
}: AdminStatsCardsProps) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('neon_auth_token');
  };

  // Load stats data
  const loadStats = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load stats');
      }

      // Add mock trend data
      const statsWithTrends = {
        ...data.data,
        trends: {
          organizations: 12.5,
          users: 8.3,
          revenue: 15.7
        }
      };

      setStats(statsWithTrends);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTrend = (trend: number) => {
    const isPositive = trend > 0;
    return {
      value: `${isPositive ? '+' : ''}${trend.toFixed(1)}%`,
      color: isPositive ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600',
      icon: isPositive ? TrendingUp : TrendingUp // Always use TrendingUp for simplicity
    };
  };

  const statCards = [
    {
      title: "Total Organizations",
      value: stats?.totalOrganizations || 0,
      icon: Building,
      description: "Registered organizations",
      trend: stats?.trends.organizations || 0,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      description: "Across all organizations",
      trend: stats?.trends.users || 0,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats?.monthlyRevenue || 0),
      icon: DollarSign,
      description: "Current month",
      trend: stats?.trends.revenue || 0,
      color: "text-purple-600"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: TrendingUp,
      description: `${stats?.totalTransactions || 0} transactions`,
      trend: 0,
      color: "text-orange-600"
    }
  ];

  if (loading) {
    return (
      <div className={`grid gap-4 ${layout === 'grid' ? 'md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600">
        Error loading stats: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className={`grid gap-4 ${layout === 'grid' ? 'md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          const trendData = showTrends ? formatTrend(stat.trend) : null;
          const TrendIcon = trendData?.icon;
          
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  {showTrends && trendData && stat.trend !== 0 && (
                    <div className={`flex items-center space-x-1 ${trendData.color}`}>
                      <TrendIcon className="h-3 w-3" />
                      <span className="text-xs font-medium">{trendData.value}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Plan Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Plan Distribution</span>
            </CardTitle>
            <CardDescription>Current subscription breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.planDistribution).map(([plan, count]) => {
                const getPlanColor = (planName: string) => {
                  switch (planName) {
                    case 'free': return 'bg-gray-100 text-gray-800';
                    case 'basic': return 'bg-blue-100 text-blue-800';
                    case 'pro': return 'bg-purple-100 text-purple-800';
                    case 'premium': return 'bg-yellow-100 text-yellow-800';
                    default: return 'bg-gray-100 text-gray-800';
                  }
                };

                const percentage = stats.totalOrganizations > 0 
                  ? ((count / stats.totalOrganizations) * 100).toFixed(1)
                  : 0;

                return (
                  <div key={plan} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground mb-2">{percentage}%</div>
                    <Badge className={getPlanColor(plan)}>
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              New signups and activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Total weekly activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Success</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

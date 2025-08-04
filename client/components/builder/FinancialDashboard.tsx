'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  RefreshCw,
  Building,
  BarChart3,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface FinancialDashboardProps {
  currency?: string;
  showTrends?: boolean;
  timeRange?: string;
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

export const FinancialDashboard = ({ 
  currency = 'USD',
  showTrends = true,
  timeRange = '12months'
}: FinancialDashboardProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  // Load financial data
  const loadFinancialData = async () => {
    try {
      setLoading(true);
      
      // Load transactions and analytics in parallel
      const [transactionsResult, analyticsResult] = await Promise.all([
        apiCall('/api/admin/transactions?limit=50'),
        apiCall('/api/admin/revenue-analytics')
      ]);
      
      setTransactions(transactionsResult.data?.transactions || []);
      setAnalytics(analyticsResult.data || null);
    } catch (error: any) {
      console.error('Failed to load financial data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary metrics
  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'completed' && (t.type === 'payment' || t.type === 'upgrade'))
    .reduce((sum, t) => sum + (t.amount / 100), 0);

  const totalRefunds = filteredTransactions
    .filter(t => t.status === 'completed' && t.type === 'refund')
    .reduce((sum, t) => sum + (t.amount / 100), 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Dashboard</h2>
          <p className="text-muted-foreground">
            Revenue analytics and transaction management
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadFinancialData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredTransactions.filter(t => t.status === 'completed').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRefunds)}</div>
            <p className="text-xs text-muted-foreground">
              Total refunded amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue - totalRefunds)}</div>
            <p className="text-xs text-muted-foreground">
              After refunds and chargebacks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      {showTrends && analytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Plan Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Plan (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.planRevenue.map((item) => (
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
                {analytics.topCustomers.slice(0, 5).map((customer, index) => (
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
      {showTrends && analytics && analytics.monthlyTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.monthlyTrend.map((month) => (
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

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest financial transactions</CardDescription>
          
          {/* Filters */}
          <div className="flex space-x-4 mt-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="upgrade">Upgrade</SelectItem>
                <SelectItem value="downgrade">Downgrade</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(transaction.created_at)}
                      </div>
                    </TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

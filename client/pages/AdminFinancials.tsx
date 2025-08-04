import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Download, 
  RefreshCw,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Transaction {
  id: string;
  organization_name: string;
  type: 'payment' | 'refund' | 'upgrade' | 'downgrade';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  plan: string;
  created_at: string;
  description?: string;
}

interface FinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingRevenue: number;
  refundedAmount: number;
  planRevenue: {
    plan: string;
    revenue: number;
    transactions: number;
  }[];
  monthlyTrend: {
    month: string;
    revenue: number;
    transactions: number;
  }[];
}

const AdminFinancials = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadFinancialData();
    }
  }, [user]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/transactions'),
        fetch('/api/admin/revenue-analytics')
      ]);

      const [transactionsData, analyticsData] = await Promise.all([
        transactionsRes.json(),
        analyticsRes.json()
      ]);

      if (transactionsData.success) {
        setTransactions(transactionsData.data.transactions || []);
      }

      if (analyticsData.success) {
        const data = analyticsData.data;
        setStats({
          totalRevenue: data.planRevenue?.reduce((sum: number, p: any) => sum + p.revenue, 0) || 0,
          monthlyRevenue: 0, // This would be calculated from recent transactions
          pendingRevenue: 0, // This would be calculated from pending transactions
          refundedAmount: 0, // This would be calculated from refund transactions
          planRevenue: data.planRevenue || [],
          monthlyTrend: data.monthlyTrend || []
        });
      }

    } catch (error) {
      console.error('Failed to load financial data:', error);
      toast({ title: "Error", description: "Failed to load financial data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const exportTransactions = async () => {
    try {
      const response = await fetch('/api/export/transactions');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'transactions-export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Success", description: "Transactions exported successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Export failed", variant: "destructive" });
    }
  };

  const processRefund = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/admin/transactions/${transactionId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ title: "Success", description: "Refund processed successfully" });
        loadFinancialData();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to process refund", variant: "destructive" });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upgrade': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'downgrade': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'refund': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-liquid-glass">
      <div className="fixed inset-0 admin-glass-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="admin-glass-card rounded-3xl p-8 border border-white/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Button
                  onClick={() => navigate('/admin-portal')}
                  className="admin-glass-button rounded-xl"
                  variant="ghost"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin Portal
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Financial Management
                  </h1>
                  <p className="text-slate-600 text-lg">Revenue tracking, billing, and financial analytics</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">${stats?.totalRevenue || 0}</p>
              <p className="text-slate-600">Total Revenue</p>
              <p className="text-sm text-slate-500">{transactions.length} transactions</p>
            </div>
          </div>
        </div>

        {/* Financial Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-800">${stats.totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+12.5% from last month</span>
              </div>
            </div>

            <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-slate-800">${stats.monthlyRevenue}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-600">Current month</span>
              </div>
            </div>

            <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Revenue</p>
                  <p className="text-3xl font-bold text-slate-800">${stats.pendingRevenue}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-600">Processing</span>
              </div>
            </div>

            <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Refunded</p>
                  <p className="text-3xl font-bold text-slate-800">${stats.refundedAmount}</p>
                </div>
                <CreditCard className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">This month</span>
              </div>
            </div>
          </div>
        )}

        {/* Plan Revenue Breakdown */}
        {stats?.planRevenue && (
          <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Revenue by Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.planRevenue.map((plan) => (
                <div key={plan.plan} className="admin-glass-card rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 capitalize">{plan.plan}</span>
                    <Badge className="admin-glass-badge text-slate-700">
                      {plan.transactions} txns
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">${plan.revenue}</p>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" 
                      style={{ width: `${(plan.revenue / (stats.totalRevenue || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-glass-input"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 admin-glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="admin-glass-modal">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 admin-glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="admin-glass-modal">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="downgrade">Downgrade</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadFinancialData} className="admin-glass-button gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={exportTransactions} className="admin-glass-button gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="admin-glass-card rounded-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold text-slate-800">Recent Transactions</h3>
            <p className="text-slate-600">Latest payment and subscription activities</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading transactions...</p>
            </div>
          ) : (
            <div className="admin-glass-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-800 font-semibold">Organization</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Type</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Amount</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Plan</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Status</TableHead>
                    <TableHead className="text-slate-800 font-semibold">Date</TableHead>
                    <TableHead className="text-slate-800 font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">No transactions found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-white/5">
                        <TableCell className="font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-500" />
                            {transaction.organization_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeBadgeColor(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-slate-800">
                          ${transaction.amount}
                        </TableCell>
                        <TableCell className="text-slate-700 capitalize">
                          {transaction.plan}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(transaction.status)}>
                            {transaction.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {transaction.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.status === 'completed' && transaction.type === 'payment' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => processRefund(transaction.id)}
                              className="admin-glass-button text-xs"
                            >
                              Refund
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFinancials;

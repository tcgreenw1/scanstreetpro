import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Target,
  Wallet,
  Crown,
  Plus,
  Filter,
  Download,
  Eye,
  ChevronUp,
  ChevronDown,
  ArrowUpRight
} from "lucide-react";
import {
  budgetOverview,
  yearlySpending,
  spendingTrends,
  spendingDistribution,
  upcomingDeadlines,
} from "@/lib/mock-data";

// Enhanced color palette for premium look
const colors = {
  primary: '#3B82F6',
  secondary: '#10B981', 
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  gradients: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ]
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border-white/20 p-4 shadow-xl">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${typeof entry.value === 'number' ? 
              new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry.value) : 
              entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Enhanced deadline data with priorities
const enhancedDeadlines = upcomingDeadlines.map((deadline, index) => ({
  ...deadline,
  priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
  progress: Math.floor(Math.random() * 100),
  assignee: ['John Smith', 'Sarah Johnson', 'Mike Rodriguez'][Math.floor(Math.random() * 3)]
}));

export default function Dashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDeadlineStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Budget Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Infrastructure budget overview for {budgetOverview.currentYear}
          </p>
          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            Free Plan - Limited Analytics
          </Badge>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link to="/pricing">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              title="See pricing and included features"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade for Advanced Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Budget</CardTitle>
            <Wallet className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {formatCurrency(budgetOverview.totalBudget)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Fiscal year {budgetOverview.currentYear}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Available Funds</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {formatCurrency(budgetOverview.availableFunds)}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {((budgetOverview.availableFunds / budgetOverview.totalBudget) * 100).toFixed(1)}% remaining
              </p>
              <ChevronUp className="w-3 h-3 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Spent This Year</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{budgetOverview.percentSpent}%</div>
            <Progress value={budgetOverview.percentSpent} className="mt-3 h-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {formatCurrency(budgetOverview.spentAmount)} of {formatCurrency(budgetOverview.totalBudget)}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Projects</CardTitle>
            <Target className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">12</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                8 in progress, 4 planning
              </p>
              <ArrowUpRight className="w-3 h-3 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enhanced Bar Chart */}
        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 dark:text-white">5-Year Funding vs Spending</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Annual budget allocation and actual spending comparison
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={yearlySpending} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="fundingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000000}M`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="funding" 
                  fill="url(#fundingGradient)" 
                  name="Budget Allocated" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
                <Bar 
                  dataKey="spending" 
                  fill="url(#spendingGradient)" 
                  name="Actual Spending" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationDelay={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enhanced Pie Chart */}
        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 dark:text-white">Spending Distribution</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Current year spending by category
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <defs>
                  {spendingDistribution.map((entry, index) => (
                    <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={spendingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${percentage}%`}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="amount"
                  animationDuration={1000}
                >
                  {spendingDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${index})`}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Area Chart */}
      <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-800 dark:text-white">Road Maintenance Spending Trend</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Annual road maintenance expenditure with trend analysis
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <Crown className="w-3 h-3 mr-1" />
                Premium Feature
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={spendingTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
              <XAxis 
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value / 1000000}M`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#F59E0B"
                strokeWidth={3}
                fill="url(#areaGradient)"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enhanced Upcoming Deadlines */}
      <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-slate-800 dark:text-white">Upcoming Deadlines</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Critical dates, milestones, and progress tracking
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Deadline
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enhancedDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="group p-4 glass-card border-white/20 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                      <h4 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                        {deadline.title}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Due:</span> {formatDate(deadline.date)}
                        {deadline.amount && (
                          <span className="block font-medium text-green-600">
                            {formatCurrency(deadline.amount)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Assigned:</span> {deadline.assignee}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Progress:</span> {deadline.progress}%
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Progress</span>
                        <span className="text-xs text-slate-500">{deadline.progress}%</span>
                      </div>
                      <Progress value={deadline.progress} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className={getPriorityColor(deadline.priority)}>
                      {deadline.priority === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300">
                      {deadline.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-500" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">Premium Deadline Management</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Upgrade to access advanced deadline tracking, automated alerts, team collaboration, and project timeline integration.
                </p>
              </div>
              <Link to="/pricing">
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  title="See pricing and included features"
                >
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

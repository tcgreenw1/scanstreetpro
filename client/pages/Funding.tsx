import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";
import {
  Banknote,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Crown,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  DollarSign,
  Building,
  Receipt,
  CreditCard,
  PiggyBank,
  FileText,
  Bell,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

interface FundingSource {
  id: string;
  name: string;
  type: 'sales-tax' | 'grant' | 'bond' | 'assessment' | 'federal' | 'state';
  amount: number;
  allocatedAmount: number;
  availableAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'expired' | 'approved';
  restrictions: string[];
  deadline?: string;
  renewalDate?: string;
}

interface Grant {
  id: string;
  name: string;
  agency: string;
  amount: number;
  deadline: string;
  status: 'available' | 'applied' | 'awarded' | 'expired';
  matchRequired: boolean;
  matchAmount?: number;
  category: string;
  description: string;
}

interface BudgetScenario {
  id: string;
  name: string;
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  fundingSources: string[];
  createdDate: string;
}

const fundingSources: FundingSource[] = [
  {
    id: 'ST001',
    name: 'Municipal Sales Tax',
    type: 'sales-tax',
    amount: 2500000,
    allocatedAmount: 1800000,
    availableAmount: 700000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    restrictions: ['Infrastructure only', 'Must be spent within fiscal year']
  },
  {
    id: 'FG001',
    name: 'Federal Highway Administration Grant',
    type: 'federal',
    amount: 1200000,
    allocatedAmount: 800000,
    availableAmount: 400000,
    startDate: '2024-02-01',
    endDate: '2026-01-31',
    status: 'active',
    restrictions: ['Highway projects only', 'Requires environmental review']
  },
  {
    id: 'IB001',
    name: 'Infrastructure Improvement Bonds',
    type: 'bond',
    amount: 5000000,
    allocatedAmount: 2300000,
    availableAmount: 2700000,
    startDate: '2024-01-01',
    endDate: '2029-12-31',
    status: 'active',
    restrictions: ['Capital improvements only', '20-year repayment term']
  },
  {
    id: 'SG001',
    name: 'State Transportation Grant',
    type: 'state',
    amount: 800000,
    allocatedAmount: 600000,
    availableAmount: 200000,
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    status: 'active',
    restrictions: ['Roads and bridges only'],
    renewalDate: '2025-01-15'
  }
];

const availableGrants: Grant[] = [
  {
    id: 'AG001',
    name: 'Resilient Infrastructure Grant',
    agency: 'Department of Transportation',
    amount: 2000000,
    deadline: '2024-06-30',
    status: 'available',
    matchRequired: true,
    matchAmount: 400000,
    category: 'Infrastructure',
    description: 'Funding for climate-resilient transportation infrastructure improvements'
  },
  {
    id: 'AG002',
    name: 'Safe Routes to School',
    agency: 'Federal Highway Administration',
    amount: 500000,
    deadline: '2024-05-15',
    status: 'applied',
    matchRequired: false,
    category: 'Safety',
    description: 'Pedestrian and bicycle infrastructure around schools'
  },
  {
    id: 'AG003',
    name: 'Rural Infrastructure Development',
    agency: 'USDA Rural Development',
    amount: 1500000,
    deadline: '2024-08-01',
    status: 'available',
    matchRequired: true,
    matchAmount: 300000,
    category: 'Rural Development',
    description: 'Infrastructure improvements for rural communities'
  }
];

const fundingBreakdown = [
  { name: 'Sales Tax', value: 2500000, color: '#3B82F6' },
  { name: 'Federal Grants', value: 1200000, color: '#10B981' },
  { name: 'State Grants', value: 800000, color: '#F59E0B' },
  { name: 'Bonds', value: 5000000, color: '#8B5CF6' },
  { name: 'Assessments', value: 300000, color: '#EF4444' }
];

const monthlyRevenue = [
  { month: 'Jan', salesTax: 208000, grants: 100000, bonds: 0, assessments: 25000 },
  { month: 'Feb', salesTax: 195000, grants: 200000, bonds: 1000000, assessments: 25000 },
  { month: 'Mar', salesTax: 212000, grants: 150000, bonds: 500000, assessments: 25000 },
  { month: 'Apr', salesTax: 225000, grants: 100000, bonds: 0, assessments: 25000 },
  { month: 'May', salesTax: 238000, grants: 0, bonds: 0, assessments: 25000 },
  { month: 'Jun', salesTax: 245000, grants: 300000, bonds: 1500000, assessments: 25000 }
];

export default function Funding() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [scenarios, setScenarios] = useState<BudgetScenario[]>([
    {
      id: 'SC001',
      name: 'Conservative Budget',
      totalRevenue: 8500000,
      totalExpenses: 7800000,
      balance: 700000,
      fundingSources: ['ST001', 'SG001'],
      createdDate: '2024-04-01'
    }
  ]);
  const { currentPlan } = usePricing();

  const totalAvailableFunding = fundingSources.reduce((sum, source) => sum + source.availableAmount, 0);
  const totalAllocatedFunding = fundingSources.reduce((sum, source) => sum + source.allocatedAmount, 0);
  const totalFunding = fundingSources.reduce((sum, source) => sum + source.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'expired':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getGrantStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Available</Badge>;
      case 'applied':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Applied</Badge>;
      case 'awarded':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Awarded</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'sales-tax':
        return <Receipt className="w-5 h-5 text-blue-600" />;
      case 'grant':
      case 'federal':
      case 'state':
        return <Building className="w-5 h-5 text-green-600" />;
      case 'bond':
        return <PiggyBank className="w-5 h-5 text-purple-600" />;
      case 'assessment':
        return <CreditCard className="w-5 h-5 text-orange-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-slate-600" />;
    }
  };

  const createScenario = () => {
    if (currentPlan === 'free' && scenarios.length >= 1) {
      alert('Free plan allows only 1 budget scenario. Upgrade to create unlimited scenarios.');
      return;
    }
    const newScenario: BudgetScenario = {
      id: `SC${String(scenarios.length + 1).padStart(3, '0')}`,
      name: `Scenario ${scenarios.length + 1}`,
      totalRevenue: 0,
      totalExpenses: 0,
      balance: 0,
      fundingSources: [],
      createdDate: new Date().toISOString().split('T')[0]
    };
    setScenarios([...scenarios, newScenario]);
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Municipal Funding Center
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Track revenue streams, manage grants, monitor deadlines, and plan multi-year funding strategies for infrastructure investments.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300">
            ${totalAvailableFunding.toLocaleString()} Available
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            {scenarios.length}/1 Scenarios {currentPlan === 'free' ? '(Free Plan)' : '(Unlimited)'}
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 glass-card border-white/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Funding Sources</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="planning">Scenario Planning</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Funding</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      ${totalFunding.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">All sources</p>
                  </div>
                  <Banknote className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Available</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${totalAvailableFunding.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Unallocated</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Allocated</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${totalAllocatedFunding.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Committed</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Utilization</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      {Math.round((totalAllocatedFunding / totalFunding) * 100)}%
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Of total funding</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funding Breakdown Chart */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-white">Funding Breakdown</CardTitle>
                <CardDescription>Distribution of funding sources by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fundingBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {fundingBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Timeline */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-white">Monthly Revenue Timeline</CardTitle>
                <CardDescription>Revenue flow by source over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000)}K`} />
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Bar dataKey="salesTax" stackId="a" fill="#3B82F6" name="Sales Tax" />
                      <Bar dataKey="grants" stackId="a" fill="#10B981" name="Grants" />
                      <Bar dataKey="bonds" stackId="a" fill="#8B5CF6" name="Bonds" />
                      <Bar dataKey="assessments" stackId="a" fill="#EF4444" name="Assessments" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Funding Sources</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Funding Source</DialogTitle>
                  <DialogDescription>
                    Create a new funding source for infrastructure projects
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="source-name">Source Name</Label>
                      <Input id="source-name" placeholder="e.g., Municipal Sales Tax" required />
                    </div>
                    <div>
                      <Label htmlFor="source-type">Source Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales-tax">Sales Tax</SelectItem>
                          <SelectItem value="federal">Federal Grant</SelectItem>
                          <SelectItem value="state">State Grant</SelectItem>
                          <SelectItem value="bond">Bond</SelectItem>
                          <SelectItem value="assessment">Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="total-amount">Total Amount</Label>
                      <Input id="total-amount" type="number" placeholder="2500000" required />
                    </div>
                    <div>
                      <Label htmlFor="available-amount">Available Amount</Label>
                      <Input id="available-amount" type="number" placeholder="700000" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="restrictions">Restrictions</Label>
                    <Textarea id="restrictions" placeholder="Infrastructure only, Must be spent within fiscal year" rows={3} />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit">Add Funding Source</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fundingSources.map((source) => (
              <Card key={source.id} className="glass-card border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getSourceIcon(source.type)}
                      <div>
                        <CardTitle className="text-lg text-slate-800 dark:text-white">{source.name}</CardTitle>
                        <CardDescription className="capitalize">{source.type.replace('-', ' ')}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(source.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400">Total</p>
                      <p className="font-bold text-slate-800 dark:text-white">${source.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400">Allocated</p>
                      <p className="font-bold text-blue-600">${source.allocatedAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-600 dark:text-slate-400">Available</p>
                      <p className="font-bold text-green-600">${source.availableAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilization</span>
                      <span>{Math.round((source.allocatedAmount / source.amount) * 100)}%</span>
                    </div>
                    <Progress value={(source.allocatedAmount / source.amount) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Period:</span>
                      <span>{new Date(source.startDate).toLocaleDateString()} - {new Date(source.endDate).toLocaleDateString()}</span>
                    </div>
                    {source.renewalDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Renewal:</span>
                        <span className={cn(
                          isDeadlineApproaching(source.renewalDate) ? "text-amber-600 font-medium" : ""
                        )}>
                          {new Date(source.renewalDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Restrictions:</p>
                    <div className="flex flex-wrap gap-1">
                      {source.restrictions.map((restriction, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grants" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Grant Opportunities</h2>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search Grants
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Grant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Grant Opportunity</DialogTitle>
                    <DialogDescription>
                      Add a new grant opportunity to track deadlines and requirements
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="grant-name">Grant Name</Label>
                      <Input id="grant-name" placeholder="e.g., Resilient Infrastructure Grant" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="grant-agency">Agency</Label>
                        <Input id="grant-agency" placeholder="e.g., Department of Transportation" required />
                      </div>
                      <div>
                        <Label htmlFor="grant-amount">Award Amount</Label>
                        <Input id="grant-amount" type="number" placeholder="2000000" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="grant-deadline">Application Deadline</Label>
                        <Input id="grant-deadline" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="grant-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="safety">Safety</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                            <SelectItem value="rural">Rural Development</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="match-required" />
                        <Label htmlFor="match-required">Match Required</Label>
                      </div>
                      <div>
                        <Label htmlFor="match-amount">Match Amount</Label>
                        <Input id="match-amount" type="number" placeholder="400000" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="grant-description">Description</Label>
                      <Textarea id="grant-description" placeholder="Funding for climate-resilient transportation infrastructure improvements" rows={3} required />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline">Cancel</Button>
                      <Button type="submit">Add Grant</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-4">
            {availableGrants.map((grant) => (
              <Card key={grant.id} className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{grant.name}</h3>
                        {getGrantStatusBadge(grant.status)}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-2">{grant.agency}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{grant.description}</p>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-2xl font-bold text-green-600">${grant.amount.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">Award Amount</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Deadline</p>
                      <p className={cn(
                        "text-sm",
                        isDeadlineApproaching(grant.deadline) ? "text-amber-600 font-medium" : "text-slate-600"
                      )}>
                        {new Date(grant.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</p>
                      <p className="text-sm text-slate-600">{grant.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Match Required</p>
                      <p className="text-sm text-slate-600">
                        {grant.matchRequired ? `Yes - $${grant.matchAmount?.toLocaleString()}` : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</p>
                      <p className="text-sm text-slate-600 capitalize">{grant.status}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {isDeadlineApproaching(grant.deadline) && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          <Bell className="w-3 h-3 mr-1" />
                          Deadline Soon
                        </Badge>
                      )}
                      {grant.matchRequired && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Match Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{grant.name}</DialogTitle>
                            <DialogDescription>{grant.agency}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-2">Grant Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Award Amount:</span>
                                    <span className="font-medium">${grant.amount.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Deadline:</span>
                                    <span className="font-medium">{new Date(grant.deadline).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Category:</span>
                                    <span className="font-medium">{grant.category}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Match Required:</span>
                                    <span className="font-medium">{grant.matchRequired ? `Yes - $${grant.matchAmount?.toLocaleString()}` : 'No'}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Application Status</h4>
                                <div className="space-y-2">
                                  {getGrantStatusBadge(grant.status)}
                                  <div className="text-sm text-slate-600">
                                    <p>Application documents required:</p>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      <li>Project proposal and timeline</li>
                                      <li>Budget breakdown and justification</li>
                                      <li>Environmental impact assessment</li>
                                      <li>Community benefit analysis</li>
                                      {grant.matchRequired && <li>Match funding documentation</li>}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-slate-600">{grant.description}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Eligibility Requirements</h4>
                              <div className="text-sm text-slate-600 space-y-1">
                                <p>• Municipality or authorized government entity</p>
                                <p>• Project must serve public infrastructure needs</p>
                                <p>• Demonstrated project management capability</p>
                                <p>• Environmental compliance documentation</p>
                                {grant.matchRequired && <p>• Ability to provide required matching funds</p>}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {grant.status === 'available' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Apply for {grant.name}</DialogTitle>
                              <DialogDescription>
                                Submit your application for this grant opportunity
                              </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="project-title">Project Title</Label>
                                  <Input id="project-title" placeholder="e.g., Main Street Infrastructure Upgrade" required />
                                </div>
                                <div>
                                  <Label htmlFor="requested-amount">Requested Amount</Label>
                                  <Input id="requested-amount" type="number" placeholder={grant.amount.toString()} max={grant.amount} required />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="project-description">Project Description</Label>
                                <Textarea id="project-description" placeholder="Describe your project, its scope, and expected outcomes..." rows={4} required />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="project-start">Project Start Date</Label>
                                  <Input id="project-start" type="date" required />
                                </div>
                                <div>
                                  <Label htmlFor="project-end">Project End Date</Label>
                                  <Input id="project-end" type="date" required />
                                </div>
                              </div>
                              {grant.matchRequired && (
                                <div>
                                  <Label htmlFor="match-source">Match Funding Source</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select funding source for match" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {fundingSources.map((source) => (
                                        <SelectItem key={source.id} value={source.id}>
                                          {source.name} - ${source.availableAmount.toLocaleString()} available
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              <div>
                                <Label htmlFor="community-benefit">Community Benefit Statement</Label>
                                <Textarea id="community-benefit" placeholder="Explain how this project will benefit the community..." rows={3} required />
                              </div>
                              <div>
                                <Label>Required Documents</Label>
                                <div className="space-y-2 mt-2">
                                  <div className="flex items-center space-x-2">
                                    <input type="file" id="proposal-doc" accept=".pdf,.doc,.docx" />
                                    <Label htmlFor="proposal-doc" className="text-sm">Project Proposal</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input type="file" id="budget-doc" accept=".pdf,.xlsx,.csv" />
                                    <Label htmlFor="budget-doc" className="text-sm">Budget Documentation</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input type="file" id="environmental-doc" accept=".pdf,.doc,.docx" />
                                    <Label htmlFor="environmental-doc" className="text-sm">Environmental Assessment</Label>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Application Checklist</h5>
                                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                                  <label className="flex items-center space-x-2">
                                    <input type="checkbox" required />
                                    <span>I confirm that all project information is accurate</span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input type="checkbox" required />
                                    <span>I have read and understand the grant requirements</span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input type="checkbox" required />
                                    <span>I confirm our organization meets eligibility criteria</span>
                                  </label>
                                  {grant.matchRequired && (
                                    <label className="flex items-center space-x-2">
                                      <input type="checkbox" required />
                                      <span>I confirm we can provide the required matching funds</span>
                                    </label>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline">Save Draft</Button>
                                <Button type="submit">Submit Application</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Budget Scenario Planning</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={currentPlan === 'free' && scenarios.length >= 1}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Scenario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Budget Scenario</DialogTitle>
                  <DialogDescription>
                    Create a new budget scenario to model different funding strategies
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); createScenario(); }}>
                  <div>
                    <Label htmlFor="scenario-name">Scenario Name</Label>
                    <Input id="scenario-name" placeholder="e.g., Aggressive Maintenance Plan" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="total-revenue">Total Revenue</Label>
                      <Input id="total-revenue" type="number" placeholder="8500000" required />
                    </div>
                    <div>
                      <Label htmlFor="total-expenses">Total Expenses</Label>
                      <Input id="total-expenses" type="number" placeholder="7800000" required />
                    </div>
                  </div>
                  <div>
                    <Label>Select Funding Sources</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {fundingSources.map((source) => (
                        <label key={source.id} className="flex items-center space-x-2">
                          <input type="checkbox" value={source.id} />
                          <span className="text-sm">{source.name} - ${source.availableAmount.toLocaleString()} available</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="scenario-description">Description</Label>
                    <Textarea id="scenario-description" placeholder="Describe the key assumptions and goals for this scenario..." rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="planning-period">Planning Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select planning period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="3-year">3 Years</SelectItem>
                        <SelectItem value="5-year">5 Years</SelectItem>
                        <SelectItem value="10-year">10 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Scenario Summary</h5>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Projected Revenue:</span>
                        <span id="projected-revenue">$0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projected Expenses:</span>
                        <span id="projected-expenses">$0</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Net Balance:</span>
                        <span id="net-balance">$0</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit">Create Scenario</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">{scenario.name}</CardTitle>
                  <CardDescription>Created {new Date(scenario.createdDate).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</span>
                      <span className="font-medium text-green-600">${scenario.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Total Expenses</span>
                      <span className="font-medium text-red-600">${scenario.totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Balance</span>
                      <span className={cn(
                        "font-bold",
                        scenario.balance >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        ${scenario.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Funding Sources</p>
                    <div className="space-y-1">
                      {scenario.fundingSources.length > 0 ? (
                        scenario.fundingSources.map(sourceId => {
                          const source = fundingSources.find(s => s.id === sourceId);
                          return source ? (
                            <div key={sourceId} className="text-xs text-slate-600 dark:text-slate-400">
                              {source.name}
                            </div>
                          ) : null;
                        })
                      ) : (
                        <p className="text-xs text-slate-500">No sources assigned</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add scenario placeholder */}
            {currentPlan !== 'free' && (
              <Card className="glass-card border-white/20 border-dashed">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <Plus className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-center">
                    Create additional scenarios to compare different funding strategies
                  </p>
                  <Button onClick={createScenario} className="mt-4">
                    Create New Scenario
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reports & Export</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <h4 className="font-medium mb-2 flex items-center text-slate-800 dark:text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Funding Summary Report
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Complete overview of all funding sources and utilization
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Generate and download PDF report
                    const reportData = {
                      title: 'Funding Summary Report',
                      date: new Date().toLocaleDateString(),
                      totalFunding: totalFunding,
                      availableFunding: totalAvailableFunding,
                      allocatedFunding: totalAllocatedFunding,
                      sources: fundingSources,
                      grants: availableGrants,
                      scenarios: scenarios
                    };

                    // In a real implementation, this would call a service to generate PDF
                    console.log('Generating PDF report...', reportData);

                    // Mock download
                    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `funding-summary-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    alert('PDF report functionality would be implemented with a proper PDF library like jsPDF or server-side generation.');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <h4 className="font-medium mb-2 flex items-center text-slate-800 dark:text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Grant Calendar
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Deadlines and application schedules for all grants
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Generate grant calendar data
                    const calendarData = availableGrants.map(grant => ({
                      'Grant Name': grant.name,
                      'Agency': grant.agency,
                      'Amount': grant.amount,
                      'Deadline': grant.deadline,
                      'Status': grant.status,
                      'Category': grant.category,
                      'Match Required': grant.matchRequired ? 'Yes' : 'No',
                      'Match Amount': grant.matchAmount || 0
                    }));

                    // Convert to CSV format
                    const headers = Object.keys(calendarData[0] || {});
                    const csvContent = [
                      headers.join(','),
                      ...calendarData.map(row =>
                        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
                      )
                    ].join('\n');

                    // Download CSV
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `grant-calendar-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Calendar
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <h4 className="font-medium mb-2 flex items-center text-slate-800 dark:text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Revenue Projection
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Multi-year revenue forecasts and trends
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Generate revenue projection data
                    const forecastData = monthlyRevenue.map(month => ({
                      'Month': month.month,
                      'Sales Tax': month.salesTax,
                      'Grants': month.grants,
                      'Bonds': month.bonds,
                      'Assessments': month.assessments,
                      'Total': month.salesTax + month.grants + month.bonds + month.assessments
                    }));

                    // Add projection for next 6 months
                    const projectionMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                    projectionMonths.forEach(month => {
                      forecastData.push({
                        'Month': `${month} (Projected)`,
                        'Sales Tax': Math.round(forecastData[forecastData.length - 6]?.['Sales Tax'] * 1.05) || 220000,
                        'Grants': Math.round((Math.random() * 200000)),
                        'Bonds': Math.round((Math.random() * 1000000)),
                        'Assessments': 25000,
                        'Total': 0
                      });
                      // Calculate total
                      const lastRow = forecastData[forecastData.length - 1];
                      lastRow.Total = lastRow['Sales Tax'] + lastRow.Grants + lastRow.Bonds + lastRow.Assessments;
                    });

                    // Convert to CSV
                    const headers = Object.keys(forecastData[0]);
                    const csvContent = [
                      headers.join(','),
                      ...forecastData.map(row =>
                        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
                      )
                    ].join('\n');

                    // Download CSV
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `revenue-forecast-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Forecast
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Premium Features Notice */}
      {currentPlan === 'free' && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Unlock Advanced Funding Management
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to access unlimited budget scenarios, automated grant tracking, deadline notifications, 
                federal database integration, advanced reporting, and multi-year financial planning tools.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Unlimited Scenarios</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Create and compare multiple plans</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Bell className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Grant Alerts</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automated deadline notifications</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Advanced Analytics</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Multi-year forecasting & trends</p>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/pricing'}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade for Advanced Funding Tools
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

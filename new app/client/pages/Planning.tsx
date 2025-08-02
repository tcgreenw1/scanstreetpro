import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Crown,
  Download,
  Save,
  Calculator,
  Target,
  Building,
  Package,
  Wrench,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

interface BudgetGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  timeframe: number; // years
  priority: 'high' | 'medium' | 'low';
  category: 'roads' | 'bridges' | 'sidewalks' | 'drainage' | 'general';
}

interface PCIProjection {
  year: number;
  currentScenario: number;
  optimizedScenario: number;
  averageCondition: string;
  maintenanceCost: number;
  reconstructionCost: number;
}

interface FundingScenario {
  id: string;
  name: string;
  salesTax: number;
  grants: number;
  bonds: number;
  specialAssessments: number;
  totalRevenue: number;
  isActive: boolean;
}

const budgetGoals: BudgetGoal[] = [
  {
    id: 'BG001',
    name: 'Main Street Reconstruction',
    targetAmount: 2500000,
    currentAmount: 850000,
    timeframe: 3,
    priority: 'high',
    category: 'roads'
  },
  {
    id: 'BG002',
    name: 'Downtown Sidewalk Improvements',
    targetAmount: 1200000,
    currentAmount: 400000,
    timeframe: 2,
    priority: 'medium',
    category: 'sidewalks'
  },
  {
    id: 'BG003',
    name: 'Bridge Inspection & Repairs',
    targetAmount: 800000,
    currentAmount: 200000,
    timeframe: 5,
    priority: 'high',
    category: 'bridges'
  }
];

const fundingScenarios: FundingScenario[] = [
  {
    id: 'FS001',
    name: 'Conservative Plan',
    salesTax: 2500000,
    grants: 800000,
    bonds: 0,
    specialAssessments: 300000,
    totalRevenue: 3600000,
    isActive: true
  },
  {
    id: 'FS002',
    name: 'Bond Issuance Plan',
    salesTax: 2500000,
    grants: 1200000,
    bonds: 5000000,
    specialAssessments: 300000,
    totalRevenue: 9000000,
    isActive: false
  },
  {
    id: 'FS003',
    name: 'Grant-Heavy Plan',
    salesTax: 2500000,
    grants: 2800000,
    bonds: 1000000,
    specialAssessments: 500000,
    totalRevenue: 6800000,
    isActive: false
  }
];

const pciProjections: PCIProjection[] = [
  { year: 2024, currentScenario: 68, optimizedScenario: 72, averageCondition: 'Good', maintenanceCost: 1800000, reconstructionCost: 500000 },
  { year: 2025, currentScenario: 65, optimizedScenario: 74, averageCondition: 'Good', maintenanceCost: 2100000, reconstructionCost: 800000 },
  { year: 2026, currentScenario: 62, optimizedScenario: 75, averageCondition: 'Good', maintenanceCost: 2400000, reconstructionCost: 1200000 },
  { year: 2027, currentScenario: 58, optimizedScenario: 76, averageCondition: 'Fair', maintenanceCost: 2800000, reconstructionCost: 1800000 },
  { year: 2028, currentScenario: 54, optimizedScenario: 77, averageCondition: 'Fair', maintenanceCost: 3200000, reconstructionCost: 2500000 },
  { year: 2029, currentScenario: 50, optimizedScenario: 78, averageCondition: 'Poor', maintenanceCost: 3800000, reconstructionCost: 3500000 }
];

const materialCostData = [
  { material: 'Asphalt', currentCost: 95, projectedCost: 108, variance: 13.7 },
  { material: 'Concrete', currentCost: 125, projectedCost: 142, variance: 13.6 },
  { material: 'Aggregate', currentCost: 18, projectedCost: 21, variance: 16.7 },
  { material: 'Steel', currentCost: 850, projectedCost: 995, variance: 17.1 }
];

export default function Planning() {
  const [planningHorizon, setPlanningHorizon] = useState<5 | 10>(5);
  const [inflationRate, setInflationRate] = useState<number>(3.2);
  const [targetPCI, setTargetPCI] = useState<number>(75);
  const [selectedScenario, setSelectedScenario] = useState<string>('FS001');
  const [scenarios, setScenarios] = useState<FundingScenario[]>(fundingScenarios);
  const { currentPlan } = usePricing();

  const activeScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];
  const totalBudgetGoals = budgetGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const currentFunding = budgetGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const fundingGap = totalBudgetGoals - currentFunding;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'roads':
        return <Package className="w-4 h-4" />;
      case 'bridges':
        return <Building className="w-4 h-4" />;
      case 'sidewalks':
        return <Shield className="w-4 h-4" />;
      case 'drainage':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const toggleScenario = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => ({
      ...s,
      isActive: s.id === scenarioId
    })));
    setSelectedScenario(scenarioId);
  };

  const createScenario = () => {
    if (currentPlan === 'free' && scenarios.length >= 3) {
      alert('Free plan allows only 3 funding scenarios. Upgrade to create unlimited scenarios.');
      return;
    }
    const newScenario: FundingScenario = {
      id: `FS${String(scenarios.length + 1).padStart(3, '0')}`,
      name: `Custom Scenario ${scenarios.length + 1}`,
      salesTax: 2500000,
      grants: 0,
      bonds: 0,
      specialAssessments: 0,
      totalRevenue: 2500000,
      isActive: false
    };
    setScenarios([...scenarios, newScenario]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Multi-Year Budget Planning
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Strategic infrastructure investment planning with PCI forecasting, funding scenario analysis, and long-term capital improvement programming.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300">
            {planningHorizon}-Year Horizon
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            {scenarios.length}/3 Scenarios {currentPlan === 'free' ? '(Free Plan)' : '(Unlimited)'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Planning Parameters */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Calculator className="w-5 h-5 mr-2" />
                Planning Parameters
              </CardTitle>
              <CardDescription>Configure your planning assumptions and targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                    Planning Horizon: {planningHorizon} years
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={planningHorizon === 5 ? "default" : "outline"}
                      onClick={() => setPlanningHorizon(5)}
                      size="sm"
                    >
                      5 Years
                    </Button>
                    <Button 
                      variant={planningHorizon === 10 ? "default" : "outline"}
                      onClick={() => setPlanningHorizon(10)}
                      size="sm"
                    >
                      10 Years
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                    Target Network PCI: {targetPCI}
                  </Label>
                  <Slider
                    value={[targetPCI]}
                    onValueChange={(value) => setTargetPCI(value[0])}
                    max={100}
                    min={60}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Poor (60)</span>
                    <span>Excellent (100)</span>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                    Annual Inflation: {inflationRate}%
                  </Label>
                  <Slider
                    value={[inflationRate]}
                    onValueChange={(value) => setInflationRate(value[0])}
                    max={6}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Low (1%)</span>
                    <span>High (6%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PCI Projections */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">PCI Projection Analysis</CardTitle>
              <CardDescription>
                Network condition forecasts under current vs optimized maintenance strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pciProjections.slice(0, planningHorizon + 1)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      domain={[40, 85]}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        `PCI: ${value}`,
                        name === 'currentScenario' ? 'Current Strategy' : 'Optimized Strategy'
                      ]}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="currentScenario"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                      name="Current Strategy"
                    />
                    <Line
                      type="monotone"
                      dataKey="optimizedScenario"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                      name="Optimized Strategy"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Budget Goals */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Capital Improvement Goals</CardTitle>
              <CardDescription>Track progress toward major infrastructure investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetGoals.map((goal) => (
                  <Card key={goal.id} className="border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(goal.category)}
                          <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">{goal.name}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                              {goal.category} • {goal.timeframe} year timeline
                            </p>
                          </div>
                        </div>
                        {getPriorityBadge(goal.priority)}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Progress</span>
                          <span className="font-medium">
                            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                          <div
                            className={cn(
                              "h-3 rounded-full transition-all duration-500",
                              goal.priority === 'high' ? "bg-red-500" :
                              goal.priority === 'medium' ? "bg-yellow-500" : "bg-green-500"
                            )}
                            style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% funded</span>
                          <span>${(goal.targetAmount - goal.currentAmount).toLocaleString()} needed</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Material Cost Analysis */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Material Cost Projections</CardTitle>
              <CardDescription>
                5-year material cost forecasts for budget planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={materialCostData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                    <XAxis 
                      dataKey="material" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip formatter={(value: any) => [`$${value}/unit`, '']} />
                    <Legend />
                    <Bar dataKey="currentCost" fill="#3B82F6" name="Current Cost" />
                    <Bar dataKey="projectedCost" fill="#F59E0B" name="5-Year Projection" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding Summary */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <DollarSign className="w-5 h-5 mr-2" />
                Funding Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Goals</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  ${totalBudgetGoals.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Current Funding</span>
                <span className="font-medium text-green-600">
                  ${currentFunding.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Funding Gap</span>
                <span className={cn(
                  "font-bold",
                  fundingGap > 0 ? "text-red-600" : "text-green-600"
                )}>
                  ${fundingGap.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Funding Scenarios */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Funding Scenarios</CardTitle>
              <CardDescription>Compare different revenue strategies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all",
                    scenario.id === selectedScenario ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-white/30"
                  )}
                  onClick={() => toggleScenario(scenario.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-800 dark:text-white">{scenario.name}</h4>
                    {scenario.id === selectedScenario && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    ${scenario.totalRevenue.toLocaleString()} total
                  </p>
                </div>
              ))}
              
              <Button 
                onClick={createScenario}
                disabled={currentPlan === 'free' && scenarios.length >= 3}
                className="w-full mt-3"
                size="sm"
              >
                Create Scenario
              </Button>
            </CardContent>
          </Card>

          {/* Active Scenario Details */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">
                {activeScenario.name}
              </CardTitle>
              <CardDescription>Revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Sales Tax</span>
                <span className="font-medium">${activeScenario.salesTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Grants</span>
                <span className="font-medium">${activeScenario.grants.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Bonds</span>
                <span className="font-medium">${activeScenario.bonds.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Assessments</span>
                <span className="font-medium">${activeScenario.specialAssessments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">Total Revenue</span>
                <span className="font-bold text-green-600">${activeScenario.totalRevenue.toLocaleString()}</span>
              </div>
              
              <div className="pt-3">
                <div className={cn(
                  "p-3 rounded-lg text-center",
                  activeScenario.totalRevenue >= fundingGap 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200" 
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200"
                )}>
                  {activeScenario.totalRevenue >= fundingGap ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Funding Goals Met
                      </p>
                      <p className="text-xs text-green-600">
                        ${(activeScenario.totalRevenue - fundingGap).toLocaleString()} surplus
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Funding Shortfall
                      </p>
                      <p className="text-xs text-red-600">
                        ${(fundingGap - activeScenario.totalRevenue).toLocaleString()} needed
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Plan
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="w-full" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Projections
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Features Notice */}
      {currentPlan === 'free' && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Unlock Advanced Planning Features
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to access unlimited funding scenarios, advanced PCI modeling, 20-year projections, 
                Monte Carlo simulation, automated reports, and integration with asset management systems.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Unlimited Scenarios</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Model complex funding strategies</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Advanced Modeling</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Monte Carlo & risk analysis</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">20-Year Planning</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Extended planning horizons</p>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/pricing'}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade for Advanced Planning
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

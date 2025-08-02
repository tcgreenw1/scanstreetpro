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
  Legend
} from "recharts";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Crown,
  Download,
  Save,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Building,
  Package,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

interface AssetCategory {
  id: string;
  name: string;
  currentPCI: number;
  laneMiles: number;
  unitCosts: {
    patching: number;
    overlay: number;
    rebuild: number;
  };
}

interface CostProjection {
  year: number;
  pci: number;
  patchingCost: number;
  overlayCost: number;
  rebuildCost: number;
  cumulativeCost: number;
  inflationAdjusted: number;
}

const assetCategories: AssetCategory[] = [
  {
    id: 'arterial',
    name: 'Arterial Roads',
    currentPCI: 72,
    laneMiles: 45.2,
    unitCosts: {
      patching: 2.50, // per sq ft
      overlay: 8.75, // per sq ft  
      rebuild: 25.00 // per sq ft
    }
  },
  {
    id: 'collector',
    name: 'Collector Roads',
    currentPCI: 68,
    laneMiles: 89.7,
    unitCosts: {
      patching: 2.25,
      overlay: 7.50,
      rebuild: 20.00
    }
  },
  {
    id: 'local',
    name: 'Local Roads',
    currentPCI: 65,
    laneMiles: 156.3,
    unitCosts: {
      patching: 2.00,
      overlay: 6.25,
      rebuild: 18.00
    }
  },
  {
    id: 'residential',
    name: 'Residential Streets',
    currentPCI: 71,
    laneMiles: 203.8,
    unitCosts: {
      patching: 1.75,
      overlay: 5.50,
      rebuild: 15.00
    }
  }
];

const inflationRates = [2.5, 2.8, 3.1, 2.9, 3.2]; // Annual inflation rates for next 5 years
const deteriorationRate = 2.5; // PCI points per year average

export default function CostEstimator() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['arterial']);
  const [treatmentStrategy, setTreatmentStrategy] = useState<'reactive' | 'preventive' | 'mixed'>('preventive');
  const [budgetConstraint, setBudgetConstraint] = useState<number>(2000000);
  const [planningHorizon, setPlanningHorizon] = useState<5 | 10>(5);
  const [inflationRate, setInflationRate] = useState<number>(2.8);
  const [savedScenarios, setSavedScenarios] = useState<number>(1);
  const { currentPlan } = usePricing();

  const generateProjections = (): CostProjection[] => {
    const projections: CostProjection[] = [];
    const selectedAssets = assetCategories.filter(cat => selectedCategories.includes(cat.id));
    
    for (let year = 0; year <= planningHorizon; year++) {
      let totalPatchingCost = 0;
      let totalOverlayCost = 0;
      let totalRebuildCost = 0;
      
      selectedAssets.forEach(asset => {
        const currentPCI = Math.max(0, asset.currentPCI - (year * deteriorationRate));
        const laneWidth = 12; // feet
        const totalSqFt = asset.laneMiles * 5280 * laneWidth; // Convert lane miles to sq ft
        
        if (currentPCI < 40) {
          // Rebuild required
          totalRebuildCost += totalSqFt * asset.unitCosts.rebuild;
        } else if (currentPCI < 60) {
          // Overlay needed
          totalOverlayCost += totalSqFt * asset.unitCosts.overlay;
        } else if (currentPCI < 80 || treatmentStrategy === 'preventive') {
          // Patching sufficient
          totalPatchingCost += totalSqFt * asset.unitCosts.patching * 0.1; // 10% of surface area
        }
      });
      
      const totalCost = totalPatchingCost + totalOverlayCost + totalRebuildCost;
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, year);
      
      projections.push({
        year: new Date().getFullYear() + year,
        pci: Math.max(0, 70 - (year * deteriorationRate * 0.8)), // Network average PCI
        patchingCost: totalPatchingCost,
        overlayCost: totalOverlayCost,
        rebuildCost: totalRebuildCost,
        cumulativeCost: totalCost,
        inflationAdjusted: totalCost * inflationMultiplier
      });
    }
    
    return projections;
  };

  const projections = generateProjections();
  const totalCost = projections.reduce((sum, p) => sum + p.inflationAdjusted, 0);
  const averageAnnualCost = totalCost / planningHorizon;

  const handleSaveScenario = () => {
    if (currentPlan === 'free' && savedScenarios >= 1) {
      alert('Free plan allows only 1 saved scenario. Upgrade to save unlimited scenarios.');
      return;
    }
    setSavedScenarios(prev => prev + 1);
    alert('Scenario saved successfully!');
  };

  const handleExportPDF = () => {
    if (currentPlan === 'free') {
      alert('PDF export is a premium feature. Upgrade to access professional reports.');
      return;
    }
    alert('PDF export functionality would be implemented here.');
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const calculateROI = () => {
    const preventiveCost = projections.filter(p => p.year <= new Date().getFullYear() + 3)
      .reduce((sum, p) => sum + p.patchingCost + p.overlayCost, 0);
    const reactiveCost = projections.reduce((sum, p) => sum + p.rebuildCost, 0);
    const savings = reactiveCost - preventiveCost;
    const roi = (savings / preventiveCost) * 100;
    return { savings, roi };
  };

  const roiData = calculateROI();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Infrastructure Cost Estimator
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Model pavement deterioration and compare treatment strategies to optimize your infrastructure investment.
        </p>
        <Badge variant="outline" className="mt-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
          {savedScenarios}/1 Saved Scenarios {currentPlan === 'free' ? '(Free Plan)' : '(Unlimited)'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Calculator className="w-5 h-5 mr-2" />
                Estimation Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-3 block">Asset Categories</Label>
                <div className="space-y-2">
                  {assetCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories(prev => [...prev, category.id]);
                          } else {
                            setSelectedCategories(prev => prev.filter(id => id !== category.id));
                          }
                        }}
                        className="rounded border-slate-300"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{category.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          PCI: {category.currentPCI} • {category.laneMiles} lane miles
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="treatment-strategy" className="text-slate-700 dark:text-slate-300">Treatment Strategy</Label>
                <Select value={treatmentStrategy} onValueChange={(value: 'reactive' | 'preventive' | 'mixed') => setTreatmentStrategy(value)}>
                  <SelectTrigger className="glass-card border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="reactive">Reactive (Fix when broken)</SelectItem>
                    <SelectItem value="preventive">Preventive (Maintain condition)</SelectItem>
                    <SelectItem value="mixed">Mixed Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  Annual Inflation Rate: {inflationRate}%
                </Label>
                <Slider
                  value={[inflationRate]}
                  onValueChange={(value) => setInflationRate(value[0])}
                  max={5}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="budget" className="text-slate-700 dark:text-slate-300">Annual Budget Constraint</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budgetConstraint}
                  onChange={(e) => setBudgetConstraint(Number(e.target.value))}
                  className="glass-card border-white/30"
                />
              </div>
            </CardContent>
          </Card>

          {/* Unit Costs */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <DollarSign className="w-5 h-5 mr-2" />
                Unit Costs (per sq ft)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-green-700 dark:text-green-300">Patching</span>
                  <span className="font-medium text-green-800 dark:text-green-200">$1.75 - $2.50</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span className="text-yellow-700 dark:text-yellow-300">Overlay</span>
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">$5.50 - $8.75</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span className="text-red-700 dark:text-red-300">Full Rebuild</span>
                  <span className="font-medium text-red-800 dark:text-red-200">$15.00 - $25.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSaveScenario}
                className="w-full"
                disabled={currentPlan === 'free' && savedScenarios >= 1}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Scenario
              </Button>
              <Button 
                onClick={handleExportPDF}
                variant="outline" 
                className="w-full"
                disabled={currentPlan === 'free'}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
                {currentPlan === 'free' && <Crown className="w-4 h-4 ml-2 text-amber-500" />}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cost Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Investment</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      ${Math.round(totalCost).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{planningHorizon}-year period</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Annual Average</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                      ${Math.round(averageAnnualCost).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Per year</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Budget Status</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      averageAnnualCost <= budgetConstraint ? "text-green-600" : "text-red-600"
                    )}>
                      {averageAnnualCost <= budgetConstraint ? "✓ Within" : "⚠ Over"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Budget constraint</p>
                  </div>
                  {averageAnnualCost <= budgetConstraint ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="projections" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 glass-card border-white/20">
              <TabsTrigger value="projections">Cost Projections</TabsTrigger>
              <TabsTrigger value="comparison">Treatment Comparison</TabsTrigger>
              <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="projections">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">Cost Projection Over Time</CardTitle>
                  <CardDescription>
                    Inflation-adjusted costs based on current deterioration models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projections}>
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
                          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip 
                          formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                          labelFormatter={(label) => `Year ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="inflationAdjusted"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">Treatment Options Comparison</CardTitle>
                  <CardDescription>
                    Cost breakdown by treatment type over planning horizon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={projections}>
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
                          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, '']} />
                        <Legend />
                        <Bar dataKey="patchingCost" stackId="a" fill="#10B981" name="Patching" />
                        <Bar dataKey="overlayCost" stackId="a" fill="#F59E0B" name="Overlay" />
                        <Bar dataKey="rebuildCost" stackId="a" fill="#EF4444" name="Rebuild" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roi">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">Return on Investment Analysis</CardTitle>
                  <CardDescription>
                    Preventive maintenance vs. reactive replacement strategy comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Preventive Strategy</h4>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                          ${Math.round(projections.reduce((sum, p) => sum + p.patchingCost + p.overlayCost, 0)).toLocaleString()}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">Regular maintenance approach</p>
                      </div>
                      
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Reactive Strategy</h4>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                          ${Math.round(projections.reduce((sum, p) => sum + p.rebuildCost, 0)).toLocaleString()}
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">Wait until rebuild needed</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Potential Savings</h4>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          ${Math.round(roiData.savings).toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">With preventive approach</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">ROI</h4>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {Math.round(roiData.roi)}%
                        </p>
                        <p className="text-sm text-purple-700 dark:text-purple-300">Return on investment</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Premium Features Notice */}
      {currentPlan === 'free' && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Unlock Advanced Cost Modeling
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to save unlimited scenarios, export professional PDF reports, integrate with actual 
                asset data, and access advanced deterioration models with inflation adjustments.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Save className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Unlimited Scenarios</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Save and compare multiple strategies</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Real Asset Data</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connect to actual PCI scores</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Download className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Professional Reports</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Council-ready PDF exports</p>
                </div>
              </div>
              
              <Button 
                onClick={handleUpgrade}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade for Advanced Modeling
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

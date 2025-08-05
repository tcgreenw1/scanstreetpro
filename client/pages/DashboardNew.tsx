import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2,
  Calculator,
  Calendar,
  ClipboardCheck,
  DollarSign,
  FileText,
  Settings,
  TrendingUp,
  Users,
  MessageSquare,
  MapPin,
  Search,
  ArrowRight,
  Activity,
  CheckCircle,
  Crown,
  Sparkles,
  Satellite,
  Car,
  Map,
  Edit3,
  Star,
  CheckCircle2,
  X,
  TrendingDown,
  BarChart3,
  AlertCircle,
  Database
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { neonService } from '@/services/neonService';
import { cn } from '@/lib/utils';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useFeatureMatrix, useDashboardFeatures } from '@/hooks/useFeatureMatrix';
import { 
  PaywallCard, 
  SampleDataBadge, 
  SummaryVisualization, 
  ConditionalFeature,
  MiniBarChart,
  MiniLineChart,
  MiniDonutChart
} from '@/components/FeatureStateComponents';
import { ModifySampleDataModal } from '@/components/ModifySampleDataModal';
import { useState, useEffect } from 'react';

const pciMethodComparison = [
  {
    method: 'Satellite PCI Scan',
    coverage: '100% Road Network',
    accuracy: '±2 PCI Points',
    cost: '$0.15/mile',
    timeframe: '2-3 weeks',
    available: true,
    recommended: true,
    description: 'High-resolution satellite imagery analysis with AI-powered PCI assessment. Fastest and most cost-effective for large networks.'
  },
  {
    method: 'Driving PCI Scan',
    coverage: '100% Road Network',
    accuracy: '±1 PCI Point',
    cost: '$2.50/mile',
    timeframe: '6-8 weeks',
    available: true,
    recommended: false,
    description: 'Vehicle-mounted sensors and cameras provide ground-truth data collection. Higher accuracy but significantly more expensive.'
  }
];

export function Dashboard() {
  const { organization } = useOrganization();
  const { userPlan } = useFeatureMatrix();
  const dashboardFeatures = useDashboardFeatures();
  
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalAssets: 42,
    avgPCI: 73,
    criticalAssets: 8,
    totalBudget: 2400000,
    monthlyExpenses: 180000,
    upcomingInspections: 15,
    activeProjects: 6,
    teamMembers: 3
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for visualization fallbacks
  const sampleChartData = [45, 52, 38, 67, 83, 92, 78, 65, 84, 76, 69, 71];
  const trendData = [65, 67, 72, 68, 75, 78, 73, 76, 79, 82, 78, 73];

  // Generate stats based on feature matrix
  const quickStats = [
    {
      label: dashboardFeatures.sampleRoads.useSampleData ? 'Sample Roads' : 'Total Assets',
      value: isLoading ? '...' : dashboardFeatures.sampleRoads.useSampleData ? '42' : dashboardMetrics.totalAssets,
      icon: MapPin,
      color: 'text-blue-600',
      trend: 'stable',
      feature: dashboardFeatures.sampleRoads,
      locked: false
    },
    {
      label: 'Average PCI Score',
      value: isLoading ? '...' : dashboardFeatures.averagePCIScore.useSampleData ? '73' : Math.round(dashboardMetrics.avgPCI),
      icon: BarChart3,
      color: 'text-green-600',
      trend: 'up',
      feature: dashboardFeatures.averagePCIScore,
      locked: false
    },
    {
      label: 'Critical Issues',
      value: isLoading ? '...' : dashboardFeatures.criticalIssues.useSampleData ? '8' : dashboardMetrics.criticalAssets,
      icon: AlertCircle,
      color: 'text-red-600',
      trend: 'down',
      feature: dashboardFeatures.criticalIssues,
      locked: false
    },
    {
      label: 'Monthly Budget',
      value: isLoading ? '...' : dashboardFeatures.monthlyBudget.useSampleData ? '$180K' : `$${Math.round(dashboardMetrics.monthlyExpenses / 1000)}K`,
      icon: DollarSign,
      color: 'text-orange-600',
      trend: 'stable',
      feature: dashboardFeatures.monthlyBudget,
      locked: false
    }
  ];

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section with PCI Focus */}
      <div className="text-center py-8">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          {organization?.name || 'Welcome'} - {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Infrastructure Dashboard
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          <strong>CURRENT PLAN: {userPlan.toUpperCase()}</strong><br/>
          {userPlan === 'free'
            ? '🔒 FREE PLAN: Sample data only, crowns on locked features, 1 export per month limit'
            : userPlan === 'basic'
            ? '✅ BASIC PLAN: Real data for critical issues and budget, sample data for PCI and roads'
            : userPlan === 'pro'
            ? '🚀 PRO PLAN: Real data for critical issues and budget, sample data for PCI and roads'
            : userPlan === 'premium'
            ? '💎 PREMIUM PLAN: Real data for critical issues and budget, sample data for PCI and roads'
            : userPlan.includes('satellite')
            ? '📡 SATELLITE ENTERPRISE: Real data for all features, PCI scanning methods hidden'
            : userPlan.includes('driving')
            ? '🚗 DRIVING ENTERPRISE: Real data for all features, PCI scanning methods hidden'
            : 'Getting started with infrastructure management. Upgrade for more features.'
          }
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const trendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Activity;
          const TrendIcon = trendIcon;
          return (
            <Card key={index} className={cn(
              "border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm relative overflow-hidden"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                      {stat.feature.useSampleData && <SampleDataBadge />}
                    </div>
                    <p className={cn(
                      "text-2xl font-bold",
                      stat.feature.useSampleData ? "text-blue-600" : "text-slate-900 dark:text-white"
                    )}>
                      {stat.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      <TrendIcon className={cn("w-3 h-3", stat.color)} />
                      <span className={cn("text-xs font-medium", stat.color)}>
                        {stat.trend === 'up' ? '+5.2%' : stat.trend === 'down' ? '-2.1%' : '0.0%'}
                      </span>
                    </div>
                  </div>
                  <Icon className={cn(
                    "w-8 h-8 transition-all duration-300 group-hover:scale-110",
                    stat.color
                  )} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PCI Method Selection - Conditional based on plan */}
      <ConditionalFeature
        state={dashboardFeatures.chooseYourPCIScanningMethod.state}
        fallback={
          <SummaryVisualization
            title="Infrastructure Analysis Summary"
            subtitle="Based on available data from other features"
            className="col-span-full"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">73</div>
                <div className="text-sm text-slate-500">Avg PCI Score</div>
                <MiniLineChart data={trendData} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">42</div>
                <div className="text-sm text-slate-500">Total Assets</div>
                <MiniBarChart data={sampleChartData} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">85%</div>
                <div className="text-sm text-slate-500">Completion</div>
                <MiniDonutChart value={85} max={100} className="mt-2 mx-auto" />
              </div>
            </div>
          </SummaryVisualization>
        }
      >
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-xl text-center">🛰️ Choose Your PCI Scanning Method</CardTitle>
            <CardDescription className="text-center">
              Select the best approach for your infrastructure assessment needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pciMethodComparison.map((method, index) => (
                <Card key={index} className={cn(
                  "relative overflow-hidden border transition-all duration-300 hover:shadow-lg",
                  method.recommended 
                    ? "border-purple-200 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/20" 
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                )}>
                  {method.recommended && (
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-bl-lg">
                      Recommended
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        {method.method === 'Satellite PCI Scan' && <Satellite className="w-6 h-6 text-white" />}
                        {method.method === 'Driving PCI Scan' && <Car className="w-6 h-6 text-white" />}
                      </div>
                      <Badge className={cn(
                        method.available ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
                      )}>
                        {method.available ? 'Available' : 'Coming Soon'}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-slate-800 dark:text-white">{method.method}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{method.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Coverage</p>
                        <p className="font-medium text-slate-800 dark:text-white">{method.coverage}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Accuracy</p>
                        <p className="font-medium text-slate-800 dark:text-white">{method.accuracy}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Cost</p>
                        <p className="font-medium text-slate-800 dark:text-white">{method.cost}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">Timeframe</p>
                        <p className="font-medium text-slate-800 dark:text-white">{method.timeframe}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </ConditionalFeature>

      {/* Satellite vs Driving Comparison - Conditional */}
      <ConditionalFeature
        state={dashboardFeatures.satelliteVsDrivingPCIScanComparison.state}
        fallback={
          <SummaryVisualization
            title="Infrastructure Methods Overview"
            subtitle="Comparison data unavailable for your plan"
          >
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Detailed method comparisons are available with Pro+ plans</p>
              <Button className="mt-4" onClick={handleUpgrade}>
                Upgrade to View Comparison
              </Button>
            </div>
          </SummaryVisualization>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Satellite PCI Scanning</h3>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Faster + Cheaper</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  High-resolution satellite imagery combined with AI analysis provides comprehensive road condition assessment without ground vehicles.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>95% coverage in 2-3 weeks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>$0.15 per mile analyzed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Weather independent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>No traffic disruption</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Driving PCI Scanning</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-200">High Precision</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ground-truth data collection using specialized vehicles with cameras, sensors, and measurement equipment.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>±1 PCI point accuracy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Detailed crack analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Subsurface data collection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Real-time processing</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </ConditionalFeature>

      {/* Sample Data Controls - Conditional */}
      <ConditionalFeature state={dashboardFeatures.sampleDataControls.state}>
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border border-amber-200 dark:border-amber-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Database className="w-5 h-5" />
                  Sample Data Controls
                </CardTitle>
                <CardDescription className="text-amber-600 dark:text-amber-300">
                  Manage sample data for demonstration purposes
                </CardDescription>
              </div>
              <Edit3 className="w-6 h-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-800 dark:text-white">Sample Data Generator</p>
                <ModifySampleDataModal />
              </div>
              <Link to="/map" className="flex-1">
                <Button variant="outline" className="w-full ml-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Sample Map
                </Button>
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                <p className="text-slate-600 dark:text-slate-400">Current PCI Range</p>
                <p className="font-medium text-slate-800 dark:text-white">45-85 (Mixed)</p>
              </div>
              <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                <p className="text-slate-600 dark:text-slate-400">Road Types</p>
                <p className="font-medium text-slate-800 dark:text-white">Arterial, Local, Collector</p>
              </div>
              <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                <p className="text-slate-600 dark:text-slate-400">Sample Size</p>
                <p className="font-medium text-slate-800 dark:text-white">12 road segments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ConditionalFeature>
    </div>
  );
}

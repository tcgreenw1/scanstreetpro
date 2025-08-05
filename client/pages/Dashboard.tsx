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
  AlertCircle,
  Clock,
  Crown,
  Zap,
  Eye,
  BarChart3,
  Shield,
  Globe,
  BookOpen,
  PlayCircle,
  Sparkles,
  Satellite,
  Car,
  Map,
  Edit3,
  Star,
  CheckCircle2,
  X,
  TrendingDown
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { neonService } from '@/services/neonService';
import { cn } from '@/lib/utils';
import { usePricing } from '@/contexts/PricingContext';
import { useOrganization, usePermissions } from '@/contexts/OrganizationContext';
import { usePlanBasedUI, useDataVisibility } from '@/hooks/usePlanBasedUI';
import { ModifySampleDataModal } from '@/components/ModifySampleDataModal';
import { PlanTrackingTest } from '@/components/PlanTrackingTest';
import { useState, useEffect } from 'react';

const pciMethodComparison = [
  {
    method: 'Free PCI Scan',
    type: 'Sample Demo Map',
    coverage: '~5-10 streets',
    accuracy: 'Demo scoring only',
    cost: '$0',
    timeframe: 'Instant',
    pros: ['Quick preview', 'No cost', 'Example PCI data', 'Platform demo'],
    cons: ['Sample data only', 'Not real conditions', 'Demo purposes only'],
    color: 'blue',
    available: true
  },
  {
    method: 'Satellite PCI Scan',
    type: 'Faster + Cheaper',
    coverage: 'City-wide',
    accuracy: '85% accuracy',
    cost: 'Contact us for quote',
    timeframe: '1-2 weeks',
    pros: ['Full coverage', 'Cost effective', 'Fast deployment', 'Regular updates'],
    cons: ['Weather dependent', 'Limited detail', 'Requires clear imagery'],
    color: 'purple',
    available: false
  },
  {
    method: 'Driving PCI Scan',
    type: 'High Precision',
    coverage: 'Street-level',
    accuracy: '95%+ accuracy',
    cost: 'Contact us for quote',
    timeframe: '3-4 weeks',
    pros: ['Maximum accuracy', 'Detailed analysis', 'Ground truth data', 'Asset integration'],
    cons: ['Higher cost', 'Longer timeline', 'Weather constraints'],
    color: 'green',
    available: false
  }
];

export default function Dashboard() {
  const { currentPlan } = usePricing();
  const { organization, planFeatures } = useOrganization();
  const { shouldShowUpgrade, isFeatureUnlocked } = usePermissions();

  // Step 1 & 2: Get plan-based UI state
  const planState = usePlanBasedUI();
  const { useSampleData, useRealData, userPlan } = useDataVisibility();

  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalAssets: 0,
    avgPCI: 0,
    criticalAssets: 0,
    totalBudget: 0,
    monthlyExpenses: 0,
    upcomingInspections: 0,
    activeProjects: 0,
    teamMembers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard metrics from database
  useEffect(() => {
    const loadMetrics = async () => {
      if (!organization) return;

      try {
        setIsLoading(true);
        const metrics = await neonService.getDashboardMetrics(organization.id);
        setDashboardMetrics(metrics);
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [organization]);

  // Step 3: Generate stats based on plan with hardcoded visibility logic
  const quickStats = [
    {
      label: useSampleData ? 'Sample Roads' : 'Total Assets',
      value: isLoading ? '...' : dashboardMetrics.totalAssets,
      icon: MapPin,
      color: 'text-blue-600',
      trend: 'stable',
      locked: false // Always show basic metrics
    },
    {
      label: 'Average PCI Score',
      value: isLoading ? '...' : Math.round(dashboardMetrics.avgPCI),
      icon: BarChart3,
      color: 'text-green-600',
      trend: 'up',
      locked: false // Always show basic metrics
    },
    {
      label: 'Critical Issues',
      value: isLoading ? '...' : dashboardMetrics.criticalAssets,
      icon: AlertCircle,
      color: 'text-red-600',
      trend: 'down',
      locked: planState.disableAssetManagement && planState.showCrowns
    },
    {
      label: 'Monthly Budget',
      value: isLoading ? '...' : `$${Math.round(dashboardMetrics.monthlyExpenses / 1000)}K`,
      icon: DollarSign,
      color: 'text-orange-600',
      trend: 'stable',
      locked: !planState.unlockBudgetSimulations && planState.showCrowns
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
          {planState.showCrowns && <Crown className="w-4 h-4 ml-2 text-amber-500" />}
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Infrastructure Dashboard
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          <strong>CURRENT PLAN: {userPlan.toUpperCase()}</strong><br/>
          {userPlan === 'free'
            ? '🔒 FREE PLAN: Sample data only, crowns on locked features, 1 export per month limit'
            : userPlan === 'basic'
            ? '✅ BASIC PLAN: Real data unlocked, asset/budget/expense management enabled, calendar visible'
            : userPlan === 'pro'
            ? '🚀 PRO PLAN: Everything unlocked including maintenance scheduling, citizen engagement, unlimited exports'
            : userPlan === 'premium'
            ? '💎 PREMIUM PLAN: Full engagement suite + AI data, mobile app, dedicated support'
            : planState.unlockEverything
            ? '🏢 ENTERPRISE PLAN: Complete platform access with AI assistance and engineering support'
            : 'Getting started with infrastructure management. Upgrade for more features.'
          }
        </p>

        {planState.showCrowns && (
          <div className="mt-6">
            <Button onClick={handleUpgrade} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Crown className="w-4 h-4 mr-2" />
              {planState.upgradeMessage}
            </Button>
          </div>
        )}
      </div>

      {/* Plan Testing Banner - Very Obvious */}
      <div className={cn(
        "p-6 rounded-xl border-2 text-center",
        userPlan === 'free' ? "bg-red-50 border-red-300 text-red-800" :
        userPlan === 'basic' ? "bg-green-50 border-green-300 text-green-800" :
        userPlan === 'pro' ? "bg-purple-50 border-purple-300 text-purple-800" :
        userPlan === 'premium' ? "bg-amber-50 border-amber-300 text-amber-800" :
        "bg-blue-50 border-blue-300 text-blue-800"
      )}>
        <h2 className="text-2xl font-bold mb-2">
          TESTING: {userPlan.toUpperCase()} PLAN ACTIVE
        </h2>
        <p className="text-lg">
          {userPlan === 'free' && "🔒 Free Plan: Should see sample data, crowns, export limits"}
          {userPlan === 'basic' && "✅ Basic Plan: Should see real data, unlocked assets/budget/expenses, crowns on advanced features"}
          {userPlan === 'pro' && "🚀 Pro Plan: Should see all features unlocked except Premium/Enterprise"}
          {userPlan === 'premium' && "💎 Premium Plan: Should see full access with AI features"}
          {userPlan.includes('enterprise') && "🏢 Enterprise Plan: Should see complete access with engineering support"}
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="text-sm">
            <strong>Sample Data:</strong> {planState.showSampleData ? "YES" : "NO"}
          </div>
          <div className="text-sm">
            <strong>Show Crowns:</strong> {planState.showCrowns ? "YES" : "NO"}
          </div>
          <div className="text-sm">
            <strong>Can Export:</strong> {planState.allowExport ? "YES" : "NO"}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const trendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Activity;
          const TrendIcon = trendIcon;
          return (
            <Card key={index} className={cn(
              "glass-card border-white/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-fadeInUp",
              stat.locked && "opacity-75 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 border-amber-200/50"
            )} style={{ animationDelay: `${index * 200}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                      {stat.locked && <Crown className="w-4 h-4 text-amber-500" />}
                    </div>
                    <p className={cn(
                      "text-2xl font-bold mt-1",
                      stat.locked ? "text-slate-400" : "text-slate-800 dark:text-white"
                    )}>
                      {stat.locked ? '••••' : stat.value}
                    </p>
                    <div className="flex items-center mt-1">
                      {!stat.locked && (
                        <>
                          <TrendIcon className={cn("w-3 h-3 mr-1",
                            stat.trend === 'up' ? 'text-green-500' :
                            stat.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                          )} />
                          <span className="text-xs text-slate-500">vs last scan</span>
                        </>
                      )}
                      {stat.locked && (
                        <span className="text-xs text-amber-600">Upgrade to unlock</span>
                      )}
                    </div>
                  </div>
                  <Icon className={cn(
                    "w-8 h-8 group-hover:scale-110 transition-transform",
                    stat.locked ? "text-slate-300" : stat.color
                  )} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PCI Scan Method Cards */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Choose Your PCI Scanning Method</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            From free sample scans to high-precision driving surveys, select the method that fits your budget and precision needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pciMethodComparison.map((method, index) => (
            <Card key={index} className={cn(
              "glass-card border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden relative animate-fadeInUp",
              method.color === 'blue' && "border-blue-200/50 hover:border-blue-300/50",
              method.color === 'purple' && "border-purple-200/50 hover:border-purple-300/50", 
              method.color === 'green' && "border-green-200/50 hover:border-green-300/50"
            )} style={{ animationDelay: `${index * 200}ms` }}>
              {/* Gradient background */}
              <div className={cn("absolute inset-0 opacity-5 bg-gradient-to-br", 
                method.color === 'blue' && "from-blue-500 to-cyan-500",
                method.color === 'purple' && "from-purple-500 to-violet-500",
                method.color === 'green' && "from-green-500 to-emerald-500"
              )} />
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br",
                      method.color === 'blue' && "from-blue-500 to-cyan-500",
                      method.color === 'purple' && "from-purple-500 to-violet-500", 
                      method.color === 'green' && "from-green-500 to-emerald-500"
                    )}>
                      {method.method === 'Free PCI Scan' && <Map className="w-6 h-6 text-white" />}
                      {method.method === 'Satellite PCI Scan' && <Satellite className="w-6 h-6 text-white" />}
                      {method.method === 'Driving PCI Scan' && <Car className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {method.method}
                      </CardTitle>
                      <Badge variant="outline" className={cn("text-xs mt-1",
                        method.color === 'blue' && "bg-blue-50 text-blue-700 border-blue-200",
                        method.color === 'purple' && "bg-purple-50 text-purple-700 border-purple-200",
                        method.color === 'green' && "bg-green-50 text-green-700 border-green-200"
                      )}>
                        {method.type}
                      </Badge>
                    </div>
                  </div>
                  {!method.available && (
                    <Crown className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 relative z-10">
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Coverage:</span>
                      <p className="font-medium text-slate-800 dark:text-white">{method.coverage}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Accuracy:</span>
                      <p className="font-medium text-slate-800 dark:text-white">{method.accuracy}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Cost:</span>
                      <p className="font-medium text-slate-800 dark:text-white">{method.cost}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Timeline:</span>
                      <p className="font-medium text-slate-800 dark:text-white">{method.timeframe}</p>
                    </div>
                  </div>
                </div>

                {method.available ? (
                  <Link to="/map">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 group-hover:scale-105 transition-all duration-200">
                      <Eye className="w-4 h-4 mr-2" />
                      View Sample Demo Map
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 group-hover:scale-105 transition-all duration-200"
                    title="Contact us to get a custom quote"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Contact Us for Quote
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Side-by-side Method Comparison */}
      <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800 dark:text-white text-center">Satellite vs Driving PCI Scan Comparison</CardTitle>
          <CardDescription className="text-center text-slate-600 dark:text-slate-300">
            Compare our premium scanning methods to choose the best fit for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Satellite Scan */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Satellite PCI Scan</h3>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Faster + Cheaper</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  Pros
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />Complete city coverage in single scan</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />Cost-effective for large areas</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />Fast 1-2 week turnaround</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />Regular update scheduling</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />No traffic disruption</li>
                </ul>
                
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center pt-3">
                  <X className="w-4 h-4 text-red-500 mr-2" />
                  Cons
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center"><X className="w-3 h-3 text-red-500 mr-2" />Weather dependent imagery</li>
                  <li className="flex items-center"><X className="w-3 h-3 text-red-500 mr-2" />85% accuracy limitation</li>
                  <li className="flex items-center"><X className="w-3 h-3 text-red-500 mr-2" />Limited subsurface detection</li>
                </ul>
              </div>
            </div>

            {/* Driving Scan */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Driving PCI Scan</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-200">High Precision</Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  Pros
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />95%+ accuracy guarantee</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />Detailed subsurface analysis</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />Asset integration capability</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />Ground truth validation</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2" />Precise crack measurement</li>
                </ul>
                
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center pt-3">
                  <X className="w-4 h-4 text-red-500 mr-2" />
                  Cons
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center"><X className="w-3 h-3 text-red-500 mr-2" />Higher cost investment</li>
                  <li className="flex items-center"><X className="w-3 h-3 text-red-500 mr-2" />3-4 week timeline</li>
                  <li className="flex items-center"><X className="w-3 h-3 text-red-500 mr-2" />Limited by weather conditions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
            <div className="text-center">
              <Crown className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2">Ready to Upgrade Your PCI Analysis?</h3>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                Get precise pavement condition data with our satellite or driving scan methods.
                Perfect for data-driven maintenance planning and budget optimization.
              </p>
              <p className="text-amber-600 dark:text-amber-400 mb-6 text-sm">
                You can also purchase the software plans without PCI rating tools — click below to explore plan options.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleUpgrade}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  title="Contact us for custom quote and consultation"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
                <Button
                  onClick={handleUpgrade}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  title="See pricing and included features"
                >
                  View Pricing & Features
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modify Sample Data Card */}
      <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-800 dark:text-white">Sample Data Controls</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Customize the sample PCI data to preview different scenarios and test the platform capabilities
              </CardDescription>
            </div>
            <Edit3 className="w-6 h-6 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <ModifySampleDataModal />
            </div>
            <Link to="/map" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Map className="w-4 h-4 mr-2" />
                View Current Sample Map
              </Button>
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
              <span className="text-slate-500 dark:text-slate-400">Current PCI Range:</span>
              <p className="font-medium text-slate-800 dark:text-white">45-85 (Mixed)</p>
            </div>
            <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
              <span className="text-slate-500 dark:text-slate-400">Road Types:</span>
              <p className="font-medium text-slate-800 dark:text-white">Arterial, Local, Collector</p>
            </div>
            <div className="p-3 bg-white/30 dark:bg-white/5 rounded-lg">
              <span className="text-slate-500 dark:text-slate-400">Sample Assets:</span>
              <p className="font-medium text-slate-800 dark:text-white">12 road segments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Tracking Test Component - Only visible in development */}
      {process.env.NODE_ENV === 'development' && <PlanTrackingTest />}
    </div>
  );
}

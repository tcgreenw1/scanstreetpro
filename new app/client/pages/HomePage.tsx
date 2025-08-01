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
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleCard {
  title: string;
  description: string;
  href: string;
  icon: any;
  status: 'active' | 'coming-soon' | 'premium';
  category: string;
  stats?: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
  };
  gradient?: string;
}

const modules: ModuleCard[] = [
  {
    title: 'Road Inspection Dashboard',
    description: 'AI-powered road monitoring and issue tracking',
    href: '/inspection-dashboard',
    icon: Search,
    status: 'active',
    category: 'Infrastructure',
    stats: { label: 'Issues Detected', value: 247, trend: 'up' },
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Budget Planning',
    description: '5-year budget projections and spending analysis',
    href: '/budget',
    icon: TrendingUp,
    status: 'active',
    category: 'Financial',
    stats: { label: 'Budget Utilization', value: '68%', trend: 'stable' },
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Asset Manager',
    description: 'Track infrastructure assets and maintenance schedules',
    href: '/assets',
    icon: Building2,
    status: 'premium',
    category: 'Infrastructure',
    gradient: 'from-purple-500 to-violet-500'
  },
  {
    title: 'Maintenance Scheduler',
    description: 'Schedule and assign maintenance tasks',
    href: '/maintenance',
    icon: Calendar,
    status: 'premium',
    category: 'Operations',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    title: 'Contractor Portal',
    description: 'Manage contractors and live job tracking',
    href: '/contractors',
    icon: Users,
    status: 'premium',
    category: 'Operations',
    stats: { label: 'Active Contracts', value: 12, trend: 'stable' },
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    title: 'Funding Center',
    description: 'Grants, funding sources, and applications',
    href: '/funding',
    icon: DollarSign,
    status: 'active',
    category: 'Financial',
    stats: { label: 'Available Grants', value: 23, trend: 'up' },
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Cost Estimator',
    description: 'PCI-based infrastructure cost projections',
    href: '/estimates',
    icon: Calculator,
    status: 'premium',
    category: 'Financial',
    gradient: 'from-teal-500 to-cyan-500'
  },
  {
    title: 'Inspections',
    description: 'Track and manage inspection workflows',
    href: '/inspections',
    icon: ClipboardCheck,
    status: 'active',
    category: 'Operations',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    title: 'Citizen Reports',
    description: 'Fix My Road submissions and citizen feedback',
    href: '/citizen-reports',
    icon: MessageSquare,
    status: 'active',
    category: 'Public Services',
    gradient: 'from-lime-500 to-green-500'
  },
  {
    title: 'Map View',
    description: 'Geographic view of assets and issues',
    href: '/map',
    icon: MapPin,
    status: 'active',
    category: 'Infrastructure',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Public Reports',
    description: 'Generate reports for council meetings',
    href: '/reports',
    icon: FileText,
    status: 'active',
    category: 'Administrative',
    gradient: 'from-slate-500 to-gray-500'
  },
  {
    title: 'System Settings',
    description: 'Account, billing, and system configuration',
    href: '/settings',
    icon: Settings,
    status: 'active',
    category: 'System',
    gradient: 'from-gray-500 to-slate-500'
  }
];

const quickStats = [
  { label: 'Active Modules', value: modules.filter(m => m.status === 'active').length, icon: Activity, color: 'text-blue-600' },
  { label: 'Premium Features', value: modules.filter(m => m.status === 'premium').length, icon: Crown, color: 'text-amber-600' },
  { label: 'Total Issues', value: 247, icon: AlertCircle, color: 'text-red-600' },
  { label: 'Budget Used', value: '68%', icon: TrendingUp, color: 'text-green-600' }
];

const statusConfig = {
  active: { 
    icon: CheckCircle, 
    color: 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300',
    label: 'Active'
  },
  'coming-soon': { 
    icon: Clock, 
    color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300',
    label: 'Coming Soon'
  },
  premium: { 
    icon: Crown, 
    color: 'bg-amber-500/10 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300',
    label: 'Premium'
  }
};

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          Welcome to Municipal Systems - Free Plan
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Infrastructure Management Hub
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Comprehensive tools for managing roads, assets, budgets, and public services. 
          Monitor infrastructure health, track maintenance, and optimize municipal operations.
        </p>
        
        {/* Free vs Premium CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
            <PlayCircle className="w-5 h-5 mr-2" />
            Start Free Tour
          </Button>
          <Button size="lg" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/20">
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={cn("w-8 h-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Getting Started Guide */}
      <Card className="glass-card border-white/20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                New to Municipal Systems?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Get started with our guided tour to learn how each module works together 
                to provide comprehensive infrastructure management capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Take Interactive Tour
                </Button>
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Modules</h2>
          <div className="flex items-center space-x-2">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              return (
                <Badge key={status} variant="outline" className={config.color}>
                  <Icon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const statusInfo = statusConfig[module.status];
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={module.href} className="glass-card border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden relative">
                {/* Gradient background */}
                <div className={cn("absolute inset-0 opacity-5 bg-gradient-to-br", module.gradient)} />
                
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br", module.gradient)}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {module.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                            {module.category}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs", statusInfo.color)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 relative z-10">
                  <CardDescription className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {module.description}
                  </CardDescription>
                  
                  {module.stats && (
                    <div className="mb-4 p-3 bg-white/30 dark:bg-white/5 rounded-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{module.stats.label}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-800 dark:text-white">{module.stats.value}</span>
                          {module.stats.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  )}

                  <Link to={module.href}>
                    <Button 
                      className={cn(
                        "w-full group-hover:bg-blue-600 group-hover:scale-105 transition-all duration-200",
                        module.status === 'premium' ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" : 
                        module.status === 'coming-soon' ? "bg-gray-400 hover:bg-gray-500" : 
                        "bg-blue-500 hover:bg-blue-600"
                      )}
                      disabled={module.status === 'coming-soon'}
                    >
                      {module.status === 'premium' && <Crown className="w-4 h-4 mr-2" />}
                      {module.status === 'coming-soon' && <Clock className="w-4 h-4 mr-2" />}
                      {module.status === 'active' && <Eye className="w-4 h-4 mr-2" />}
                      
                      {module.status === 'coming-soon' ? 'Coming Soon' : 
                       module.status === 'premium' ? 'Upgrade Required' : 'Open Module'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Premium Upgrade Section */}
      <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
        <CardContent className="p-8">
          <div className="text-center">
            <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Unlock Premium Features
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Get access to advanced asset management, satellite PCI scans, cost estimation, 
              contractor portals, and integrations. Perfect for municipalities ready to scale.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-800 dark:text-white">Advanced Security</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Enterprise-grade security and compliance</p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-800 dark:text-white">Advanced Analytics</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Detailed insights and reporting</p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                <Globe className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-800 dark:text-white">API Integration</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Connect with existing systems</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg">
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
              <Button size="lg" variant="outline">
                Compare Plans
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

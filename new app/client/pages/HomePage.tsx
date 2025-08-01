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
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModuleCard {
  title: string;
  description: string;
  href: string;
  icon: any;
  status: 'active' | 'coming-soon' | 'beta';
  category: string;
  stats?: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
  };
}

const modules: ModuleCard[] = [
  {
    title: 'Road Inspection Dashboard',
    description: 'AI-powered road monitoring and issue tracking',
    href: '/inspection-dashboard',
    icon: Search,
    status: 'active',
    category: 'Infrastructure',
    stats: { label: 'Issues Detected', value: 247, trend: 'up' }
  },
  {
    title: 'Budget Planning',
    description: '5-year budget projections and spending analysis',
    href: '/budget',
    icon: TrendingUp,
    status: 'active',
    category: 'Financial',
    stats: { label: 'Budget Utilization', value: '68%', trend: 'stable' }
  },
  {
    title: 'Asset Manager',
    description: 'Track infrastructure assets and maintenance schedules',
    href: '/assets',
    icon: Building2,
    status: 'coming-soon',
    category: 'Infrastructure'
  },
  {
    title: 'Maintenance Scheduler',
    description: 'Schedule and assign maintenance tasks',
    href: '/maintenance',
    icon: Calendar,
    status: 'coming-soon',
    category: 'Operations'
  },
  {
    title: 'Contractor Portal',
    description: 'Manage contractors and live job tracking',
    href: '/contractors',
    icon: Users,
    status: 'active',
    category: 'Operations',
    stats: { label: 'Active Contracts', value: 12, trend: 'stable' }
  },
  {
    title: 'Funding Center',
    description: 'Grants, funding sources, and applications',
    href: '/funding',
    icon: DollarSign,
    status: 'active',
    category: 'Financial',
    stats: { label: 'Available Grants', value: 23, trend: 'up' }
  },
  {
    title: 'Cost Estimator',
    description: 'PCI-based infrastructure cost projections',
    href: '/estimates',
    icon: Calculator,
    status: 'coming-soon',
    category: 'Financial'
  },
  {
    title: 'Inspections',
    description: 'Track and manage inspection workflows',
    href: '/inspections',
    icon: ClipboardCheck,
    status: 'coming-soon',
    category: 'Operations'
  },
  {
    title: 'Citizen Reports',
    description: 'Fix My Road submissions and citizen feedback',
    href: '/citizen-reports',
    icon: MessageSquare,
    status: 'coming-soon',
    category: 'Public Services'
  },
  {
    title: 'Map View',
    description: 'Geographic view of assets and issues',
    href: '/map',
    icon: MapPin,
    status: 'active',
    category: 'Infrastructure'
  },
  {
    title: 'Public Reports',
    description: 'Generate reports for council meetings',
    href: '/reports',
    icon: FileText,
    status: 'active',
    category: 'Administrative'
  },
  {
    title: 'System Settings',
    description: 'Account, billing, and system configuration',
    href: '/settings',
    icon: Settings,
    status: 'coming-soon',
    category: 'System'
  }
];

const categoryColors = {
  'Infrastructure': 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-800',
  'Financial': 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-800',
  'Operations': 'bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-800',
  'Public Services': 'bg-purple-500/10 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-800',
  'Administrative': 'bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-800',
  'System': 'bg-slate-500/10 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-800'
};

const statusIcons = {
  active: CheckCircle,
  'coming-soon': Clock,
  beta: AlertCircle
};

const statusColors = {
  active: 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300',
  'coming-soon': 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300',
  beta: 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300'
};

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Municipal Infrastructure Management
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Comprehensive tools for managing roads, assets, budgets, and public services. 
          Monitor infrastructure health, track maintenance, and optimize municipal operations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Modules</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {modules.filter(m => m.status === 'active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">In Development</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {modules.filter(m => m.status === 'coming-soon').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Issues</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">247</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Budget Used</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">68%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Modules</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={statusColors.active}>
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
            <Badge variant="outline" className={statusColors['coming-soon']}>
              <Clock className="w-3 h-3 mr-1" />
              In Development
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const StatusIcon = statusIcons[module.status];
            
            return (
              <Card key={module.href} className="glass-card border-white/20 hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-slate-800 dark:text-white">{module.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={cn("text-xs", categoryColors[module.category as keyof typeof categoryColors])}>
                            {module.category}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs", statusColors[module.status])}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {module.status === 'coming-soon' ? 'Coming Soon' : module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-slate-600 dark:text-slate-300 mb-4">
                    {module.description}
                  </CardDescription>
                  
                  {module.stats && (
                    <div className="mb-4 p-3 bg-white/30 dark:bg-white/5 rounded-lg border border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{module.stats.label}</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{module.stats.value}</span>
                      </div>
                    </div>
                  )}

                  <Link to={module.href}>
                    <Button 
                      className={cn(
                        "w-full group-hover:bg-blue-600 transition-colors",
                        module.status === 'coming-soon' ? "bg-gray-400 hover:bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                      )}
                      disabled={module.status === 'coming-soon'}
                    >
                      {module.status === 'coming-soon' ? 'Coming Soon' : 'Open Module'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Tour CTA */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Get Started with Municipal Systems
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            New to the platform? Take a quick tour to learn how each module works together 
            to provide comprehensive infrastructure management capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Start Quick Tour
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 hover:bg-white/10">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

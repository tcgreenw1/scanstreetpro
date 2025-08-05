import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
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
  Home,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  Crown,
  Zap,
  Shield,
  UserCheck,
  CreditCard,
  HelpCircle,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePricing } from '@/contexts/PricingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization, usePermissions } from '@/contexts/OrganizationContext';
import { useFeatureMatrix, useNavFeatures } from '@/hooks/useFeatureMatrix';
import { NavItemWrapper } from '@/components/FeatureStateComponents';
import { GlobalSearch } from './GlobalSearch';
import { ConnectionStatus } from './ConnectionStatus';
import { TestPlanSwitcher } from './TestPlanSwitcher';
import { GlobalPlanIndicator } from './GlobalPlanIndicator';
import { PlanImplementationStatus } from './PlanImplementationStatus';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  featureKey: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation configuration with feature keys
const NAV_SECTIONS: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Main overview and metrics', featureKey: 'dashboard' },
      {
        name: 'Road Inspection',
        href: '/inspection-dashboard',
        icon: Search,
        description: 'AI-powered road monitoring',
        featureKey: 'roadInspection'
      }
    ]
  },
  {
    title: "Infrastructure",
    items: [
      {
        name: 'Asset Manager',
        href: '/assets',
        icon: Building2,
        description: 'Track infrastructure assets',
        featureKey: 'assetManager'
      },
      {
        name: 'Maintenance',
        href: '/maintenance',
        icon: Calendar,
        description: 'Schedule and track maintenance',
        featureKey: 'maintenance'
      },
      { name: 'Inspections', href: '/inspections', icon: ClipboardCheck, description: 'Inspection workflows', featureKey: 'inspections' },
      { name: 'Map View', href: '/map', icon: MapPin, description: 'Geographic asset view', featureKey: 'mapView' }
    ]
  },
  {
    title: "Financial",
    items: [
      {
        name: 'Budget Planning',
        href: '/budget',
        icon: TrendingUp,
        description: '5-year budget projections',
        featureKey: 'budgetPlanning'
      },
      { name: 'Cost Estimator', href: '/estimates', icon: Calculator, description: 'PCI-based cost projections', featureKey: 'costEstimator' },
      {
        name: 'Funding Center',
        href: '/funding',
        icon: DollarSign,
        description: 'Grants and funding sources',
        featureKey: 'fundingCenter'
      },
      {
        name: 'Expenses',
        href: '/expenses',
        icon: FileText,
        description: 'Track spending and costs',
        featureKey: 'expenses'
      }
    ]
  },
  {
    title: "Operations",
    items: [
      {
        name: 'Contractors',
        href: '/contractors',
        icon: Users,
        description: 'Contractor management portal',
        featureKey: 'contractors'
      },
      {
        name: 'Citizen Reports',
        href: '/citizen-reports',
        icon: MessageSquare,
        description: 'Public reporting platform',
        featureKey: 'citizenReports'
      },
      { name: 'Reports', href: '/reports', icon: FileText, description: 'Generate reports', featureKey: 'reports' }
    ]
  },
  {
    title: "System",
    items: [
      { name: 'Pricing', href: '/pricing', icon: Crown, description: 'View plans and upgrade', featureKey: 'pricing' },
      {
        name: 'Integrations',
        href: '/integrations',
        icon: Settings,
        description: 'Third-party connections',
        featureKey: 'integrations'
      },
      { name: 'Settings', href: '/settings', icon: Settings, description: 'Account and preferences', featureKey: 'settings' }
    ]
  }
];

export function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { organization } = useOrganization();
  const { userPlan } = useFeatureMatrix();
  const navFeatures = useNavFeatures();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", isDarkMode && "dark")}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={cn(
          "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 transition-all duration-300 flex flex-col shadow-2xl shadow-blue-500/10",
          isCollapsed ? "w-16" : "w-72"
        )}>
          {/* Sidebar Header */}
          <div className={cn("border-b border-white/10 transition-all duration-300", isCollapsed ? "p-3" : "p-6")}>
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="animate-slide-in">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    InfrastructureOS
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {organization?.name || 'Default Organization'} • {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="rounded-lg hover:bg-white/20 dark:hover:bg-white/10 animate-pulse-glow"
              >
                {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Search - Only show when expanded */}
            {!isCollapsed && (
              <div className="mt-4 animate-fade-in">
                <GlobalSearch />
              </div>
            )}
          </div>

          {/* Plan Indicator */}
          {!isCollapsed && (
            <div className="p-4 border-b border-white/10">
              <GlobalPlanIndicator />
              <div className="mt-2">
                <TestPlanSwitcher />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={cn("flex-1 overflow-y-auto transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
            <div className={cn("transition-all duration-300", isCollapsed ? "space-y-2" : "space-y-6")}>
              {NAV_SECTIONS.map((section) => (
                <div key={section.title}>
                  {!isCollapsed && (
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 animate-fadeInUp">
                      {section.title}
                    </h3>
                  )}
                  <div className={cn("transition-all duration-300", isCollapsed ? "space-y-1" : "space-y-1")}>
                    {section.items.map((item) => {
                      // Special handling for admin features
                      if (item.href === '/admin-portal' && !isAdmin) {
                        return null;
                      }

                      const Icon = item.icon;
                      const active = isActive(item.href);
                      const featureState = navFeatures[item.featureKey]?.state || 'shown';

                      return (
                        <NavItemWrapper
                          key={item.href}
                          state={featureState}
                          href={featureState === 'paywall' ? '/pricing' : item.href}
                          className={cn(
                            "transition-all duration-200 group relative animate-pulse-glow rounded-xl",
                            isCollapsed ? "px-2 py-3 justify-center" : "space-x-3 px-3 py-2.5",
                            active && featureState !== 'paywall'
                              ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/30 shadow-lg glow-active"
                              : ""
                          )}
                        >
                          <Icon className={cn(
                            "transition-all duration-200 group-hover:scale-110",
                            isCollapsed ? "w-6 h-6" : "w-5 h-5",
                            active && featureState !== 'paywall' 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                          )} />
                          
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0 animate-slide-in">
                              <div className="flex items-center justify-between">
                                <p className="font-medium truncate">{item.name}</p>
                              </div>
                              {item.description && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.description}</p>
                              )}
                            </div>
                          )}
                        </NavItemWrapper>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Admin Section */}
              {isAdmin && (
                <div>
                  {!isCollapsed && (
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 animate-fadeInUp">
                      Administration
                    </h3>
                  )}
                  <div className={cn("transition-all duration-300", isCollapsed ? "space-y-1" : "space-y-1")}>
                    <Link
                      to="/admin-portal"
                      className={cn(
                        "flex items-center transition-all duration-200 group relative animate-pulse-glow rounded-xl",
                        isCollapsed ? "px-2 py-3 justify-center" : "space-x-3 px-3 py-2.5",
                        isActive('/admin-portal')
                          ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/30 shadow-lg glow-active"
                          : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:shadow-md"
                      )}
                    >
                      <Shield className={cn(
                        "transition-all duration-200 group-hover:scale-110",
                        isCollapsed ? "w-6 h-6" : "w-5 h-5",
                        isActive('/admin-portal') ? "text-blue-600 dark:text-blue-400" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                      )} />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0 animate-slide-in">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">Admin Portal</p>
                          </div>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">System administration</p>
                        </div>
                      )}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Dark/Light Mode Toggle */}
          <div className={cn("border-t border-white/10 transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
            {isCollapsed ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 animate-pulse-glow"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            ) : (
              <div className="p-3 bg-gradient-to-r from-slate-100/50 to-slate-200/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/30 dark:border-slate-700/30 animate-scale-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Theme</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="rounded-full w-12 h-6 p-0 relative bg-slate-300 dark:bg-slate-600 transition-all duration-300 hover:bg-slate-400 dark:hover:bg-slate-500"
                  >
                    <div className={cn(
                      "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 flex items-center justify-center",
                      isDarkMode ? "left-6" : "left-0.5"
                    )}>
                      {isDarkMode ? <Moon className="w-3 h-3 text-slate-700" /> : <Sun className="w-3 h-3 text-yellow-500" />}
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 px-6 py-4 shadow-lg shadow-blue-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {location.pathname === '/' || location.pathname === '/dashboard' ? 'Dashboard' : 
                   location.pathname.slice(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <ConnectionStatus />
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                    3
                  </Badge>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={organization?.settings.logoUrl} alt={user?.name} />
                        <AvatarFallback>
                          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pricing" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Plan Implementation Status - only visible to admin users */}
      <PlanImplementationStatus />
    </div>
  );
}

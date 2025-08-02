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
import { GlobalSearch } from './GlobalSearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
  isPremium?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Main overview and metrics' },
      { name: 'Road Inspection', href: '/inspection-dashboard', icon: Search, description: 'AI-powered road monitoring' }
    ]
  },
  {
    title: "Infrastructure",
    items: [
      { name: 'Asset Manager', href: '/assets', icon: Building2, description: 'Track infrastructure assets', isPremium: true },
      { name: 'Maintenance', href: '/maintenance', icon: Calendar, description: 'Schedule and track maintenance', isPremium: true },
      { name: 'Inspections', href: '/inspections', icon: ClipboardCheck, description: 'Inspection workflows' },
      { name: 'Map View', href: '/map', icon: MapPin, description: 'Geographic asset view' }
    ]
  },
  {
    title: "Financial",
    items: [
      { name: 'Budget Planning', href: '/budget', icon: TrendingUp, description: '5-year budget projections' },
      { name: 'Cost Estimator', href: '/estimates', icon: Calculator, description: 'PCI-based cost projections', isPremium: true },
      { name: 'Funding Center', href: '/funding', icon: DollarSign, description: 'Grants and funding sources' },
      { name: 'Expenses', href: '/expenses', icon: FileText, description: 'Track spending and costs' }
    ]
  },
  {
    title: "Operations",
    items: [
      { name: 'Contractors', href: '/contractors', icon: Users, description: 'Contractor management portal', isPremium: true },
      { name: 'Citizen Reports', href: '/citizen-reports', icon: MessageSquare, description: 'Fix My Road submissions' },
      { name: 'Verification', href: '/verify', icon: ClipboardCheck, description: 'Issue verification workflow' },
      { name: 'Reports', href: '/reports', icon: FileText, description: 'Generate public reports' }
    ]
  },
  {
    title: "System",
    items: [
      { name: 'Pricing', href: '/pricing', icon: Crown, description: 'View plans and upgrade' },
      { name: 'Integrations', href: '/integrations', icon: Settings, description: 'System integrations', isPremium: true },
      { name: 'Settings', href: '/settings', icon: Settings, description: 'Account and billing settings' }
    ]
  }
];

const quickAccessButtons = [
  { name: 'New Inspection', href: '/inspections/new', icon: ClipboardCheck, color: 'bg-blue-500' },
  { name: 'View Map', href: '/map', icon: MapPin, color: 'bg-green-500' },
  { name: 'Contractors', href: '/contractors', icon: Users, color: 'bg-purple-500', isPremium: true },
  { name: 'Reports', href: '/reports', icon: FileText, color: 'bg-orange-500' }
];

const mockNotifications = [
  { id: '1', title: 'Critical pothole detected on Main St', time: '5 min ago', type: 'critical', unread: true },
  { id: '2', title: 'Monthly budget report ready', time: '1 hour ago', type: 'info', unread: true },
  { id: '3', title: 'Contractor ABC completed Oak Ave repair', time: '2 hours ago', type: 'success', unread: false },
  { id: '4', title: 'Inspection scheduled for Bridge #12', time: '1 day ago', type: 'info', unread: false },
  { id: '5', title: 'Grant application deadline in 3 days', time: '2 days ago', type: 'warning', unread: false }
];

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const location = useLocation();
  const { currentPlan, planDetails } = usePricing();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  // Global search keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", isDarkMode && "dark")}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"}></div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0 glass-card border-white/20">
          <MobileSidebar
            navSections={navSections}
            isActive={isActive}
            onClose={() => setIsSidebarOpen(false)}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:overflow-y-auto glass-card border-r border-white/20 transition-all duration-300",
        isSidebarCollapsed ? "lg:w-16" : "lg:w-72"
      )}>
        <DesktopSidebar
          navSections={navSections}
          isActive={isActive}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </aside>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", isSidebarCollapsed ? "lg:ml-16" : "lg:ml-72")}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass-card border-b border-white/20 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              {/* Page title */}
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {navSections.flatMap(s => s.items).find(item => isActive(item.href))?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {navSections.flatMap(s => s.items).find(item => isActive(item.href))?.description || 'Infrastructure management system'}
                </p>
              </div>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search assets, inspections, contractors... (⌘K)"
                  readOnly
                  onClick={() => setIsGlobalSearchOpen(true)}
                  className="pl-10 pr-16 glass-card border-white/30 bg-white/50 dark:bg-black/20 cursor-pointer"
                />
                <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              {/* Current plan badge */}
              <Badge variant="outline" className={cn(
                "hidden sm:flex",
                currentPlan === 'free' ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800" :
                currentPlan === 'standard' ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" :
                currentPlan === 'pro' ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800" :
                "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
              )}>
                {currentPlan === 'enterprise' ? <Crown className="w-3 h-3 mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
                {planDetails.name} Plan
              </Badge>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center p-0">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 glass-card border-white/20">
                  <div className="p-3 border-b border-white/10">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <p className="text-xs text-slate-500">{unreadCount} unread</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer",
                          notification.unread && "bg-blue-50/50 dark:bg-blue-900/20"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-white/10">
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      View All Notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Account menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-blue-500 text-white">MU</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card border-white/20">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">Scan Street Pro User</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Infrastructure Admin</p>
                    <Badge variant="outline" className={cn(
                      "mt-1 text-xs",
                      currentPlan === 'free' ? "bg-blue-50 text-blue-700 border-blue-200" :
                      currentPlan === 'standard' ? "bg-green-50 text-green-700 border-green-200" :
                      currentPlan === 'pro' ? "bg-purple-50 text-purple-700 border-purple-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {currentPlan === 'enterprise' ? <Crown className="w-3 h-3 mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
                      {planDetails.name} Plan
                    </Badge>
                  </div>
                  <DropdownMenuItem>
                    <UserCheck className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  {currentPlan !== 'enterprise' && (
                    <DropdownMenuItem asChild>
                      <Link to="/pricing">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {currentPlan === 'free' ? 'Upgrade Plan' :
                             currentPlan === 'standard' ? 'Upgrade to Pro' :
                             'View Pricing'}
                          </span>
                          <Crown className="w-4 h-4 text-amber-500" />
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={toggleTheme}>
                    {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Quick Access Bar */}
        <div className="border-b border-white/20 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
          <div className="px-4 py-3">
            <div className="flex items-center space-x-3 overflow-x-auto">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Quick Access:</span>
              {quickAccessButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <Link
                    key={button.href}
                    to={button.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      "bg-white/50 hover:bg-white/70 dark:bg-white/10 dark:hover:bg-white/20 border border-white/30",
                      button.isPremium && "opacity-60 cursor-not-allowed"
                    )}
                    onClick={(e) => button.isPremium && e.preventDefault()}
                  >
                    <div className={cn("w-4 h-4 rounded-full flex items-center justify-center", button.color)}>
                      <Icon className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>{button.name}</span>
                    {button.isPremium && <Crown className="w-3 h-3 text-amber-500" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Global Search */}
      <GlobalSearch
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
      />
    </div>
  );
}

// Desktop Sidebar Component
function DesktopSidebar({
  navSections,
  isActive,
  isCollapsed,
  onToggleCollapse,
  isDarkMode,
  toggleTheme
}: {
  navSections: NavSection[],
  isActive: (href: string) => boolean,
  isCollapsed: boolean,
  onToggleCollapse: () => void,
  isDarkMode: boolean,
  toggleTheme: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn("border-b border-white/10 transition-all duration-300", isCollapsed ? "p-3" : "p-6")}>
        <div className="flex items-center justify-between">
          <Link to="/" className={cn("flex items-center transition-all duration-300", isCollapsed ? "space-x-0" : "space-x-3")}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="animate-slide-in">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Scan Street Pro</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Infrastructure Management</p>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
                    FREE
                  </Badge>
                </div>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10 animate-pulse-glow"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className={cn("w-4 h-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
        <div className={cn("transition-all duration-300", isCollapsed ? "space-y-2" : "space-y-6")}>
          {navSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 animate-fadeInUp">
                  {section.title}
                </h3>
              )}
              <div className={cn("transition-all duration-300", isCollapsed ? "space-y-1" : "space-y-1")}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center transition-all duration-200 group relative animate-pulse-glow rounded-xl",
                        isCollapsed ? "px-2 py-3 justify-center" : "space-x-3 px-3 py-2.5",
                        active
                          ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/30 shadow-lg glow-active"
                          : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:shadow-md",
                        item.isPremium && !active && "opacity-70"
                      )}
                      title={isCollapsed ? `${item.name}${item.description ? ` - ${item.description}` : ''}` : undefined}
                    >
                      <Icon className={cn(
                        "transition-all duration-200 group-hover:scale-110",
                        isCollapsed ? "w-6 h-6" : "w-5 h-5",
                        active ? "text-blue-600 dark:text-blue-400" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                      )} />
                      {item.isPremium && isCollapsed && (
                        <Crown className="absolute -top-1 -right-1 w-3 h-3 text-amber-500" />
                      )}
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0 animate-slide-in">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{item.name}</p>
                            {item.isPremium && <Crown className="w-3 h-3 text-amber-500 ml-2" />}
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.description}</p>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
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

      {/* Upgrade CTA */}
      <div className={cn("border-t border-white/10 transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
        {isCollapsed ? (
          <Link to="/pricing">
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 animate-pulse-glow"
              title="See pricing and included features - Upgrade to Premium"
            >
              <Crown className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/30 dark:border-blue-800/30 animate-scale-up">
            <div className="flex items-center space-x-3 mb-3">
              <Crown className="w-6 h-6 text-amber-500 animate-pulse-glow" />
              <div className="animate-slide-in">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Upgrade to Premium</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Unlock advanced features</p>
              </div>
            </div>
            <Link to="/pricing">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 animate-pulse-glow"
                title="See pricing and included features"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile Sidebar Component
function MobileSidebar({
  navSections,
  isActive,
  onClose,
  isDarkMode,
  toggleTheme
}: {
  navSections: NavSection[],
  isActive: (href: string) => boolean,
  onClose: () => void,
  isDarkMode: boolean,
  toggleTheme: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3" onClick={onClose}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">Scan Street Pro</h1>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">FREE</Badge>
            </div>
          </Link>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200",
                        active
                          ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/30"
                          : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10",
                        item.isPremium && !active && "opacity-70"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", active ? "text-blue-600 dark:text-blue-400" : "text-slate-500")} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{item.name}</p>
                          {item.isPremium && <Crown className="w-3 h-3 text-amber-500" />}
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-400 dark:text-slate-500">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Dark/Light Mode Toggle for Mobile */}
      <div className="p-4 border-t border-white/10">
        <div className="p-3 bg-gradient-to-r from-slate-100/50 to-slate-200/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
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
      </div>
    </div>
  );
}

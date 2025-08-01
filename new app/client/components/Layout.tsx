import { ReactNode, useState } from 'react';
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
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { name: 'Municipal Dashboard', href: '/dashboard', icon: Home, description: 'Main overview and metrics' },
      { name: 'Road Inspection', href: '/inspection-dashboard', icon: Search, description: 'AI-powered road monitoring' }
    ]
  },
  {
    title: "Infrastructure",
    items: [
      { name: 'Asset Manager', href: '/assets', icon: Building2, description: 'Track infrastructure assets' },
      { name: 'Maintenance', href: '/maintenance', icon: Calendar, description: 'Schedule and track maintenance' },
      { name: 'Inspections', href: '/inspections', icon: ClipboardCheck, description: 'Inspection workflows' },
      { name: 'Map View', href: '/map', icon: MapPin, description: 'Geographic asset view' }
    ]
  },
  {
    title: "Financial",
    items: [
      { name: 'Budget Planning', href: '/budget', icon: TrendingUp, description: '5-year budget projections' },
      { name: 'Cost Estimator', href: '/estimates', icon: Calculator, description: 'PCI-based cost projections' },
      { name: 'Funding Center', href: '/funding', icon: DollarSign, description: 'Grants and funding sources' },
      { name: 'Expenses', href: '/expenses', icon: FileText, description: 'Track spending and costs' }
    ]
  },
  {
    title: "Operations",
    items: [
      { name: 'Contractors', href: '/contractors', icon: Users, description: 'Contractor management portal' },
      { name: 'Citizen Reports', href: '/citizen-reports', icon: MessageSquare, description: 'Fix My Road submissions' },
      { name: 'Verification', href: '/verify', icon: ClipboardCheck, description: 'Issue verification workflow' },
      { name: 'Reports', href: '/reports', icon: FileText, description: 'Generate public reports' }
    ]
  },
  {
    title: "System",
    items: [
      { name: 'Integrations', href: '/integrations', icon: Settings, description: 'System integrations' },
      { name: 'Settings', href: '/settings', icon: Settings, description: 'Account and billing settings' }
    ]
  }
];

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", isDarkMode && "dark")}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"}></div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 glass-card border-r border-white/20 transform transition-transform duration-300 ease-in-out z-50",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white">Municipal Systems</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Infrastructure Management</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
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
                          onClick={() => setIsSidebarOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                            active
                              ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/30 shadow-sm"
                              : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                          )}
                          title={item.description}
                        >
                          <Icon className={cn("w-5 h-5 transition-colors", active ? "text-blue-600 dark:text-blue-400" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300")} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{item.description}</p>
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

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>MU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Municipal User</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Infrastructure Admin</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
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
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass-card border-b border-white/20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {navSections.flatMap(s => s.items).find(item => isActive(item.href))?.name || 'Municipal Dashboard'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {navSections.flatMap(s => s.items).find(item => isActive(item.href))?.description || 'Infrastructure management system'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

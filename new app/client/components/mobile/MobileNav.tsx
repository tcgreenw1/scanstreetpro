import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Home, 
  Camera, 
  MapPin, 
  Settings, 
  Bell,
  User,
  BarChart3
} from "lucide-react";

interface MobileNavProps {
  currentStats: {
    pendingReview: number;
    totalIssues: number;
  };
}

export function MobileNav({ currentStats }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/", active: true },
    { icon: Camera, label: "Verify", href: "/verify", badge: currentStats.pendingReview },
    { icon: MapPin, label: "Map View", href: "/map" },
    { icon: BarChart3, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="h-9 w-9 p-0"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Road Inspector</h1>
              <p className="text-xs text-muted-foreground">
                {currentStats.pendingReview} pending
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">Road Inspector</h2>
                  <p className="text-xs text-muted-foreground">City Department</p>
                </div>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "default" : "ghost"}
                  className="w-full justify-start h-12"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Today's Progress</p>
                <p className="text-xs text-muted-foreground">
                  {currentStats.totalIssues - currentStats.pendingReview} issues reviewed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Quick Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t z-30">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Button variant="ghost" className="flex flex-col h-16 text-xs">
            <Home className="w-5 h-5 mb-1" />
            Dashboard
          </Button>
          <Button variant="ghost" className="flex flex-col h-16 text-xs relative">
            <Camera className="w-5 h-5 mb-1" />
            Verify
            {currentStats.pendingReview > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center">
                {currentStats.pendingReview > 9 ? '9+' : currentStats.pendingReview}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" className="flex flex-col h-16 text-xs">
            <MapPin className="w-5 h-5 mb-1" />
            Map
          </Button>
          <Button variant="ghost" className="flex flex-col h-16 text-xs">
            <BarChart3 className="w-5 h-5 mb-1" />
            Reports
          </Button>
        </div>
      </div>
    </>
  );
}

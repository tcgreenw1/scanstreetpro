import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  Grid3X3, 
  List, 
  Filter,
  Bell,
  Settings,
  MapPin,
  Calendar
} from "lucide-react";
import { DashboardStats } from "@shared/api";

interface DashboardHeaderProps {
  stats: DashboardStats;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  selectedCount: number;
  onBulkAction: (action: 'confirm' | 'reject', issueIds: string[]) => void;
  selectedIssues: string[];
}

export function DashboardHeader({ 
  stats, 
  viewMode, 
  onViewModeChange, 
  selectedCount,
  onBulkAction,
  selectedIssues 
}: DashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Date */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Road Inspector Dashboard
              </h1>
              <Badge variant="secondary" className="glass-card">
                <MapPin className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{currentDate}</span>
              <Badge variant="outline" className="ml-2">
                {stats.recentActivity.issuesReviewed} reviewed today
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="p-3 glass-card">
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">
                  {stats.pendingReview}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </Card>
            <Card className="p-3 glass-card">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {stats.confirmedIssues}
                </div>
                <div className="text-xs text-muted-foreground">Confirmed</div>
              </div>
            </Card>
            <Card className="p-3 glass-card">
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                  {stats.rejectedIssues}
                </div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
            </Card>
            <Card className="p-3 glass-card">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {stats.avgPciScore}
                </div>
                <div className="text-xs text-muted-foreground">Avg PCI</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          {/* Selection Actions */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 animate-fade-in">
              <Badge variant="secondary" className="glass-card">
                {selectedCount} selected
              </Badge>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onBulkAction('confirm', selectedIssues)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirm All
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onBulkAction('reject', selectedIssues)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject All
              </Button>
            </div>
          )}

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                onClick={() => onViewModeChange('table')}
                className={viewMode === 'table' ? 'shadow-sm' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => onViewModeChange('grid')}
                className={viewMode === 'grid' ? 'shadow-sm' : ''}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
            
            <Button size="sm" variant="outline" className="glass-card">
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
            
            <Button size="sm" variant="outline" className="glass-card">
              <Bell className="w-4 h-4" />
            </Button>
            
            <Button size="sm" variant="outline" className="glass-card">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

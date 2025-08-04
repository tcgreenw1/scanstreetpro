import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { IssuesTable } from "@/components/dashboard/IssuesTable";
import { IssueFilters } from "@/components/dashboard/IssueFilters";
import { MobileNav } from "@/components/mobile/MobileNav";
import { ScanIssue, FilterOptions, DashboardStats } from "@shared/api";

// Mock data for development - will be replaced with API calls
const mockStats: DashboardStats = {
  totalIssues: 247,
  pendingReview: 43,
  confirmedIssues: 156,
  rejectedIssues: 48,
  avgPciScore: 65,
  issuesByType: {
    pothole: 45,
    crack: 89,
    low_pci: 67,
    surface_deterioration: 32,
    edge_cracking: 12,
    alligator_cracking: 2
  },
  issuesBySeverity: {
    low: 123,
    medium: 89,
    high: 35
  },
  recentActivity: {
    issuesReviewed: 28,
    tasksCreated: 19,
    period: "today"
  }
};

const mockIssues: ScanIssue[] = [
  {
    id: "1",
    imageUrl: "/placeholder.svg",
    overlayImageUrl: "/placeholder.svg",
    issueType: "pothole",
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: "123 Main St",
      roadName: "Main Street",
      segment: "A-15"
    },
    pciScore: 45,
    aiSuggestion: "patching",
    status: "pending",
    aiConfidence: 0.89,
    detectedAt: "2024-01-15T09:30:00Z",
    severity: "high",
    dimensions: {
      length: 0.8,
      width: 0.6,
      depth: 0.15
    }
  },
  {
    id: "2",
    imageUrl: "/placeholder.svg",
    overlayImageUrl: "/placeholder.svg", 
    issueType: "crack",
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: "456 Oak Ave",
      roadName: "Oak Avenue",
      segment: "B-22"
    },
    pciScore: 72,
    aiSuggestion: "crack_sealing",
    status: "pending",
    aiConfidence: 0.95,
    detectedAt: "2024-01-15T10:15:00Z",
    severity: "medium",
    dimensions: {
      length: 2.1,
      width: 0.02
    }
  },
  {
    id: "3",
    imageUrl: "/placeholder.svg",
    overlayImageUrl: "/placeholder.svg",
    issueType: "low_pci",
    location: {
      latitude: 40.6892,
      longitude: -74.0445,
      address: "789 Pine Rd",
      roadName: "Pine Road",
      segment: "C-08"
    },
    pciScore: 35,
    aiSuggestion: "overlay",
    status: "confirmed",
    aiConfidence: 0.78,
    detectedAt: "2024-01-15T11:45:00Z",
    severity: "high"
  }
];

export default function Index() {
  const [issues, setIssues] = useState<ScanIssue[]>(mockIssues);
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Fetch real data from API
    // fetchIssues(filters);
    // fetchStats();
  }, [filters]);

  // Safe responsive detection for view mode
  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        setViewMode(window.innerWidth < 768 ? 'grid' : 'table');
      }
    };

    checkScreenSize();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleIssueUpdate = (issueId: string, updates: Partial<ScanIssue>) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, ...updates } : issue
    ));
  };

  const handleBulkAction = (action: 'confirm' | 'reject', issueIds: string[]) => {
    setIssues(prev => prev.map(issue => 
      issueIds.includes(issue.id) ? { ...issue, status: action === 'confirm' ? 'confirmed' : 'rejected' } : issue
    ));
    setSelectedIssues([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"}></div>
      </div>

      <div className="relative z-10">
        {/* Mobile Navigation */}
        <MobileNav currentStats={{
          pendingReview: stats.pendingReview,
          totalIssues: stats.totalIssues
        }} />

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <DashboardHeader
            stats={stats}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={selectedIssues.length}
            onBulkAction={handleBulkAction}
            selectedIssues={selectedIssues}
          />
        </div>

        <main className="container mx-auto px-4 py-6 space-y-6 pb-20 lg:pb-6">
          <StatsOverview stats={stats} />

          {/* Mobile: Stack layout, Desktop: Side-by-side */}
          <div className="mobile-stack lg:grid lg:grid-cols-4 gap-6">
            {/* Filters - Mobile: Full width collapsible, Desktop: Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:block">
                <IssueFilters
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Issues Table - Responsive */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="mobile-table">
                <IssuesTable
                  issues={issues}
                  viewMode={viewMode}
                  selectedIssues={selectedIssues}
                  onSelectionChange={setSelectedIssues}
                  onIssueUpdate={handleIssueUpdate}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

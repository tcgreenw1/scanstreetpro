import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Plus,
  Filter,
  Download,
  TrendingUp,
  Users,
  FileText,
  Zap,
  Crown,
  PlayCircle,
  BarChart3,
  Navigation,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePricing, FeatureGate, UpgradePrompt } from '@/contexts/PricingContext';

// Mock inspection data with timeline
const mockInspections = [
  {
    id: 'INS001',
    roadName: 'Main Street',
    location: 'Main St & 1st Ave',
    date: '2024-01-20',
    status: 'completed',
    stage: 'Completed',
    pciScore: 68,
    issuesFound: 3,
    inspector: 'John Smith',
    priority: 'Medium',
    images: 4,
    reportGenerated: true,
    workOrderCreated: false,
    timeline: [
      { stage: 'Scheduled', date: '2024-01-18', status: 'completed' },
      { stage: 'In Progress', date: '2024-01-20', status: 'completed' },
      { stage: 'Under Review', date: '2024-01-20', status: 'completed' },
      { stage: 'Completed', date: '2024-01-20', status: 'completed' }
    ]
  },
  {
    id: 'INS002',
    roadName: 'Oak Avenue',
    location: 'Oak Ave (Full Length)',
    date: '2024-01-22',
    status: 'under-review',
    stage: 'Under Review',
    pciScore: 45,
    issuesFound: 8,
    inspector: 'Sarah Johnson',
    priority: 'High',
    images: 12,
    reportGenerated: false,
    workOrderCreated: false,
    timeline: [
      { stage: 'Scheduled', date: '2024-01-21', status: 'completed' },
      { stage: 'In Progress', date: '2024-01-22', status: 'completed' },
      { stage: 'Under Review', date: '2024-01-22', status: 'current' },
      { stage: 'Completed', date: null, status: 'pending' }
    ]
  },
  {
    id: 'INS003',
    roadName: 'Pine Road',
    location: 'Pine Rd & Highway 12',
    date: '2024-01-25',
    status: 'in-progress',
    stage: 'In Progress',
    pciScore: null,
    issuesFound: null,
    inspector: 'Mike Rodriguez',
    priority: 'Low',
    images: 0,
    reportGenerated: false,
    workOrderCreated: false,
    timeline: [
      { stage: 'Scheduled', date: '2024-01-24', status: 'completed' },
      { stage: 'In Progress', date: '2024-01-25', status: 'current' },
      { stage: 'Under Review', date: null, status: 'pending' },
      { stage: 'Completed', date: null, status: 'pending' }
    ]
  },
  {
    id: 'INS004',
    roadName: 'City Center Loop',
    location: 'Downtown Business District',
    date: '2024-01-28',
    status: 'scheduled',
    stage: 'Scheduled',
    pciScore: null,
    issuesFound: null,
    inspector: 'Emily Davis',
    priority: 'Medium',
    images: 0,
    reportGenerated: false,
    workOrderCreated: false,
    timeline: [
      { stage: 'Scheduled', date: '2024-01-28', status: 'current' },
      { stage: 'In Progress', date: null, status: 'pending' },
      { stage: 'Under Review', date: null, status: 'pending' },
      { stage: 'Completed', date: null, status: 'pending' }
    ]
  }
];

const statusConfig = {
  scheduled: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300',
    icon: Calendar,
    label: 'Scheduled'
  },
  'in-progress': { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300',
    icon: Clock,
    label: 'In Progress'
  },
  'under-review': { 
    color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300',
    icon: Eye,
    label: 'Under Review'
  },
  completed: { 
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300',
    icon: CheckCircle,
    label: 'Completed'
  }
};

const priorityConfig = {
  Low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300',
  High: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300'
};

export default function RoadInspection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null);
  const { currentPlan, hasFeature } = usePricing();

  const filteredInspections = mockInspections.filter(inspection => {
    const matchesSearch = inspection.roadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || inspection.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: mockInspections.length,
    completed: mockInspections.filter(i => i.status === 'completed').length,
    inProgress: mockInspections.filter(i => i.status === 'in-progress').length,
    scheduled: mockInspections.filter(i => i.status === 'scheduled').length,
    avgPci: Math.round(mockInspections.filter(i => i.pciScore).reduce((acc, i) => acc + i.pciScore!, 0) / mockInspections.filter(i => i.pciScore).length),
    totalIssues: mockInspections.reduce((acc, i) => acc + (i.issuesFound || 0), 0)
  };

  const TimelineView = ({ inspection }: { inspection: any }) => (
    <div className="space-y-4">
      {inspection.timeline.map((stage: any, index: number) => {
        const isCompleted = stage.status === 'completed';
        const isCurrent = stage.status === 'current';
        const isPending = stage.status === 'pending';
        
        return (
          <div key={index} className="flex items-center space-x-4">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border-2",
              isCompleted ? "bg-green-500 border-green-500" :
              isCurrent ? "bg-blue-500 border-blue-500" :
              "bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
            )}>
              {isCompleted ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : isCurrent ? (
                <Clock className="w-4 h-4 text-white" />
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={cn(
                  "font-medium",
                  isCompleted ? "text-green-700 dark:text-green-300" :
                  isCurrent ? "text-blue-700 dark:text-blue-300" :
                  "text-gray-500 dark:text-gray-400"
                )}>
                  {stage.stage}
                </h4>
                {stage.date && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(stage.date).toLocaleDateString()}
                  </span>
                )}
              </div>
              {isCurrent && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Currently in progress
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Road Inspections</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Track and manage infrastructure inspection progress
          </p>
          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            City Management View
          </Badge>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <FeatureGate feature="hasInspectionTools" fallback={
            <Button variant="outline" size="sm" disabled>
              <Download className="w-4 h-4 mr-2" />
              Export (Premium)
            </Button>
          }>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </FeatureGate>
          <FeatureGate feature="hasInspectionTools" fallback={
            <Button size="sm" disabled className="bg-gray-400">
              <Plus className="w-4 h-4 mr-2" />
              Schedule (Premium)
            </Button>
          }>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Inspection
            </Button>
          </FeatureGate>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Inspections</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.avgPci}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg PCI Score</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.totalIssues}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Issues</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Feature Showcase */}
      {!hasFeature('hasInspectionTools') && (
        <UpgradePrompt feature="hasInspectionTools" className="mb-6">
          <div className="flex items-center justify-between mt-3">
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                Unlock Advanced Inspection Tools
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Get mobile forms, GPS tracking, photo capture, and automated reporting
              </p>
            </div>
            <Link to="/pricing">
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                title="See pricing and included features"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        </UpgradePrompt>
      )}

      {/* Search and Filters */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by road name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inspections List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredInspections.map((inspection) => {
          const statusInfo = statusConfig[inspection.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={inspection.id} className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Inspection Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                          {inspection.roadName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{inspection.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(inspection.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{inspection.inspector}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <Badge variant="outline" className={priorityConfig[inspection.priority as keyof typeof priorityConfig]}>
                          {inspection.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">PCI Score</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                          {inspection.pciScore || 'TBD'}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Issues Found</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                          {inspection.issuesFound || 'TBD'}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Photos</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                          {inspection.images}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Progress</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                          {Math.round((inspection.timeline.filter(t => t.status === 'completed').length / inspection.timeline.length) * 100)}%
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {inspection.images > 0 && (
                        <FeatureGate feature="hasInspectionTools" fallback={
                          <Button variant="outline" size="sm" disabled>
                            <Camera className="w-4 h-4 mr-2" />
                            Photos (Premium)
                          </Button>
                        }>
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            View Photos ({inspection.images})
                          </Button>
                        </FeatureGate>
                      )}
                      {inspection.reportGenerated && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="lg:col-span-1">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Inspection Timeline</h4>
                    <TimelineView inspection={inspection} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredInspections.length === 0 && (
        <Card className="glass-card border-white/20">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
              No inspections found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Try adjusting your search criteria or schedule a new inspection
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Inspection
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ClipboardList,
  Camera,
  MapPin,
  Calendar,
  Plus,
  Search,
  Filter,
  Crown,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Upload,
  Download,
  Edit,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { useRoadInspectionsFeatures } from '@/hooks/useFeatureMatrix';

interface RoadInspection {
  id: string;
  roadId: string;
  roadName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  inspector: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'approved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  pciScore: number;
  surfaceType: string;
  distressTypes: string[];
  photos: number;
  weatherConditions: string;
  trafficVolume: string;
  findings: string;
  recommendations: string;
  isSampleData?: boolean;
}

// Sample data for free plan
const sampleInspections: RoadInspection[] = [
  {
    id: 'INS-SAMPLE-001',
    roadId: 'RD-SAMPLE-001',
    roadName: 'Main Street Demo',
    location: 'Downtown District (Sample)',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    inspector: 'Demo Inspector',
    date: '2024-01-15',
    status: 'completed',
    priority: 'medium',
    pciScore: 72,
    surfaceType: 'Asphalt',
    distressTypes: ['Cracking', 'Rutting'],
    photos: 8,
    weatherConditions: 'Clear',
    trafficVolume: 'High',
    findings: 'Sample finding: Moderate surface distress observed',
    recommendations: 'Sample recommendation: Schedule preventive maintenance',
    isSampleData: true
  },
  {
    id: 'INS-SAMPLE-002',
    roadId: 'RD-SAMPLE-002',
    roadName: 'Oak Avenue Demo',
    location: 'Residential Area (Sample)',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    inspector: 'Demo Inspector',
    date: '2024-01-20',
    status: 'in-progress',
    priority: 'high',
    pciScore: 45,
    surfaceType: 'Asphalt',
    distressTypes: ['Potholes', 'Edge Cracking'],
    photos: 12,
    weatherConditions: 'Overcast',
    trafficVolume: 'Medium',
    findings: 'Sample finding: Significant deterioration requiring attention',
    recommendations: 'Sample recommendation: Schedule repair within 30 days',
    isSampleData: true
  }
];

// Real data for paid plans
const realInspections: RoadInspection[] = [
  {
    id: 'INS-001',
    roadId: 'RD-001',
    roadName: 'Main Street',
    location: 'Downtown District (1st to 5th Ave)',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    inspector: 'John Mitchell',
    date: '2024-04-15',
    status: 'completed',
    priority: 'medium',
    pciScore: 72,
    surfaceType: 'Asphalt',
    distressTypes: ['Longitudinal Cracking', 'Transverse Cracking'],
    photos: 15,
    weatherConditions: 'Clear, 65°F',
    trafficVolume: 'High (>10,000 ADT)',
    findings: 'Moderate surface distress with 15% cracking. Good structural integrity maintained.',
    recommendations: 'Schedule crack sealing within 6 months. Monitor for progression.'
  },
  {
    id: 'INS-002',
    roadId: 'RD-002',
    roadName: 'Oak Avenue',
    location: 'Residential District (Mile 1-3)',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    inspector: 'Sarah Johnson',
    date: '2024-04-20',
    status: 'approved',
    priority: 'low',
    pciScore: 85,
    surfaceType: 'Concrete',
    distressTypes: ['Minor Joint Spalling'],
    photos: 8,
    weatherConditions: 'Partly Cloudy, 70°F',
    trafficVolume: 'Medium (5,000-8,000 ADT)',
    findings: 'Excellent overall condition. Minor joint deterioration at intersections.',
    recommendations: 'Continue routine maintenance schedule. Re-inspect in 18 months.'
  },
  {
    id: 'INS-003',
    roadId: 'RD-003',
    roadName: 'Industrial Boulevard',
    location: 'Industrial Zone (Factory District)',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    inspector: 'Mike Rodriguez',
    date: '2024-04-25',
    status: 'in-progress',
    priority: 'urgent',
    pciScore: 35,
    surfaceType: 'Asphalt',
    distressTypes: ['Alligator Cracking', 'Potholes', 'Rutting'],
    photos: 25,
    weatherConditions: 'Clear, 68°F',
    trafficVolume: 'Very High (>15,000 ADT)',
    findings: 'Severe structural and surface distress. Multiple potholes and extensive alligator cracking.',
    recommendations: 'Immediate reconstruction required. Temporary patching for safety until reconstruction.'
  }
];

export default function RoadInspections() {
  const roadInspectionsFeatures = useRoadInspectionsFeatures();
  
  // Determine data source based on plan
  const inspections = roadInspectionsFeatures.dataSource.useSampleData ? sampleInspections : realInspections;
  const [filteredInspections, setFilteredInspections] = useState(inspections);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedInspection, setSelectedInspection] = useState<RoadInspection | null>(null);
  const [isAddingInspection, setIsAddingInspection] = useState(false);

  // Filter inspections
  useEffect(() => {
    let filtered = inspections.filter(inspection => {
      const matchesSearch = inspection.roadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inspection.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || inspection.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    setFilteredInspections(filtered);
  }, [inspections, searchTerm, statusFilter, priorityFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200"><Calendar className="w-3 h-3 mr-1" />Scheduled</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPCIColor = (pci: number) => {
    if (pci >= 80) return 'text-green-600';
    if (pci >= 60) return 'text-yellow-600';
    if (pci >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const addNewInspection = async () => {
    if (!roadInspectionsFeatures.dataSource.useRealData) {
      alert('Creating new inspections requires a paid plan with real data access.');
      return;
    }
    // In real app, this would make API call to create inspection
    alert('New inspection would be created via API call to /api/inspections');
    setIsAddingInspection(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Road Inspections
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {roadInspectionsFeatures.dataSource.useSampleData
            ? '📊 SAMPLE DATA - View sample road inspection data. Upgrade to access real inspection management.'
            : '✅ REAL DATA - Complete road inspection management with live database integration and full editing capabilities.'
          }
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            {filteredInspections.length} Inspections
          </Badge>
          {roadInspectionsFeatures.dataSource.useSampleData && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300">
              Sample Data Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Upgrade Card for Free Plan */}
      {roadInspectionsFeatures.upgradeCard.show && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Unlock Real Road Inspection Data
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to Basic plan to access real inspection data, create new inspections, 
                edit existing records, and connect to your live database.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Real Data Access</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connect to live inspection database</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Edit className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Full Editing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Create, edit, and manage inspections</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Advanced Analytics</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Detailed reporting and insights</p>
                </div>
              </div>
              
              <Link to="/pricing">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Basic Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search inspections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-white/30"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 glass-card border-white/30">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40 glass-card border-white/30">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                disabled={roadInspectionsFeatures.dataSource.useSampleData}
                className={roadInspectionsFeatures.dataSource.useSampleData ? "opacity-50" : ""}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Dialog open={isAddingInspection} onOpenChange={setIsAddingInspection}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Inspection
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl glass-card border-white/20">
                  <DialogHeader>
                    <DialogTitle>Create New Road Inspection</DialogTitle>
                    <DialogDescription>
                      Schedule a new road inspection with automated PCI assessment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Road Name</Label>
                      <Input placeholder="e.g., Main Street" className="glass-card border-white/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Inspector</Label>
                      <Select>
                        <SelectTrigger className="glass-card border-white/30">
                          <SelectValue placeholder="Select inspector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Mitchell</SelectItem>
                          <SelectItem value="sarah">Sarah Johnson</SelectItem>
                          <SelectItem value="mike">Mike Rodriguez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input placeholder="Street address or description" className="glass-card border-white/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Scheduled Date</Label>
                      <Input type="date" className="glass-card border-white/30" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Notes</Label>
                      <Textarea placeholder="Additional inspection notes..." className="glass-card border-white/30" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingInspection(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNewInspection}>Create Inspection</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspections Table */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-white">Road Inspections</CardTitle>
          <CardDescription>
            {roadInspectionsFeatures.dataSource.useSampleData 
              ? "Sample inspection data for demonstration purposes"
              : "Complete road inspection records with real-time data"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Road</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>PCI Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.map((inspection) => (
                  <TableRow key={inspection.id} className={inspection.isSampleData ? "bg-blue-50/50 dark:bg-blue-900/20" : ""}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">{inspection.roadName}</div>
                          <div className="text-sm text-slate-500">{inspection.location}</div>
                        </div>
                        {inspection.isSampleData && (
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                            Sample
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{inspection.inspector}</TableCell>
                    <TableCell>{new Date(inspection.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                    <TableCell>{getPriorityBadge(inspection.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={cn("font-medium", getPCIColor(inspection.pciScore))}>
                          {inspection.pciScore}
                        </span>
                        <div className="w-16">
                          <Progress value={inspection.pciScore} className="h-2" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedInspection(inspection)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Details Modal */}
      {selectedInspection && (
        <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-white/20">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" />
                Road Inspection Details - {selectedInspection.id}
              </DialogTitle>
              <DialogDescription>
                {selectedInspection.roadName} • {new Date(selectedInspection.date).toLocaleDateString()}
                {selectedInspection.isSampleData && " • Sample Data"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Road Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Road ID:</span>
                      <span>{selectedInspection.roadId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Surface Type:</span>
                      <span>{selectedInspection.surfaceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Traffic Volume:</span>
                      <span>{selectedInspection.trafficVolume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Weather:</span>
                      <span>{selectedInspection.weatherConditions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Photos Taken:</span>
                      <span>{selectedInspection.photos}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Distress Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInspection.distressTypes.map((distress, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {distress}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">PCI Assessment</h4>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className={cn("text-4xl font-bold mb-2", getPCIColor(selectedInspection.pciScore))}>
                      {selectedInspection.pciScore}
                    </div>
                    <Progress value={selectedInspection.pciScore} className="h-3 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedInspection.pciScore >= 80 ? 'Excellent' :
                       selectedInspection.pciScore >= 60 ? 'Good' :
                       selectedInspection.pciScore >= 40 ? 'Fair' : 'Poor'} Condition
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Inspector Findings</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    {selectedInspection.findings}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Recommendations</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    {selectedInspection.recommendations}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedInspection(null)}>
                Close
              </Button>
              {roadInspectionsFeatures.dataSource.useRealData && (
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Inspection
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Inspections</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {filteredInspections.length}
                </p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Avg PCI Score</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {Math.round(filteredInspections.reduce((sum, i) => sum + i.pciScore, 0) / filteredInspections.length) || 0}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {filteredInspections.filter(i => i.status === 'completed' || i.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">High Priority</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {filteredInspections.filter(i => i.priority === 'high' || i.priority === 'urgent').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

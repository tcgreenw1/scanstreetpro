import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ClipboardList,
  Camera,
  MapPin,
  Calendar,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  Crown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Smartphone,
  WifiOff,
  FileText,
  Video,
  Edit,
  Signature,
  Bell,
  BarChart3,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

interface Inspection {
  id: string;
  assetId: string;
  assetType: 'road' | 'sidewalk' | 'bridge' | 'drainage';
  location: string;
  coordinates: { lat: number; lng: number };
  inspector: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'approved' | 'requires-action';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  findings: string[];
  photos: number;
  videos: number;
  signature: boolean;
  nextInspection: string;
  compliance: string[];
}

interface InspectionTemplate {
  id: string;
  name: string;
  assetType: string;
  items: InspectionItem[];
  frequency: string;
  mandatory: boolean;
}

interface InspectionItem {
  id: string;
  category: string;
  description: string;
  type: 'checkbox' | 'rating' | 'measurement' | 'photo' | 'text';
  required: boolean;
  options?: string[];
}

const inspections: Inspection[] = [
  {
    id: 'INS001',
    assetId: 'RD-001',
    assetType: 'road',
    location: 'Main Street (1st to 2nd Ave)',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    inspector: 'John Mitchell',
    date: '2024-04-15',
    status: 'completed',
    priority: 'medium',
    score: 72,
    findings: ['Minor cracking', 'Edge deterioration'],
    photos: 8,
    videos: 2,
    signature: true,
    nextInspection: '2024-10-15',
    compliance: ['DOT Standards', 'ADA Compliance']
  },
  {
    id: 'INS002',
    assetId: 'SW-003',
    assetType: 'sidewalk',
    location: 'School Zone - Elementary',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    inspector: 'Sarah Johnson',
    date: '2024-04-20',
    status: 'requires-action',
    priority: 'high',
    score: 45,
    findings: ['Trip hazard', 'ADA non-compliance', 'Surface cracking'],
    photos: 12,
    videos: 1,
    signature: true,
    nextInspection: '2024-07-20',
    compliance: ['ADA Standards']
  },
  {
    id: 'INS003',
    assetId: 'BR-001',
    assetType: 'bridge',
    location: 'River Crossing Bridge',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    inspector: 'Mike Rodriguez',
    date: '2024-04-25',
    status: 'in-progress',
    priority: 'urgent',
    score: 0,
    findings: [],
    photos: 3,
    videos: 0,
    signature: false,
    nextInspection: '2024-04-25',
    compliance: ['Federal Bridge Standards', 'State Highway Specs']
  }
];

const templates: InspectionTemplate[] = [
  {
    id: 'TPL001',
    name: 'Pavement Condition Assessment',
    assetType: 'road',
    frequency: 'Annually',
    mandatory: true,
    items: [
      { id: '1', category: 'Surface', description: 'Check for cracking', type: 'rating', required: true, options: ['1', '2', '3', '4', '5'] },
      { id: '2', category: 'Surface', description: 'Document surface photo', type: 'photo', required: true },
      { id: '3', category: 'Drainage', description: 'Assess drainage condition', type: 'rating', required: true, options: ['Poor', 'Fair', 'Good', 'Excellent'] },
      { id: '4', category: 'Safety', description: 'Note any safety hazards', type: 'text', required: false }
    ]
  },
  {
    id: 'TPL002',
    name: 'ADA Compliance Check',
    assetType: 'sidewalk',
    frequency: 'Every 2 years',
    mandatory: true,
    items: [
      { id: '1', category: 'Accessibility', description: 'Measure sidewalk width', type: 'measurement', required: true },
      { id: '2', category: 'Accessibility', description: 'Check slope compliance', type: 'measurement', required: true },
      { id: '3', category: 'Accessibility', description: 'Document ramp condition', type: 'photo', required: true },
      { id: '4', category: 'Surface', description: 'Note trip hazards', type: 'checkbox', required: true, options: ['None', 'Minor', 'Major', 'Severe'] }
    ]
  }
];

export default function Inspections() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<string>('');
  const [offlineMode, setOfflineMode] = useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const { currentPlan } = usePricing();

  const filteredInspections = inspections.filter(inspection => {
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    const matchesAssetType = assetTypeFilter === 'all' || inspection.assetType === assetTypeFilter;
    const matchesSearch = inspection.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesAssetType && matchesSearch;
  });

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
      case 'requires-action':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Action Required</Badge>;
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

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'road':
        return '🛣️';
      case 'sidewalk':
        return '🚶';
      case 'bridge':
        return '🌉';
      case 'drainage':
        return '🚰';
      default:
        return '📍';
    }
  };

  const startInspection = () => {
    if (currentPlan === 'free') {
      alert('Mobile inspection forms are a premium feature. Upgrade to access offline capabilities and advanced forms.');
      return;
    }
    alert('Starting new inspection with mobile form interface...');
  };

  const toggleGPS = () => {
    if (!gpsEnabled && currentPlan === 'free') {
      alert('GPS location tagging is a premium feature. Upgrade to enable automatic location capture.');
      return;
    }
    setGpsEnabled(!gpsEnabled);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Infrastructure Inspections
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Mobile-optimized inspection forms with offline capability, GPS tagging, and compliance tracking for all municipal assets.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            {filteredInspections.length} Active Inspections
          </Badge>
          <Badge variant="outline" className={cn(
            "border-2",
            offlineMode ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-700 border-slate-200"
          )}>
            <WifiOff className="w-3 h-3 mr-1" />
            {offlineMode ? 'Offline Mode' : 'Online Mode'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
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
                      <SelectItem value="requires-action">Action Required</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                    <SelectTrigger className="w-40 glass-card border-white/30">
                      <SelectValue placeholder="Asset Type" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="road">Roads</SelectItem>
                      <SelectItem value="sidewalk">Sidewalks</SelectItem>
                      <SelectItem value="bridge">Bridges</SelectItem>
                      <SelectItem value="drainage">Drainage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={offlineMode}
                      onCheckedChange={setOfflineMode}
                      disabled={currentPlan === 'free'}
                    />
                    <Label className="text-sm">Offline Mode</Label>
                  </div>
                  <Button onClick={startInspection} disabled={currentPlan === 'free'}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Inspection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspections Table */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Recent Inspections</CardTitle>
              <CardDescription>
                Track and manage all infrastructure inspections and assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getAssetTypeIcon(inspection.assetType)}</span>
                            <div>
                              <div className="font-medium text-slate-800 dark:text-white">{inspection.id}</div>
                              <div className="text-sm text-slate-500 capitalize">{inspection.assetType}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-sm">{inspection.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{inspection.inspector}</TableCell>
                        <TableCell>{new Date(inspection.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                        <TableCell>{getPriorityBadge(inspection.priority)}</TableCell>
                        <TableCell>
                          {inspection.score > 0 ? (
                            <div className="flex items-center space-x-2">
                              <span className={cn(
                                "font-medium",
                                inspection.score >= 80 ? "text-green-600" :
                                inspection.score >= 60 ? "text-yellow-600" : "text-red-600"
                              )}>
                                {inspection.score}
                              </span>
                              <div className="w-16">
                                <Progress 
                                  value={inspection.score} 
                                  className="h-2"
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400">Pending</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedInspection(inspection.id)}>
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center">
                                  <ClipboardList className="w-5 h-5 mr-2" />
                                  Inspection {inspection.id}
                                </DialogTitle>
                                <DialogDescription>
                                  {inspection.location} • {new Date(inspection.date).toLocaleDateString()}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Tabs defaultValue="details" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-5">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="findings">Findings</TabsTrigger>
                                  <TabsTrigger value="media">Media</TabsTrigger>
                                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                                  <TabsTrigger value="actions">Actions</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Asset Information</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Asset ID:</span>
                                            <span>{inspection.assetId}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Type:</span>
                                            <span className="capitalize">{inspection.assetType}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Location:</span>
                                            <span>{inspection.location}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Coordinates:</span>
                                            <span>{inspection.coordinates.lat}, {inspection.coordinates.lng}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Inspection Details</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Inspector:</span>
                                            <span>{inspection.inspector}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Date:</span>
                                            <span>{new Date(inspection.date).toLocaleDateString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Next Inspection:</span>
                                            <span>{new Date(inspection.nextInspection).toLocaleDateString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Digital Signature:</span>
                                            <span>{inspection.signature ? '✓ Signed' : '⚠ Pending'}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="findings" className="space-y-4">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-medium">Inspection Findings</h4>
                                      {inspection.score > 0 && (
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm text-slate-600">Overall Score:</span>
                                          <Badge variant={inspection.score >= 80 ? 'default' : inspection.score >= 60 ? 'outline' : 'destructive'}>
                                            {inspection.score}/100
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {inspection.findings.length > 0 ? (
                                      <div className="space-y-2">
                                        {inspection.findings.map((finding, index) => (
                                          <div key={index} className="flex items-center p-3 border rounded">
                                            <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                                            <span>{finding}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-8 text-slate-500">
                                        No findings recorded yet
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>

                                <TabsContent value="media" className="space-y-4">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-medium">Documentation</h4>
                                      <div className="flex space-x-2">
                                        <Button size="sm" variant="outline">
                                          <Camera className="w-4 h-4 mr-2" />
                                          Add Photo
                                        </Button>
                                        <Button size="sm" variant="outline">
                                          <Video className="w-4 h-4 mr-2" />
                                          Add Video
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <Card>
                                        <CardContent className="p-4 text-center">
                                          <Camera className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                          <h5 className="font-medium">Photos</h5>
                                          <p className="text-2xl font-bold text-blue-600">{inspection.photos}</p>
                                          <p className="text-sm text-slate-500">Captured</p>
                                        </CardContent>
                                      </Card>
                                      
                                      <Card>
                                        <CardContent className="p-4 text-center">
                                          <Video className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                                          <h5 className="font-medium">Videos</h5>
                                          <p className="text-2xl font-bold text-purple-600">{inspection.videos}</p>
                                          <p className="text-sm text-slate-500">Recorded</p>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="compliance" className="space-y-4">
                                  <div className="space-y-4">
                                    <h4 className="font-medium">Regulatory Compliance</h4>
                                    <div className="space-y-2">
                                      {inspection.compliance.map((standard, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                                          <div className="flex items-center">
                                            <Shield className="w-4 h-4 mr-2 text-green-600" />
                                            <span>{standard}</span>
                                          </div>
                                          <Badge className="bg-green-100 text-green-800 border-green-200">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Compliant
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="actions" className="space-y-4">
                                  <div className="space-y-4">
                                    <h4 className="font-medium">Generated Actions</h4>
                                    {inspection.status === 'requires-action' ? (
                                      <div className="space-y-3">
                                        <Card className="border-red-200 bg-red-50">
                                          <CardContent className="p-4">
                                            <div className="flex items-start space-x-3">
                                              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                              <div>
                                                <h5 className="font-medium text-red-800">Immediate Action Required</h5>
                                                <p className="text-sm text-red-700 mt-1">
                                                  Trip hazard identified - requires immediate remediation for public safety
                                                </p>
                                                <div className="mt-2">
                                                  <Button size="sm" variant="outline">
                                                    Generate Work Order
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                        
                                        <Card className="border-amber-200 bg-amber-50">
                                          <CardContent className="p-4">
                                            <div className="flex items-start space-x-3">
                                              <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                                              <div>
                                                <h5 className="font-medium text-amber-800">Schedule Follow-up</h5>
                                                <p className="text-sm text-amber-700 mt-1">
                                                  ADA compliance review recommended within 30 days
                                                </p>
                                                <div className="mt-2">
                                                  <Button size="sm" variant="outline">
                                                    Schedule Inspection
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    ) : (
                                      <div className="text-center py-8 text-slate-500">
                                        No actions required
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Inspection Templates</CardTitle>
              <CardDescription>
                Standardized checklists and forms for consistent inspections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="border-white/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-slate-800 dark:text-white">{template.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                            {template.assetType} • {template.frequency}
                          </p>
                        </div>
                        {template.mandatory && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Required
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Items:</span>
                          <span>{template.items.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Required:</span>
                          <span>{template.items.filter(item => item.required).length}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Smartphone className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mobile Controls */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Smartphone className="w-5 h-5 mr-2" />
                Mobile Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white">GPS Tagging</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Auto-capture location</p>
                </div>
                <Switch
                  checked={gpsEnabled}
                  onCheckedChange={toggleGPS}
                  disabled={currentPlan === 'free'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white">Offline Sync</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Work without internet</p>
                </div>
                <Switch
                  checked={offlineMode}
                  onCheckedChange={setOfflineMode}
                  disabled={currentPlan === 'free'}
                />
              </div>

              <Button className="w-full" variant="outline" disabled={currentPlan === 'free'}>
                <Download className="w-4 h-4 mr-2" />
                Download Forms
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Inspection Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                <span className="font-medium text-slate-800 dark:text-white">{inspections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                <span className="font-medium text-green-600">
                  {inspections.filter(i => i.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Action Required</span>
                <span className="font-medium text-red-600">
                  {inspections.filter(i => i.status === 'requires-action').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Avg Score</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {Math.round(inspections.filter(i => i.score > 0).reduce((sum, i) => sum + i.score, 0) / inspections.filter(i => i.score > 0).length) || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Bell className="w-5 h-5 mr-2" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-slate-800 dark:text-white">Bridge inspection due</p>
                    <p className="text-slate-500">River Crossing - Apr 25</p>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-slate-800 dark:text-white">ADA compliance check</p>
                    <p className="text-slate-500">School District - May 1</p>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-slate-800 dark:text-white">Routine pavement check</p>
                    <p className="text-slate-500">Downtown area - May 5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Features Notice */}
      {currentPlan === 'free' && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Unlock Advanced Inspection Features
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to access mobile inspection forms, offline capabilities, GPS auto-tagging, 
                custom templates, automated compliance tracking, and enterprise reporting.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Mobile Forms</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Optimized for tablets & phones</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <WifiOff className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Offline Capability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Work without internet connection</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Compliance Tracking</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automated regulatory reporting</p>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/pricing'}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade for Mobile Inspections
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

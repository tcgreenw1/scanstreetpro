import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Construction, 
  Car, 
  AlertTriangle,
  SignalIcon,
  Paintbrush,
  Zap,
  Clock,
  CheckCircle,
  Eye,
  Calendar,
  MapPin,
  Search,
  Filter,
  Download,
  Map,
  BarChart3,
  Users,
  TrendingUp,
  Star,
  QrCode
} from "lucide-react";

const mockReports = [
  {
    id: "CIV-123456",
    type: "pothole",
    title: "Large pothole on Main Street",
    location: "Main St & 1st Ave",
    date: "2024-01-15",
    status: "fixed",
    priority: "high",
    assignedTo: "Public Works Team A",
    citizenName: "John Smith",
    citizenEmail: "john@email.com"
  },
  {
    id: "CIV-123457",
    type: "light-out",
    title: "Street light not working",
    location: "Oak Park, near playground",
    date: "2024-01-10",
    status: "scheduled",
    priority: "medium",
    assignedTo: "Electrical Contractor",
    citizenName: "Maria Garcia",
    citizenEmail: "maria@email.com"
  },
  {
    id: "CIV-123458",
    type: "sidewalk-crack",
    title: "Cracked sidewalk creating trip hazard",
    location: "Elm Street sidewalk",
    date: "2024-01-08",
    status: "in-review",
    priority: "medium",
    assignedTo: null,
    citizenName: "David Johnson",
    citizenEmail: "david@email.com"
  },
  {
    id: "CIV-123459",
    type: "graffiti",
    title: "Graffiti on bus stop",
    location: "5th Ave Bus Stop",
    date: "2024-01-05",
    status: "received",
    priority: "low",
    assignedTo: null,
    citizenName: "Sarah Wilson",
    citizenEmail: "sarah@email.com"
  }
];

const issueIcons = {
  "pothole": Construction,
  "road-damage": Car,
  "sidewalk-crack": Construction,
  "faded-striping": AlertTriangle,
  "drain-clogged": AlertTriangle,
  "missing-sign": SignalIcon,
  "graffiti": Paintbrush,
  "light-out": Zap,
};

const statusConfig = {
  "received": { label: "Received", icon: Clock, color: "bg-blue-100 text-blue-700" },
  "in-review": { label: "In Review", icon: Eye, color: "bg-yellow-100 text-yellow-700" },
  "scheduled": { label: "Scheduled", icon: Calendar, color: "bg-orange-100 text-orange-700" },
  "fixed": { label: "Fixed", icon: CheckCircle, color: "bg-green-100 text-green-700" }
};

const priorityConfig = {
  "high": { label: "High", color: "bg-red-100 text-red-700" },
  "medium": { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  "low": { label: "Low", color: "bg-green-100 text-green-700" }
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: mockReports.length,
    received: mockReports.filter(r => r.status === "received").length,
    inReview: mockReports.filter(r => r.status === "in-review").length,
    scheduled: mockReports.filter(r => r.status === "scheduled").length,
    fixed: mockReports.filter(r => r.status === "fixed").length,
  };

  return (
    <div className="min-h-screen bg-civic-gray-light/30">
      {/* Header */}
      <header className="bg-white border-b border-civic-gray-light">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-civic-blue rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">City Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>Generate QR</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-civic-gray">Total Reports</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-civic-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-civic-gray">Received</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.received}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-civic-gray">In Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.inReview}</p>
                </div>
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-civic-gray">Scheduled</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.scheduled}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-civic-gray">Fixed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.fixed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Construction className="w-4 h-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters & Search</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-gray w-4 h-4" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Reports ({filteredReports.length})</CardTitle>
                <CardDescription>Manage and track all citizen-reported infrastructure issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => {
                    const status = statusConfig[report.status as keyof typeof statusConfig];
                    const priority = priorityConfig[report.priority as keyof typeof priorityConfig];
                    const Icon = issueIcons[report.type as keyof typeof issueIcons];
                    
                    return (
                      <div key={report.id} className="border border-civic-gray-light rounded-lg p-4 hover:bg-civic-gray-light/10 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="w-10 h-10 bg-civic-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-civic-blue" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-foreground">{report.title}</h3>
                                <Badge className={priority.color}>{priority.label}</Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-civic-gray mb-2">
                                <span>#{report.id}</span>
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{report.location}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(report.date).toLocaleDateString()}</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-civic-gray">
                                <span>Reporter: {report.citizenName}</span>
                                {report.assignedTo && (
                                  <span>Assigned to: {report.assignedTo}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Badge className={`${status.color} flex items-center space-x-1`}>
                              <status.icon className="w-3 h-3" />
                              <span>{status.label}</span>
                            </Badge>
                            
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Map className="w-5 h-5" />
                  <span>Issue Map View</span>
                </CardTitle>
                <CardDescription>
                  Visualize all reported issues on an interactive map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-civic-gray-light/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-civic-gray mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map Coming Soon</h3>
                    <p className="text-civic-gray">
                      This feature will show all reported issues plotted on an interactive map with color-coded markers based on status and priority.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Report Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-civic-gray-light/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-civic-gray mx-auto mb-2" />
                      <p className="text-civic-gray">Charts and analytics coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-civic-gray">Average Resolution Time</span>
                      <span className="font-semibold">5.2 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-civic-gray">Citizen Satisfaction</span>
                      <span className="font-semibold">4.6/5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-civic-gray">Reports This Month</span>
                      <span className="font-semibold">87</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-civic-gray">Resolution Rate</span>
                      <span className="font-semibold">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

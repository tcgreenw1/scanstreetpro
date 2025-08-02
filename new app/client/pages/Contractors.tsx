import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Users,
  Star,
  Calendar,
  DollarSign,
  FileText,
  Crown,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

interface Contractor {
  id: string;
  name: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  rating: number;
  certifications: string[];
  status: 'certified' | 'pending' | 'suspended';
  activeProjects: number;
  completedProjects: number;
  totalValue: number;
  joinDate: string;
  specialties: string[];
}

interface Project {
  id: string;
  name: string;
  contractorId: string;
  startDate: string;
  endDate: string;
  progress: number;
  value: number;
  status: 'planning' | 'in-progress' | 'completed' | 'delayed';
  location: string;
}

interface Payment {
  date: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'overdue';
}

const contractors: Contractor[] = [
  {
    id: '1',
    name: 'Premier Paving Co.',
    contact: {
      email: 'contact@premierpaving.com',
      phone: '(555) 123-4567',
      address: '1234 Industrial Blvd, City, ST 12345'
    },
    rating: 4.8,
    certifications: ['DOT Certified', 'OSHA 30', 'MBE'],
    status: 'certified',
    activeProjects: 3,
    completedProjects: 24,
    totalValue: 2450000,
    joinDate: '2022-03-15',
    specialties: ['Asphalt Paving', 'Road Reconstruction', 'Parking Lots']
  },
  {
    id: '2',
    name: 'Municipal Infrastructure Services',
    contact: {
      email: 'bids@misinfo.com',
      phone: '(555) 987-6543',
      address: '5678 Commerce Dr, City, ST 12345'
    },
    rating: 4.6,
    certifications: ['State Licensed', 'DBE', 'Bonded'],
    status: 'certified',
    activeProjects: 2,
    completedProjects: 18,
    totalValue: 1890000,
    joinDate: '2021-11-08',
    specialties: ['Concrete Work', 'Utilities', 'Sidewalks']
  },
  {
    id: '3',
    name: 'Rapid Road Repair LLC',
    contact: {
      email: 'info@rapidroad.com',
      phone: '(555) 456-7890',
      address: '9012 Service Rd, City, ST 12345'
    },
    rating: 4.2,
    certifications: ['OSHA 10', 'Local Licensed'],
    status: 'pending',
    activeProjects: 1,
    completedProjects: 12,
    totalValue: 890000,
    joinDate: '2023-01-20',
    specialties: ['Emergency Repairs', 'Pothole Patching', 'Crack Sealing']
  }
];

const projects: Project[] = [
  {
    id: 'P001',
    name: 'Main Street Reconstruction',
    contractorId: '1',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    progress: 65,
    value: 850000,
    status: 'in-progress',
    location: 'Main St (1st to 5th Ave)'
  },
  {
    id: 'P002',
    name: 'School Zone Sidewalk Project',
    contractorId: '2',
    startDate: '2024-02-15',
    endDate: '2024-04-30',
    progress: 90,
    value: 320000,
    status: 'in-progress',
    location: 'Elementary School District'
  },
  {
    id: 'P003',
    name: 'Emergency Pothole Repairs',
    contractorId: '3',
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    progress: 100,
    value: 45000,
    status: 'completed',
    location: 'Various Locations'
  }
];

const payments: Payment[] = [
  { date: '2024-03-15', amount: 170000, description: 'Main Street - Milestone 2', status: 'paid' },
  { date: '2024-04-01', amount: 96000, description: 'Sidewalk Project - Progress Payment', status: 'pending' },
  { date: '2024-04-15', amount: 255000, description: 'Main Street - Milestone 3', status: 'pending' },
  { date: '2024-02-28', amount: 45000, description: 'Emergency Repairs - Final Payment', status: 'paid' }
];

export default function Contractors() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const { currentPlan } = usePricing();

  const filteredContractors = contractors.filter(contractor => {
    const matchesStatus = statusFilter === 'all' || contractor.status === statusFilter;
    const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contractor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'certified':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Certified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'planning':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Planning</Badge>;
      case 'delayed':
        return <Badge variant="destructive">Delayed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const addContractor = () => {
    if (currentPlan === 'free' && contractors.length >= 3) {
      alert('Free plan allows only 3 contractors. Upgrade to add unlimited contractors.');
      return;
    }
    alert('Add contractor functionality would be implemented here.');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-slate-300"
            )}
          />
        ))}
        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">{rating}</span>
      </div>
    );
  };

  const generateGanttData = () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return projects.map(project => {
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      const startOffset = Math.ceil((projectStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const duration = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...project,
        startOffset: (startOffset / totalDays) * 100,
        width: (duration / totalDays) * 100
      };
    });
  };

  const ganttData = generateGanttData();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Contractor Management
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Manage contractors, assign projects, track progress, and handle payments for all infrastructure maintenance work.
        </p>
        <Badge variant="outline" className="mt-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
          {contractors.length}/3 Contractors {currentPlan === 'free' ? '(Free Plan)' : '(Unlimited)'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters and Search */}
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search contractors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass-card border-white/30"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 glass-card border-white/30">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="certified">Certified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={addContractor}
                  disabled={currentPlan === 'free' && contractors.length >= 3}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contractor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contractors Table */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Contractors Directory</CardTitle>
              <CardDescription>
                Manage your approved contractors and track their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white">{contractor.name}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {contractor.specialties.slice(0, 2).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="w-3 h-3 mr-1 text-slate-400" />
                              {contractor.contact.email}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="w-3 h-3 mr-1 text-slate-400" />
                              {contractor.contact.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderStars(contractor.rating)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-slate-800 dark:text-white">
                              {contractor.activeProjects} active
                            </div>
                            <div className="text-slate-500">
                              {contractor.completedProjects} completed
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-800 dark:text-white">
                            ${contractor.totalValue.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(contractor.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedContractor(contractor.id)}>
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    {contractor.name}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Contractor details, certifications, and project history
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <Tabs defaultValue="details" className="space-y-4">
                                  <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="projects">Projects</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                    <TabsTrigger value="payments">Payments</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="details" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-medium mb-2">Contact Information</h4>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex items-center">
                                              <Mail className="w-4 h-4 mr-2 text-slate-400" />
                                              {contractor.contact.email}
                                            </div>
                                            <div className="flex items-center">
                                              <Phone className="w-4 h-4 mr-2 text-slate-400" />
                                              {contractor.contact.phone}
                                            </div>
                                            <div className="flex items-center">
                                              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                              {contractor.contact.address}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium mb-2">Specialties</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {contractor.specialties.map((specialty, index) => (
                                              <Badge key={index} variant="outline">
                                                {specialty}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-medium mb-2">Performance</h4>
                                          <div className="space-y-2">
                                            <div className="flex justify-between">
                                              <span className="text-sm text-slate-600">Rating</span>
                                              {renderStars(contractor.rating)}
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-sm text-slate-600">Joined</span>
                                              <span className="text-sm">{new Date(contractor.joinDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-sm text-slate-600">Total Projects</span>
                                              <span className="text-sm">{contractor.completedProjects + contractor.activeProjects}</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium mb-2">Certifications</h4>
                                          <div className="space-y-2">
                                            {contractor.certifications.map((cert, index) => (
                                              <div key={index} className="flex items-center">
                                                <Award className="w-4 h-4 mr-2 text-green-600" />
                                                <span className="text-sm">{cert}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="projects" className="space-y-4">
                                    <div className="space-y-4">
                                      {projects
                                        .filter(p => p.contractorId === contractor.id)
                                        .map((project) => (
                                          <Card key={project.id}>
                                            <CardContent className="p-4">
                                              <div className="flex justify-between items-start mb-3">
                                                <div>
                                                  <h4 className="font-medium">{project.name}</h4>
                                                  <p className="text-sm text-slate-600">{project.location}</p>
                                                </div>
                                                {getProjectStatusBadge(project.status)}
                                              </div>
                                              <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                  <span>Progress</span>
                                                  <span>{project.progress}%</span>
                                                </div>
                                                <Progress value={project.progress} className="h-2" />
                                                <div className="flex justify-between text-sm text-slate-600">
                                                  <span>{project.startDate} - {project.endDate}</span>
                                                  <span>${project.value.toLocaleString()}</span>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="documents" className="space-y-4">
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <h4 className="font-medium">Contract Documents</h4>
                                        <Button size="sm">
                                          <Upload className="w-4 h-4 mr-2" />
                                          Upload Document
                                        </Button>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        {[
                                          'Insurance Certificate.pdf',
                                          'Performance Bond.pdf',
                                          'W9 Tax Form.pdf',
                                          'Safety Certification.pdf'
                                        ].map((doc, index) => (
                                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                                            <div className="flex items-center">
                                              <FileText className="w-4 h-4 mr-2 text-slate-400" />
                                              <span className="text-sm">{doc}</span>
                                            </div>
                                            <Button variant="outline" size="sm">
                                              <Download className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="payments" className="space-y-4">
                                    <div className="space-y-4">
                                      <h4 className="font-medium">Payment Schedule</h4>
                                      <div className="space-y-2">
                                        {payments.map((payment, index) => (
                                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                                            <div>
                                              <div className="font-medium">${payment.amount.toLocaleString()}</div>
                                              <div className="text-sm text-slate-600">{payment.description}</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-sm">{payment.date}</div>
                                              <Badge variant={payment.status === 'paid' ? 'default' : payment.status === 'pending' ? 'outline' : 'destructive'}>
                                                {payment.status}
                                              </Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Gantt Chart */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <BarChart3 className="w-5 h-5 mr-2" />
                Project Timeline (Gantt View)
              </CardTitle>
              <CardDescription>
                Visual timeline of all active and planned projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Timeline header */}
                <div className="grid grid-cols-12 gap-1 text-xs text-slate-500 mb-4">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                    <div key={index} className="text-center">{month}</div>
                  ))}
                </div>
                
                {/* Gantt bars */}
                <div className="space-y-3">
                  {ganttData.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-800 dark:text-white">{project.name}</span>
                        <span className="text-slate-500">{project.progress}%</span>
                      </div>
                      <div className="relative h-8 bg-slate-100 dark:bg-slate-800 rounded">
                        <div
                          className={cn(
                            "absolute h-full rounded flex items-center px-2 text-xs font-medium text-white",
                            project.status === 'completed' ? "bg-green-500" :
                            project.status === 'in-progress' ? "bg-blue-500" :
                            project.status === 'delayed' ? "bg-red-500" : "bg-purple-500"
                          )}
                          style={{
                            left: `${project.startOffset}%`,
                            width: `${project.width}%`
                          }}
                        >
                          <span className="truncate">{project.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Contractors</span>
                <span className="font-medium text-slate-800 dark:text-white">{contractors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Active Projects</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {contractors.reduce((sum, c) => sum + c.activeProjects, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Contract Value</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  ${contractors.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {(contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length).toFixed(1)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-slate-800 dark:text-white">Payment approved for Premier Paving</p>
                    <p className="text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-slate-800 dark:text-white">New bid received from ABC Construction</p>
                    <p className="text-slate-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-slate-800 dark:text-white">Project delayed: School Zone Sidewalks</p>
                    <p className="text-slate-500">1 day ago</p>
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
                Unlock Advanced Contractor Management
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to manage unlimited contractors, advanced project tracking, automated payments, 
                comprehensive reporting, and enterprise-grade contractor performance analytics.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Unlimited Contractors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No limits on contractor database</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Advanced Analytics</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Performance insights & reports</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Payment Automation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automated invoicing & payments</p>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/pricing'}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade for Advanced Management
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

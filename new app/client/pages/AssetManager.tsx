import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  MapPin,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  Trash2,
  Crown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Users,
  Calendar,
  Wrench,
  TrendingUp,
  DollarSign,
  Navigation,
  Layers,
  Settings,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock asset data
const mockAssets = [
  {
    id: 'A001',
    name: 'Main Street Bridge',
    type: 'Bridge',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Main St' },
    condition: 'Good',
    status: 'Active',
    lastInspection: '2024-01-15',
    nextInspection: '2024-07-15',
    assignedContractor: 'Bridge Works Inc.',
    installDate: '2018-05-15',
    value: 250000,
    maintenanceCost: 12500,
    priority: 'Medium'
  },
  {
    id: 'A002',
    name: 'Oak Avenue Traffic Light',
    type: 'Traffic Signal',
    location: { lat: 40.7589, lng: -73.9851, address: '456 Oak Ave' },
    condition: 'Excellent',
    status: 'Active',
    lastInspection: '2024-01-10',
    nextInspection: '2024-04-10',
    assignedContractor: 'Signal Tech LLC',
    installDate: '2022-03-20',
    value: 15000,
    maintenanceCost: 800,
    priority: 'Low'
  },
  {
    id: 'A003',
    name: 'Pine Road Storm Drain',
    type: 'Drainage',
    location: { lat: 40.6892, lng: -74.0445, address: '789 Pine Rd' },
    condition: 'Poor',
    status: 'Needs Repair',
    lastInspection: '2024-01-20',
    nextInspection: '2024-02-20',
    assignedContractor: 'Drain Masters',
    installDate: '2015-09-10',
    value: 8500,
    maintenanceCost: 3200,
    priority: 'High'
  },
  {
    id: 'A004',
    name: 'City Hall Lighting System',
    type: 'Street Light',
    location: { lat: 40.7250, lng: -74.0000, address: 'City Hall Plaza' },
    condition: 'Good',
    status: 'Active',
    lastInspection: '2024-01-05',
    nextInspection: '2024-06-05',
    assignedContractor: 'Bright Lights Co.',
    installDate: '2020-11-12',
    value: 25000,
    maintenanceCost: 1500,
    priority: 'Low'
  }
];

const assetTypes = ['All', 'Bridge', 'Traffic Signal', 'Drainage', 'Street Light', 'Signage', 'Pavement'];
const conditionTypes = ['All', 'Excellent', 'Good', 'Fair', 'Poor', 'Critical'];
const statusTypes = ['All', 'Active', 'Needs Repair', 'Under Maintenance', 'Decommissioned'];

export default function AssetManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Poor':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || asset.type === selectedType;
    const matchesCondition = selectedCondition === 'All' || asset.condition === selectedCondition;
    const matchesStatus = selectedStatus === 'All' || asset.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesCondition && matchesStatus;
  });

  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalMaintenanceCost = mockAssets.reduce((sum, asset) => sum + asset.maintenanceCost, 0);
  const assetsNeedingAttention = mockAssets.filter(asset => 
    asset.condition === 'Poor' || asset.status === 'Needs Repair'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Asset Manager</h1>
              <p className="text-slate-600 dark:text-slate-300">Premium Feature - Upgrade Required</p>
            </div>
          </div>
          <Link to="/pricing">
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              title="See pricing and included features"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Access
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-white/20 opacity-60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Assets</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{mockAssets.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 opacity-60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Value</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 opacity-60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Maintenance Cost</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  ${totalMaintenanceCost.toLocaleString()}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 opacity-60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Need Attention</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{assetsNeedingAttention}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="glass-card border-white/20 opacity-60">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-slate-800 dark:text-white">Asset Inventory</CardTitle>
              <CardDescription>Manage and track infrastructure assets</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType} disabled>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCondition} onValueChange={setSelectedCondition} disabled>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditionTypes.map(condition => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus} disabled>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusTypes.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="table" disabled>
                <Eye className="w-4 h-4 mr-2" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="map" disabled>
                <MapPin className="w-4 h-4 mr-2" />
                Map View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6">
              <div className="rounded-md border border-white/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800">
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Inspection</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id} className="opacity-60">
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-white">{asset.name}</p>
                            <p className="text-sm text-slate-500">{asset.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {asset.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {asset.location.address}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getConditionColor(asset.condition)}>
                            {asset.condition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            asset.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                            asset.status === 'Needs Repair' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }>
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {new Date(asset.nextInspection).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(asset.priority)}>
                            {asset.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" disabled>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" disabled>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" disabled>
                              <History className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="map" className="mt-6">
              <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg border border-white/20 flex items-center justify-center opacity-60">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    Interactive Asset Map
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    View assets on an interactive map with real-time status updates
                  </p>
                  <Link to="/pricing">
                    <Button
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      title="See pricing and included features"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Access Map
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Premium Features Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/30 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10 opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
              <Navigation className="w-5 h-5 text-amber-600" />
              GPS Asset Tracking
            </CardTitle>
            <CardDescription>Real-time location monitoring and route optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Live GPS tracking for mobile assets
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Geofencing and alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Route history and analytics
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/30 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10 opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
              <Layers className="w-5 h-5 text-amber-600" />
              Predictive Maintenance
            </CardTitle>
            <CardDescription>AI-powered maintenance scheduling and cost optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Machine learning failure prediction
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Automated work order generation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cost optimization algorithms
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

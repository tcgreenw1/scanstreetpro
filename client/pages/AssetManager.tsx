import { useState, useEffect } from 'react';
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
  History,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { neonService, Asset } from '@/services/neonService';
import { useOrganization, usePermissions } from '@/contexts/OrganizationContext';
import { usePlanBasedUI, useFeatureAccess, useDataVisibility } from '@/hooks/usePlanBasedUI';

const assetTypes = ['All', 'road', 'bridge', 'sidewalk', 'drainage', 'lighting', 'signage'];
const conditionTypes = ['All', 'excellent', 'good', 'fair', 'poor', 'critical'];

export default function AssetManager() {
  const { organization, planFeatures } = useOrganization();
  const { isFeatureUnlocked } = usePermissions();

  // Step 1 & 2: Get plan-based UI state
  const planState = usePlanBasedUI();
  const assetAccess = useFeatureAccess('assetManagement');
  const { useSampleData, userPlan } = useDataVisibility();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  // Step 3: Apply hardcoded plan logic for Asset Management
  // Free: Disable all interaction, show upsell banner
  // Basic+: Fully editable, live data from Neon
  const canManageAssets = assetAccess.hasAccess;

  // Load assets from database
  useEffect(() => {
    const loadAssets = async () => {
      if (!organization) return;

      try {
        setIsLoading(true);
        const assetData = await neonService.getAssets(
          organization.id,
          planFeatures?.sampleDataOnly || false
        );
        setAssets(assetData);
      } catch (error) {
        console.error('Failed to load assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [organization, planFeatures]);

  // Filter assets based on search and filters
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || asset.type === selectedType;
    const matchesCondition = selectedCondition === 'All' || asset.condition.status === selectedCondition;

    return matchesSearch && matchesType && matchesCondition;
  });

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



  // Calculate statistics from real asset data
  const totalValue = assets.reduce((sum, asset) => sum + (asset.metadata.cost || 0), 0);
  const averagePCI = assets.length > 0 ?
    Math.round(assets.reduce((sum, asset) => sum + asset.condition.pci, 0) / assets.length) : 0;
  const assetsNeedingAttention = assets.filter(asset =>
    asset.condition.status === 'poor' || asset.condition.status === 'critical'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className={cn(
        "glass-card p-6 rounded-xl",
        !canManageAssets
          ? "border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20"
          : "border-white/20"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              !canManageAssets
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-blue-500 to-purple-500"
            )}>
              {!canManageAssets ? (
                <Crown className="w-6 h-6 text-white" />
              ) : (
                <Building2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Asset Manager</h1>
              <p className="text-slate-600 dark:text-slate-300">
                {canManageAssets
                  ? `Managing ${assets.length} infrastructure assets`
                  : planFeatures?.sampleDataOnly
                    ? "Viewing sample data - upgrade for full management"
                    : "Asset management requires Basic plan or higher"
                }
              </p>
            </div>
          </div>
          {!canManageAssets && (
            <Link to="/pricing">
              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                title="See pricing and included features"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Access
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className={cn("glass-card border-white/20", !canManageAssets && "opacity-75")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Assets</p>
                  {!canManageAssets && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
                <p className={cn("text-2xl font-bold",
                  canManageAssets ? "text-slate-800 dark:text-white" : "text-slate-400"
                )}>
                  {canManageAssets ? assets.length : '••••'}
                </p>
              </div>
              <Building2 className={cn("w-8 h-8", canManageAssets ? "text-blue-600" : "text-slate-300")} />
            </div>
          </CardContent>
        </Card>

        <Card className={cn("glass-card border-white/20", !canManageAssets && "opacity-75")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Average PCI</p>
                  {!canManageAssets && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
                <p className={cn("text-2xl font-bold",
                  canManageAssets ? "text-slate-800 dark:text-white" : "text-slate-400"
                )}>
                  {canManageAssets ? averagePCI : '••••'}
                </p>
              </div>
              <BarChart3 className={cn("w-8 h-8", canManageAssets ? "text-green-600" : "text-slate-300")} />
            </div>
          </CardContent>
        </Card>

        <Card className={cn("glass-card border-white/20", !canManageAssets && "opacity-75")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Value</p>
                  {!canManageAssets && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
                <p className={cn("text-2xl font-bold",
                  canManageAssets ? "text-slate-800 dark:text-white" : "text-slate-400"
                )}>
                  {canManageAssets ? `$${Math.round(totalValue / 1000)}K` : '••••'}
                </p>
              </div>
              <DollarSign className={cn("w-8 h-8", canManageAssets ? "text-green-600" : "text-slate-300")} />
            </div>
          </CardContent>
        </Card>

        <Card className={cn("glass-card border-white/20", !canManageAssets && "opacity-75")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Need Attention</p>
                  {!canManageAssets && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
                <p className={cn("text-2xl font-bold",
                  canManageAssets ? "text-slate-800 dark:text-white" : "text-slate-400"
                )}>
                  {canManageAssets ? assetsNeedingAttention : '••••'}
                </p>
              </div>
              <AlertTriangle className={cn("w-8 h-8", canManageAssets ? "text-red-600" : "text-slate-300")} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className={cn("glass-card border-white/20", !canManageAssets && "opacity-75")}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-slate-800 dark:text-white flex items-center gap-2">
                Asset Inventory
                {!canManageAssets && <Crown className="w-5 h-5 text-amber-500" />}
              </CardTitle>
              <CardDescription>
                {canManageAssets
                  ? "Manage and track infrastructure assets"
                  : planFeatures?.sampleDataOnly
                    ? "View sample asset data - upgrade for full management"
                    : "Asset management requires Basic plan or higher"
                }
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!canManageAssets}
                className={!canManageAssets ? "opacity-50" : ""}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
                {!canManageAssets && <Crown className="w-4 h-4 ml-2 text-amber-500" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canManageAssets}
                className={!canManageAssets ? "opacity-50" : ""}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
                {!canManageAssets && <Crown className="w-4 h-4 ml-2 text-amber-500" />}
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
                  placeholder={canManageAssets ? "Search assets..." : "Search disabled - upgrade to unlock"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={!canManageAssets}
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType} disabled={!canManageAssets}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCondition} onValueChange={setSelectedCondition} disabled={!canManageAssets}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditionTypes.map(condition => (
                  <SelectItem key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </SelectItem>
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
                      <TableHead>Condition (PCI)</TableHead>
                      <TableHead>Last Inspection</TableHead>
                      <TableHead>Next Inspection</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <span className="text-slate-600 mt-3 block">Loading assets...</span>
                        </TableCell>
                      </TableRow>
                    ) : filteredAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <Building2 className="w-12 h-12 text-slate-300" />
                            <p className="text-slate-500">
                              {planFeatures?.sampleDataOnly
                                ? "No sample assets available"
                                : "No assets found"}
                            </p>
                            {!canManageAssets && (
                              <Button onClick={() => window.location.href = '/pricing'} size="sm">
                                <Crown className="w-4 h-4 mr-2" />
                                Upgrade to Add Assets
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAssets.map((asset) => (
                        <TableRow
                          key={asset.id}
                          className={cn(
                            canManageAssets ? "hover:bg-slate-50 dark:hover:bg-slate-800" : "opacity-75",
                            asset.isSampleData && "bg-blue-50/50 dark:bg-blue-900/20"
                          )}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-medium text-slate-800 dark:text-white">{asset.name}</p>
                                <p className="text-sm text-slate-500">{asset.id}</p>
                              </div>
                              {asset.isSampleData && (
                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                                  Sample
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                {asset.location.address || `${asset.location.lat}, ${asset.location.lng}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getConditionColor(asset.condition.status)}>
                                {asset.condition.status.charAt(0).toUpperCase() + asset.condition.status.slice(1)}
                              </Badge>
                              <span className="text-sm text-slate-500">
                                PCI: {asset.condition.pci}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                {asset.condition.lastInspected.toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                {asset.condition.nextInspection.toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!canManageAssets}
                                className={!canManageAssets ? "opacity-50" : ""}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!canManageAssets}
                                className={!canManageAssets ? "opacity-50" : ""}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={!canManageAssets}
                                className={!canManageAssets ? "opacity-50" : ""}
                              >
                                <History className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
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

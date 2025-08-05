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
import { useAssetManagerFeatures } from '@/hooks/useFeatureMatrix';
import { PreviewModeWrapper, usePreviewMode } from '@/components/LockedOverlay';
import { PredictiveMaintenanceChart } from '@/components/charts/PredictiveMaintenanceChart';

const assetTypes = ['All', 'road', 'bridge', 'sidewalk', 'drainage', 'lighting', 'signage'];
const conditionTypes = ['All', 'excellent', 'good', 'fair', 'poor', 'critical'];

export default function AssetManager() {
  const { organization, planFeatures } = useOrganization();
  const { isFeatureUnlocked } = usePermissions();

  // Step 1 & 2: Get plan-based UI state
  const planState = usePlanBasedUI();
  const assetAccess = useFeatureAccess('assetManagement');
  const { useSampleData, userPlan } = useDataVisibility();

  // New feature matrix system
  const assetManagerFeatures = useAssetManagerFeatures();
  const assetInventoryState = assetManagerFeatures.assetInventory.state;
  const predictiveMaintenanceState = assetManagerFeatures.predictiveMaintenance.state;
  const { isPreviewMode: assetInventoryPreview, requiredPlan: assetInventoryRequiredPlan } = usePreviewMode(assetInventoryState, userPlan);
  const { isPreviewMode: predictiveMaintenancePreview, requiredPlan: predictiveMaintenanceRequiredPlan } = usePreviewMode(predictiveMaintenanceState, userPlan);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');

  // Step 3: Apply hardcoded plan logic for Asset Management
  // Free: Paywall for both inventory and predictive maintenance
  // Basic+: Full access to both features with real data
  const canManageAssets = assetManagerFeatures.assetInventory.useRealData;

  // Load assets from database with plan-based logic
  useEffect(() => {
    const loadAssets = async () => {
      if (!organization) return;

      try {
        setIsLoading(true);
        const assetData = await neonService.getAssets(
          organization.id,
          !assetManagerFeatures.assetInventory.useRealData // Use sample data if not real data plan
        );
        setAssets(assetData);
      } catch (error) {
        console.error('Failed to load assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [organization, assetManagerFeatures.assetInventory.useRealData]);

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
                <strong>CURRENT PLAN: {userPlan.toUpperCase()}</strong><br/>
                {assetManagerFeatures.assetInventory.isPaywall
                  ? "🔒 ASSET MANAGEMENT LOCKED - Upgrade to Basic to unlock real asset tracking and editing"
                  : canManageAssets
                    ? `✅ ASSET MANAGEMENT UNLOCKED - Managing ${assets.length} infrastructure assets with live data from Neon`
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

      {/* Asset Inventory Section */}
      <PreviewModeWrapper
        isPreviewMode={assetInventoryPreview}
        requiredPlan={assetInventoryRequiredPlan}
        featureName="Asset Inventory"
      >
        <Card className="glass-card border-white/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-slate-800 dark:text-white flex items-center gap-2">
                  Asset Inventory
                  {assetInventoryPreview && <Crown className="w-5 h-5 text-amber-500" />}
                </CardTitle>
                <CardDescription>
                  {canManageAssets
                    ? "Manage and track infrastructure assets"
                    : "Asset management requires Basic plan or higher"
                  }
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={assetInventoryPreview}
                  className={assetInventoryPreview ? "opacity-50" : ""}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={assetInventoryPreview}
                  className={assetInventoryPreview ? "opacity-50" : ""}
                >
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
                    placeholder={canManageAssets ? "Search assets..." : "Search disabled - upgrade to unlock"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    disabled={assetInventoryPreview}
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType} disabled={assetInventoryPreview}>
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
              <Select value={selectedCondition} onValueChange={setSelectedCondition} disabled={assetInventoryPreview}>
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

            {/* Asset Table */}
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
                            {!canManageAssets
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
                              disabled={assetInventoryPreview}
                              className={assetInventoryPreview ? "opacity-50" : ""}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={assetInventoryPreview}
                              className={assetInventoryPreview ? "opacity-50" : ""}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={assetInventoryPreview}
                              className={assetInventoryPreview ? "opacity-50" : ""}
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
          </CardContent>
        </Card>
      </PreviewModeWrapper>

      {/* Predictive Maintenance Section */}
      <PreviewModeWrapper
        isPreviewMode={predictiveMaintenancePreview}
        requiredPlan={predictiveMaintenanceRequiredPlan}
        featureName="Predictive Maintenance with Graphs"
      >
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
              <Layers className="w-5 h-5 text-blue-600" />
              Predictive Maintenance
              {predictiveMaintenancePreview && <Crown className="w-5 h-5 text-amber-500" />}
            </CardTitle>
            <CardDescription>
              {assetManagerFeatures.predictiveMaintenance.useRealData
                ? "AI-powered maintenance scheduling and cost optimization with interactive graphs"
                : "AI-powered maintenance predictions available with paid plans"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assetManagerFeatures.predictiveMaintenance.useRealData ? (
              <PredictiveMaintenanceChart />
            ) : (
              <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Predictive Analytics with Graphs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                    Advanced AI predictions with interactive charts showing maintenance forecasts, cost analysis, and condition trends.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </PreviewModeWrapper>
    </div>
  );
}

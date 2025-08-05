import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Crown, 
  Sun, 
  Moon,
  Layers,
  Filter,
  Maximize,
  Minimize,
  RotateCcw,
  Settings,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureMatrix } from '@/hooks/useFeatureMatrix';
import { AssetType, ASSET_TYPES } from '@/services/assetsService';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

interface EnhancedMapToolbarProps {
  isDarkMode: boolean;
  isFullscreen: boolean;
  showPCILayer: boolean;
  showAssetLayer: boolean;
  pciFilter: number;
  selectedAssetTypes: AssetType[];
  hasPCIAccess: boolean;
  hasExportAccess: boolean;
  onToggleDarkMode: () => void;
  onToggleFullscreen: () => void;
  onTogglePCILayer: () => void;
  onToggleAssetLayer: () => void;
  onPCIFilterChange: (value: number) => void;
  onAssetTypesChange: (types: AssetType[]) => void;
  onExportPDF: () => void;
  onExportCSV: (type: 'roads' | 'assets') => void;
  onResetView: () => void;
  className?: string;
}

export function EnhancedMapToolbar({
  isDarkMode,
  isFullscreen,
  showPCILayer,
  showAssetLayer,
  pciFilter,
  selectedAssetTypes,
  hasPCIAccess,
  hasExportAccess,
  onToggleDarkMode,
  onToggleFullscreen,
  onTogglePCILayer,
  onToggleAssetLayer,
  onPCIFilterChange,
  onAssetTypesChange,
  onExportPDF,
  onExportCSV,
  onResetView,
  className
}: EnhancedMapToolbarProps) {
  const { user } = useAuth();
  const { userPlan } = useFeatureMatrix();
  const [showFilters, setShowFilters] = useState(false);

  const handleAssetTypeToggle = (assetType: AssetType) => {
    const newTypes = selectedAssetTypes.includes(assetType)
      ? selectedAssetTypes.filter(type => type !== assetType)
      : [...selectedAssetTypes, assetType];
    onAssetTypesChange(newTypes);
  };

  const pciRanges = [
    { min: 0, max: 100, label: 'All Roads' },
    { min: 70, max: 100, label: 'Good+ Only' },
    { min: 40, max: 69, label: 'Needs Attention' },
    { min: 0, max: 39, label: 'Critical Only' }
  ];

  return (
    <div className={cn(
      "fixed top-4 right-4 z-40 w-80",
      className
    )}>
      <div 
        className="glass-card border border-white/20 rounded-xl p-4 shadow-xl space-y-4"
        style={{ 
          background: isDarkMode 
            ? 'rgba(0, 0, 0, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              Map Controls
            </h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
          </Badge>
        </div>

        {/* Main Controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleDarkMode}
            className="flex-1 border-white/20 hover:bg-white/20"
          >
            {isDarkMode ? <Sun className="w-4 h-4 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
            {isDarkMode ? 'Light' : 'Dark'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className="flex-1 border-white/20 hover:bg-white/20"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 mr-1" /> : <Maximize className="w-4 h-4 mr-1" />}
            {isFullscreen ? 'Exit' : 'Full'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onResetView}
            className="border-white/20 hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Layer Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="pci-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              PCI Road Data
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                id="pci-toggle"
                checked={showPCILayer && hasPCIAccess}
                onCheckedChange={onTogglePCILayer}
                disabled={!hasPCIAccess}
              />
              {!hasPCIAccess && <Crown className="w-4 h-4 text-amber-500" />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="asset-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              City Assets
            </Label>
            <Switch
              id="asset-toggle"
              checked={showAssetLayer}
              onCheckedChange={onToggleAssetLayer}
            />
          </div>
        </div>

        {/* Export Controls */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              disabled={!hasExportAccess}
              className="border-white/20 hover:bg-white/20 disabled:opacity-50"
            >
              <FileText className="w-4 h-4 mr-1" />
              PDF Map
              {!hasExportAccess && <Crown className="w-3 h-3 ml-1 text-amber-500" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasExportAccess}
                  className="border-white/20 hover:bg-white/20 disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" />
                  CSV Data
                  {!hasExportAccess && <Crown className="w-3 h-3 ml-1 text-amber-500" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onExportCSV('roads')} disabled={!hasPCIAccess}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Roads & PCI Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportCSV('assets')}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  City Assets
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="space-y-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
            </div>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFilters && (
            <div className="space-y-4 p-3 bg-white/10 dark:bg-black/10 rounded-lg">
              {/* PCI Range Filter */}
              {hasPCIAccess && (
                <div className="space-y-2">
                  <Label className="text-xs text-slate-700 dark:text-slate-300">
                    PCI Range Filter: {pciFilter}+
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={pciFilter}
                    onChange={(e) => onPCIFilterChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Failed</span>
                    <span>Fair</span>
                    <span>Excellent</span>
                  </div>
                </div>
              )}

              {/* Asset Type Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-700 dark:text-slate-300">
                  Asset Types ({selectedAssetTypes.length} selected)
                </Label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {ASSET_TYPES.slice(0, 6).map((assetType) => (
                    <div key={assetType.type} className="flex items-center space-x-2">
                      <Checkbox
                        id={assetType.type}
                        checked={selectedAssetTypes.includes(assetType.type)}
                        onCheckedChange={() => handleAssetTypeToggle(assetType.type)}
                      />
                      <Label 
                        htmlFor={assetType.type}
                        className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1"
                      >
                        <span>{assetType.icon}</span>
                        {assetType.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Notice */}
        {(!hasPCIAccess || !hasExportAccess) && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start space-x-2">
              <Crown className="w-4 h-4 text-amber-500 mt-0.5" />
              <div className="text-xs text-amber-700 dark:text-amber-300">
                <p className="font-medium">Premium Features Available</p>
                <p>Unlock full PCI analysis and export capabilities.</p>
                <Button 
                  size="sm" 
                  className="mt-2 bg-amber-600 hover:bg-amber-700 text-white text-xs"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Camera, 
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
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureMatrix } from '@/hooks/useFeatureMatrix';

interface MapToolbarProps {
  isDarkMode: boolean;
  isFullscreen: boolean;
  showPCILayer: boolean;
  showAssetLayer: boolean;
  pciFilter: number;
  onToggleDarkMode: () => void;
  onToggleFullscreen: () => void;
  onTogglePCILayer: () => void;
  onToggleAssetLayer: () => void;
  onPCIFilterChange: (value: number) => void;
  onExportCSV: (type: 'roads' | 'assets') => void;
  onExportScreenshot: () => void;
  onResetView: () => void;
  className?: string;
}

export function MapToolbar({
  isDarkMode,
  isFullscreen,
  showPCILayer,
  showAssetLayer,
  pciFilter,
  onToggleDarkMode,
  onToggleFullscreen,
  onTogglePCILayer,
  onToggleAssetLayer,
  onPCIFilterChange,
  onExportCSV,
  onExportScreenshot,
  onResetView,
  className
}: MapToolbarProps) {
  const { user } = useAuth();
  const { userPlan } = useFeatureMatrix();
  const [showFilters, setShowFilters] = useState(false);

  // Plan-based feature access
  const canExportCSV = ['basic', 'pro', 'premium', 'satellite_enterprise', 'driving_enterprise'].includes(userPlan);
  const canExportScreenshot = ['pro', 'premium', 'satellite_enterprise', 'driving_enterprise'].includes(userPlan);
  const canUseAdvancedFilters = ['pro', 'premium', 'satellite_enterprise', 'driving_enterprise'].includes(userPlan);

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  return (
    <Card className={cn("glass-card border-white/20 bg-white/90 dark:bg-black/90", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Main Controls Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleDarkMode}
              className="border-white/20 hover:bg-white/20"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFullscreen}
              className="border-white/20 hover:bg-white/20"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>

            {/* Reset View */}
            <Button
              variant="outline"
              size="sm"
              onClick={onResetView}
              className="border-white/20 hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            {/* Layer Toggles */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 dark:bg-black/20 rounded-lg">
              <Layers className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <div className="flex items-center gap-3">
                <Label htmlFor="pci-toggle" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  PCI
                </Label>
                <Switch
                  id="pci-toggle"
                  checked={showPCILayer}
                  onCheckedChange={onTogglePCILayer}
                />

                <Label htmlFor="asset-toggle" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  Assets
                </Label>
                <Switch
                  id="asset-toggle"
                  checked={showAssetLayer}
                  onCheckedChange={onToggleAssetLayer}
                />
              </div>
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-white/20 hover:bg-white/20"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </Button>
          </div>

          {/* Export Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <Download className="w-3 h-3" />
              Export:
            </div>

            {/* CSV Exports */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportCSV('roads')}
              disabled={!canExportCSV}
              className="border-white/20 hover:bg-white/20 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1" />
              Roads CSV
              {!canExportCSV && <Crown className="w-3 h-3 ml-1 text-amber-500" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportCSV('assets')}
              disabled={!canExportCSV}
              className="border-white/20 hover:bg-white/20 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1" />
              Assets CSV
              {!canExportCSV && <Crown className="w-3 h-3 ml-1 text-amber-500" />}
            </Button>

            {/* Screenshot Export */}
            <Button
              variant="outline"
              size="sm"
              onClick={onExportScreenshot}
              disabled={!canExportScreenshot}
              className="border-white/20 hover:bg-white/20 disabled:opacity-50"
            >
              <Camera className="w-4 h-4 mr-1" />
              Screenshot
              {!canExportScreenshot && <Crown className="w-3 h-3 ml-1 text-amber-500" />}
            </Button>

            {/* Plan Badge */}
            <Badge variant="outline" className="text-xs">
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
            </Badge>
          </div>

          {/* Premium Feature Notice */}
          {(!canExportCSV || !canExportScreenshot) && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start space-x-2">
                <Crown className="w-4 h-4 text-amber-500 mt-0.5" />
                <div className="text-xs text-amber-700 dark:text-amber-300">
                  <p className="font-medium">Export Features Locked</p>
                  <p>CSV exports require Basic+ plan. Screenshots require Pro+ plan.</p>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-amber-600 hover:bg-amber-700 text-white text-xs"
                    onClick={handleUpgrade}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Filters (Collapsible) */}
          {showFilters && (
            <div className="space-y-3 p-3 bg-white/20 dark:bg-black/20 rounded-lg border border-white/20">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Filter Controls
                </span>
              </div>

              {/* PCI Range Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-700 dark:text-slate-300">
                  Minimum PCI Score: {pciFilter}
                </Label>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={pciFilter}
                    onChange={(e) => onPCIFilterChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                    disabled={!canUseAdvancedFilters}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0 (Very Poor)</span>
                    <span>50 (Fair)</span>
                    <span>100 (Excellent)</span>
                  </div>
                </div>
                
                {!canUseAdvancedFilters && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <Crown className="w-3 h-3" />
                    Advanced filters require Pro+ plan
                  </div>
                )}
              </div>

              {/* Quick Filter Buttons */}
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPCIFilterChange(0)}
                  className="text-xs px-2 py-1 h-6"
                >
                  All Roads
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPCIFilterChange(70)}
                  className="text-xs px-2 py-1 h-6"
                  disabled={!canUseAdvancedFilters}
                >
                  Good+ Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPCIFilterChange(40)}
                  className="text-xs px-2 py-1 h-6"
                  disabled={!canUseAdvancedFilters}
                >
                  Needs Attention
                </Button>
              </div>
            </div>
          )}

          {/* Location Info */}
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <MapPin className="w-3 h-3" />
            <span>Springfield, Ohio | Showing {showPCILayer ? 'PCI roads' : ''} {showPCILayer && showAssetLayer ? '& ' : ''} {showAssetLayer ? 'city assets' : ''}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PCILevel {
  min: number;
  max: number;
  label: string;
  color: string;
  darkColor?: string;
}

export const PCI_LEVELS: PCILevel[] = [
  { min: 86, max: 100, label: 'Excellent', color: '#2f9e44', darkColor: '#2f9e44' }, // Dark green
  { min: 71, max: 85, label: 'Good', color: '#51cf66', darkColor: '#51cf66' },      // Light green
  { min: 56, max: 70, label: 'Satisfactory', color: '#ffd43b', darkColor: '#ffd43b' }, // Yellow
  { min: 41, max: 55, label: 'Fair', color: '#fab005', darkColor: '#fab005' },      // Orange
  { min: 26, max: 40, label: 'Poor', color: '#e8590c', darkColor: '#e8590c' },     // Dark orange
  { min: 11, max: 25, label: 'Serious', color: '#c92a2a', darkColor: '#c92a2a' },   // Red
  { min: 0, max: 10, label: 'Failed', color: '#3a3a3a', darkColor: '#3a3a3a' }   // Gray
];

interface MapLegendProps {
  showPCILegend: boolean;
  showAssetLegend: boolean;
  onTogglePCI: () => void;
  onToggleAssets: () => void;
  isDarkMode?: boolean;
  className?: string;
}

export function MapLegend({ 
  showPCILegend, 
  showAssetLegend, 
  onTogglePCI, 
  onToggleAssets,
  isDarkMode = false,
  className 
}: MapLegendProps) {
  return (
    <Card className={cn("glass-card border-white/20 bg-white/90 dark:bg-black/90", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center text-slate-800 dark:text-white">
          <BarChart3 className="w-5 h-5 mr-2" />
          Map Legend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PCI Legend Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            PCI Road Segments
          </span>
          <button
            onClick={onTogglePCI}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            {showPCILegend ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {showPCILegend ? 'Visible' : 'Hidden'}
          </button>
        </div>

        {/* PCI Color Scale */}
        {showPCILegend && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              PCI Color Scale
            </h4>
            <div className="space-y-1.5">
              {PCI_LEVELS.map((level, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3 border border-white/20"
                      style={{ 
                        backgroundColor: isDarkMode ? level.darkColor || level.color : level.color 
                      }}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {level.label}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {level.min}-{level.max}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Asset Legend Toggle */}
        <div className="pt-3 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              City Assets
            </span>
            <button
              onClick={onToggleAssets}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {showAssetLegend ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {showAssetLegend ? 'Visible' : 'Hidden'}
            </button>
          </div>

          {/* Asset Types */}
          {showAssetLegend && (
            <div className="space-y-2 mt-3">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Asset Types
              </h4>
              <div className="space-y-1.5">
                {[
                  { type: 'Traffic Signs', color: '#3b82f6', icon: '🛑' },
                  { type: 'Street Lights', color: '#eab308', icon: '💡' },
                  { type: 'Traffic Lights', color: '#dc2626', icon: '🚦' },
                  { type: 'Benches', color: '#16a34a', icon: '🪑' },
                  { type: 'Fire Hydrants', color: '#dc2626', icon: '🚒' },
                  { type: 'Manholes', color: '#6b7280', icon: '⚫' }
                ].map((asset, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3 border border-white/20 flex items-center justify-center text-xs"
                      style={{ backgroundColor: asset.color }}
                    >
                      <span className="text-white text-xs leading-none">
                        {asset.icon}
                      </span>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {asset.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Controls Info */}
        <div className="pt-3 border-t border-white/20">
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>🖱️ Click road segments for details</p>
            <p>📍 Click assets for information</p>
            <p>🔍 Use mouse wheel to zoom</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get PCI color based on score
export function getPCIColor(pci: number, isDarkMode: boolean = false): string {
  const level = PCI_LEVELS.find(l => pci >= l.min && pci <= l.max);
  if (!level) return isDarkMode ? '#9ca3af' : '#6b7280'; // Default gray
  return isDarkMode ? (level.darkColor || level.color) : level.color;
}

// Helper function to get PCI label based on score
export function getPCILabel(pci: number): string {
  const level = PCI_LEVELS.find(l => pci >= l.min && pci <= l.max);
  return level?.label || 'Unknown';
}

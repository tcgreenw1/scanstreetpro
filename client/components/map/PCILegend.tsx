import React from 'react';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PCI_LEVELS } from './MapLegend';

interface PCILegendProps {
  showPCILayer: boolean;
  onTogglePCI: () => void;
  isDarkMode?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function PCILegend({ 
  showPCILayer, 
  onTogglePCI,
  isDarkMode = false,
  position = 'bottom-right',
  className 
}: PCILegendProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={cn(
      "fixed z-40 w-72",
      positionClasses[position],
      className
    )}>
      <div 
        className="glass-card border border-white/20 rounded-xl p-4 shadow-xl"
        style={{ 
          background: isDarkMode 
            ? 'rgba(0, 0, 0, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              PCI Color Legend
            </h3>
          </div>
          <button
            onClick={onTogglePCI}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors hover:bg-white/20 dark:hover:bg-black/20"
          >
            {showPCILayer ? (
              <>
                <Eye className="w-3 h-3" />
                <span className="text-blue-600 dark:text-blue-400">Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span className="text-slate-500">Hidden</span>
              </>
            )}
          </button>
        </div>

        {/* Legend Items */}
        {showPCILayer && (
          <div className="space-y-2">
            {PCI_LEVELS.map((level, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between group hover:bg-white/10 dark:hover:bg-black/10 rounded-lg p-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/30 shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: level.color }}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {level.label}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-white/20 dark:bg-black/20 px-2 py-1 rounded">
                  {level.min}–{level.max}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/20 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span>Pavement Condition Index</span>
            <span className="font-mono">{PCI_LEVELS.length} levels</span>
          </div>
        </div>
      </div>
    </div>
  );
}

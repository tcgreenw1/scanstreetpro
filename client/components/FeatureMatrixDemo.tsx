import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Eye, Database, Lock, CheckCircle } from 'lucide-react';
import { useFeatureMatrix, useNavFeatures, useDashboardFeatures } from '@/hooks/useFeatureMatrix';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export function FeatureMatrixDemo() {
  const { userPlan } = useFeatureMatrix();
  const navFeatures = useNavFeatures();
  const dashboardFeatures = useDashboardFeatures();

  const getStateColor = (state: string) => {
    switch (state) {
      case 'shown': return 'text-green-600 bg-green-100 border-green-300';
      case 'sample_data': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'paywall': return 'text-amber-600 bg-amber-100 border-amber-300';
      case 'not_shown': return 'text-slate-500 bg-slate-100 border-slate-300';
      default: return 'text-slate-600 bg-slate-100 border-slate-300';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'shown': return <CheckCircle className="w-3 h-3" />;
      case 'sample_data': return <Database className="w-3 h-3" />;
      case 'paywall': return <Eye className="w-3 h-3" />;
      case 'not_shown': return <Lock className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStateDescription = (state: string) => {
    switch (state) {
      case 'shown': return 'Full access with real data';
      case 'sample_data': return 'Feature shown with sample data';
      case 'paywall': return 'Preview mode - clickable but locked';
      case 'not_shown': return 'Hidden - replaced with summaries';
      default: return 'Unknown state';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto glass-card bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20">
      <Card className="border-none bg-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Feature Matrix Demo
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Current Plan: {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Legend */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Feature States:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { state: 'shown', label: 'Shown' },
                { state: 'sample_data', label: 'Sample' },
                { state: 'paywall', label: 'Preview' },
                { state: 'not_shown', label: 'Hidden' }
              ].map(({ state, label }) => (
                <div key={state} className="flex items-center gap-1">
                  <Badge variant="outline" className={`text-xs ${getStateColor(state)}`}>
                    {getStateIcon(state)}
                    {label}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Navigation Features:</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {Object.entries(navFeatures).slice(0, 8).map(([feature, config]) => (
                <div key={feature} className="flex items-center justify-between text-xs">
                  <span className="capitalize truncate flex-1">{feature.replace(/([A-Z])/g, ' $1')}</span>
                  <Badge variant="outline" className={`text-xs ml-2 ${getStateColor(config.state)}`}>
                    {getStateIcon(config.state)}
                    {config.state.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Features */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Dashboard Features:</h4>
            <div className="space-y-1">
              {Object.entries(dashboardFeatures).map(([feature, config]) => (
                <div key={feature} className="flex items-center justify-between text-xs">
                  <span className="capitalize truncate flex-1">{feature.replace(/([A-Z])/g, ' $1')}</span>
                  <Badge variant="outline" className={`text-xs ml-2 ${getStateColor(config.state)}`}>
                    {getStateIcon(config.state)}
                    {config.state.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Test Links */}
          <div className="pt-3 border-t border-white/20 space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Test Navigation:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/assets">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Assets
                  <Badge variant="outline" className={`ml-1 text-xs ${getStateColor(navFeatures.assetManager?.state || 'shown')}`}>
                    {navFeatures.assetManager?.state || 'shown'}
                  </Badge>
                </Button>
              </Link>
              <Link to="/contractors">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Contractors
                  <Badge variant="outline" className={`ml-1 text-xs ${getStateColor(navFeatures.contractors?.state || 'shown')}`}>
                    {navFeatures.contractors?.state || 'shown'}
                  </Badge>
                </Button>
              </Link>
              <Link to="/maintenance">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Maintenance
                  <Badge variant="outline" className={`ml-1 text-xs ${getStateColor(navFeatures.maintenance?.state || 'shown')}`}>
                    {navFeatures.maintenance?.state || 'shown'}
                  </Badge>
                </Button>
              </Link>
              <Link to="/funding">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Funding
                  <Badge variant="outline" className={`ml-1 text-xs ${getStateColor(navFeatures.fundingCenter?.state || 'shown')}`}>
                    {navFeatures.fundingCenter?.state || 'shown'}
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>

          {/* Behavior Guide */}
          <div className="pt-3 border-t border-white/20">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Behavior Guide:</h4>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <div>🔓 <strong>Shown:</strong> Full access with real data</div>
              <div>📊 <strong>Sample:</strong> UI shown with mock data</div>
              <div>🔒 <strong>Paywall:</strong> Preview mode - visually shown but locked</div>
              <div>🙈 <strong>Hidden:</strong> Replaced with summary visualizations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

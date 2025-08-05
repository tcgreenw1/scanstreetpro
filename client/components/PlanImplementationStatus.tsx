import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Database } from 'lucide-react';
import { planTrackingApi, PlanTrackingData, ensurePlanTrackingReady } from '@/utils/planTrackingApi';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function PlanImplementationStatus() {
  const [trackingData, setTrackingData] = useState<PlanTrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadTrackingData();
  }, []);

  const loadTrackingData = async () => {
    setLoading(true);

    // Ensure tracking system is ready first
    const readyResult = await ensurePlanTrackingReady();
    if (!readyResult.success) {
      console.warn('Plan tracking system not available');
      setLoading(false);
      return;
    }

    const result = await planTrackingApi.getAll();
    if (result.success) {
      setTrackingData(result.data);
    }
    setLoading(false);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 left-4 z-40">
        <Button 
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="glass-card border-white/30 bg-white/80 dark:bg-black/80"
        >
          <Database className="w-4 h-4 mr-2" />
          Implementation Status
        </Button>
      </div>
    );
  }

  const completedPages = trackingData.filter(page => page.implementation_status === 'completed').length;
  const totalPages = trackingData.length;
  const progressPercentage = totalPages > 0 ? (completedPages / totalPages) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 w-96 glass-card border border-white/20 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-xl shadow-xl">
      <Card className="border-none bg-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5" />
              Plan Implementation Progress
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{completedPages} of {totalPages} pages completed</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="text-center py-4 text-sm text-slate-500">Loading...</div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {trackingData.map((page) => (
                <div key={page.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(page.implementation_status)}
                    <span className="text-sm truncate" title={page.page_name}>
                      {page.page_name}
                    </span>
                  </div>
                  {getStatusBadge(page.implementation_status)}
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-white/20">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadTrackingData}
              className="w-full text-xs"
              disabled={loading}
            >
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

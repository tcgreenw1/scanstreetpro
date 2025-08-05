import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { planTrackingApi, ensurePlanTrackingReady } from '@/utils/planTrackingApi';

export function PlanTrackingTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testInit = async () => {
    setLoading(true);
    setResult('Testing initialization...');
    
    try {
      const initResult = await ensurePlanTrackingReady();
      if (initResult.success) {
        setResult('✅ Plan tracking system initialized successfully!');
      } else {
        setResult(`❌ Failed to initialize: ${initResult.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetAll = async () => {
    setLoading(true);
    setResult('Testing data fetch...');
    
    try {
      const result = await planTrackingApi.getAll();
      if (result.success) {
        setResult(`✅ Found ${result.data.length} pages in tracking data`);
      } else {
        setResult(`❌ Failed to fetch data: ${result.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-96 fixed top-4 right-4 z-50 glass-card bg-white/90 dark:bg-black/90">
      <CardHeader>
        <CardTitle className="text-sm">Plan Tracking System Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={testInit} 
            disabled={loading}
            className="flex-1"
          >
            Test Init
          </Button>
          <Button 
            size="sm" 
            onClick={testGetAll} 
            disabled={loading}
            className="flex-1"
          >
            Test Fetch
          </Button>
        </div>
        {result && (
          <div className="text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded">
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { planTrackingApi, ensurePlanTrackingReady } from '@/utils/planTrackingApi';
import { useFeatureMatrix } from '@/hooks/useFeatureMatrix';
import { useAuth } from '@/contexts/AuthContext';
import { testPlanTracking } from '@/utils/initFeatureMatrix';

export function PlanTrackingTest() {
  const { user } = useAuth();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { userPlan, matrix } = useFeatureMatrix();

  // Only show to admin users
  if (!['admin', 'superadmin', 'owner'].includes(user?.role)) {
    return null;
  }

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

  const testFeatureMatrix = async () => {
    setLoading(true);
    setResult('Testing feature matrix...');

    try {
      const response = await fetch(`/api/feature-matrix/plan/${userPlan}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const dashboardFeatures = Object.keys(data.data.matrix.dashboard).length;
          const navFeatures = Object.keys(data.data.matrix.navMenu).length;
          setResult(`✅ Feature matrix loaded: ${dashboardFeatures} dashboard features, ${navFeatures} nav features`);
        } else {
          setResult(`❌ API error: ${data.error}`);
        }
      } else {
        setResult(`❌ HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testFeatureStates = () => {
    setLoading(true);
    setResult('Testing local feature states...');

    try {
      const dashboardFeatures = Object.keys(matrix.dashboard).length;
      const navFeatures = Object.keys(matrix.navMenu).length;
      setResult(`✅ Local matrix: Plan=${userPlan}, Dashboard=${dashboardFeatures}, Nav=${navFeatures}`);
    } catch (error) {
      setResult(`❌ Error: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testPlanTrackingAPI = async () => {
    setLoading(true);
    setResult('Testing plan tracking API...');

    try {
      const result = await testPlanTracking();
      if (result.success) {
        setResult(`✅ Plan tracking API: ${result.data.length} entries found`);
      } else {
        setResult(`❌ Plan tracking API failed: ${result.error}`);
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
        <CardTitle className="text-sm">Feature Matrix Test ({userPlan})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={testInit}
            disabled={loading}
          >
            Test Init
          </Button>
          <Button
            size="sm"
            onClick={testGetAll}
            disabled={loading}
          >
            Test Fetch
          </Button>
          <Button
            size="sm"
            onClick={testFeatureMatrix}
            disabled={loading}
          >
            Matrix API
          </Button>
          <Button
            size="sm"
            onClick={testFeatureStates}
            disabled={loading}
          >
            Local Matrix
          </Button>
          <Button
            size="sm"
            onClick={testPlanTrackingAPI}
            disabled={loading}
            className="col-span-2"
          >
            Test Plan API
          </Button>
        </div>
        {result && (
          <div className="text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded max-h-32 overflow-y-auto">
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

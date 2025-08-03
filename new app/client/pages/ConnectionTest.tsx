import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { testSupabaseConnection } from '@/lib/supabase';
import { runDiagnostics, getStatusIcon, getStatusColor, DiagnosticResult } from '@/utils/diagnostics';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function ConnectionTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [autoTested, setAutoTested] = useState(false);

  useEffect(() => {
    if (!autoTested) {
      runConnectionTest();
      runFullDiagnostics();
      setAutoTested(true);
    }
  }, [autoTested]);

  const runConnectionTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      console.log('🧪 Running connection test...');
      const result = await testSupabaseConnection();
      setTestResult(result);
      console.log('🧪 Test completed:', result);
    } catch (error: any) {
      console.error('🧪 Test failed:', error);
      setTestResult({
        success: false,
        error: error?.message || 'Unknown test error'
      });
    } finally {
      setTesting(false);
    }
  };

  const runFullDiagnostics = async () => {
    setRunningDiagnostics(true);
    setDiagnostics([]);

    try {
      console.log('🔍 Running full diagnostics...');
      const results = await runDiagnostics();
      setDiagnostics(results);
      console.log('🔍 Diagnostics completed:', results);
    } catch (error: any) {
      console.error('🔍 Diagnostics failed:', error);
      setDiagnostics([{
        component: 'Diagnostics System',
        status: 'fail',
        message: 'Failed to run diagnostics',
        details: error?.message || 'Unknown error'
      }]);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  const getStatusIcon = () => {
    if (testing) return <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />;
    if (!testResult) return <AlertCircle className="w-6 h-6 text-gray-400" />;
    return testResult.success ? 
      <CheckCircle className="w-6 h-6 text-green-500" /> : 
      <XCircle className="w-6 h-6 text-red-500" />;
  };

  const getStatusText = () => {
    if (testing) return 'Testing connection...';
    if (!testResult) return 'No test run yet';
    return testResult.success ? 'Connection successful!' : 'Connection failed';
  };

  const getStatusColor = () => {
    if (testing) return 'border-blue-200 bg-blue-50';
    if (!testResult) return 'border-gray-200 bg-gray-50';
    return testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Supabase Connection Test</h1>
          <p className="text-gray-600 mt-2">Test and debug your Supabase database connection</p>
        </div>

        <Card className={`${getStatusColor()} transition-colors duration-300`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              {getStatusIcon()}
              <span>Connection Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{getStatusText()}</span>
                <div className="flex space-x-2">
                  <Button
                    onClick={runConnectionTest}
                    disabled={testing}
                    variant="outline"
                  >
                    {testing ? 'Testing...' : 'Test Again'}
                  </Button>
                  <Button
                    onClick={runFullDiagnostics}
                    disabled={runningDiagnostics}
                    variant="outline"
                  >
                    {runningDiagnostics ? 'Running...' : 'Full Diagnostics'}
                  </Button>
                </div>
              </div>

              {testResult && (
                <Alert variant={testResult.success ? 'default' : 'destructive'}>
                  <AlertDescription>
                    {testResult.success ? (
                      <div>
                        <strong>✅ Connection Successful!</strong>
                        <br />
                        Both authentication and database services are working properly.
                      </div>
                    ) : (
                      <div>
                        <strong>❌ Connection Failed:</strong>
                        <br />
                        {testResult.error}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {diagnostics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>System Diagnostics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diagnostics.map((diagnostic, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getStatusIcon(diagnostic.status)}</span>
                      <div>
                        <p className="font-medium">{diagnostic.component}</p>
                        <p className={`text-sm ${getStatusColor(diagnostic.status)}`}>
                          {diagnostic.message}
                        </p>
                        {diagnostic.details && (
                          <div className="text-xs text-gray-500 mt-1">
                            {typeof diagnostic.details === 'string'
                              ? diagnostic.details
                              : JSON.stringify(diagnostic.details, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Supabase URL</span>
                <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Supabase Key</span>
                <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              {import.meta.env.VITE_SUPABASE_URL && (
                <div className="text-xs text-gray-500 mt-2">
                  URL: {import.meta.env.VITE_SUPABASE_URL}
                </div>
              )}
              {import.meta.env.VITE_SUPABASE_ANON_KEY && (
                <div className="text-xs text-gray-500">
                  Key: {import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/database-setup', '_blank')}
              >
                🔧 Database Setup
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/debug-env', '_blank')}
              >
                🐛 Debug Environment
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/login', '_blank')}
              >
                🔐 Test Login
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-red-600">❌ Common Issues:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                  <li><strong>Invalid Supabase URL:</strong> Should be https://xxx.supabase.co</li>
                  <li><strong>Invalid anon key:</strong> Should start with 'eyJ' (JWT format)</li>
                  <li><strong>Network errors:</strong> Check internet connection</li>
                  <li><strong>Database not found:</strong> Tables may not be created yet</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-green-600">✅ Solutions:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                  <li>Check environment variables in .env file</li>
                  <li>Verify Supabase project is active</li>
                  <li>Run database setup if tables are missing</li>
                  <li>Check browser console for detailed errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

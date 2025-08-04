import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getErrorMessage } from '@/utils/errorHandler';
import { testSupabaseConnection } from '@/lib/supabase';

export default function ErrorTest() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testErrorHandling = () => {
    // Test different error types
    const testCases = [
      { name: 'String error', error: 'Simple string error' },
      { name: 'Error object', error: new Error('Error object message') },
      { name: 'Object with message', error: { message: 'Object message' } },
      { name: 'Nested error', error: { error: { message: 'Nested error message' } } },
      { name: 'Complex object', error: { code: 'E001', details: 'Complex error details' } },
      { name: 'Empty object', error: {} },
      { name: 'Null error', error: null },
      { name: 'Undefined error', error: undefined },
    ];

    testCases.forEach(testCase => {
      const result = getErrorMessage(testCase.error);
      addResult(`${testCase.name}: "${result}"`);
    });
  };

  const testConnectionError = async () => {
    try {
      addResult('Testing Supabase connection...');
      const result = await testSupabaseConnection();
      if (result.success) {
        addResult('✅ Connection successful');
      } else {
        addResult(`❌ Connection failed: "${result.error}"`);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      addResult(`❌ Connection test error: "${errorMessage}"`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Error Handling Test</h1>
          <p className="text-gray-600 mt-2">Test error message extraction and display</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button onClick={testErrorHandling}>
                Test Error Message Extraction
              </Button>
              <Button onClick={testConnectionError} variant="outline">
                Test Connection Error
              </Button>
              <Button onClick={clearResults} variant="destructive">
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <Alert key={index}>
                    <AlertDescription className="font-mono text-sm">
                      {result}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Expected Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>✅ Good:</strong> Clear, readable error messages</p>
              <p><strong>❌ Bad:</strong> "[object Object]" or similar unhelpful messages</p>
              <p><strong>Note:</strong> All error objects should be converted to meaningful strings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

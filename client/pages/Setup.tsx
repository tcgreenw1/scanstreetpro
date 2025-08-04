import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Database, Loader2 } from "lucide-react";

export default function Setup() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const runMigration = async () => {
    setStatus('running');
    setMessage('');
    
    try {
      const response = await fetch('/api/migrate/financial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage('Failed to connect to server: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Database className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            Initialize financial tracking tables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This will create the financial tracking tables needed for the admin portal.
            </p>
          </div>
          
          <Button 
            onClick={runMigration} 
            disabled={status === 'running' || status === 'success'}
            className="w-full"
          >
            {status === 'running' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {status === 'running' ? 'Setting up...' : status === 'success' ? 'Setup Complete' : 'Setup Database'}
          </Button>
          
          {status === 'success' && (
            <div className="text-center">
              <Button variant="outline" onClick={() => window.location.href = '/login'} className="w-full">
                Continue to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

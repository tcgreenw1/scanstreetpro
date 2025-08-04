import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Database } from "lucide-react";

export default function MigrationHelper() {
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
      setMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Migration</span>
          </CardTitle>
          <CardDescription>
            Apply financial tracking tables and settings to the database
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
              This migration will create:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• transactions table for financial tracking</li>
              <li>• system_settings table for configuration</li>
              <li>• Required enums and indexes</li>
              <li>• Default system settings</li>
            </ul>
          </div>
          
          <Button 
            onClick={runMigration} 
            disabled={status === 'running'}
            className="w-full"
          >
            {status === 'running' ? 'Applying Migration...' : 'Apply Migration'}
          </Button>
          
          {status === 'success' && (
            <div className="text-center">
              <Button variant="outline" onClick={() => window.location.href = '/admin-portal'}>
                Go to Admin Portal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

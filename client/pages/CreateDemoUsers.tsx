import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Users } from 'lucide-react';

const CreateDemoUsers = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const demoUsers = [
    {
      fullName: 'System Administrator',
      organizationName: 'Scan Street Pro Admin',
      email: 'admin@scanstreetpro.com',
      password: 'admin123'
    },
    {
      fullName: 'Test Manager',
      organizationName: 'City of Springfield',
      email: 'test@springfield.gov',
      password: 'test123'
    },
    {
      fullName: 'Premium User',
      organizationName: 'Premium Organization',
      email: 'premium@springfield.gov',
      password: 'premium123'
    }
  ];

  const createDemoUsers = async () => {
    setLoading(true);
    setResults([]);

    const newResults = [];

    for (const user of demoUsers) {
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });

        const data = await response.json();
        
        newResults.push({
          user: user.email,
          success: data.success,
          message: data.success ? 'Created successfully' : data.error,
          data: data.data
        });
      } catch (error: any) {
        newResults.push({
          user: user.email,
          success: false,
          message: error.message,
          data: null
        });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Create Demo Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Create demo users for testing the authentication system.
            </p>

            <div className="space-y-2 text-sm bg-gray-50 p-4 rounded">
              <p><strong>Demo Users to be created:</strong></p>
              {demoUsers.map((user, index) => (
                <p key={index}>
                  • {user.email} (password: {user.password})
                </p>
              ))}
            </div>

            <Button
              onClick={createDemoUsers}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Create Demo Users
            </Button>

            {results.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Results:</h3>
                {results.map((result, index) => (
                  <Alert key={index} className={result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                    <div className="flex items-start space-x-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <AlertDescription className="text-sm">
                          <strong>{result.user}:</strong> {result.message}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateDemoUsers;

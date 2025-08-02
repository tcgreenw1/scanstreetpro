import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, HardHat, MapPin } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo login logic
    if (email && password) {
      // Store demo auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', email.includes('admin') ? 'admin' : 'contractor');
      navigate('/dashboard');
    } else {
      setError('Please enter email and password');
    }

    setIsLoading(false);
  };

  const fillDemo = (role: 'contractor' | 'admin') => {
    if (role === 'contractor') {
      setEmail('contractor@demo.com');
      setPassword('demo123');
    } else {
      setEmail('admin@city.gov');
      setPassword('demo123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl">
              <HardHat className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Public Works Portal</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage road maintenance tasks</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Access your contractor dashboard or admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Buttons */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center mb-3">Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemo('contractor')}
                  className="text-xs"
                >
                  👷 Contractor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemo('admin')}
                  className="text-xs"
                >
                  🧑‍💼 Admin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Powered by City of Springfield Public Works</span>
          </div>
        </div>
      </div>
    </div>
  );
}

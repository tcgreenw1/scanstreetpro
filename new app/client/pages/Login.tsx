import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, Building2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up flow
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        setError('Check your email for verification link!');
      } else {
        // Sign in flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Check if user is admin
          const { data: userData } = await supabase
            .from('users')
            .select('role, organizations(plan)')
            .eq('id', data.user.id)
            .single();
            
          if (userData?.role === 'admin') {
            navigate('/admin-portal');
          } else {
            navigate('/dashboard');
          }
        }
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Google authentication failed');
    }
  };

  const handleDemoLogin = async (demoType: 'admin' | 'user') => {
    setLoading(true);
    setError('');
    
    const demoCredentials = {
      admin: { email: 'admin@scanstreetpro.com', password: 'AdminPass123!' },
      user: { email: 'test@springfield.gov', password: 'TestUser123!' }
    };
    
    const { email: demoEmail, password: demoPassword } = demoCredentials[demoType];
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      
      if (error) throw error;
      
      if (data.user) {
        if (demoType === 'admin') {
          navigate('/admin-portal');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scan Street Pro
            </span>
          </div>
          <p className="text-gray-600">Municipal Infrastructure Management</p>
        </div>

        {/* Main Login Card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? 'Sign up to get started with infrastructure management' 
                : 'Sign in to access your infrastructure dashboard'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant={error.includes('Check your email') ? 'default' : 'destructive'}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@scanstreetpro.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              className="w-full"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Login Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/60 backdrop-blur-sm border-0 hover:bg-white/80 transition-all cursor-pointer group">
            <CardContent className="p-4" onClick={() => handleDemoLogin('admin')}>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="font-semibold text-sm">Admin Demo</h3>
                <p className="text-xs text-gray-600">Full access to admin portal</p>
                <Button size="sm" variant="outline" className="w-full group-hover:bg-red-50">
                  Try Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 hover:bg-white/80 transition-all cursor-pointer group">
            <CardContent className="p-4" onClick={() => handleDemoLogin('user')}>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm">User Demo</h3>
                <p className="text-xs text-gray-600">Standard user experience</p>
                <Button size="sm" variant="outline" className="w-full group-hover:bg-blue-50">
                  Try User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-xs text-gray-500">
          Demo Credentials:<br />
          Admin: admin@scanstreetpro.com / AdminPass123!<br />
          User: test@springfield.gov / TestUser123!
        </div>
      </div>
    </div>
  );
};

export default Login;

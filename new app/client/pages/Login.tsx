import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signInWithTimeout, signUpWithTimeout } from '@/lib/supabase';
import { tryFallbackLogin, getFallbackSession } from '@/utils/authFallback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Check for existing fallback session
      const fallbackSession = getFallbackSession();
      if (fallbackSession) {
        if (fallbackSession.role === 'admin') {
          navigate('/admin-portal');
        } else {
          navigate('/dashboard');
        }
        return;
      }

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (userData?.role === 'admin') {
          navigate('/admin-portal');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log('No active session');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const result = await signUpWithTimeout(email, password);
        if (result.error) throw result.error;
        setError('✅ Check your email for verification link!');
      } else {
        // Try Supabase auth first
        try {
          const { data, error } = await signInWithTimeout(email, password);
          if (error) throw error;

          if (data.user) {
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
        } catch (authError: any) {
          // Try fallback auth if Supabase fails
          const fallbackResult = await tryFallbackLogin(email, password);
          if (fallbackResult.success) {
            if (fallbackResult.user?.role === 'admin') {
              navigate('/admin-portal');
            } else {
              navigate('/dashboard');
            }
          } else {
            throw authError;
          }
        }
      }
    } catch (error: any) {
      setError(error?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-xl">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Scan Street Pro</h1>
          </div>
          <p className="text-slate-500 font-medium">Municipal Infrastructure Management</p>
        </div>

        {/* Main Login Card - Apple Glass Style */}
        <div className="glass-card border-white/20 backdrop-blur-xl bg-white/80 shadow-2xl rounded-3xl border border-slate-200/50">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-500 mt-2">
                {isSignUp
                  ? 'Join the future of infrastructure management'
                  : 'Sign in to your infrastructure dashboard'
                }
              </p>
            </div>

            {error && (
              <Alert variant={error.includes('✅') ? 'default' : 'destructive'}>
                <AlertDescription className={error.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 glass-card border-slate-200/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/60 backdrop-blur-sm rounded-xl text-slate-800 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 glass-card border-slate-200/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/60 backdrop-blur-sm rounded-xl text-slate-800 placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg backdrop-blur-sm border border-blue-400/20 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-slate-400">
          Need help? Contact your system administrator
        </div>
      </div>
    </div>
  );
};

export default Login;

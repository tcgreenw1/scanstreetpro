import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, testSupabaseConnection, signInWithTimeout, signUpWithTimeout } from '@/lib/supabase';
import { tryFallbackLogin, getFallbackSession, isFallbackMode } from '@/utils/authFallback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  Chrome,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'fallback'>('checking');
  const [fallbackMode, setFallbackMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    initializeLogin();
  }, []);

  const initializeLogin = async () => {
    try {
      setConnectionStatus('checking');

      // Check for existing fallback session first
      const fallbackSession = getFallbackSession();
      if (fallbackSession) {
        console.log('🔄 Found fallback session, redirecting...');
        setFallbackMode(true);
        setConnectionStatus('fallback');

        if (fallbackSession.role === 'admin') {
          navigate('/admin-portal');
        } else {
          navigate('/dashboard');
        }
        return;
      }

      // Test Supabase connection
      const connectionTest = await testSupabaseConnection();

      if (!connectionTest.success) {
        console.log('⚠️ Supabase connection failed, enabling fallback mode');
        setConnectionStatus('fallback');
        setFallbackMode(true);
        setError(`Database connection failed. Using offline mode. Demo credentials: admin@scanstreetpro.com / AdminPass123!`);
        return;
      }

      setConnectionStatus('connected');
      setFallbackMode(false);

      // Check if user is already logged in via Supabase
      await checkUser();
    } catch (error: any) {
      console.error('Login initialization error:', error);
      setConnectionStatus('fallback');
      setFallbackMode(true);
      setError(`Initialization failed: ${error?.message || 'Unknown error'}. Using offline mode.`);
    }
  };

  const checkUser = async () => {
    try {
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
    } catch (error: any) {
      console.log('No active session:', error?.message || error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please check your connection and try again.');
    }, 15000); // 15 second timeout

    try {
      if (isSignUp && !fallbackMode) {
        // Sign up flow (only available when Supabase is connected)
        const result = await signUpWithTimeout(email, password);

        clearTimeout(timeoutId);

        setError('✅ Check your email for verification link!');
      } else {
        // Sign in flow
        let authResult;

        if (fallbackMode) {
          // Use fallback authentication
          authResult = await tryFallbackLogin(email, password);
          clearTimeout(timeoutId);

          if (!authResult.success) {
            throw new Error(authResult.error || 'Fallback authentication failed');
          }

          // Navigate based on role
          if (authResult.user?.role === 'admin') {
            navigate('/admin-portal');
          } else {
            navigate('/dashboard');
          }
        } else {
          // Use Supabase authentication
          const { data, error } = await signInWithTimeout(email, password);

          clearTimeout(timeoutId);

          if (error) throw error;

          if (data.user) {
            // Check if user is admin with timeout
            const userPromise = supabase
              .from('users')
              .select('role, organizations(plan)')
              .eq('id', data.user.id)
              .single();

            const { data: userData } = await Promise.race([
              userPromise,
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Database query timeout')), 5000)
              )
            ]) as any;

            if (userData?.role === 'admin') {
              navigate('/admin-portal');
            } else {
              navigate('/dashboard');
            }
          }
        }
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Auth error:', error);

      // If Supabase auth fails and we're not in fallback mode yet, try fallback
      if (!fallbackMode && !isSignUp) {
        console.log('🔄 Supabase auth failed, trying fallback...');
        try {
          const fallbackResult = await tryFallbackLogin(email, password);
          if (fallbackResult.success) {
            setFallbackMode(true);
            setConnectionStatus('fallback');
            setError('⚠️ Using offline mode - Limited functionality available');

            if (fallbackResult.user?.role === 'admin') {
              navigate('/admin-portal');
            } else {
              navigate('/dashboard');
            }
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback auth also failed:', fallbackError);
        }
      }

      setError(error?.message || 'Authentication failed. Please try again.');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
      setError(error?.message || 'Google authentication is not configured. Please contact your administrator.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoType: 'admin' | 'user' | 'premium') => {
    setLoading(true);
    setError('');
    
    const demoCredentials = {
      admin: { email: 'admin@scanstreetpro.com', password: 'AdminPass123!' },
      user: { email: 'test@springfield.gov', password: 'TestUser123!' },
      premium: { email: 'premium@springfield.gov', password: 'Premium!' }
    };
    
    const { email: demoEmail, password: demoPassword } = demoCredentials[demoType];
    
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Demo login timed out. Please try again.');
    }, 10000);
    
    try {
      const { data, error } = await signInWithTimeout(demoEmail, demoPassword);

      clearTimeout(timeoutId);

      if (error) throw error;
      
      if (data.user) {
        if (demoType === 'admin') {
          navigate('/admin-portal');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Demo login error:', error);
      setError(error?.message || `${demoType} demo login failed. Please try again.`);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-800">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-shift"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-white/5 via-transparent to-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand */}
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative inline-flex items-center space-x-3 p-6 glass-card rounded-3xl border border-white/20 shadow-2xl">
                <div className="relative">
                  <Building2 className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 blur-xl"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Scan Street Pro
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-white/70 font-medium">Municipal Infrastructure</p>
                    <div className="flex items-center space-x-1 text-xs">
                      {connectionStatus === 'checking' && (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-yellow-200">Connecting...</span>
                        </>
                      )}
                      {connectionStatus === 'connected' && (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-200">Connected</span>
                        </>
                      )}
                      {connectionStatus === 'error' && (
                        <>
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-red-200">Connection Error</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Login Card */}
          <div className="relative group animate-fade-in-up animation-delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative glass-card rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl">
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    {isSignUp ? 'Join the Future' : 'Welcome Back'}
                  </h2>
                  <p className="text-white/60">
                    {isSignUp 
                      ? 'Create your account to get started' 
                      : 'Sign in to your infrastructure dashboard'
                    }
                  </p>
                </div>

                {error && (
                  <Alert variant={error.includes('✅') ? 'default' : 'destructive'} className="glass-card border-white/20">
                    <AlertDescription className={error.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80 font-medium">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="premium@springfield.gov"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 glass-input border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80 font-medium">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-white/60 transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-12 glass-input border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/20 transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-black/50 px-4 text-white/60 font-medium">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="w-full h-12 glass-card border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  <Chrome className="mr-3 h-5 w-5" />
                  Sign in with Google
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-white/60 hover:text-white/80 transition-colors font-medium"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Login Cards */}
          <div className="grid grid-cols-3 gap-3 animate-fade-in-up animation-delay-400">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/50 to-pink-500/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div 
                className="relative glass-card rounded-2xl border border-white/20 p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleDemoLogin('admin')}
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">Admin</h3>
                  <p className="text-xs text-white/60">Full System Access</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div 
                className="relative glass-card rounded-2xl border border-white/20 p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleDemoLogin('user')}
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">User</h3>
                  <p className="text-xs text-white/60">Standard Access</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div 
                className="relative glass-card rounded-2xl border border-white/20 p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleDemoLogin('premium')}
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">Premium</h3>
                  <p className="text-xs text-white/60">Enhanced Features</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-white/40 space-y-1 animate-fade-in-up animation-delay-600">
            <div>🚀 Demo Credentials Available</div>
            <div>Admin: admin@scanstreetpro.com • User: test@springfield.gov • Premium: premium@springfield.gov</div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, signUpWithTimeout } from '@/lib/neonAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { DarkModeToggle } from '@/components/DarkModeToggle';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkSession();

    // Dark mode is now handled by ThemeContext
  }, [navigate]);


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signUpWithTimeout(
        formData.email,
        formData.password,
        formData.fullName,
        formData.organizationName || undefined
      );

      if (result.error) {
        throw result.error;
      }

      setSuccess('Account created successfully! You have been automatically signed in.');

      // Navigate to dashboard after successful signup
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      setError(error?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-all duration-500">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float"></div>
        </div>

        {/* Dark Mode Toggle */}
        <DarkModeToggle variant="floating" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Logo/Brand */}
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl animate-gradient-shift">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Scan Street Pro
              </h1>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Join the Future
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Create your account in seconds
              </p>
            </div>
          </div>

          {/* Main Sign Up Card */}
          <div className="glass-card border-white/20 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 shadow-2xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up animation-delay-200">
            <div className="p-8 space-y-6">

              {error && (
                <Alert variant="destructive" className="animate-scale-in">
                  <AlertDescription className="text-red-600 dark:text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-scale-in">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-slate-700 dark:text-slate-300 font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-12 h-14 glass-card border-slate-200/50 dark:border-slate-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Organization Name */}
                <div className="space-y-3">
                  <Label htmlFor="organizationName" className="text-slate-700 dark:text-slate-300 font-medium">
                    Organization Name <span className="text-slate-400">(optional)</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="organizationName"
                      type="text"
                      placeholder="Your company or organization name"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      className="pl-12 h-14 glass-card border-slate-200/50 dark:border-slate-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-12 h-14 glass-card border-slate-200/50 dark:border-slate-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-12 pr-12 h-14 glass-card border-slate-200/50 dark:border-slate-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-12 pr-12 h-14 glass-card border-slate-200/50 dark:border-slate-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg backdrop-blur-sm border border-blue-400/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] btn-glow"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span>Sign Up</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors hover:underline"
                >
                  Already have an account? Log in
                </Link>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center text-slate-400 dark:text-slate-500 animate-fade-in-up animation-delay-400">
            Need help? Contact your system administrator
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

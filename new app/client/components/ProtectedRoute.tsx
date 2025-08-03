import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasCheckedRef = useRef(false);

  console.log('🛡️ ProtectedRoute check:', {
    loading,
    user: user?.email || 'none',
    role: user?.role || 'none',
    requireAdmin,
    pathname: location.pathname,
    hasChecked: hasCheckedRef.current
  });

  useEffect(() => {
    // Clear any pending redirects when component mounts/updates
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    // Reset check flag on location change
    hasCheckedRef.current = false;
  }, [location.pathname]);

  useEffect(() => {
    // Only check once per location change and after loading is done
    if (loading || hasCheckedRef.current) return;

    hasCheckedRef.current = true;

    // Use setTimeout to avoid immediate redirect during render
    redirectTimeoutRef.current = setTimeout(() => {
      // Check authentication
      if (!user) {
        if (location.pathname !== '/login') {
          console.log('🔒 No user, redirecting to login via window.location');
          window.location.replace('/login');
          return;
        }
      }

      // Check admin access
      if (user && requireAdmin && user.role !== 'admin') {
        if (location.pathname !== '/dashboard') {
          console.log('🚫 Non-admin user, redirecting to dashboard via window.location');
          window.location.replace('/dashboard');
          return;
        }
      }

      // If we get here, user has proper access
      console.log('✅ User has proper access');
    }, 100); // Small delay to prevent render loop

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [user, loading, requireAdmin, location.pathname]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show content if user has access
  if (user && (!requireAdmin || user.role === 'admin')) {
    return <>{children}</>;
  }

  // Show loading state while redirect is happening
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;

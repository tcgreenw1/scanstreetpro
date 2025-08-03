import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  const hasRedirectedRef = useRef(false);

  // Reset redirect flag when location changes
  useEffect(() => {
    hasRedirectedRef.current = false;
  }, [location.pathname]);

  console.log('🛡️ ProtectedRoute check:', {
    loading,
    user: user?.email || 'none',
    role: user?.role || 'none',
    requireAdmin,
    pathname: location.pathname,
    hasRedirected: hasRedirectedRef.current
  });

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

  // Check authentication
  if (!user) {
    if (!hasRedirectedRef.current && location.pathname !== '/login') {
      console.log('🔒 No user, redirecting to login');
      hasRedirectedRef.current = true;
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // If we're already on login page or have already redirected, don't redirect again
    if (location.pathname === '/login') {
      return <>{children}</>;
    }
    return null;
  }

  // Check admin access
  if (requireAdmin && user.role !== 'admin') {
    if (!hasRedirectedRef.current && location.pathname !== '/dashboard') {
      console.log('🚫 Non-admin user, redirecting to dashboard');
      hasRedirectedRef.current = true;
      return <Navigate to="/dashboard" replace />;
    }
    // If we're already on dashboard or have already redirected, don't redirect again
    if (location.pathname === '/dashboard') {
      return <>{children}</>;
    }
    return null;
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;

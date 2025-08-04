import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { signInWithTimeout, signUpWithTimeout, signOutWithTimeout } from '@/lib/neonAuth';

interface AuthUser {
  id: string;
  email: string;
  role: 'manager' | 'member' | 'admin';
  organizationId: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'basic' | 'pro' | 'premium' | 'satellite' | 'driving';
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  organization: Organization | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName?: string, organizationName?: string) => Promise<any>;
  signOut: () => Promise<any>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    initialized.current = true;

    console.log('🚀 AuthProvider initializing with Neon...');

    const initialize = async () => {
      try {
        console.log('🔄 Checking existing session...');

        // Check for existing token
        const token = localStorage.getItem('neon_auth_token');
        
        if (token) {
          try {
            const response = await fetch('/api/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data.user) {
                console.log('✅ Session found:', result.data.user.email);
                setUser(result.data.user);
                setOrganization(result.data.organization || null);
              }
            } else {
              // Token is invalid, remove it
              localStorage.removeItem('neon_auth_token');
              localStorage.removeItem('neon_auth_session');
            }
          } catch (error) {
            console.warn('Failed to verify token:', error);
            localStorage.removeItem('neon_auth_token');
            localStorage.removeItem('neon_auth_session');
          }
        } else {
          console.log('ℹ️ No token found');
        }

        if (mounted.current) {
          setLoading(false);
        }

      } catch (error: any) {
        console.error('Auth initialization failed:', error.message);
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted.current = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithTimeout(email, password);
      
      if (result.data?.user) {
        setUser(result.data.user);
        setOrganization(result.data.session?.organization || null);
      }
      
      setLoading(false);
      return result;
    } catch (error: any) {
      setLoading(false);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, organizationName?: string) => {
    try {
      setLoading(true);
      const result = await signUpWithTimeout(email, password, fullName, organizationName);
      
      if (result.data?.user) {
        setUser(result.data.user);
        setOrganization(result.data.session?.organization || null);
      }
      
      setLoading(false);
      return result;
    } catch (error: any) {
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await signOutWithTimeout();
      setUser(null);
      setOrganization(null);
      localStorage.removeItem('neon_auth_token');
      localStorage.removeItem('neon_auth_session');
      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      return { error };
    }
  };

  const isAdmin = () => {
    return user?.role === 'manager' || user?.role === 'admin'; // Support both admin and manager roles
  };

  const value = {
    user,
    organization,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  console.log('AuthProvider state:', { 
    user: user?.email || null, 
    organization: organization?.name || null, 
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { supabase, signInWithTimeout, signUpWithTimeout, signOutWithTimeout } from '@/lib/neonAuth';

interface AuthUser {
  id: string;
  email: string;
  role: 'manager' | 'member';
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

        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted.current) return;

        if (error) {
          console.warn('Session error:', error.message);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Session found:', session.user.email);
          setUser(session.user);
          setOrganization(session.organization || null);
        } else {
          console.log('ℹ️ No session found');
        }

        setLoading(false);

      } catch (error: any) {
        console.error('Auth initialization failed:', error.message);
        setLoading(false);
      }
    };

    initialize();

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted.current) return;
        
        console.log('🔄 Auth event:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setOrganization(null);
        } else if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setOrganization(session.organization || null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
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
      const result = await signOutWithTimeout();
      setUser(null);
      setOrganization(null);
      setLoading(false);
      return result;
    } catch (error: any) {
      setLoading(false);
      return { error };
    }
  };

  const isAdmin = () => {
    return user?.role === 'manager'; // In our system, managers are essentially admins
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

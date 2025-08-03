import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, signInWithTimeout, signUpWithTimeout, signOutWithTimeout } from '@/lib/supabase';
import { getErrorMessage } from '@/utils/errorHandler';

interface AuthUser extends User {
  role?: string;
  organization_id?: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    settings?: any;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  isAdmin: () => boolean;
  switchToOrganization: (orgId: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    initialized.current = true;

    console.log('🚀 AuthProvider initializing...');

    const initialize = async () => {
      try {
        console.log('🔄 AuthContext initializing...');

        // Check if Supabase client and environment are properly configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabase || !supabaseUrl || !supabaseKey) {
          console.warn('Supabase not properly configured:', {
            client: !!supabase,
            url: !!supabaseUrl,
            key: !!supabaseKey
          });
          console.warn('Starting in logged out state - check environment variables');
          if (mounted.current) setLoading(false);
          return;
        }

        // Skip connectivity test to prevent load failures
        console.log('🔄 Skipping connectivity test, proceeding with auth initialization');

        // Get session with retry logic
        let sessionResult;
        let retries = 2;

        while (retries > 0) {
          try {
            const sessionPromise = supabase.auth.getSession();
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Session timeout after 10 seconds')), 10000)
            );

            sessionResult = await Promise.race([
              sessionPromise,
              timeoutPromise
            ]) as any;

            break; // Success, exit retry loop

          } catch (sessionError: any) {
            retries--;
            const errorMessage = getErrorMessage(sessionError);
            console.warn(`Session fetch attempt failed (${2 - retries}/2):`, errorMessage);

            if (retries > 0) {
              console.log('Retrying session fetch in 1 second...');
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              console.warn('All session fetch attempts failed - continuing without session');
              if (mounted.current) setLoading(false);
              return;
            }
          }
        }

        const { data: { session }, error } = sessionResult;

        if (!mounted.current) return;

        if (error) {
          console.warn('Session error:', error.message);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Session found:', session.user.email);
          
          // Set user with basic info first
          setUser({
            ...session.user,
            role: 'viewer', // Default role
            organization_id: null,
            organization: null
          });

          // Try to get extended user data (with longer timeout, non-blocking)
          setTimeout(async () => {
            if (!mounted.current) return;

            try {
              const userDataPromise = supabase
                .from('users')
                .select(`
                  role,
                  organization_id,
                  organizations (
                    id,
                    name,
                    slug,
                    plan,
                    settings
                  )
                `)
                .eq('id', session.user.id)
                .maybeSingle();

              const userDataTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('User data timeout after 10 seconds')), 10000)
              );

              const { data: userData, error: userDataError } = await Promise.race([
                userDataPromise,
                userDataTimeout
              ]) as any;

              if (userDataError) {
                const errorMessage = getErrorMessage(userDataError);
                console.warn('User data query error:', errorMessage);
              } else if (userData && mounted.current) {
                console.log('✅ User data loaded:', userData.role);
                setUser(prev => prev ? {
                  ...prev,
                  role: userData.role || 'viewer',
                  organization_id: userData.organization_id || null,
                  organization: userData.organizations || null
                } : null);
              }
            } catch (userDataError: any) {
              const errorMessage = getErrorMessage(userDataError);
              console.warn('User data fetch failed:', errorMessage);
            }
          }, 500); // Delay user data fetch to not block initial auth
        } else {
          console.log('ℹ️ No session found');
        }

        if (mounted.current) setLoading(false);

      } catch (error: any) {
        const errorMessage = getErrorMessage(error);
        console.error('Auth initialization failed:', errorMessage);
        if (mounted.current) setLoading(false);
      }
    };

    initialize();

    // Simple auth state listener (minimal to prevent loops)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted.current) return;
        
        console.log('🔄 Auth event:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            ...session.user,
            role: 'viewer',
            organization_id: null,
            organization: null
          });
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
      return await signInWithTimeout(email, password);
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      return await signUpWithTimeout(email, password);
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      return await signOutWithTimeout();
    } catch (error: any) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { data, error };
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const switchToOrganization = async (orgId: string) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const { data: orgData, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (!error && orgData && mounted.current) {
        setUser({
          ...user,
          organization_id: orgData.id,
          organization: orgData
        });
      }
    } catch (error) {
      console.error('Error switching organization:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isAdmin,
    switchToOrganization,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

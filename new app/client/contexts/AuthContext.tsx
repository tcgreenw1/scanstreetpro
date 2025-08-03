import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, withTimeout, withTimeoutAndRetry, withFastTimeout, signInWithTimeout, signUpWithTimeout, signOutWithTimeout } from '@/lib/supabase';
import { logError } from '@/utils/errorHandler';
import { userDataCircuitBreaker } from '@/utils/circuitBreaker';

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

  // Memoize fetchUserData to prevent recreation on every render
  const fetchUserData = React.useCallback(async (userId: string) => {
    // Immediate fallback profile - return this quickly if DB is slow
    const createFallbackProfile = (reason: string) => ({
      id: userId,
      email: `${reason}@example.com`,
      role: 'viewer' as const,
      organization_id: null,
      organizations: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: null,
      phone: null,
      avatar_url: null,
      last_login: null
    });

    // Quick check first - fail fast and use fallback
    try {
      const { data, error } = await withFastTimeout(
        supabase
          .from('users')
          .select(`
            *,
            organizations (
              id,
              name,
              slug,
              plan,
              settings
            )
          `)
          .eq('id', userId)
          .single(),
        2000, // Very quick 2-second timeout
        'Quick user data fetch timed out'
      );

      if (error) {
        console.warn('Quick user data fetch failed, using fallback immediately');
        return createFallbackProfile('quick-fail');
      }

      console.log('✅ User data fetched quickly');
      return data;
    } catch (quickError: any) {
      console.warn('Quick fetch failed, will use fallback:', quickError.message);

      // Check circuit breaker state
      const circuitState = userDataCircuitBreaker.getState();
      if (circuitState === 'OPEN') {
        console.warn('Circuit breaker is OPEN - immediate fallback');
        return createFallbackProfile('circuit-open');
      }

      // For slow networks, return fallback immediately instead of waiting
      console.warn('Network appears slow - using fallback profile to prevent blocking');
      return createFallbackProfile('slow-network');
    }
  }, []); // Empty dependency array since this function doesn't depend on any state

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts

    // Get initial session with fast-fail approach
    const getSession = async () => {
      try {
        // Try a very quick session check first
        let sessionData;
        try {
          sessionData = await withFastTimeout(
            supabase.auth.getSession(),
            2000, // 2 second quick timeout
            'Quick session fetch timed out'
          );
        } catch (quickError: any) {
          console.warn('Quick session fetch failed, app will start in logged-out state');
          if (isMounted) setLoading(false);
          return;
        }

        const { data: { session }, error } = sessionData;

        if (error) {
          console.warn('Session error, starting logged out:', error.message || error);
          if (isMounted) setLoading(false);
          return;
        }

        if (session?.user && isMounted) {
          console.log('📊 Session found, fetching user data:', session.user.id);
          const userData = await fetchUserData(session.user.id);
          if (isMounted) {
            setUser({
              ...session.user,
              role: userData?.role || 'viewer',
              organization_id: userData?.organization_id || null,
              organization: userData?.organizations || null
            });
          }
        }

        if (isMounted) setLoading(false);
      } catch (error: any) {
        console.warn('Session handling failed, starting in logged-out state:', error.message || error);
        if (isMounted) setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return; // Prevent updates if component unmounted

        try {
          console.log('🔄 Auth state changed:', event, session?.user?.id);

          if (session?.user) {
            // Fetch user data with timeout and retry
            const userData = await fetchUserData(session.user.id);
            if (isMounted) {
              setUser({
                ...session.user,
                role: userData?.role,
                organization_id: userData?.organization_id,
                organization: userData?.organizations
              });
            }
          } else if (isMounted) {
            setUser(null);
          }
          if (isMounted) setLoading(false);
        } catch (error: any) {
          console.error('Error in auth state change:', error.message || error);
          if (!isMounted) return;

          // Don't block auth flow on user data errors
          if (session?.user) {
            setUser({
              ...session.user,
              role: 'viewer', // Default role
              organization_id: null,
              organization: null
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]); // Add fetchUserData to dependencies

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithTimeout(email, password);
      return result;
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await signUpWithTimeout(email, password);
      return result;
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const result = await signOutWithTimeout();
      return result;
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
    if (!user) return;
    
    try {
      // For admin users, allow switching to any organization
      if (user.role === 'admin') {
        const { data: orgData, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .single();

        if (error) {
          console.error('Error fetching organization:', error);
          return;
        }

        // Update user context to temporarily switch organization
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

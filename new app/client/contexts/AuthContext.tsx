import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, withTimeout, withTimeoutAndRetry, signInWithTimeout, signUpWithTimeout, signOutWithTimeout } from '@/lib/supabase';
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

  const fetchUserData = async (userId: string) => {
    try {
      // Use retry logic for better reliability
      const { data, error } = await withTimeoutAndRetry(
        () => supabase
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
        3000, // 3 second timeout per attempt
        2,    // 2 retries (3 total attempts)
        'User data fetch failed after retries'
      );

      if (error) {
        console.warn('User data fetch error:', error);
        logError(error, 'AuthContext.fetchUserData');

        // Return minimal profile for error cases
        return {
          id: userId,
          email: 'loading@example.com',
          role: 'viewer',
          organization_id: null,
          organizations: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: null,
          phone: null,
          avatar_url: null,
          last_login: null
        };
      }

      console.log('✅ User data fetched successfully');
      return data;
    } catch (error: any) {
      const errorMessage = logError(error, 'AuthContext.fetchUserData.failed');
      console.warn('User data fetch completely failed, using fallback profile:', errorMessage);

      // Return a fallback user profile to prevent app blocking
      return {
        id: userId,
        email: 'fallback@example.com',
        role: 'viewer',
        organization_id: null,
        organizations: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: null,
        phone: null,
        avatar_url: null,
        last_login: null
      };
    }
  };

  useEffect(() => {
    // Get initial session with retry logic
    const getSession = async () => {
      try {
        const { data: { session }, error } = await withTimeoutAndRetry(
          () => supabase.auth.getSession(),
          3000, // 3 second timeout
          1,    // 1 retry (2 total attempts)
          'Session fetch timed out'
        );

        if (error) {
          console.error('Error getting session:', error.message || error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('📊 Fetching user data for session user:', session.user.id);
          const userData = await fetchUserData(session.user.id);
          setUser({
            ...session.user,
            role: userData?.role,
            organization_id: userData?.organization_id,
            organization: userData?.organizations
          });
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error in getSession:', error.message || error);
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('🔄 Auth state changed:', event, session?.user?.id);

          if (session?.user) {
            // Fetch user data with timeout and retry
            const userData = await fetchUserData(session.user.id);
            setUser({
              ...session.user,
              role: userData?.role,
              organization_id: userData?.organization_id,
              organization: userData?.organizations
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        } catch (error: any) {
          console.error('Error in auth state change:', error.message || error);
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

    return () => subscription.unsubscribe();
  }, []);

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

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, withTimeout, signInWithTimeout, signUpWithTimeout, signOutWithTimeout } from '@/lib/supabase';
import { logError } from '@/utils/errorHandler';

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
      const query = supabase
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
        .single();

      const { data, error } = await withTimeout(
        query,
        8000,
        'Timeout fetching user data'
      );

      if (error) {
        logError(error, 'AuthContext.fetchUserData');
        return null;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching user data:', error.message || 'Unknown error');
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error.message || error);
          setLoading(false);
          return;
        }

        if (session?.user) {
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
          if (session?.user) {
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

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, withTimeout, withFastTimeout, signInWithTimeout, signUpWithTimeout, signOutWithTimeout } from '@/lib/supabase';

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
  const initializationRef = useRef(false);
  
  console.log('🔍 AuthProvider render - loading:', loading, 'user:', user?.email || 'none');

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log('⚠️ Auth already initialized, skipping');
      return;
    }
    
    initializationRef.current = true;
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing Auth...');
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Session error:', error.message);
          if (isMounted) setLoading(false);
          return;
        }

        if (session?.user && isMounted) {
          console.log('📊 Session found for user:', session.user.email);
          
          // Try to get user data with timeout
          try {
            const { data: userData } = await Promise.race([
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
                .eq('id', session.user.id)
                .maybeSingle(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('User data timeout')), 3000)
              )
            ]) as any;

            if (userData && isMounted) {
              setUser({
                ...session.user,
                role: userData.role || 'viewer',
                organization_id: userData.organization_id || null,
                organization: userData.organizations || null
              });
            } else if (isMounted) {
              // Set user with minimal data if database fetch fails
              setUser({
                ...session.user,
                role: 'viewer',
                organization_id: null,
                organization: null
              });
            }
          } catch (userDataError) {
            console.warn('User data fetch failed, using minimal user data');
            if (isMounted) {
              setUser({
                ...session.user,
                role: 'viewer',
                organization_id: null,
                organization: null
              });
            }
          }
        }

        if (isMounted) setLoading(false);
        
      } catch (error: any) {
        console.error('Auth initialization failed:', error);
        if (isMounted) setLoading(false);
      }
    };

    // Initialize auth
    initializeAuth();

    // Listen for auth changes (but don't fetch user data here to prevent loops)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // For sign in events, just set basic user data to prevent loops
          setUser({
            ...session.user,
            role: 'viewer', // Default role, will be updated by re-initialization if needed
            organization_id: null,
            organization: null
          });
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array

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

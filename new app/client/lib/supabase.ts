import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug Supabase configuration
console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl ? '✅ URL configured' : '❌ URL missing',
  key: supabaseAnonKey ? '✅ Key configured' : '❌ Key missing',
  urlValue: supabaseUrl || 'undefined',
  keyLength: supabaseAnonKey?.length || 0
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing! Check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'scan-street-pro@1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: 'free' | 'starter' | 'professional' | 'enterprise';
          settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          plan?: 'free' | 'starter' | 'professional' | 'enterprise';
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          plan?: 'free' | 'starter' | 'professional' | 'enterprise';
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          name: string | null;
          role: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id: string;
          email: string;
          name?: string | null;
          role?: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          email?: string;
          name?: string | null;
          role?: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contractors: {
        Row: {
          id: string;
          organization_id: string;
          contractor_id: string;
          name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          specialties: string[];
          certifications: string[];
          rating: number;
          status: 'certified' | 'pending' | 'suspended';
          active_projects: number;
          completed_projects: number;
          total_value: number;
          hourly_rate: number | null;
          join_date: string;
          is_active: boolean;
          last_active: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          contractor_id: string;
          name: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          specialties?: string[];
          certifications?: string[];
          rating?: number;
          status?: 'certified' | 'pending' | 'suspended';
          active_projects?: number;
          completed_projects?: number;
          total_value?: number;
          hourly_rate?: number | null;
          join_date?: string;
          is_active?: boolean;
          last_active?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          contractor_id?: string;
          name?: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          specialties?: string[];
          certifications?: string[];
          rating?: number;
          status?: 'certified' | 'pending' | 'suspended';
          active_projects?: number;
          completed_projects?: number;
          total_value?: number;
          hourly_rate?: number | null;
          join_date?: string;
          is_active?: boolean;
          last_active?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          organization_id: string;
          asset_id: string;
          name: string;
          type: 'road' | 'bridge' | 'traffic_signal' | 'street_light' | 'signage' | 'sidewalk' | 'drainage';
          location_lat: number | null;
          location_lng: number | null;
          address: string | null;
          road_name: string | null;
          segment: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | null;
          status: 'active' | 'needs_repair' | 'under_maintenance' | 'decommissioned';
          install_date: string | null;
          value: number | null;
          maintenance_cost: number;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assigned_contractor_id: string | null;
          last_inspection: string | null;
          next_inspection: string | null;
          pci_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          asset_id: string;
          name: string;
          type: 'road' | 'bridge' | 'traffic_signal' | 'street_light' | 'signage' | 'sidewalk' | 'drainage';
          location_lat?: number | null;
          location_lng?: number | null;
          address?: string | null;
          road_name?: string | null;
          segment?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | null;
          status?: 'active' | 'needs_repair' | 'under_maintenance' | 'decommissioned';
          install_date?: string | null;
          value?: number | null;
          maintenance_cost?: number;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_contractor_id?: string | null;
          last_inspection?: string | null;
          next_inspection?: string | null;
          pci_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          asset_id?: string;
          name?: string;
          type?: 'road' | 'bridge' | 'traffic_signal' | 'street_light' | 'signage' | 'sidewalk' | 'drainage';
          location_lat?: number | null;
          location_lng?: number | null;
          address?: string | null;
          road_name?: string | null;
          segment?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | null;
          status?: 'active' | 'needs_repair' | 'under_maintenance' | 'decommissioned';
          install_date?: string | null;
          value?: number | null;
          maintenance_cost?: number;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_contractor_id?: string | null;
          last_inspection?: string | null;
          next_inspection?: string | null;
          pci_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other table types as needed...
    };
    Views: {
      // Define views if any
    };
    Functions: {
      // Define functions if any
    };
    Enums: {
      // Define enums if any
    };
  };
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to get user's organization
export const getUserOrganization = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select(`
      organization_id,
      organizations (
        id,
        name,
        slug,
        plan,
        settings
      )
    `)
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user organization:', error);
    return null;
  }

  return data?.organizations;
};

// Timeout wrapper for Supabase operations
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  errorMessage: string = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
};

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');

    // Test basic connectivity
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase connection successful');
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Supabase connection test error:', error);
    return { success: false, error: error.message || 'Unknown connection error' };
  }
};

// Enhanced auth functions with timeout and better error handling
export const signInWithTimeout = async (email: string, password: string) => {
  try {
    console.log('🔐 Attempting sign in for:', email);

    const result = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      15000,
      'Sign in timed out. Please check your connection.'
    );

    if (result.error) {
      console.error('❌ Sign in failed:', result.error);

      // Handle specific error types
      if (result.error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (result.error.message?.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link.');
      } else if (result.error.message?.includes('Too many requests')) {
        throw new Error('Too many login attempts. Please wait a few minutes and try again.');
      } else {
        throw new Error(result.error.message || 'Authentication failed');
      }
    }

    console.log('✅ Sign in successful');
    return result;
  } catch (error: any) {
    console.error('❌ Sign in error:', error);
    throw error;
  }
};

export const signUpWithTimeout = async (email: string, password: string) => {
  return withTimeout(
    supabase.auth.signUp({ email, password }),
    15000,
    'Sign up timed out. Please check your connection.'
  );
};

export const signOutWithTimeout = async () => {
  return withTimeout(
    supabase.auth.signOut(),
    5000,
    'Sign out timed out.'
  );
};

// Enhanced database functions with timeout
export const queryWithTimeout = <T>(
  query: any,
  timeoutMs: number = 8000
): Promise<T> => {
  return withTimeout(query, timeoutMs, 'Database query timed out');
};

export default supabase;

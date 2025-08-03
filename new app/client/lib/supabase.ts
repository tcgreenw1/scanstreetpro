import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug Supabase configuration
console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl ? '✅ URL configured' : '❌ URL missing',
  key: supabaseAnonKey ? '✅ Key configured' : '❌ Key missing',
  urlValue: supabaseUrl || 'undefined',
  keyLength: supabaseAnonKey?.length || 0,
  urlValid: supabaseUrl?.includes('supabase.co') ? '✅ Valid format' : '❌ Invalid format',
  keyValid: supabaseAnonKey?.startsWith('eyJ') ? '✅ Valid JWT format' : '❌ Invalid JWT format'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing! Check environment variables.');
} else if (!supabaseUrl.includes('supabase.co')) {
  console.error('❌ Invalid Supabase URL format! Should be https://xxx.supabase.co');
} else if (!supabaseAnonKey.startsWith('eyJ')) {
  console.error('❌ Invalid Supabase key format! Should be a JWT token starting with eyJ');
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

// Timeout wrapper for Supabase operations with retry logic
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

// Enhanced timeout wrapper with retry logic and aggressive fallbacks
export const withTimeoutAndRetry = <T>(
  promiseFactory: () => Promise<T>,
  timeoutMs: number = 15000, // Increased from 5000 to 15000
  maxRetries: number = 1,    // Reduced retries to fail faster
  errorMessage: string = 'Operation timed out after retries'
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const promise = promiseFactory();
        const timeoutPromise = new Promise<T>((_, timeoutReject) =>
          setTimeout(() => timeoutReject(new Error(`${errorMessage} (attempt ${attempt + 1})`)), timeoutMs)
        );

        const result = await Promise.race([promise, timeoutPromise]);
        resolve(result);
        return;
      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1} failed:`, error.message);

        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Fixed 2-second delay
        }
      }
    }

    reject(lastError || new Error(errorMessage));
  });
};

// Fast-fail wrapper for quick fallback
export const withFastTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 3000,
  errorMessage: string = 'Operation timed out quickly'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
};

// Test Supabase connection comprehensively
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');

    // First check if configuration is valid
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        error: 'Supabase configuration missing. Check environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
      };
    }

    if (!supabaseUrl.includes('supabase.co')) {
      return {
        success: false,
        error: `Invalid Supabase URL format: ${supabaseUrl}. Should be https://xxx.supabase.co`
      };
    }

    if (!supabaseAnonKey.startsWith('eyJ')) {
      return {
        success: false,
        error: 'Invalid Supabase anon key format. Should be a JWT token starting with eyJ'
      };
    }

    // Test auth connectivity with timeout
    console.log('🔍 Testing auth service...');
    const authPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Auth service timeout after 8 seconds')), 8000)
    );

    const authResult = await Promise.race([authPromise, timeoutPromise]) as any;

    if (authResult.error) {
      const errorMessage = extractErrorMessage(authResult.error);
      console.error('❌ Auth service test failed:', errorMessage);
      return { success: false, error: `Auth service error: ${errorMessage}` };
    }

    // Test database connectivity
    console.log('🔍 Testing database service...');
    const dbPromise = supabase.from('organizations').select('count').limit(1);
    const dbTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database service timeout after 8 seconds')), 8000)
    );

    let dbResult;
    try {
      dbResult = await Promise.race([dbPromise, dbTimeoutPromise]) as any;
    } catch (dbError: any) {
      // Handle timeout or other errors from Promise.race
      const errorMessage = extractErrorMessage(dbError);
      console.error('❌ Database service test failed (race error):', errorMessage);
      return { success: false, error: `Database connection error: ${errorMessage}` };
    }

    if (dbResult.error) {
      const errorMessage = extractErrorMessage(dbResult.error);
      console.error('❌ Database service test failed:', errorMessage);

      // Provide specific guidance for common database errors
      if (errorMessage.includes('relation "organizations" does not exist')) {
        return {
          success: false,
          error: 'Database tables not found. Please run database setup: /database-setup'
        };
      } else if (errorMessage.includes('JWT')) {
        return {
          success: false,
          error: 'Invalid authentication token. Check your Supabase anon key.'
        };
      } else {
        return {
          success: false,
          error: `Database error: ${errorMessage}`
        };
      }
    }

    console.log('✅ Supabase connection and database test successful');
    return { success: true, data: { auth: authResult.data, db: dbResult.data } };

  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    console.error('❌ Supabase connection test error:', errorMessage);

    // Provide specific guidance for network errors
    if (errorMessage.includes('fetch')) {
      return {
        success: false,
        error: 'Network connection failed. Please check your internet connection.'
      };
    } else if (errorMessage.includes('timeout')) {
      return {
        success: false,
        error: 'Connection timeout. Supabase service may be unavailable.'
      };
    } else {
      return {
        success: false,
        error: errorMessage
      };
    }
  }
};

// Helper function to extract meaningful error messages
const extractErrorMessage = (error: any): string => {
  // Handle null, undefined, or empty values
  if (!error) return 'Unknown error occurred';

  // Handle string errors
  if (typeof error === 'string') return error;

  // Handle Error objects and similar
  if (error?.message) return error.message;
  if (error?.error?.message) return error.error.message;

  // Handle Supabase-specific error properties
  if (error?.details) return error.details;
  if (error?.hint) return error.hint;
  if (error?.code) return `Error code: ${error.code}`;

  // Handle nested error structures
  if (error?.data?.error?.message) return error.data.error.message;
  if (error?.response?.data?.message) return error.response.data.message;

  // Try to find any message-like property
  const messageKeys = ['msg', 'description', 'reason', 'statusText'];
  for (const key of messageKeys) {
    if (error[key] && typeof error[key] === 'string') {
      return error[key];
    }
  }

  // Try to stringify if it's a simple object
  try {
    if (error && typeof error === 'object') {
      const keys = Object.keys(error);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const firstValue = error[firstKey];

        // If the first value is a string, use it
        if (typeof firstValue === 'string') {
          return `${firstKey}: ${firstValue}`;
        }

        // If it's a simple object, try to extract its string properties
        if (typeof firstValue === 'object' && firstValue) {
          const subKeys = Object.keys(firstValue);
          if (subKeys.length > 0 && typeof firstValue[subKeys[0]] === 'string') {
            return firstValue[subKeys[0]];
          }
        }

        // Last resort - just show the key
        return `Error in ${firstKey}`;
      }
    }
  } catch (e) {
    // Ignore stringify errors
    console.warn('Failed to extract error message from object:', error);
  }

  return 'Unknown connection error - please check your internet connection and Supabase configuration';
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
      const errorMessage = extractErrorMessage(result.error);
      console.error('❌ Sign in failed:', errorMessage);

      // Handle specific error types
      if (errorMessage.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (errorMessage.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link.');
      } else if (errorMessage.includes('Too many requests')) {
        throw new Error('Too many login attempts. Please wait a few minutes and try again.');
      } else if (errorMessage.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else {
        throw new Error(errorMessage || 'Authentication failed');
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
  try {
    console.log('📝 Attempting sign up for:', email);

    const result = await withTimeout(
      supabase.auth.signUp({ email, password }),
      15000,
      'Sign up timed out. Please check your connection.'
    );

    if (result.error) {
      const errorMessage = extractErrorMessage(result.error);
      console.error('❌ Sign up failed:', errorMessage);

      if (errorMessage.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (errorMessage.includes('Password should be')) {
        throw new Error('Password must be at least 6 characters long.');
      } else if (errorMessage.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else {
        throw new Error(errorMessage || 'Sign up failed');
      }
    }

    console.log('✅ Sign up successful');
    return result;
  } catch (error: any) {
    console.error('❌ Sign up error:', error);
    throw error;
  }
};

export const signOutWithTimeout = async () => {
  try {
    console.log('🚪 Signing out...');

    const result = await withTimeout(
      supabase.auth.signOut(),
      5000,
      'Sign out timed out.'
    );

    if (result.error) {
      const errorMessage = extractErrorMessage(result.error);
      console.error('❌ Sign out failed:', errorMessage);
      throw new Error(errorMessage || 'Sign out failed');
    }

    console.log('✅ Sign out successful');
    return result;
  } catch (error: any) {
    console.error('❌ Sign out error:', error);
    throw error;
  }
};

// Enhanced database functions with timeout
export const queryWithTimeout = <T>(
  query: any,
  timeoutMs: number = 8000
): Promise<T> => {
  return withTimeout(query, timeoutMs, 'Database query timed out');
};

export default supabase;

import { createClient } from '@supabase/supabase-js';
import { getErrorMessage } from '@/utils/errorHandler';

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
  console.error('����� Supabase configuration missing! Check environment variables.');
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

// Cache to prevent concurrent calls to the same function
let userOrgCache: { [userId: string]: Promise<any> } = {};

// Helper function to get user's organization
export const getUserOrganization = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  // Check if we already have a pending request for this user
  if (userOrgCache[user.id]) {
    console.log('🔄 Using cached organization request for user:', user.id);
    try {
      return await userOrgCache[user.id];
    } catch (error) {
      // If cached request failed, remove it and try again
      delete userOrgCache[user.id];
    }
  }

  // Create new request and cache it
  const organizationPromise = (async () => {
    try {
      // Use .maybeSingle() instead of .single() to handle 0 or 1 results gracefully
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
        .maybeSingle(); // This returns null for 0 results, doesn't error on multiple

      if (error) {
        const errorMessage = extractErrorMessage(error);
        console.error('Error fetching user organization:', errorMessage);

        // Handle specific error cases
        if (errorMessage.includes('Body is disturbed or locked')) {
          console.warn('🔄 Request body conflict detected, retrying after delay...');
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
          // Remove from cache and retry once
          delete userOrgCache[user.id];
          throw new Error('Request conflict - will retry');
        }

        return null;
      }

      // If no user found, return null gracefully
      if (!data) {
        console.warn('���️ User not found in database:', user.id);
        return null;
      }

      // If user exists but has no organization_id or organization
      if (!data.organization_id) {
        console.warn('⚠️ User has no organization assigned:', user.id);
        return null;
      }

      if (!data.organizations) {
        console.warn('⚠️ User organization not found, organization_id:', data.organization_id);
        return null;
      }

      return data.organizations;
    } finally {
      // Clean up cache after request completes
      delete userOrgCache[user.id];
    }
  })();

  // Cache the promise
  userOrgCache[user.id] = organizationPromise;

  return organizationPromise;
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

    // Test auth connectivity with longer timeout
    console.log('🔍 Testing auth service...');
    let authResult;
    try {
      authResult = await withFastTimeout(
        supabase.auth.getSession(),
        5000, // Quick 5-second test
        'Auth service not responding (5s timeout)'
      );
    } catch (quickError: any) {
      console.warn('Quick auth test failed, trying extended timeout...');
      try {
        authResult = await withTimeout(
          supabase.auth.getSession(),
          20000, // Extended 20-second timeout
          'Auth service timeout after extended wait'
        );
      } catch (extendedError: any) {
        const errorMessage = extractErrorMessage(extendedError);
        console.error('❌ Auth service completely failed:', errorMessage);
        return { success: false, error: `Auth service unavailable: ${errorMessage}. Using offline mode.` };
      }
    }

    if (authResult.error) {
      const errorMessage = extractErrorMessage(authResult.error);
      console.error('❌ Auth service test failed:', errorMessage);
      return { success: false, error: `Auth service error: ${errorMessage}` };
    }

    // Test database connectivity with progressive timeouts
    console.log('🔍 Testing database service...');
    let dbResult;
    try {
      // Quick test first
      dbResult = await withFastTimeout(
        supabase.from('organizations').select('count').limit(1),
        5000,
        'Database service not responding (5s timeout)'
      );
    } catch (quickDbError: any) {
      console.warn('Quick database test failed, trying extended timeout...');
      try {
        dbResult = await withTimeout(
          supabase.from('organizations').select('count').limit(1),
          20000,
          'Database service timeout after extended wait'
        );
      } catch (extendedDbError: any) {
        const errorMessage = extractErrorMessage(extendedDbError);
        console.error('❌ Database service completely failed:', errorMessage);
        return { success: false, error: `Database unavailable: ${errorMessage}. Using offline mode.` };
      }
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

// Helper function to repair demo users if they're in an inconsistent state
// Disabled because admin APIs are not available in client context
export const repairDemoUsers = async () => {
  console.log('🔧 Repair function disabled - admin APIs not available in client context');
  return;
};

// Helper function to ensure demo users exist in Supabase Auth
export const ensureDemoUsersExist = async () => {
  // Temporarily disable repair function to prevent load issues
  // await repairDemoUsers();

  const demoUsers = [
    {
      email: 'admin@scanstreetpro.com',
      password: 'AdminPass123!',
      role: 'admin',
      name: 'System Administrator',
      orgName: 'Scan Street Pro Admin',
      orgSlug: 'scan-street-admin',
      orgPlan: 'enterprise'
    },
    {
      email: 'test@springfield.gov',
      password: 'TestUser123!',
      role: 'manager',
      name: 'Test User',
      orgName: 'City of Springfield (Free)',
      orgSlug: 'springfield-free',
      orgPlan: 'free'
    },
    {
      email: 'premium@springfield.gov',
      password: 'Premium!',
      role: 'manager',
      name: 'Premium User',
      orgName: 'City of Springfield (Premium)',
      orgSlug: 'springfield-premium',
      orgPlan: 'professional'
    }
  ];

  for (const demoUser of demoUsers) {
    try {
      // First ensure organization exists
      let { data: org, error: orgCheckError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', demoUser.orgSlug)
        .maybeSingle();

      if (orgCheckError) {
        const errorMessage = getErrorMessage(orgCheckError);
        console.error(`Error checking organization ${demoUser.orgSlug}:`, errorMessage);
        continue;
      }

      if (!org) {
        console.log(`🏢 Creating organization: ${demoUser.orgName}`);
        const { data: newOrg, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: demoUser.orgName,
            slug: demoUser.orgSlug,
            plan: demoUser.orgPlan
          })
          .select('id')
          .single();

        if (orgError && !orgError.message.includes('duplicate')) {
          const errorMessage = getErrorMessage(orgError);
          console.error(`Failed to create org ${demoUser.orgName}:`, errorMessage);
          continue;
        }
        org = newOrg;
      }

      if (!org?.id) {
        console.error(`No organization available for ${demoUser.email}`);
        continue;
      }

      // Check if user exists in database
      const { data: dbUser, error: dbCheckError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', demoUser.email)
        .maybeSingle();

      if (dbCheckError) {
        const errorMessage = getErrorMessage(dbCheckError);
        console.error(`Error checking if user exists ${demoUser.email}:`, errorMessage);
        continue;
      }

      if (!dbUser) {
        console.log(`🔧 Creating demo user: ${demoUser.email}`);

        let authData = null;
        let authSuccess = false;

        // Use regular signup (admin API not available in client)
        console.log(`Creating auth user via signup for ${demoUser.email}`);

        // Try to create user with minimal email verification requirements
        const authResult = await supabase.auth.signUp({
          email: demoUser.email,
          password: demoUser.password,
          options: {
            data: {
              name: demoUser.name,
              role: demoUser.role
            },
            emailRedirectTo: undefined, // Skip email confirmation redirect
            captchaToken: undefined     // Skip captcha
          }
        });

        if (!authResult.error && authResult.data?.user) {
          authData = authResult.data;
          authSuccess = true;

          // Check if user needs email confirmation
          if (authResult.data.user.email_confirmed_at) {
            console.log(`✅ Auth user created and confirmed for ${demoUser.email}`);
          } else {
            console.log(`⚠️ Auth user created but requires email confirmation for ${demoUser.email}`);
            console.log(`User ID: ${authResult.data.user.id}, Confirmation required: ${!authResult.data.user.email_confirmed_at}`);
          }
        } else if (authResult.error && authResult.error.message.includes('User already registered')) {
          console.log(`ℹ️ User ${demoUser.email} already exists in auth`);
          // For existing users, try to sign them in to get the user ID
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: demoUser.email,
              password: demoUser.password
            });

            if (!signInError && signInData.user) {
              authData = signInData;
              authSuccess = true;
              console.log(`✅ Retrieved existing user ${demoUser.email}`);
              // Sign out immediately to not affect current session
              await supabase.auth.signOut();
            } else {
              console.warn(`Cannot sign in existing user ${demoUser.email}, skipping`);
              continue;
            }
          } catch (signInErr) {
            console.warn(`Error signing in existing user ${demoUser.email}:`, getErrorMessage(signInErr));
            continue;
          }
        } else if (authResult.error) {
          const errorMessage = getErrorMessage(authResult.error);
          console.error(`❌ Auth creation failed for ${demoUser.email}:`, errorMessage);
          continue;
        } else {
          console.error(`❌ Unknown auth result for ${demoUser.email}`);
          continue;
        }

        const userId = authData?.user?.id;
        if (!userId) {
          console.error(`No user ID available for ${demoUser.email} - auth creation failed`);
          continue;
        }

        console.log(`📝 Auth user created for ${demoUser.email} with ID: ${userId}`);

        // Validate auth user exists by checking current session after signup
        let userValidated = false;

        if (authData.session) {
          console.log(`✅ Auth user has active session, proceeding with database creation`);
          userValidated = true;
        } else {
          console.log(`⚠️ Auth user created but no session - may need email confirmation`);
          // For demo users, try to sign them in to validate they exist
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: demoUser.email,
              password: demoUser.password
            });

            if (!signInError && signInData.user) {
              console.log(`✅ Auth user validated via sign-in for ${demoUser.email}`);
              userValidated = true;
              // Sign out to not affect current session
              await supabase.auth.signOut();
            } else {
              console.error(`❌ Cannot validate auth user for ${demoUser.email}:`, getErrorMessage(signInError));
            }
          } catch (validationError) {
            console.error(`❌ Error validating auth user for ${demoUser.email}:`, getErrorMessage(validationError));
          }
        }

        if (!userValidated) {
          console.error(`❌ Auth user validation failed for ${demoUser.email}, skipping database creation`);
          continue;
        }

        // Wait longer to ensure auth user is fully propagated in the system
        console.log(`⏳ Waiting for auth user propagation...`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create in database with retry logic for foreign key issues
        let dbError = null;
        let retries = 5; // Increased retries

        while (retries > 0) {
          console.log(`📝 Attempting database user creation for ${demoUser.email} (${6 - retries}/5)`);

          // First verify the auth user exists before attempting database insert
          try {
            const { data: authUsers, error: authCheckError } = await supabase.auth.admin.listUsers();
            const authUserExists = authUsers?.users?.some(u => u.id === userId);

            if (!authUserExists) {
              console.warn(`⚠️ Auth user ${userId} not found in auth.users, waiting longer...`);
              retries--;
              if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // Longer wait
                continue;
              } else {
                throw new Error(`Auth user ${userId} not found after all retries`);
              }
            }
          } catch (authCheckError) {
            console.warn('Auth user check failed, proceeding with insert attempt...');
          }

          const result = await supabase
            .from('users')
            .insert({
              id: userId,
              organization_id: org.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          dbError = result.error;

          if (!dbError) {
            console.log(`✅ Database user created successfully for ${demoUser.email}`);
            break;
          } else if (dbError.message.includes('foreign key constraint') || dbError.code === '23503') {
            retries--;
            if (retries > 0) {
              console.warn(`⚠️ Foreign key constraint error for ${demoUser.email}, retrying in 3 seconds... (${retries} attempts left)`);
              await new Promise(resolve => setTimeout(resolve, 3000)); // Longer wait
            } else {
              console.error(`❌ Foreign key constraint persists after all retries for ${demoUser.email}`);
            }
          } else {
            // Other error, don't retry
            break;
          }
        }

        if (dbError) {
          const errorMessage = getErrorMessage(dbError);
          if (dbError.message.includes('duplicate') || dbError.code === '23505') {
            console.log(`ℹ️ User ${demoUser.email} already exists in database`);
          } else if (dbError.message.includes('foreign key constraint') || dbError.code === '23503') {
            console.error(`❌ Persistent foreign key violation for ${demoUser.email}: Auth user ${userId} not found in auth.users table`);
            console.error(`This typically means:`);
            console.error(`1. User was created but requires email confirmation`);
            console.error(`2. There's a delay in auth user propagation`);
            console.error(`3. Supabase RLS policies may be blocking the reference`);
            console.warn('⚠️ User exists in auth but cannot be referenced in database - may need admin intervention');
          } else {
            console.error(`Failed to create db user ${demoUser.email}:`, errorMessage);
          }
        } else {
          console.log(`✅ Created demo user: ${demoUser.email}`);
        }
      } else {
        console.log(`ℹ️ Demo user already exists: ${demoUser.email}`);
      }
    } catch (error) {
      console.warn(`Error ensuring demo user ${demoUser.email}:`, getErrorMessage(error));
    }
  }
};

// Enhanced auth functions with timeout and better error handling
export const signInWithTimeout = async (email: string, password: string) => {
  try {
    console.log('🔐 Attempting sign in for:', email);

    // Check if this is a demo user and ensure they exist
    const demoEmails = ['admin@scanstreetpro.com', 'test@springfield.gov', 'premium@springfield.gov'];
    if (demoEmails.includes(email)) {
      console.log('🔧 Demo user detected, ensuring user exists...');
      await ensureDemoUsersExist();
      // Small delay to allow user creation to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // First check if user exists in the database
    try {
      const { data: userExists, error: userCheckError } = await withFastTimeout(
        supabase.from('users').select('id, email, is_active').eq('email', email).single(),
        3000,
        'User check timed out'
      );

      if (userCheckError) {
        if (userCheckError.code === 'PGRST116') {
          console.log('❌ User does not exist in database:', email);
          throw new Error(`User ${email} not found in database. Please contact your administrator to create your account.`);
        }
        console.warn('User check failed, proceeding with auth attempt:', userCheckError.message);
      } else if (userExists && !userExists.is_active) {
        throw new Error('Your account has been deactivated. Please contact your administrator.');
      } else if (userExists) {
        console.log('✅ User exists in database:', email);
      }
    } catch (userCheckError: any) {
      if (userCheckError.message.includes('not found in database') || userCheckError.message.includes('deactivated')) {
        throw userCheckError;
      }
      console.warn('User existence check failed, proceeding with auth:', userCheckError.message);
    }

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
        // For demo users, try to create them if they don't exist in Auth
        if (demoEmails.includes(email)) {
          console.log('🔧 Demo user auth failed, attempting to create user in Supabase Auth...');
          try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password
            });

            if (signUpError && !signUpError.message.includes('User already registered')) {
              throw new Error(`Failed to create demo user: ${signUpError.message}`);
            }

            if (signUpData.user) {
              console.log('✅ Demo user created in Auth, retrying login...');
              // Retry login after creation
              const retryResult = await supabase.auth.signInWithPassword({ email, password });
              if (!retryResult.error) {
                console.log('✅ Retry login successful');
                return retryResult;
              }
            }
          } catch (createError: any) {
            console.error('Failed to auto-create demo user:', createError.message);
          }
        }

        throw new Error(`Invalid credentials for ${email}. The user may exist in the database but not in Supabase Auth. For demo users, please use the Auth Debug tab in Admin Portal to create missing users.`);
      } else if (errorMessage.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link.');
      } else if (errorMessage.includes('Too many requests')) {
        throw new Error('Too many login attempts. Please wait a few minutes and try again.');
      } else if (errorMessage.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else if (errorMessage.includes('foreign key') || errorMessage.includes('constraint')) {
        throw new Error('Account setup is still in progress. Please wait a moment and try again.');
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

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
      } else if (errorMessage.includes('invalid') && errorMessage.includes('email')) {
        throw new Error('Invalid email address. Please check the email format and try again.');
      } else if (errorMessage.includes('Email address') && errorMessage.includes('invalid')) {
        throw new Error('This email address is not allowed. Please use a work email or contact support.');
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
    console.log('��� Signing out...');

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

// Helper function to create a user in both Supabase Auth and database
export const createUserInSupabase = async (email: string, password: string, userData: {
  name?: string;
  role?: string;
  organization_id?: string;
}) => {
  try {
    console.log('👥 Creating user in Supabase Auth:', email);

    // First create user in Supabase Auth using regular signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: userData.name },
        emailRedirectTo: undefined // Skip email confirmation
      }
    });

    if (authError) {
      const errorMessage = getErrorMessage(authError);
      console.error('❌ Failed to create user in Auth:', errorMessage);
      throw new Error(`Failed to create user in Auth: ${errorMessage}`);
    }

    if (!authData.user) {
      throw new Error('No user data returned from Auth creation');
    }

    console.log('✅ User created in Auth, now creating in database');

    // Then create user record in database
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        name: userData.name || null,
        role: userData.role || 'viewer',
        organization_id: userData.organization_id || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      const errorMessage = getErrorMessage(dbError);
      console.error('❌ Failed to create user in database:', errorMessage);
      // Cannot clean up auth user with client API - user will remain in auth
      console.warn('⚠️ Database user creation failed but auth user remains (cannot cleanup with client API)');
      throw new Error(`Failed to create user in database: ${errorMessage}`);
    }

    console.log('✅ User successfully created in both Auth and database');
    return { authData, dbData };
  } catch (error: any) {
    console.error('❌ User creation error:', error);
    throw error;
  }
};

// Helper function to check if user exists in database and Auth
export const checkUserExistence = async (email: string) => {
  try {
    console.log('🔍 Checking user existence for:', email);

    // Check in database
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('id, email, is_active, role, organization_id')
      .eq('email', email)
      .single();

    const dbExists = !dbError && dbUser;

    // Check in Auth (requires admin access, may not work in client)
    let authExists = false;
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (!authError && authUsers.users) {
        authExists = authUsers.users.some(user => user.email === email);
      }
    } catch (authCheckError) {
      console.warn('Cannot check Auth users (admin access required):', authCheckError);
    }

    return {
      database: {
        exists: dbExists,
        user: dbUser,
        error: dbError
      },
      auth: {
        exists: authExists,
        checkable: true
      }
    };
  } catch (error: any) {
    console.error('Error checking user existence:', error);
    return {
      database: { exists: false, user: null, error },
      auth: { exists: false, checkable: false }
    };
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

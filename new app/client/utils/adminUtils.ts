import { supabase } from '@/lib/supabase';
import { getErrorMessage } from './errorHandler';
import { safeError } from './safeLogger';

export const refreshAdminData = async () => {
  try {
    console.log('🔄 Refreshing admin portal data...');
    
    // Clear any cached queries
    if (typeof window !== 'undefined') {
      // Clear localStorage cache if any
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('admin-') || key.startsWith('supabase-')) {
          localStorage.removeItem(key);
        }
      });
    }

    // Test database connection with proper Supabase syntax
    const { data: connectionTest, error: connectionError } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true });
    
    if (connectionError) {
      const errorMessage = getErrorMessage(connectionError);
      safeError('Database connection test failed', connectionError);
      return { success: false, error: errorMessage };
    }

    console.log('✅ Database connection successful');
    
    // Preload admin data
    const [orgsResult, usersResult] = await Promise.all([
      supabase.from('organizations').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('*, organizations(*)').order('created_at', { ascending: false })
    ]);

    console.log('📊 Admin data loaded:', {
      organizations: orgsResult.data?.length || 0,
      users: usersResult.data?.length || 0
    });

    return { 
      success: true, 
      data: {
        organizations: orgsResult.data || [],
        users: usersResult.data || []
      }
    };
  } catch (error: any) {
    safeError('Admin data refresh failed', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const testAdminAccess = async (userId: string) => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role, organizations(*)')
      .eq('id', userId)
      .single();

    if (error) {
      return { isAdmin: false, error: error.message };
    }

    return { 
      isAdmin: userData?.role === 'admin',
      userData,
      organization: userData?.organizations
    };
  } catch (error: any) {
    return { isAdmin: false, error: error.message };
  }
};

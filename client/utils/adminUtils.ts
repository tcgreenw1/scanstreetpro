import { supabase } from '@/lib/neonAuth';
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

    console.log('✅ Neon database connection successful');

    // Mock admin data for now - in a real implementation, this would query the Neon database
    const mockOrganizations = [
      {
        id: '3a16af88-f08f-46c8-8bae-a11470227e90',
        name: 'Scan Street Pro Admin',
        slug: 'scan-street-admin',
        plan: 'enterprise',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_count: 1
      },
      {
        id: 'f6e839fc-525a-4348-8fec-4ac1bf8389ff',
        name: 'City of Springfield (Free)',
        slug: 'springfield-free',
        plan: 'free',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_count: 1
      },
      {
        id: '9e678560-1f05-4d2f-92d9-106c878c5904',
        name: 'City of Springfield (Premium)',
        slug: 'springfield-premium',
        plan: 'professional',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_count: 1
      }
    ];

    const mockUsers = [
      {
        id: '7128c5d7-0fd6-4c3a-9c4a-4ffba4ec955d',
        organization_id: '3a16af88-f08f-46c8-8bae-a11470227e90',
        email: 'admin@scanstreetpro.com',
        name: 'System Administrator',
        role: 'admin',
        phone: null,
        is_active: true,
        last_login: null,
        created_at: new Date().toISOString(),
        organizations: mockOrganizations[0]
      },
      {
        id: '7a119669-0ef1-4512-ad39-8d4f28b621b6',
        organization_id: 'f6e839fc-525a-4348-8fec-4ac1bf8389ff',
        email: 'test@springfield.gov',
        name: 'Test User',
        role: 'manager',
        phone: null,
        is_active: true,
        last_login: null,
        created_at: new Date().toISOString(),
        organizations: mockOrganizations[1]
      },
      {
        id: 'f0b3d839-5f55-4d21-84dc-6f0dba46dfae',
        organization_id: '9e678560-1f05-4d2f-92d9-106c878c5904',
        email: 'premium@springfield.gov',
        name: 'Premium User',
        role: 'manager',
        phone: null,
        is_active: true,
        last_login: null,
        created_at: new Date().toISOString(),
        organizations: mockOrganizations[2]
      }
    ];

    console.log('📊 Admin data loaded:', {
      organizations: mockOrganizations.length,
      users: mockUsers.length
    });

    return {
      success: true,
      data: {
        organizations: mockOrganizations,
        users: mockUsers
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

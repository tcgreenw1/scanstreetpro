// Mock functions to replace Supabase operations in AdminPortal

export const mockToggleUserActive = async (userId: string, isActive: boolean) => {
  console.log(`Mock: Toggle user ${userId} active state to ${isActive}`);
  return Promise.resolve();
};

export const mockUpdateOrganizationPlan = async (orgId: string, plan: string) => {
  console.log(`Mock: Update organization ${orgId} plan to ${plan}`);
  return Promise.resolve();
};

export const mockDeleteUser = async (userId: string) => {
  console.log(`Mock: Delete user ${userId}`);
  return Promise.resolve();
};

export const mockDiagnoseUser = async (email: string, password: string) => {
  console.log(`Mock: Diagnose user ${email}`);
  return {
    testResults: {
      databaseExists: true,
      authExists: true,
      userCanSignIn: true,
      message: 'Mock user diagnosis completed successfully'
    }
  };
};

export const mockCreateUserInSupabase = async (email: string, password: string, userData: any) => {
  console.log(`Mock: Create user ${email}`, userData);
  return {
    authData: { user: { id: `user_${Date.now()}`, email } },
    dbData: { id: `user_${Date.now()}`, email, ...userData }
  };
};

export const mockDeleteOrganization = async (orgId: string) => {
  console.log(`Mock: Delete organization ${orgId}`);
  return Promise.resolve();
};

export const mockUpdateUserRole = async (userId: string, role: string) => {
  console.log(`Mock: Update user ${userId} role to ${role}`);
  return Promise.resolve();
};

export const mockSwitchOrganizationPlan = async (orgId: string, fromPlan: string, toPlan: string) => {
  console.log(`Mock: Switch organization ${orgId} from ${fromPlan} to ${toPlan}`);
  return Promise.resolve();
};

export const mockExportData = async (type: 'users' | 'organizations') => {
  console.log(`Mock: Export ${type} data`);
  
  const mockData = type === 'users' 
    ? [
        { id: '1', email: 'admin@scanstreetpro.com', name: 'System Administrator', role: 'admin' },
        { id: '2', email: 'test@springfield.gov', name: 'Test User', role: 'manager' },
        { id: '3', email: 'premium@springfield.gov', name: 'Premium User', role: 'manager' }
      ]
    : [
        { id: '1', name: 'Scan Street Pro Admin', plan: 'enterprise' },
        { id: '2', name: 'City of Springfield (Free)', plan: 'free' },
        { id: '3', name: 'City of Springfield (Premium)', plan: 'professional' }
      ];

  return mockData;
};

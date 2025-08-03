import { supabase } from '@/lib/supabase';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
  organizationName: string;
  organizationSlug: string;
  organizationPlan: 'free' | 'starter' | 'professional' | 'enterprise';
}

const demoUsers: SeedUser[] = [
  {
    email: 'admin@scanstreetpro.com',
    password: 'AdminPass123!',
    name: 'System Administrator',
    role: 'admin',
    organizationName: 'Scan Street Pro Admin',
    organizationSlug: 'scan-street-admin',
    organizationPlan: 'enterprise'
  },
  {
    email: 'test@springfield.gov',
    password: 'TestUser123!',
    name: 'Test User',
    role: 'manager',
    organizationName: 'City of Springfield (Free)',
    organizationSlug: 'springfield-free',
    organizationPlan: 'free'
  },
  {
    email: 'premium@springfield.gov',
    password: 'Premium!',
    name: 'Premium User',
    role: 'manager',
    organizationName: 'City of Springfield (Premium)',
    organizationSlug: 'springfield-premium',
    organizationPlan: 'professional'
  }
];

export const seedDemoUsers = async () => {
  console.log('🌱 Seeding demo users...');
  
  for (const user of demoUsers) {
    try {
      // Create organization first
      const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', user.organizationSlug)
        .single();

      let organizationId = existingOrg?.id;

      if (!organizationId) {
        const { data: newOrg, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: user.organizationName,
            slug: user.organizationSlug,
            plan: user.organizationPlan
          })
          .select('id')
          .single();

        if (orgError && !orgError.message.includes('duplicate')) {
          console.error(`Error creating organization ${user.organizationName}:`, orgError.message || orgError);
          continue;
        }
        organizationId = newOrg?.id;
      }

      if (!organizationId) {
        console.error(`Could not create organization for ${user.email}`);
        continue;
      }

      // Check if user already exists in auth
      const { data: existingAuthUser } = await supabase.auth.admin.listUsers();
      const userExists = existingAuthUser?.users?.find(u => u.email === user.email);

      if (!userExists) {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true
        });

        if (authError) {
          console.error(`Error creating auth user ${user.email}:`, authError.message || authError);
          continue;
        }

        if (authData.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              organization_id: organizationId,
              email: user.email,
              name: user.name,
              role: user.role,
              is_active: true
            });

          if (profileError && !profileError.message.includes('duplicate')) {
            console.error(`Error creating user profile ${user.email}:`, profileError.message || profileError);
            // Try to clean up auth user
            await supabase.auth.admin.deleteUser(authData.user.id);
            continue;
          }

          console.log(`✅ Created user: ${user.email} (${user.role}) in ${user.organizationName}`);
        }
      } else {
        console.log(`ℹ️ User already exists: ${user.email}`);
        
        // Update user profile if it doesn't exist
        const { data: existingProfile } = await supabase
          .from('users')
          .select('id')
          .eq('id', userExists.id)
          .single();

        if (!existingProfile) {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: userExists.id,
              organization_id: organizationId,
              email: user.email,
              name: user.name,
              role: user.role,
              is_active: true
            });

          if (profileError && !profileError.message.includes('duplicate')) {
            console.error(`Error creating missing user profile ${user.email}:`, profileError);
          } else {
            console.log(`✅ Created missing profile for: ${user.email}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error seeding user ${user.email}:`, error);
    }
  }
  
  console.log('🌱 Demo user seeding complete!');
};

export const getDemoCredentials = () => {
  return demoUsers.map(user => ({
    email: user.email,
    password: user.password,
    name: user.name,
    role: user.role,
    organization: user.organizationName,
    plan: user.organizationPlan
  }));
};

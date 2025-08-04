import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://nwoeeejaxmwvxggcpchw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53b2VlZWpheG13dnhnZ2NwY2h3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQzMDcxMiwiZXhwIjoyMDUzMDA2NzEyfQ.tUQs_m8cDsI9_yKJPpGgSQqK3bq0HIQ4kDxrxqE7vYE'; // Service role key needed for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      if (error) {
        console.log(`⚠️  Statement ${i + 1} failed (may already exist):`, error.message);
        // Continue with other statements - some may fail if tables already exist
      } else {
        console.log(`✅ Statement ${i + 1} completed successfully`);
      }
    }
    
    console.log('🎉 Database initialization completed!');
    
    // Create initial admin user and organization
    await createInitialData();
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function createInitialData() {
  try {
    console.log('🔄 Creating initial admin data...');
    
    // Create admin organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: 'Scan Street Pro Admin',
        slug: 'admin',
        plan: 'enterprise'
      })
      .select()
      .single();
      
    if (orgError && !orgError.message.includes('duplicate')) {
      console.error('Failed to create admin organization:', orgError);
      return;
    }
    
    const organizationId = org?.id;
    
    if (organizationId) {
      console.log('✅ Admin organization created:', organizationId);
      
      // Create admin user in auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'admin@scanstreetpro.com',
        password: 'AdminPass123!',
        email_confirm: true
      });
      
      if (authError && !authError.message.includes('already')) {
        console.error('Failed to create admin auth user:', authError);
        return;
      }
      
      if (authUser.user) {
        // Create user profile
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authUser.user.id,
            organization_id: organizationId,
            email: 'admin@scanstreetpro.com',
            name: 'System Administrator',
            role: 'admin'
          });
          
        if (userError && !userError.message.includes('duplicate')) {
          console.error('Failed to create admin user profile:', userError);
          return;
        }
        
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@scanstreetpro.com');
        console.log('🔑 Password: AdminPass123!');
      }
    }
    
    // Create sample organization for testing
    const { data: testOrg, error: testOrgError } = await supabase
      .from('organizations')
      .insert({
        name: 'City of Springfield',
        slug: 'springfield',
        plan: 'free'
      })
      .select()
      .single();
      
    if (testOrgError && !testOrgError.message.includes('duplicate')) {
      console.error('Failed to create test organization:', testOrgError);
      return;
    }
    
    if (testOrg) {
      // Create test user
      const { data: testAuthUser, error: testAuthError } = await supabase.auth.admin.createUser({
        email: 'test@springfield.gov',
        password: 'TestUser123!',
        email_confirm: true
      });
      
      if (testAuthError && !testAuthError.message.includes('already')) {
        console.error('Failed to create test auth user:', testAuthError);
        return;
      }
      
      if (testAuthUser.user) {
        const { error: testUserError } = await supabase
          .from('users')
          .insert({
            id: testAuthUser.user.id,
            organization_id: testOrg.id,
            email: 'test@springfield.gov',
            name: 'Test User',
            role: 'manager'
          });
          
        if (testUserError && !testUserError.message.includes('duplicate')) {
          console.error('Failed to create test user profile:', testUserError);
          return;
        }
        
        console.log('✅ Test user created successfully!');
        console.log('📧 Email: test@springfield.gov');
        console.log('🔑 Password: TestUser123!');
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to create initial data:', error);
  }
}

// Run the initialization
initializeDatabase();

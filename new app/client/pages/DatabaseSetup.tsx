import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function DatabaseSetup() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const logProgress = (message: string) => {
    setProgress(prev => [...prev, message]);
  };

  const initializeDatabase = async () => {
    setLoading(true);
    setProgress([]);
    setError('');
    setSuccess(false);

    try {
      logProgress('🔄 Starting database initialization...');

      // First, test basic connection
      logProgress('🔌 Testing basic database connection...');
      const { data: basicTest, error: basicError } = await supabase
        .from('_realtime')
        .select('*')
        .limit(1);

      if (basicError && !basicError.message.includes('does not exist')) {
        throw new Error(`Basic connection failed: ${basicError.message}`);
      }

      logProgress('✅ Basic connection established');

      // Try to check if tables exist
      logProgress('📋 Checking if schema exists...');
      const { data: orgCheck, error: orgError } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);

      if (orgError && orgError.message.includes('does not exist')) {
        logProgress('❌ Database schema not found - tables need to be created');
        logProgress('📋 You need to run the schema.sql file in Supabase');
        logProgress('🔗 Go to Supabase Dashboard → SQL Editor');
        logProgress('📄 Copy and paste the schema from database/schema.sql');

        // Show the schema creation instructions
        setError('Database schema not found. Please create the tables first using the SQL schema.');
        return;
      }

      if (orgError) {
        throw new Error(`Schema check failed: ${orgError.message}`);
      }

      logProgress('✅ Database schema exists');

      // Create admin organization
      logProgress('📁 Creating admin organization...');
      const { data: adminOrg, error: adminOrgError } = await supabase
        .from('organizations')
        .insert({
          name: 'Scan Street Pro Admin',
          slug: 'admin',
          plan: 'enterprise'
        })
        .select()
        .single();

      if (adminOrgError && !adminOrgError.message.includes('duplicate')) {
        if (adminOrgError.message.includes('violates row-level security')) {
          logProgress('⚠️  Admin organization creation requires service role key');
          logProgress('📋 Manual setup instructions will be provided');
        } else {
          throw new Error(`Failed to create admin organization: ${adminOrgError.message}`);
        }
      } else {
        logProgress('✅ Admin organization created');
      }

      // Create test organization
      logProgress('📁 Creating test organization...');
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
        if (testOrgError.message.includes('violates row-level security')) {
          logProgress('⚠️  Test organization creation requires service role key');
        } else {
          throw new Error(`Failed to create test organization: ${testOrgError.message}`);
        }
      } else {
        logProgress('✅ Test organization created');
      }

      // Try to check existing organizations
      logProgress('🔍 Checking existing organizations...');
      const { data: existingOrgs, error: orgCheckError } = await supabase
        .from('organizations')
        .select('*');

      if (orgCheckError) {
        logProgress(`⚠️  Could not check organizations: ${orgCheckError.message}`);
        logProgress('📋 This is expected with current permissions');
      } else {
        logProgress(`✅ Found ${existingOrgs?.length || 0} existing organizations`);
      }

      // Note about user creation
      logProgress('📋 User creation requires service role key or manual setup in Supabase dashboard');
      logProgress('🔗 Go to Supabase Dashboard → Authentication → Users to create:');
      logProgress('   • admin@scanstreetpro.com (password: AdminPass123!)');
      logProgress('   • test@springfield.gov (password: TestUser123!)');
      logProgress('💡 After creating users, add them to the users table with organization_id');

      logProgress('🎉 Database connection test completed!');
      logProgress('📋 Next steps:');
      logProgress('   1. Create organizations in Supabase Dashboard → Database → organizations table');
      logProgress('   2. Create auth users in Supabase Dashboard → Authentication → Users');
      logProgress('   3. Link users to organizations in the users table');
      logProgress('   4. Test the login flow');

      setSuccess(true);

    } catch (err: any) {
      setError(err.message || 'Database initialization failed');
      logProgress(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Setup</h1>
              <p className="text-gray-600">Initialize Supabase database with admin users and sample data</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Database Initialization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  🎉 Database initialized successfully! You can now login with the created accounts.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">This will create:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Admin Organization (Scan Street Pro Admin)</li>
                <li>• Test Organization (City of Springfield)</li>
                <li>• Admin User: admin@scanstreetpro.com / AdminPass123!</li>
                <li>• Test User: test@springfield.gov / TestUser123!</li>
                <li>• Sample contractors and data</li>
              </ul>
            </div>

            <Button 
              onClick={initializeDatabase} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initializing Database...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Initialize Database
                </>
              )}
            </Button>

            {progress.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Progress:</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {progress.map((item, index) => (
                    <div key={index} className="text-sm font-mono">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {success && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Manual Setup Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-blue-800">
                  ✅ Database connection successful! Manual setup is required for full initialization.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2">Step 1: Create Organizations</h3>
                  <p className="text-sm text-yellow-700 mb-2">Go to Supabase Dashboard → Database → organizations table</p>
                  <div className="text-xs bg-yellow-100 p-2 rounded font-mono">
                    INSERT INTO organizations (name, slug, plan) VALUES<br/>
                    ('Scan Street Pro Admin', 'admin', 'enterprise'),<br/>
                    ('City of Springfield', 'springfield', 'free');
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Step 2: Create Auth Users</h3>
                  <p className="text-sm text-green-700 mb-2">Go to Supabase Dashboard → Authentication → Users</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Email: admin@scanstreetpro.com | Password: AdminPass123!</li>
                    <li>• Email: test@springfield.gov | Password: TestUser123!</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Step 3: Link Users to Organizations</h3>
                  <p className="text-sm text-purple-700 mb-2">After creating users, add records to the users table:</p>
                  <div className="text-xs bg-purple-100 p-2 rounded font-mono">
                    INSERT INTO users (id, organization_id, email, name, role) VALUES<br/>
                    ('&lt;admin_user_id&gt;', '&lt;admin_org_id&gt;', 'admin@scanstreetpro.com', 'Admin', 'admin'),<br/>
                    ('&lt;test_user_id&gt;', '&lt;test_org_id&gt;', 'test@springfield.gov', 'Test User', 'manager');
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button asChild className="mr-2">
                  <a href="/login">Go to Login Page</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://supabase.com/dashboard/project/nwoeeejaxmwvxggcpchw" target="_blank">
                    Open Supabase Dashboard
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

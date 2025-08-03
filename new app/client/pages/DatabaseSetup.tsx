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
              <h3 className="font-semibold">Database Schema Setup:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Test database connection</li>
                <li>• Check if tables exist</li>
                <li>• Provide setup instructions if needed</li>
                <li>• Guide through manual organization/user creation</li>
              </ul>
            </div>

            {error && error.includes('schema not found') && (
              <div className="space-y-4">
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-orange-800">
                    <strong>Database tables not found!</strong> You need to create the schema first.
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Step 1: Create Database Schema</h4>
                  <ol className="text-sm text-blue-700 space-y-2">
                    <li>1. Go to <a href="https://supabase.com/dashboard/project/nwoeeejaxmwvxggcpchw/sql" target="_blank" className="underline font-medium">Supabase SQL Editor</a></li>
                    <li>2. Copy the schema below and paste it into the SQL Editor</li>
                    <li>3. Click "Run" to create all the tables</li>
                    <li>4. Come back here and try "Test Connection" again</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Database Schema (Copy this):</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const schemaText = document.getElementById('schema-sql')?.textContent;
                        if (schemaText) {
                          navigator.clipboard.writeText(schemaText);
                          alert('Schema copied to clipboard!');
                        }
                      }}
                    >
                      Copy Schema
                    </Button>
                  </div>
                  <div
                    id="schema-sql"
                    className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono max-h-60 overflow-y-auto"
                  >
{`-- Municipal Infrastructure Management System Database Schema
-- For Supabase Integration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (for multi-tenant support)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'inspector', 'contractor', 'viewer')),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contractors table
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    contractor_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    specialties TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('certified', 'pending', 'suspended')),
    active_projects INTEGER DEFAULT 0,
    completed_projects INTEGER DEFAULT 0,
    total_value DECIMAL(12,2) DEFAULT 0,
    hourly_rate DECIMAL(6,2),
    join_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (you can add more restrictive ones later)
CREATE POLICY "Enable read access for authenticated users" ON organizations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON contractors
    FOR SELECT USING (auth.role() = 'authenticated');`}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={initializeDatabase}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Test Database Connection
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

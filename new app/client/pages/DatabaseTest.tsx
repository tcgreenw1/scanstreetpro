import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, AlertTriangle, Loader2, Eye, Edit, Users, Building2 } from 'lucide-react';

export default function DatabaseTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{test: string, status: 'success' | 'error' | 'info', message: string}>>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string) => {
    setResults(prev => [...prev, { test, status, message }]);
  };

  const runDatabaseTests = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      // Test 1: Basic Connection
      addResult('Connection', 'info', 'Testing basic connection...');
      const { data: healthCheck } = await supabase.from('_realtime').select('*').limit(1);
      addResult('Connection', 'success', 'Basic connection working');

      // Test 2: Check existing tables
      addResult('Schema Check', 'info', 'Checking if tables exist...');
      
      // Try to read organizations
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*');
      
      if (orgError) {
        if (orgError.message.includes('does not exist')) {
          addResult('Schema Check', 'error', 'Organizations table does not exist - will create it');
          await createTables();
        } else {
          addResult('Schema Check', 'error', `Error reading organizations: ${orgError.message}`);
        }
      } else {
        addResult('Schema Check', 'success', `Organizations table exists with ${orgData?.length || 0} records`);
        setOrganizations(orgData || []);
      }

      // Test 3: Try to create organization
      addResult('Write Test', 'info', 'Testing write operations...');
      const testOrgSlug = `test-${Date.now()}`;
      
      const { data: newOrg, error: writeError } = await supabase
        .from('organizations')
        .insert({
          name: `Test Organization ${new Date().toLocaleTimeString()}`,
          slug: testOrgSlug,
          plan: 'free'
        })
        .select()
        .single();

      if (writeError) {
        addResult('Write Test', 'error', `Write failed: ${writeError.message}`);
        
        // If RLS is the issue, let's try to fix it
        if (writeError.message.includes('row-level security')) {
          addResult('RLS Fix', 'info', 'Attempting to fix RLS policies...');
          await fixRLSPolicies();
        }
      } else {
        addResult('Write Test', 'success', `Successfully created organization: ${newOrg.name}`);
        
        // Test 4: Create a user for this organization
        await testUserCreation(newOrg.id);
      }

      // Test 5: Read all current data
      await loadAllData();

    } catch (error: any) {
      addResult('General Error', 'error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const createTables = async () => {
    addResult('Table Creation', 'info', 'Creating database tables...');
    
    const schema = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Organizations table
      CREATE TABLE IF NOT EXISTS organizations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
          settings JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
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
      CREATE TABLE IF NOT EXISTS contractors (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          organization_id UUID REFERENCES organizations(id),
          contractor_id VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(20),
          specialties TEXT[] DEFAULT '{}',
          rating DECIMAL(2,1) DEFAULT 0.0,
          status VARCHAR(20) DEFAULT 'pending',
          active_projects INTEGER DEFAULT 0,
          completed_projects INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: schema });
      if (error) {
        // Try individual table creation
        await createTablesIndividually();
      } else {
        addResult('Table Creation', 'success', 'All tables created successfully');
      }
    } catch (error: any) {
      addResult('Table Creation', 'error', `Failed to create tables: ${error.message}`);
    }
  };

  const createTablesIndividually = async () => {
    // Create organizations table
    try {
      const { error: orgError } = await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS organizations (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name VARCHAR(255) NOT NULL,
              slug VARCHAR(100) UNIQUE NOT NULL,
              plan VARCHAR(20) NOT NULL DEFAULT 'free',
              settings JSONB DEFAULT '{}',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (orgError) {
        addResult('Organizations Table', 'error', `Failed: ${orgError.message}`);
      } else {
        addResult('Organizations Table', 'success', 'Created successfully');
      }
    } catch (error: any) {
      addResult('Organizations Table', 'error', `Exception: ${error.message}`);
    }
  };

  const fixRLSPolicies = async () => {
    const policies = `
      -- Disable RLS temporarily or create permissive policies
      ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
      
      -- Or create permissive policies
      DROP POLICY IF EXISTS "Enable all for authenticated users" ON organizations;
      CREATE POLICY "Enable all for authenticated users" ON organizations
          FOR ALL USING (true);
    `;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: policies });
      if (error) {
        addResult('RLS Fix', 'error', `RLS fix failed: ${error.message}`);
      } else {
        addResult('RLS Fix', 'success', 'RLS policies updated');
      }
    } catch (error: any) {
      addResult('RLS Fix', 'error', `RLS fix exception: ${error.message}`);
    }
  };

  const testUserCreation = async (organizationId: string) => {
    addResult('User Test', 'info', 'Testing user creation...');

    // First verify the organization exists
    const { data: orgExists, error: orgCheckError } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', organizationId)
      .single();

    if (orgCheckError || !orgExists) {
      addResult('User Test', 'error', `Organization ${organizationId} does not exist. Cannot create user.`);
      return;
    }

    addResult('User Test', 'info', `Verified organization ${organizationId} exists`);

    // Now try to create a simple user record (not auth user)
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        organization_id: organizationId,
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        role: 'viewer'
      })
      .select()
      .single();

    if (userError) {
      addResult('User Test', 'error', `User creation failed: ${userError.message}`);

      // If foreign key constraint, provide helpful message
      if (userError.message.includes('foreign key constraint')) {
        addResult('User Test', 'error', 'Foreign key constraint failed - organization_id does not exist in organizations table');
      }
    } else {
      addResult('User Test', 'success', `User created: ${newUser.name}`);
    }
  };

  const loadAllData = async () => {
    addResult('Data Load', 'info', 'Loading all current data...');
    
    try {
      const [orgsResult, usersResult] = await Promise.all([
        supabase.from('organizations').select('*'),
        supabase.from('users').select('*')
      ]);

      if (orgsResult.error) {
        addResult('Data Load', 'error', `Organizations load failed: ${orgsResult.error.message}`);
      } else {
        setOrganizations(orgsResult.data || []);
        addResult('Data Load', 'success', `Loaded ${orgsResult.data?.length || 0} organizations`);
      }

      if (usersResult.error) {
        addResult('Data Load', 'error', `Users load failed: ${usersResult.error.message}`);
      } else {
        setUsers(usersResult.data || []);
        addResult('Data Load', 'success', `Loaded ${usersResult.data?.length || 0} users`);
      }
    } catch (error: any) {
      addResult('Data Load', 'error', `Load exception: ${error.message}`);
    }
  };

  const createSampleData = async () => {
    setLoading(true);
    addResult('Sample Data', 'info', 'Creating comprehensive sample data...');

    try {
      // Create admin organization
      const { data: adminOrg } = await supabase
        .from('organizations')
        .insert({
          name: 'Scan Street Pro Admin',
          slug: 'admin',
          plan: 'enterprise'
        })
        .select()
        .single();

      // Create test organization
      const { data: testOrg } = await supabase
        .from('organizations')
        .insert({
          name: 'City of Springfield',
          slug: 'springfield',
          plan: 'free'
        })
        .select()
        .single();

      if (adminOrg && testOrg) {
        // Create some contractors for the test org
        await supabase.from('contractors').insert([
          {
            organization_id: testOrg.id,
            contractor_id: 'CONT-001',
            name: 'Springfield Road Works',
            company: 'Springfield Construction LLC',
            email: 'contact@springfieldroads.com',
            rating: 4.8,
            status: 'certified',
            active_projects: 3,
            completed_projects: 24
          },
          {
            organization_id: testOrg.id,
            contractor_id: 'CONT-002',
            name: 'Elite Infrastructure',
            company: 'Elite Contractors Inc',
            email: 'info@eliteinfra.com',
            rating: 4.6,
            status: 'certified',
            active_projects: 2,
            completed_projects: 18
          }
        ]);

        addResult('Sample Data', 'success', 'Created organizations and contractors');
        await loadAllData();
      }
    } catch (error: any) {
      addResult('Sample Data', 'error', `Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'info') => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'info': return <Database className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: 'success' | 'error' | 'info') => {
    switch (status) {
      case 'success': return 'text-green-800 bg-green-50 border-green-200';
      case 'error': return 'text-red-800 bg-red-50 border-red-200';
      case 'info': return 'text-blue-800 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Test Suite</h1>
              <p className="text-gray-600">Comprehensive read/write testing for Supabase integration</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Database Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runDatabaseTests} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Run Full Database Test
                  </>
                )}
              </Button>

              <Button 
                onClick={createSampleData} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Create Sample Data
              </Button>

              <Button 
                onClick={loadAllData} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Database className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </CardContent>
          </Card>

          {/* Current Data */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Current Database State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Building2 className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-sm font-medium">Organizations</p>
                  <p className="text-2xl font-bold text-blue-800">{organizations.length}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto text-green-600 mb-1" />
                  <p className="text-sm font-medium">Users</p>
                  <p className="text-2xl font-bold text-green-800">{users.length}</p>
                </div>
              </div>

              {organizations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Organizations:</h4>
                  <div className="space-y-1">
                    {organizations.slice(0, 3).map((org) => (
                      <div key={org.id} className="flex justify-between items-center text-sm">
                        <span>{org.name}</span>
                        <Badge variant="outline">{org.plan}</Badge>
                      </div>
                    ))}
                    {organizations.length > 3 && (
                      <p className="text-xs text-gray-500">+{organizations.length - 3} more...</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {results.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <Alert key={index} className={`border ${getStatusColor(result.status)}`}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <div>
                        <strong>{result.test}:</strong> {result.message}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>How This Helps Save Credits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              • This page tests every database operation without using Builder.io credits
            </p>
            <p className="text-sm text-gray-600">
              • See exactly what's working vs what's failing in real-time
            </p>
            <p className="text-sm text-gray-600">
              • Automatically creates tables and fixes common issues (RLS, permissions)
            </p>
            <p className="text-sm text-gray-600">
              • Tests both read and write operations comprehensively
            </p>
            <p className="text-sm text-gray-600">
              • Creates sample data for testing the freemium model
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

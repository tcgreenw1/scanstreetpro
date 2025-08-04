import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function TestOrgCreation() {
  const [status, setStatus] = useState('');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const createTestOrganizations = async () => {
    setStatus('Creating test organizations...');
    
    const testOrgs = [
      { name: 'City of Springfield Free', slug: 'springfield-free', plan: 'free' },
      { name: 'City of Springfield Premium', slug: 'springfield-premium', plan: 'professional' },
      { name: 'Test Municipality', slug: 'test-municipality', plan: 'starter' }
    ];

    try {
      for (const org of testOrgs) {
        const { error } = await supabase
          .from('organizations')
          .insert(org);
        
        if (error && !error.message.includes('duplicate')) {
          throw error;
        }
      }
      
      setStatus('Test organizations created successfully!');
      await loadData();
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const testUserCreation = async () => {
    setStatus('Testing user creation...');
    
    try {
      // Get first organization
      const { data: orgs, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .limit(1);
      
      if (orgError) throw orgError;
      
      if (!orgs || orgs.length === 0) {
        setStatus('No organizations found. Create organizations first.');
        return;
      }

      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        name: 'Test User',
        organization_id: orgs[0].id,
        role: 'viewer',
        phone: '555-0123'
      };

      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            organization_id: testUser.organization_id,
            email: testUser.email,
            name: testUser.name,
            role: testUser.role,
            phone: testUser.phone
          });

        if (profileError) {
          // Clean up auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw profileError;
        }

        setStatus(`User created successfully! Email: ${testUser.email}, Org: ${orgs[0].name} (${orgs[0].plan} plan)`);
        await loadData();
      }
    } catch (error: any) {
      setStatus(`User creation error: ${error.message}`);
    }
  };

  const loadData = async () => {
    try {
      const { data: orgs } = await supabase
        .from('organizations')
        .select('*');
      
      const { data: users } = await supabase
        .from('users')
        .select(`
          *,
          organizations (name, plan)
        `);
      
      setOrganizations(orgs || []);
      setUsers(users || []);
    } catch (error: any) {
      console.error('Load data error:', error);
    }
  };

  const clearTestData = async () => {
    if (!confirm('This will delete all test data. Continue?')) return;
    
    setStatus('Clearing test data...');
    
    try {
      // Delete test users
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .like('email', '%@example.com');
      
      // Delete test orgs
      const { error: orgError } = await supabase
        .from('organizations')
        .delete()
        .in('slug', ['springfield-free', 'springfield-premium', 'test-municipality']);
      
      setStatus('Test data cleared!');
      await loadData();
    } catch (error: any) {
      setStatus(`Clear error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Testing & Premium vs Free Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button onClick={createTestOrganizations}>
                Create Test Organizations
              </Button>
              <Button onClick={testUserCreation} variant="outline">
                Test User Creation
              </Button>
              <Button onClick={loadData} variant="outline">
                Refresh Data
              </Button>
              <Button onClick={clearTestData} variant="destructive">
                Clear Test Data
              </Button>
            </div>
            
            {status && (
              <Alert>
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organizations ({organizations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {organizations.map((org) => (
                  <div key={org.id} className="p-2 bg-gray-100 rounded">
                    <p className="font-medium">{org.name}</p>
                    <p className="text-sm text-gray-600">{org.slug} - {org.plan}</p>
                    <p className="text-xs text-gray-500">ID: {org.id}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="p-2 bg-gray-100 rounded">
                    <p className="font-medium">{user.name || 'Unnamed'}</p>
                    <p className="text-sm text-gray-600">{user.email} - {user.role}</p>
                    <p className="text-xs text-gray-500">
                      Org: {user.organizations?.name} ({user.organizations?.plan})
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

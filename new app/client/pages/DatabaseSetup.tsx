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
        throw new Error(`Failed to create admin organization: ${adminOrgError.message}`);
      }

      logProgress('✅ Admin organization created');

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
        throw new Error(`Failed to create test organization: ${testOrgError.message}`);
      }

      logProgress('✅ Test organization created');

      // Create admin user
      logProgress('👤 Creating admin user...');
      const adminOrgId = adminOrg?.id || (await supabase.from('organizations').select('id').eq('slug', 'admin').single()).data?.id;
      
      const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
        email: 'admin@scanstreetpro.com',
        password: 'AdminPass123!',
        email_confirm: true
      });

      if (adminAuthError && !adminAuthError.message.includes('already')) {
        throw new Error(`Failed to create admin auth: ${adminAuthError.message}`);
      }

      if (adminAuth.user && adminOrgId) {
        const { error: adminProfileError } = await supabase
          .from('users')
          .insert({
            id: adminAuth.user.id,
            organization_id: adminOrgId,
            email: 'admin@scanstreetpro.com',
            name: 'System Administrator',
            role: 'admin'
          });

        if (adminProfileError && !adminProfileError.message.includes('duplicate')) {
          throw new Error(`Failed to create admin profile: ${adminProfileError.message}`);
        }

        logProgress('✅ Admin user created (admin@scanstreetpro.com / AdminPass123!)');
      }

      // Create test user
      logProgress('👤 Creating test user...');
      const testOrgId = testOrg?.id || (await supabase.from('organizations').select('id').eq('slug', 'springfield').single()).data?.id;
      
      const { data: testAuth, error: testAuthError } = await supabase.auth.admin.createUser({
        email: 'test@springfield.gov',
        password: 'TestUser123!',
        email_confirm: true
      });

      if (testAuthError && !testAuthError.message.includes('already')) {
        throw new Error(`Failed to create test auth: ${testAuthError.message}`);
      }

      if (testAuth.user && testOrgId) {
        const { error: testProfileError } = await supabase
          .from('users')
          .insert({
            id: testAuth.user.id,
            organization_id: testOrgId,
            email: 'test@springfield.gov',
            name: 'Test User',
            role: 'manager'
          });

        if (testProfileError && !testProfileError.message.includes('duplicate')) {
          throw new Error(`Failed to create test profile: ${testProfileError.message}`);
        }

        logProgress('✅ Test user created (test@springfield.gov / TestUser123!)');
      }

      // Add some sample contractors for Springfield
      if (testOrgId) {
        logProgress('🚧 Adding sample contractors...');
        const contractors = [
          {
            organization_id: testOrgId,
            contractor_id: 'CONT-001',
            name: 'Springfield Road Works',
            company: 'Springfield Construction LLC',
            email: 'contact@springfieldroads.com',
            phone: '(555) 123-4567',
            specialties: ['Road Repair', 'Pothole Filling', 'Asphalt Overlay'],
            rating: 4.8,
            status: 'certified',
            active_projects: 3,
            completed_projects: 24,
            total_value: 125000
          },
          {
            organization_id: testOrgId,
            contractor_id: 'CONT-002',
            name: 'Elite Infrastructure Solutions',
            company: 'Elite Contractors Inc',
            email: 'info@eliteinfra.com',
            phone: '(555) 987-6543',
            specialties: ['Bridge Maintenance', 'Drainage Systems', 'Street Lighting'],
            rating: 4.6,
            status: 'certified',
            active_projects: 2,
            completed_projects: 18,
            total_value: 89000
          }
        ];

        for (const contractor of contractors) {
          const { error } = await supabase.from('contractors').insert(contractor);
          if (error && !error.message.includes('duplicate')) {
            console.warn(`Warning: Could not create contractor ${contractor.name}:`, error.message);
          }
        }

        logProgress('✅ Sample contractors added');
      }

      logProgress('🎉 Database initialization completed successfully!');
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
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-800">Admin Login</h3>
                  <p className="text-sm text-red-600">admin@scanstreetpro.com</p>
                  <p className="text-sm text-red-600">AdminPass123!</p>
                  <p className="text-xs text-red-500 mt-2">Access admin portal and manage organizations</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Test User Login</h3>
                  <p className="text-sm text-blue-600">test@springfield.gov</p>
                  <p className="text-sm text-blue-600">TestUser123!</p>
                  <p className="text-xs text-blue-500 mt-2">Experience the app as a regular user</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button asChild className="mr-2">
                  <a href="/login">Go to Login Page</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/admin-portal">Admin Portal</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

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
      logProgress('🔄 Starting database test...');

      // Test basic connection
      const { data: basicTest, error: basicError } = await supabase
        .from('_realtime')
        .select('*')
        .limit(1);

      if (basicError && !basicError.message.includes('does not exist')) {
        throw new Error(`Connection failed: ${basicError.message}`);
      }

      logProgress('✅ Basic connection works');

      // Check if tables exist
      const { data: orgCheck, error: orgError } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);

      if (orgError && orgError.message.includes('does not exist')) {
        logProgress('❌ Tables not found - need to create schema');
        setError('Database schema not found. Please create the tables using the SQL below.');
        setSuccess(true);
        return;
      }

      if (orgError) {
        throw new Error(`Schema check failed: ${orgError.message}`);
      }

      logProgress('✅ Database schema exists');
      logProgress('🎉 Test completed successfully');
      setSuccess(true);

    } catch (err: any) {
      setError(err.message || 'Test failed');
      logProgress(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copySchema = () => {
    const sql = getSchema();
    navigator.clipboard.writeText(sql);
    alert('Schema copied!');
  };

  const getSchema = () => {
    const lines = [
      '-- Municipal Infrastructure Database Schema',
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
      '',
      '-- Organizations table',
      'CREATE TABLE organizations (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    name VARCHAR(255) NOT NULL,',
      '    slug VARCHAR(100) UNIQUE NOT NULL,',
      '    plan VARCHAR(20) NOT NULL DEFAULT \'free\',',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      '-- Users table',
      'CREATE TABLE users (',
      '    id UUID PRIMARY KEY REFERENCES auth.users(id),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    email VARCHAR(255) NOT NULL,',
      '    name VARCHAR(255),',
      '    role VARCHAR(20) NOT NULL DEFAULT \'viewer\',',
      '    is_active BOOLEAN DEFAULT true,',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      '-- Contractors table',
      'CREATE TABLE contractors (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    contractor_id VARCHAR(50) UNIQUE NOT NULL,',
      '    name VARCHAR(255) NOT NULL,',
      '    company VARCHAR(255),',
      '    email VARCHAR(255),',
      '    rating DECIMAL(2,1) DEFAULT 0.0,',
      '    status VARCHAR(20) DEFAULT \'pending\',',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      '-- Assets table',
      'CREATE TABLE assets (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    asset_id VARCHAR(50) UNIQUE NOT NULL,',
      '    name VARCHAR(255) NOT NULL,',
      '    type VARCHAR(50) NOT NULL,',
      '    condition VARCHAR(20),',
      '    pci_score INTEGER,',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      '-- Inspections table',
      'CREATE TABLE inspections (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    inspection_id VARCHAR(50) UNIQUE NOT NULL,',
      '    asset_id UUID REFERENCES assets(id),',
      '    inspector_id UUID REFERENCES users(id),',
      '    date DATE NOT NULL,',
      '    status VARCHAR(20) DEFAULT \'scheduled\',',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      '-- Projects table',
      'CREATE TABLE projects (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    project_id VARCHAR(50) UNIQUE NOT NULL,',
      '    name VARCHAR(255) NOT NULL,',
      '    contractor_id UUID REFERENCES contractors(id),',
      '    status VARCHAR(20) DEFAULT \'planning\',',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      '-- Additional tables',
      'CREATE TABLE maintenance_tasks (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    task_id VARCHAR(50) UNIQUE NOT NULL,',
      '    title VARCHAR(255) NOT NULL,',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      'CREATE TABLE expenses (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    expense_id VARCHAR(50) UNIQUE NOT NULL,',
      '    description VARCHAR(255) NOT NULL,',
      '    amount DECIMAL(10,2) NOT NULL,',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      'CREATE TABLE funding_sources (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    source_id VARCHAR(50) UNIQUE NOT NULL,',
      '    name VARCHAR(255) NOT NULL,',
      '    amount DECIMAL(12,2) NOT NULL,',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      'CREATE TABLE grants (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    grant_id VARCHAR(50) UNIQUE NOT NULL,',
      '    name VARCHAR(255) NOT NULL,',
      '    amount DECIMAL(12,2),',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      'CREATE TABLE budget_scenarios (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    scenario_id VARCHAR(50) UNIQUE NOT NULL,',
      '    name VARCHAR(255) NOT NULL,',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      'CREATE TABLE citizen_reports (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    report_id VARCHAR(50) UNIQUE NOT NULL,',
      '    title VARCHAR(255) NOT NULL,',
      '    status VARCHAR(20) DEFAULT \'queued\',',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      'CREATE TABLE scan_issues (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    issue_id VARCHAR(50) UNIQUE NOT NULL,',
      '    issue_type VARCHAR(50),',
      '    status VARCHAR(20) DEFAULT \'pending\',',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      'CREATE TABLE inspector_notes (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    issue_id UUID REFERENCES scan_issues(id),',
      '    inspector_id UUID REFERENCES users(id),',
      '    comments TEXT,',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      'CREATE TABLE inspection_templates (',
      '    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),',
      '    organization_id UUID REFERENCES organizations(id),',
      '    name VARCHAR(255) NOT NULL,',
      '    asset_type VARCHAR(50) NOT NULL,',
      '    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
      ');',
      '',
      '-- Enable RLS',
      'ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE assets ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE projects ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE funding_sources ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE grants ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE budget_scenarios ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE scan_issues ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE inspector_notes ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;',
      '',
      '-- Basic policies',
      'CREATE POLICY "auth_users" ON organizations FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON users FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON contractors FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON assets FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON inspections FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON projects FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON maintenance_tasks FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON expenses FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON funding_sources FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON grants FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON budget_scenarios FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON citizen_reports FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON scan_issues FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON inspector_notes FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "auth_users" ON inspection_templates FOR ALL USING (auth.role() = \'authenticated\');'
    ];
    
    return lines.join('\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Setup</h1>
              <p className="text-gray-600">Initialize Supabase database</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={initializeDatabase} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
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
                <div className="bg-gray-50 rounded-lg p-4">
                  {progress.map((item, index) => (
                    <div key={index} className="text-sm">{item}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {success && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>SQL Schema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Complete Database Schema (15 Tables)</span>
                <Button size="sm" onClick={copySchema}>Copy</Button>
              </div>
              
              <textarea 
                className="w-full h-80 p-4 bg-gray-900 text-green-400 text-xs font-mono"
                value={getSchema()}
                readOnly
              />

              <div className="text-center space-x-2">
                <Button asChild>
                  <a href="/database-test">Test Database</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://supabase.com/dashboard/project/nwoeeejaxmwvxggcpchw" target="_blank">
                    Supabase Dashboard
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

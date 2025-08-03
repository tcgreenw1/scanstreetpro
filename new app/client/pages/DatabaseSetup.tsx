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
        logProgress('📄 Copy and paste the schema from the box below');
        
        setError('Database schema not found. Please create the tables first using the SQL schema.');
        setSuccess(true);
        return;
      }

      if (orgError) {
        throw new Error(`Schema check failed: ${orgError.message}`);
      }

      logProgress('✅ Database schema exists');
      logProgress('🎉 Database connection test completed!');
      setSuccess(true);

    } catch (err: any) {
      setError(err.message || 'Database initialization failed');
      logProgress(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copySchema = () => {
    const sqlSchema = getSQLSchema();
    navigator.clipboard.writeText(sqlSchema);
    alert('Schema copied to clipboard!');
  };

  const getSQLSchema = () => {
    return `-- Municipal Infrastructure Management System Database Schema
-- Complete 15-Table Schema for Supabase Integration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Tables
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(20) NOT NULL DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'viewer',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    contractor_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    rating DECIMAL(2,1) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    asset_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    condition VARCHAR(20),
    pci_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    inspection_id VARCHAR(50) UNIQUE NOT NULL,
    asset_id UUID REFERENCES assets(id),
    inspector_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    score INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    project_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contractor_id UUID REFERENCES contractors(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    task_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    asset_id UUID REFERENCES assets(id),
    contractor_id UUID REFERENCES contractors(id),
    status VARCHAR(20) DEFAULT 'scheduled',
    scheduled_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    expense_id VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE funding_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    source_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20),
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    grant_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    agency VARCHAR(255),
    amount DECIMAL(12,2),
    deadline DATE,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE budget_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    scenario_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_expenses DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE citizen_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    report_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    status VARCHAR(20) DEFAULT 'queued',
    submitted_date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE scan_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    issue_id VARCHAR(50) UNIQUE NOT NULL,
    image_url TEXT,
    issue_type VARCHAR(50),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    pci_score INTEGER,
    ai_confidence DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'pending',
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inspector_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    issue_id UUID REFERENCES scan_issues(id),
    inspector_id UUID REFERENCES users(id),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inspection_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspector_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "auth_policy" ON organizations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON contractors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON assets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON inspections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON maintenance_tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON expenses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON funding_sources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON grants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON budget_scenarios FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON citizen_reports FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON scan_issues FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON inspector_notes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_policy" ON inspection_templates FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX idx_contractors_org ON contractors(organization_id);
CREATE INDEX idx_assets_org ON assets(organization_id);
CREATE INDEX idx_inspections_org ON inspections(organization_id);
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_maintenance_org ON maintenance_tasks(organization_id);
CREATE INDEX idx_expenses_org ON expenses(organization_id);`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Setup</h1>
              <p className="text-gray-600">Initialize Supabase database with schema and test connection</p>
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className={error.includes('successfully') ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className={error.includes('successfully') ? "text-green-800" : "text-red-800"}>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">This will:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Test database connection</li>
                <li>• Check if tables exist</li>
                <li>• Provide setup instructions if needed</li>
                <li>• Show SQL schema for manual creation</li>
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
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Complete SQL Schema</CardTitle>
                <CardDescription>Copy this entire schema and run it in Supabase SQL Editor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">15-Table Schema for Municipal Infrastructure App:</h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copySchema}
                  >
                    Copy Schema
                  </Button>
                </div>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono max-h-80 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{getSQLSchema()}</pre>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Database className="h-4 w-4" />
                  <AlertDescription className="text-blue-800">
                    <strong>Instructions:</strong> Copy the SQL above and paste it into Supabase Dashboard → SQL Editor → Run
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-2">1. Run SQL Schema</h3>
                    <p className="text-sm text-yellow-700">Copy the schema above and run it in Supabase SQL Editor</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">2. Create Users</h3>
                    <p className="text-sm text-green-700">Go to Authentication → Users and create test accounts</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">3. Add Organizations</h3>
                    <p className="text-sm text-blue-700">Insert organizations into the organizations table</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2">4. Test App</h3>
                    <p className="text-sm text-purple-700">Use database-test page to verify everything works</p>
                  </div>
                </div>
                
                <div className="text-center space-x-2">
                  <Button asChild>
                    <a href="/database-test">Test Database</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://supabase.com/dashboard/project/nwoeeejaxmwvxggcpchw" target="_blank">
                      Open Supabase Dashboard
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

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
        
        // Show the schema creation instructions
        setError('Database schema not found. Please create the tables first using the SQL schema.');
        setSuccess(true); // Show success section for schema display
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

  const copySchema = () => {
    const schemaElement = document.getElementById('schema-sql');
    const schemaText = schemaElement?.textContent;
    if (schemaText) {
      navigator.clipboard.writeText(schemaText);
      alert('Schema copied to clipboard!');
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
              <Alert className={error.includes('successfully') ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className={error.includes('successfully') ? "text-green-800" : "text-red-800"}>
                  {error}
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

        {(success || error.includes('schema not found')) && (
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
                
                <div 
                  id="schema-sql"
                  className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono max-h-80 overflow-y-auto"
                >
                  <pre>{`-- Municipal Infrastructure Management System Database Schema
-- Complete 15-Table Schema for Supabase Integration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations table (for multi-tenant support)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users table (extends Supabase auth.users)
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

-- 3. Contractors table
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

-- 4. Assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    asset_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('road', 'bridge', 'traffic_signal', 'street_light', 'signage', 'sidewalk', 'drainage')),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    address TEXT,
    road_name VARCHAR(255),
    segment VARCHAR(100),
    condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'critical')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'needs_repair', 'under_maintenance', 'decommissioned')),
    install_date DATE,
    value DECIMAL(12,2),
    maintenance_cost DECIMAL(12,2) DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_contractor_id UUID REFERENCES contractors(id),
    last_inspection DATE,
    next_inspection DATE,
    pci_score INTEGER CHECK (pci_score >= 0 AND pci_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Inspection templates table
CREATE TABLE inspection_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    frequency VARCHAR(100),
    mandatory BOOLEAN DEFAULT false,
    items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Inspections table
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    inspection_id VARCHAR(50) UNIQUE NOT NULL,
    asset_id UUID REFERENCES assets(id),
    inspector_id UUID REFERENCES users(id),
    contractor_id UUID REFERENCES contractors(id),
    template_id UUID REFERENCES inspection_templates(id),
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'approved', 'requires_action')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    findings TEXT[] DEFAULT '{}',
    photos_count INTEGER DEFAULT 0,
    videos_count INTEGER DEFAULT 0,
    has_signature BOOLEAN DEFAULT false,
    next_inspection_date DATE,
    compliance_standards TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    project_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contractor_id UUID REFERENCES contractors(id),
    start_date DATE,
    end_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    value DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'delayed')),
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Maintenance tasks table
CREATE TABLE maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    task_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    asset_id UUID REFERENCES assets(id),
    contractor_id UUID REFERENCES contractors(id),
    assigned_crew VARCHAR(255),
    type VARCHAR(50) CHECK (type IN ('pothole_repair', 'crack_sealing', 'sign_maintenance', 'street_cleaning', 'inspection', 'snow_removal', 'general_maintenance')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'on_hold', 'delayed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    scheduled_date DATE,
    completed_date DATE,
    estimated_duration INTEGER,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    materials TEXT[] DEFAULT '{}',
    notes TEXT[] DEFAULT '{}',
    attachments TEXT[] DEFAULT '{}',
    weather_sensitive BOOLEAN DEFAULT false,
    pci_score INTEGER CHECK (pci_score >= 0 AND pci_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    expense_id VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    date DATE NOT NULL,
    vendor VARCHAR(255),
    contractor VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected', 'upcoming')),
    project VARCHAR(255),
    invoice_number VARCHAR(100),
    approved_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Funding sources table
CREATE TABLE funding_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    source_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('sales_tax', 'grant', 'bond', 'assessment', 'federal', 'state')),
    amount DECIMAL(12,2) NOT NULL,
    allocated_amount DECIMAL(12,2) DEFAULT 0,
    available_amount DECIMAL(12,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'expired', 'approved')),
    restrictions TEXT[] DEFAULT '{}',
    deadline DATE,
    renewal_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Grants table
CREATE TABLE grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    grant_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    agency VARCHAR(255),
    amount DECIMAL(12,2),
    deadline DATE,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'applied', 'awarded', 'expired')),
    match_required BOOLEAN DEFAULT false,
    match_amount DECIMAL(12,2),
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Budget scenarios table
CREATE TABLE budget_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    scenario_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_expenses DECIMAL(12,2) DEFAULT 0,
    balance DECIMAL(12,2) DEFAULT 0,
    funding_sources TEXT[] DEFAULT '{}',
    created_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Citizen reports table
CREATE TABLE citizen_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    report_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('pothole', 'signage', 'flooding', 'sidewalk', 'streetlight', 'other')),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    address VARCHAR(255),
    status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'scheduled', 'in_progress', 'resolved')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    submitted_date DATE DEFAULT CURRENT_DATE,
    assigned_to VARCHAR(255),
    estimated_completion DATE,
    description TEXT,
    submitter_email VARCHAR(255),
    submitter_phone VARCHAR(20),
    photos TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. AI Scan issues table (Road Inspection AI Data)
CREATE TABLE scan_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    issue_id VARCHAR(50) UNIQUE NOT NULL,
    image_url TEXT,
    overlay_image_url TEXT,
    issue_type VARCHAR(50) CHECK (issue_type IN ('pothole', 'crack', 'low_pci', 'surface_deterioration', 'edge_cracking', 'alligator_cracking')),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    address VARCHAR(255),
    road_name VARCHAR(255),
    segment VARCHAR(100),
    pci_score INTEGER CHECK (pci_score >= 0 AND pci_score <= 100),
    ai_suggestion VARCHAR(50) CHECK (ai_suggestion IN ('overlay', 'seal', 'reconstruction', 'patching', 'crack_sealing', 'none')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'adjusted')),
    ai_confidence DECIMAL(5,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')),
    dimensions JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Inspector notes table
CREATE TABLE inspector_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    issue_id UUID REFERENCES scan_issues(id),
    inspector_id UUID REFERENCES users(id),
    inspector_name VARCHAR(255),
    comments TEXT,
    photo_uploads TEXT[] DEFAULT '{}',
    voice_note_url TEXT,
    adjustment_details JSONB,
    gps_check_in JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_contractors_organization ON contractors(organization_id);
CREATE INDEX idx_assets_organization ON assets(organization_id);
CREATE INDEX idx_inspections_organization ON inspections(organization_id);
CREATE INDEX idx_maintenance_tasks_organization ON maintenance_tasks(organization_id);
CREATE INDEX idx_scan_issues_organization ON scan_issues(organization_id);
CREATE INDEX idx_citizen_reports_organization ON citizen_reports(organization_id);
CREATE INDEX idx_projects_organization ON projects(organization_id);
CREATE INDEX idx_expenses_organization ON expenses(organization_id);
CREATE INDEX idx_funding_sources_organization ON funding_sources(organization_id);
CREATE INDEX idx_grants_organization ON grants(organization_id);
CREATE INDEX idx_budget_scenarios_organization ON budget_scenarios(organization_id);
CREATE INDEX idx_inspector_notes_organization ON inspector_notes(organization_id);
CREATE INDEX idx_inspection_templates_organization ON inspection_templates(organization_id);

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspector_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies - Allow all operations for authenticated users
CREATE POLICY "Enable all for authenticated users" ON organizations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON contractors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON assets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON inspections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON maintenance_tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON expenses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON funding_sources FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON grants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON budget_scenarios FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON citizen_reports FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON scan_issues FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON inspector_notes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON inspection_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_tasks_updated_at BEFORE UPDATE ON maintenance_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funding_sources_updated_at BEFORE UPDATE ON funding_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON grants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_scenarios_updated_at BEFORE UPDATE ON budget_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_citizen_reports_updated_at BEFORE UPDATE ON citizen_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scan_issues_updated_at BEFORE UPDATE ON scan_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspector_notes_updated_at BEFORE UPDATE ON inspector_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspection_templates_updated_at BEFORE UPDATE ON inspection_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`}</pre>
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
                
                <div className="text-center">
                  <Button asChild className="mr-2">
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

import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

const router = Router();

// Database connection pool (lazy initialization)
let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  return pool;
}

// Database schema as string
const SCHEMA_SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('manager', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE organization_plan AS ENUM ('free', 'basic', 'pro', 'premium', 'satellite', 'driving');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'trial', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    plan organization_plan NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'manager',
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plan organization_plan NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    status subscription_status NOT NULL DEFAULT 'trial',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE
);

-- Plan features table
CREATE TABLE IF NOT EXISTS plan_features (
    id SERIAL PRIMARY KEY,
    plan organization_plan NOT NULL,
    feature_name TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE(plan, feature_name)
);

-- UI rules table
CREATE TABLE IF NOT EXISTS ui_rules (
    id SERIAL PRIMARY KEY,
    plan organization_plan NOT NULL,
    component_name TEXT NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT true,
    sample_data BOOLEAN NOT NULL DEFAULT false,
    show_crown BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(plan, component_name)
);

-- Insert default plan features
INSERT INTO plan_features (plan, feature_name, value) VALUES
('free', 'max_users', '3'),
('free', 'max_organizations', '1'),
('free', 'max_inspections', '10'),
('free', 'support_level', 'community'),
('free', 'data_retention_days', '30'),
('basic', 'max_users', '10'),
('basic', 'max_organizations', '1'),
('basic', 'max_inspections', '100'),
('basic', 'support_level', 'email'),
('basic', 'data_retention_days', '90'),
('pro', 'max_users', '50'),
('pro', 'max_organizations', '3'),
('pro', 'max_inspections', '1000'),
('pro', 'support_level', 'priority'),
('pro', 'data_retention_days', '365'),
('premium', 'max_users', 'unlimited'),
('premium', 'max_organizations', 'unlimited'),
('premium', 'max_inspections', 'unlimited'),
('premium', 'support_level', 'phone'),
('premium', 'data_retention_days', 'unlimited'),
('satellite', 'max_users', '100'),
('satellite', 'max_organizations', '10'),
('satellite', 'max_inspections', 'unlimited'),
('satellite', 'support_level', 'priority'),
('satellite', 'data_retention_days', 'unlimited'),
('driving', 'max_users', 'unlimited'),
('driving', 'max_organizations', 'unlimited'),
('driving', 'max_inspections', 'unlimited'),
('driving', 'support_level', 'dedicated'),
('driving', 'data_retention_days', 'unlimited')
ON CONFLICT (plan, feature_name) DO NOTHING;

-- Insert default UI rules
INSERT INTO ui_rules (plan, component_name, visible, sample_data, show_crown) VALUES
('free', 'dashboard', true, true, true),
('free', 'inspections', true, true, true),
('free', 'reports', true, true, true),
('free', 'analytics', false, true, true),
('free', 'advanced_settings', false, true, true),
('basic', 'dashboard', true, false, false),
('basic', 'inspections', true, false, false),
('basic', 'reports', true, false, true),
('basic', 'analytics', true, true, true),
('basic', 'advanced_settings', false, true, true),
('pro', 'dashboard', true, false, false),
('pro', 'inspections', true, false, false),
('pro', 'reports', true, false, false),
('pro', 'analytics', true, false, true),
('pro', 'advanced_settings', true, false, true),
('premium', 'dashboard', true, false, false),
('premium', 'inspections', true, false, false),
('premium', 'reports', true, false, false),
('premium', 'analytics', true, false, false),
('premium', 'advanced_settings', true, false, false),
('satellite', 'dashboard', true, false, false),
('satellite', 'inspections', true, false, false),
('satellite', 'reports', true, false, false),
('satellite', 'analytics', true, false, false),
('satellite', 'advanced_settings', true, false, false),
('driving', 'dashboard', true, false, false),
('driving', 'inspections', true, false, false),
('driving', 'reports', true, false, false),
('driving', 'analytics', true, false, false),
('driving', 'advanced_settings', true, false, false)
ON CONFLICT (plan, component_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_plan_features_plan ON plan_features(plan);
CREATE INDEX IF NOT EXISTS idx_ui_rules_plan ON ui_rules(plan);
`;

// POST /api/init-db - Initialize database schema
router.post('/init-db', async (req: Request, res: Response) => {
  try {
    console.log('Initializing database schema...');
    
    // Execute the schema
    await pool.query(SCHEMA_SQL);

    console.log('Database schema initialized successfully');

    res.json({
      success: true,
      message: 'Database schema initialized successfully'
    });

  } catch (error: any) {
    console.error('Error initializing schema:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to initialize database schema'
    });
  }
});

// GET /api/db-status - Check database status
router.get('/db-status', async (req: Request, res: Response) => {
  try {
    // Test connection
    const result = await pool.query('SELECT NOW()');
    
    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    res.json({
      success: true,
      data: {
        connected: true,
        timestamp: result.rows[0].now,
        tables: tablesResult.rows.map(row => row.table_name)
      }
    });

  } catch (error: any) {
    console.error('Database status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Database connection failed'
    });
  }
});

export default router;

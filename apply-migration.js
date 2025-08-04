import { Client } from 'pg';

async function applyMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://neon_owner:npg_SylBRYLFrwWO@ep-square-art-a5vdlgco.us-east-2.aws.neon.tech/neon?sslmode=require'
  });

  try {
    await client.connect();
    console.log('🔄 Applying financial tracking migration...');
    
    // Create transaction types and status enums
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'upgrade', 'downgrade');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'canceled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        type transaction_type NOT NULL,
        status transaction_status NOT NULL DEFAULT 'pending',
        stripe_payment_id TEXT,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `);
    
    // Create system_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Insert default settings
    await client.query(`
      INSERT INTO system_settings (key, value, description) VALUES
      ('stripe_public_key', '', 'Stripe publishable key for payments'),
      ('stripe_secret_key', '', 'Stripe secret key for payments'),
      ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
      ('max_organizations_per_user', '5', 'Maximum organizations a user can create'),
      ('trial_duration_days', '14', 'Default trial duration in days'),
      ('email_notifications', 'true', 'Enable email notifications')
      ON CONFLICT (key) DO NOTHING;
    `);
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_organization_id ON transactions(organization_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
      CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
    `);
    
    console.log('✅ Financial tracking migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

applyMigration().catch(console.error);

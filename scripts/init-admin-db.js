import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const initializeAdminDatabase = async () => {
  console.log('🚀 Initializing admin portal database...');

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon database');

    // Create tables if they don't exist
    console.log('📋 Creating tables...');

    // Organizations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'premium')),
        monthly_revenue DECIMAL(10,2) DEFAULT 0,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Organizations table ready');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Users table ready');

    // Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('payment', 'refund', 'upgrade', 'downgrade')),
        amount DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'canceled')),
        plan TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Transactions table ready');

    // Check if admin organization exists
    const orgQuery = 'SELECT id FROM organizations WHERE slug = $1';
    const orgResult = await client.query(orgQuery, ['admin-org']);

    let adminOrgId;
    if (orgResult.rows.length === 0) {
      // Create admin organization
      const createOrgQuery = `
        INSERT INTO organizations (name, slug, plan, monthly_revenue, status) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id
      `;
      const newOrgResult = await client.query(createOrgQuery, [
        'Admin Organization',
        'admin-org',
        'premium',
        0,
        'active'
      ]);
      adminOrgId = newOrgResult.rows[0].id;
      console.log('✅ Created admin organization');
    } else {
      adminOrgId = orgResult.rows[0].id;
      console.log('ℹ️ Admin organization already exists');
    }

    // Create sample organizations
    const sampleOrgs = [
      { name: 'Demo Corporation', slug: 'demo-corp', plan: 'free', revenue: 0 },
      { name: 'Sample Industries', slug: 'sample-ind', plan: 'basic', revenue: 99 },
      { name: 'Pro Business LLC', slug: 'pro-biz', plan: 'pro', revenue: 299 },
      { name: 'Enterprise Solutions', slug: 'enterprise', plan: 'premium', revenue: 999 }
    ];

    for (const org of sampleOrgs) {
      const existingOrg = await client.query('SELECT id FROM organizations WHERE slug = $1', [org.slug]);
      if (existingOrg.rows.length === 0) {
        const result = await client.query(
          'INSERT INTO organizations (name, slug, plan, monthly_revenue) VALUES ($1, $2, $3, $4) RETURNING id',
          [org.name, org.slug, org.plan, org.revenue]
        );
        console.log(`✅ Created organization: ${org.name}`);
        
        // Create sample users for each org
        const userCount = org.plan === 'free' ? 2 : org.plan === 'basic' ? 5 : org.plan === 'pro' ? 10 : 20;
        for (let i = 1; i <= userCount; i++) {
          const userEmail = `user${i}@${org.slug}.com`;
          const userExists = await client.query('SELECT id FROM users WHERE email = $1', [userEmail]);
          if (userExists.rows.length === 0) {
            const tempPassword = 'password123';
            const passwordHash = await bcrypt.hash(tempPassword, 12);
            await client.query(
              'INSERT INTO users (email, password_hash, name, role, organization_id) VALUES ($1, $2, $3, $4, $5)',
              [userEmail, passwordHash, `User ${i}`, i === 1 ? 'manager' : 'member', result.rows[0].id]
            );
          }
        }
      }
    }

    // Check if admin user exists
    const adminEmail = 'admin@scanstreetpro.com';
    const userQuery = 'SELECT id FROM users WHERE email = $1';
    const userResult = await client.query(userQuery, [adminEmail]);

    if (userResult.rows.length === 0) {
      // Create admin user
      const adminPassword = 'zobfig-mirme9-qiMdas';
      const passwordHash = await bcrypt.hash(adminPassword, 12);

      const createUserQuery = `
        INSERT INTO users (email, password_hash, name, role, organization_id, is_active) 
        VALUES ($1, $2, $3, $4, $5, true) 
        RETURNING id, email, role
      `;

      const newUserResult = await client.query(createUserQuery, [
        adminEmail,
        passwordHash,
        'System Administrator',
        'admin',
        adminOrgId
      ]);

      console.log('✅ Created admin user:', newUserResult.rows[0]);
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create sample transactions
    const allOrgs = await client.query('SELECT id, name FROM organizations WHERE slug != $1', ['admin-org']);
    for (const org of allOrgs.rows) {
      const transactionExists = await client.query('SELECT id FROM transactions WHERE organization_id = $1', [org.id]);
      if (transactionExists.rows.length === 0) {
        await client.query(
          'INSERT INTO transactions (organization_id, type, amount, status, plan, description) VALUES ($1, $2, $3, $4, $5, $6)',
          [org.id, 'upgrade', 99, 'completed', 'basic', `Plan upgrade for ${org.name}`]
        );
      }
    }

    client.release();

    // Test the data
    console.log('\n📊 Database summary:');
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM organizations) as org_count,
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM transactions) as transaction_count,
        (SELECT SUM(monthly_revenue) FROM organizations) as total_revenue
    `);
    
    const row = stats.rows[0];
    console.log(`- Organizations: ${row.org_count}`);
    console.log(`- Users: ${row.user_count}`);
    console.log(`- Transactions: ${row.transaction_count}`);
    console.log(`- Total Monthly Revenue: $${row.total_revenue}`);

    console.log('\n🎉 Admin portal database initialized successfully!');
    console.log(`📧 Admin Login: ${adminEmail}`);
    console.log('🔑 Password: zobfig-mirme9-qiMdas');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

initializeAdminDatabase();

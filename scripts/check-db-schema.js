import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const checkSchema = async () => {
  console.log('🔍 Checking database schema...');

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

    // Check what tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\n📋 Existing tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check organizations table structure
    if (tablesResult.rows.some(row => row.table_name === 'organizations')) {
      const orgColumnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'organizations' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);

      console.log('\n🏢 Organizations table columns:');
      orgColumnsResult.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
      });

      // Check if monthly_revenue column exists
      const hasMonthlyRevenue = orgColumnsResult.rows.some(row => row.column_name === 'monthly_revenue');
      const hasStatus = orgColumnsResult.rows.some(row => row.column_name === 'status');

      if (!hasMonthlyRevenue) {
        console.log('\n🔧 Adding missing monthly_revenue column...');
        await client.query('ALTER TABLE organizations ADD COLUMN monthly_revenue DECIMAL(10,2) DEFAULT 0');
        console.log('✅ Added monthly_revenue column');
      }

      if (!hasStatus) {
        console.log('\n🔧 Adding missing status column...');
        await client.query(`ALTER TABLE organizations ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial'))`);
        console.log('✅ Added status column');
      }
    }

    // Check users table structure
    if (tablesResult.rows.some(row => row.table_name === 'users')) {
      const userColumnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);

      console.log('\n👥 Users table columns:');
      userColumnsResult.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
      });

      // Check if last_login column exists
      const hasLastLogin = userColumnsResult.rows.some(row => row.column_name === 'last_login');
      if (!hasLastLogin) {
        console.log('\n🔧 Adding missing last_login column...');
        await client.query('ALTER TABLE users ADD COLUMN last_login TIMESTAMP WITH TIME ZONE');
        console.log('✅ Added last_login column');
      }
    }

    // Check data counts
    if (tablesResult.rows.some(row => row.table_name === 'organizations')) {
      const orgCount = await client.query('SELECT COUNT(*) as count FROM organizations');
      console.log(`\n📊 Organizations: ${orgCount.rows[0].count}`);
    }

    if (tablesResult.rows.some(row => row.table_name === 'users')) {
      const userCount = await client.query('SELECT COUNT(*) as count FROM users');
      console.log(`📊 Users: ${userCount.rows[0].count}`);
    }

    if (tablesResult.rows.some(row => row.table_name === 'transactions')) {
      const transactionCount = await client.query('SELECT COUNT(*) as count FROM transactions');
      console.log(`📊 Transactions: ${transactionCount.rows[0].count}`);
    }

    client.release();
    console.log('\n🎉 Schema check complete!');

  } catch (error) {
    console.error('❌ Error checking schema:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

checkSchema();

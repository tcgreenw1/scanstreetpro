import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const checkConstraints = async () => {
  console.log('🔍 Checking database constraints...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();

    // Check user role constraint
    const constraintResult = await client.query(`
      SELECT constraint_name, check_clause
      FROM information_schema.check_constraints 
      WHERE constraint_name LIKE '%role%'
    `);

    console.log('🔒 Role constraints:');
    constraintResult.rows.forEach(row => {
      console.log(`  - ${row.constraint_name}: ${row.check_clause}`);
    });

    // Check existing user roles
    const rolesResult = await client.query(`
      SELECT DISTINCT role 
      FROM users 
      WHERE role IS NOT NULL
      ORDER BY role
    `);

    console.log('\n📋 Existing user roles:');
    rolesResult.rows.forEach(row => {
      console.log(`  - ${row.role}`);
    });

    client.release();

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
};

checkConstraints();

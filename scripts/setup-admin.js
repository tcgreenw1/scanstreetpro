const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const setupAdmin = async () => {
  console.log('🚀 Setting up admin user...');

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
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to database');

    // Check if admin organization exists
    const orgQuery = 'SELECT id FROM organizations WHERE slug = $1';
    const orgResult = await client.query(orgQuery, ['admin-org']);

    let orgId;
    if (orgResult.rows.length === 0) {
      // Create admin organization
      const createOrgQuery = `
        INSERT INTO organizations (name, slug, plan, created_at, updated_at) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING id
      `;
      const newOrgResult = await client.query(createOrgQuery, [
        'Admin Organization',
        'admin-org',
        'premium'
      ]);
      orgId = newOrgResult.rows[0].id;
      console.log('✅ Created admin organization');
    } else {
      orgId = orgResult.rows[0].id;
      console.log('ℹ️ Admin organization already exists');
    }

    // Check if admin user exists
    const adminEmail = 'admin@scanstreetpro.com';
    const userQuery = 'SELECT id FROM users WHERE email = $1';
    const userResult = await client.query(userQuery, [adminEmail]);

    if (userResult.rows.length === 0) {
      // Create admin user
      const adminPassword = 'zobfig-mirme9-qiMdas'; // The password you're trying to use
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

      const createUserQuery = `
        INSERT INTO users (email, password_hash, name, role, organization_id, is_active, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING id, email, role
      `;

      const newUserResult = await client.query(createUserQuery, [
        adminEmail,
        passwordHash,
        'System Administrator',
        'admin',
        orgId
      ]);

      console.log('✅ Created admin user:', newUserResult.rows[0]);
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    } else {
      // Update existing admin user password
      const adminPassword = 'zobfig-mirme9-qiMdas';
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

      await client.query(
        'UPDATE users SET password_hash = $1, role = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3',
        [passwordHash, 'admin', adminEmail]
      );

      console.log('✅ Updated admin user password');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    }

    client.release();
    console.log('🎉 Admin setup complete!');

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

setupAdmin();

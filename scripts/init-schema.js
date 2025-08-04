import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://neon_owner:npg_SylBRYLFrwWO@ep-square-art-a5vdlgco.us-east-2.aws.neon.tech/neon?sslmode=require'
  });

  try {
    await client.connect();
    console.log('Connected to Neon database');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'server', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await client.query(schema);
    console.log('✅ Database schema initialized successfully');

  } catch (error) {
    console.error('❌ Error initializing schema:', error.message);
  } finally {
    await client.end();
  }
}

initializeSchema();

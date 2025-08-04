import { Pool } from 'pg';

let pool: Pool | null = null;
let connectionFailed = false;

export function getPool() {
  if (connectionFailed) {
    throw new Error('Database connection is unavailable');
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        // Add connection timeout and retry settings
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        max: 10,
      });

      // Test connection on creation
      pool.on('error', (err) => {
        console.error('Database pool error:', err);
        connectionFailed = true;
      });

    } catch (error) {
      console.error('Failed to create database pool:', error);
      connectionFailed = true;
      throw new Error('Database connection is unavailable');
    }
  }
  
  return pool;
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    connectionFailed = true;
    return false;
  }
}

export function isDatabaseAvailable(): boolean {
  return !connectionFailed && !!process.env.DATABASE_URL;
}

export function resetConnectionState() {
  connectionFailed = false;
  pool = null;
}

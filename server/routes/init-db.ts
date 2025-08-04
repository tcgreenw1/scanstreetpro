import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// POST /api/init-db - Initialize database schema
router.post('/init-db', async (req: Request, res: Response) => {
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await pool.query(schema);

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

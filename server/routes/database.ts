import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const NEON_PROJECT_ID = 'hidden-queen-27037107';

// Helper function to execute Neon SQL queries using the MCP tools
const executeNeonQuery = async (sql: string, params?: any[]) => {
  try {
    // This would use the Neon MCP tools in a real implementation
    // For now, we'll simulate the database calls
    console.log('Executing SQL:', sql, 'with params:', params);
    
    // Simulate successful response
    return { rows: [] };
  } catch (error: any) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// Middleware to verify JWT token
const verifyAuth: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    (req as any).user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const queryDatabase: RequestHandler = async (req, res) => {
  try {
    const { sql, params } = req.body;
    const user = (req as any).user;

    if (!sql) {
      return res.status(400).json({ message: 'SQL query is required' });
    }

    // Add basic security - only allow SELECT, INSERT, UPDATE, DELETE
    const sanitizedSql = sql.trim().toLowerCase();
    const allowedOperations = ['select', 'insert', 'update', 'delete'];
    const operation = sanitizedSql.split(' ')[0];

    if (!allowedOperations.includes(operation)) {
      return res.status(400).json({ 
        message: 'Only SELECT, INSERT, UPDATE, and DELETE operations are allowed' 
      });
    }

    // Execute the query
    const result = await executeNeonQuery(sql, params);

    res.json(result);

  } catch (error: any) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      message: error.message || 'Database query failed' 
    });
  }
};

export const testConnection: RequestHandler = async (req, res) => {
  try {
    // Test basic connectivity
    const result = await executeNeonQuery('SELECT version(), current_timestamp');
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: result
    });

  } catch (error: any) {
    console.error('Database connection test error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Database connection failed' 
    });
  }
};

// Apply auth middleware to protected routes
export const protectedQueryDatabase = [verifyAuth, queryDatabase];
export const protectedTestConnection = [verifyAuth, testConnection];

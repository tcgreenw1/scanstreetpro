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

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Middleware to verify admin access
const authenticateAdmin = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    if (decoded.role !== 'admin' && decoded.role !== 'manager') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Convert data to CSV format
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Convert data to JSON format
const convertToJSON = (data: any[]): string => {
  return JSON.stringify(data, null, 2);
};

// GET /api/export/organizations - Export organizations data
router.get('/organizations', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { format = 'csv' } = req.query;
    const pool = getPool();
    
    const result = await pool.query(`
      SELECT 
        o.id, o.name, o.plan, o.created_at, o.updated_at,
        COUNT(u.id) as user_count
      FROM organizations o
      LEFT JOIN users u ON o.id = u.organization_id
      GROUP BY o.id, o.name, o.plan, o.created_at, o.updated_at
      ORDER BY o.created_at DESC
    `);
    
    const data = result.rows.map(row => ({
      ...row,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null
    }));
    
    let output: string;
    let contentType: string;
    let filename: string;
    
    switch (format) {
      case 'json':
        output = convertToJSON(data);
        contentType = 'application/json';
        filename = `organizations_${Date.now()}.json`;
        break;
      case 'csv':
      default:
        output = convertToCSV(data);
        contentType = 'text/csv';
        filename = `organizations_${Date.now()}.csv`;
        break;
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(output);
    
  } catch (error: any) {
    console.error('Export organizations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export organizations'
    });
  }
});

// GET /api/export/users - Export users data
router.get('/users', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { format = 'csv' } = req.query;
    const pool = getPool();
    
    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.role, u.created_at,
        o.name as organization_name, o.plan as organization_plan
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      ORDER BY u.created_at DESC
    `);
    
    const data = result.rows.map(row => ({
      ...row,
      created_at: new Date(row.created_at).toISOString()
    }));
    
    let output: string;
    let contentType: string;
    let filename: string;
    
    switch (format) {
      case 'json':
        output = convertToJSON(data);
        contentType = 'application/json';
        filename = `users_${Date.now()}.json`;
        break;
      case 'csv':
      default:
        output = convertToCSV(data);
        contentType = 'text/csv';
        filename = `users_${Date.now()}.csv`;
        break;
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(output);
    
  } catch (error: any) {
    console.error('Export users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export users'
    });
  }
});

// GET /api/export/transactions - Export transactions data
router.get('/transactions', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { format = 'csv' } = req.query;
    const pool = getPool();
    
    try {
      const result = await pool.query(`
        SELECT 
          t.id, t.amount, t.currency, t.type, t.status, t.description,
          t.created_at, t.completed_at,
          o.name as organization_name, o.plan as organization_plan
        FROM transactions t
        LEFT JOIN organizations o ON t.organization_id = o.id
        ORDER BY t.created_at DESC
      `);
      
      const data = result.rows.map(row => ({
        ...row,
        amount: row.amount / 100, // Convert from cents to dollars
        created_at: new Date(row.created_at).toISOString(),
        completed_at: row.completed_at ? new Date(row.completed_at).toISOString() : null
      }));
      
      let output: string;
      let contentType: string;
      let filename: string;
      
      switch (format) {
        case 'json':
          output = convertToJSON(data);
          contentType = 'application/json';
          filename = `transactions_${Date.now()}.json`;
          break;
        case 'csv':
        default:
          output = convertToCSV(data);
          contentType = 'text/csv';
          filename = `transactions_${Date.now()}.csv`;
          break;
      }
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(output);
      
    } catch (dbError: any) {
      // If transactions table doesn't exist, return empty data
      if (dbError.code === '42P01') {
        const emptyData: any[] = [];
        let output: string;
        let contentType: string;
        let filename: string;
        
        switch (format) {
          case 'json':
            output = convertToJSON(emptyData);
            contentType = 'application/json';
            filename = `transactions_${Date.now()}.json`;
            break;
          case 'csv':
          default:
            output = 'No transaction data available';
            contentType = 'text/csv';
            filename = `transactions_${Date.now()}.csv`;
            break;
        }
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(output);
      } else {
        throw dbError;
      }
    }
    
  } catch (error: any) {
    console.error('Export transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export transactions'
    });
  }
});

// GET /api/export/analytics - Export analytics data
router.get('/analytics', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { format = 'csv' } = req.query;
    const pool = getPool();
    
    // Get comprehensive analytics data
    const [orgResult, userResult, planResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM organizations'),
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT plan, COUNT(*) as count FROM organizations GROUP BY plan')
    ]);
    
    let revenueData = { total: 0, monthly: 0 };
    try {
      const revenueResult = await pool.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total,
          COALESCE(SUM(CASE WHEN status = 'completed' AND created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END), 0) as monthly
        FROM transactions
      `);
      revenueData = {
        total: parseInt(revenueResult.rows[0].total) / 100,
        monthly: parseInt(revenueResult.rows[0].monthly) / 100
      };
    } catch (error) {
      // Transactions table doesn't exist, use fallback
    }
    
    const analyticsData = [
      {
        metric: 'Total Organizations',
        value: parseInt(orgResult.rows[0].count),
        category: 'Organizations'
      },
      {
        metric: 'Total Users',
        value: parseInt(userResult.rows[0].count),
        category: 'Users'
      },
      {
        metric: 'Total Revenue',
        value: revenueData.total,
        category: 'Revenue'
      },
      {
        metric: 'Monthly Revenue',
        value: revenueData.monthly,
        category: 'Revenue'
      },
      ...planResult.rows.map(row => ({
        metric: `${row.plan.charAt(0).toUpperCase() + row.plan.slice(1)} Plan`,
        value: parseInt(row.count),
        category: 'Plan Distribution'
      }))
    ];
    
    let output: string;
    let contentType: string;
    let filename: string;
    
    switch (format) {
      case 'json':
        output = convertToJSON(analyticsData);
        contentType = 'application/json';
        filename = `analytics_${Date.now()}.json`;
        break;
      case 'csv':
      default:
        output = convertToCSV(analyticsData);
        contentType = 'text/csv';
        filename = `analytics_${Date.now()}.csv`;
        break;
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(output);
    
  } catch (error: any) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics'
    });
  }
});

export default router;

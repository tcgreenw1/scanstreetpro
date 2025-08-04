import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Check if user is admin or manager (both have admin access)
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

// GET /api/admin/stats - Get admin dashboard stats
router.get('/stats', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const pool = getPool();
    
    // Get total organizations
    const orgResult = await pool.query('SELECT COUNT(*) as count FROM organizations');
    const totalOrganizations = parseInt(orgResult.rows[0].count);
    
    // Get total users
    const userResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(userResult.rows[0].count);
    
    // Get plan distribution
    const planResult = await pool.query(`
      SELECT plan, COUNT(*) as count 
      FROM organizations 
      GROUP BY plan
    `);
    
    const planDistribution: Record<string, number> = {};
    planResult.rows.forEach(row => {
      planDistribution[row.plan] = parseInt(row.count);
    });
    
    // Calculate monthly revenue from actual transactions (fallback if table doesn't exist)
    let monthlyRevenue = 0;
    try {
      const revenueResult = await pool.query(`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE status = 'completed'
        AND type IN ('payment', 'upgrade')
        AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
      `);
      monthlyRevenue = parseInt(revenueResult.rows[0].total) / 100; // Convert from cents
    } catch (error: any) {
      // Fallback calculation if transactions table doesn't exist
      monthlyRevenue =
        (planDistribution.basic || 0) * 99 +
        (planDistribution.pro || 0) * 199 +
        (planDistribution.premium || 0) * 999;
    }
    
    // Get additional stats
    const transactionResult = await pool.query(`
      SELECT
        COUNT(*) as total_transactions,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_revenue
      FROM transactions
    `);

    const totalTransactions = parseInt(transactionResult.rows[0].total_transactions);
    const totalRevenue = parseInt(transactionResult.rows[0].total_revenue) / 100;

    res.json({
      success: true,
      data: {
        totalOrganizations,
        totalUsers,
        monthlyRevenue,
        totalRevenue,
        totalTransactions,
        planDistribution
      }
    });
    
  } catch (error: any) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get admin stats'
    });
  }
});

// GET /api/admin/organizations - Get all organizations
router.get('/organizations', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const pool = getPool();
    
    const result = await pool.query(`
      SELECT 
        o.id, o.name, o.slug, o.plan, o.settings, o.created_at, o.updated_at,
        COUNT(u.id) as user_count
      FROM organizations o
      LEFT JOIN users u ON o.id = u.organization_id
      GROUP BY o.id, o.name, o.slug, o.plan, o.settings, o.created_at, o.updated_at
      ORDER BY o.created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error: any) {
    console.error('Get organizations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get organizations'
    });
  }
});

// GET /api/admin/users - Get all users
router.get('/users', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const pool = getPool();
    
    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.role, u.organization_id, u.created_at,
        o.name as organization_name, o.plan as organization_plan
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      ORDER BY u.created_at DESC
    `);
    
    const users = result.rows.map(row => ({
      id: row.id,
      email: row.email,
      name: row.email.split('@')[0], // Derive name from email for now
      role: row.role,
      organization_id: row.organization_id,
      phone: null,
      is_active: true,
      last_login: null,
      created_at: row.created_at,
      organization: {
        id: row.organization_id,
        name: row.organization_name,
        plan: row.organization_plan
      }
    }));
    
    res.json({
      success: true,
      data: users
    });
    
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
    });
  }
});

// PUT /api/admin/organizations/:id/plan - Update organization plan
router.put('/organizations/:id/plan', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;
    
    if (!plan || !['free', 'basic', 'pro', 'premium'].includes(plan)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan specified'
      });
    }
    
    const pool = getPool();
    
    const result = await pool.query(
      'UPDATE organizations SET plan = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [plan, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Organization plan updated successfully'
    });
    
  } catch (error: any) {
    console.error('Update organization plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update organization plan'
    });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role || !['admin', 'manager', 'member'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role specified'
      });
    }
    
    const pool = getPool();
    
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      [role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'User role updated successfully'
    });
    
  } catch (error: any) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  }
});

// POST /api/admin/users - Create new user
router.post('/users', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, password, name, organization_id, role, phone } = req.body;
    
    if (!email || !password || !organization_id) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and organization_id are required'
      });
    }
    
    const pool = getPool();
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, organization_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, role, organization_id, created_at`,
      [email, passwordHash, role || 'member', organization_id]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'User created successfully'
    });
    
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// DELETE /api/admin/organizations/:id - Delete organization
router.delete('/organizations/:id', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    // Delete organization (users will be cascade deleted)
    const result = await pool.query('DELETE FROM organizations WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Organization deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Delete organization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete organization'
    });
  }
});

// POST /api/admin/organizations - Create new organization
router.post('/organizations', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { name, plan = 'free' } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Organization name is required'
      });
    }

    const pool = getPool();

    // Create organization
    const result = await pool.query(
      `INSERT INTO organizations (name, plan)
       VALUES ($1, $2)
       RETURNING *`,
      [name, plan]
    );

    // Create default subscription
    await pool.query(
      `INSERT INTO subscriptions (organization_id, plan, price, status)
       VALUES ($1, $2, $3, 'active')`,
      [result.rows[0].id, plan, plan === 'free' ? 0 : (plan === 'basic' ? 9900 : plan === 'pro' ? 19900 : 99900)]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Organization created successfully'
    });

  } catch (error: any) {
    console.error('Create organization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create organization'
    });
  }
});

// PUT /api/admin/organizations/:id - Update organization
router.put('/organizations/:id', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { name, plan } = req.body;

    const pool = getPool();

    const result = await pool.query(
      'UPDATE organizations SET name = COALESCE($1, name), plan = COALESCE($2, plan), updated_at = NOW() WHERE id = $3 RETURNING *',
      [name, plan, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Organization updated successfully'
    });

  } catch (error: any) {
    console.error('Update organization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update organization'
    });
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { email, role, organization_id } = req.body;

    const pool = getPool();

    const result = await pool.query(
      `UPDATE users SET
       email = COALESCE($1, email),
       role = COALESCE($2, role),
       organization_id = COALESCE($3, organization_id)
       WHERE id = $4
       RETURNING id, email, role, organization_id, created_at`,
      [email, role, organization_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'User updated successfully'
    });

  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// GET /api/admin/transactions - Get financial transactions
router.get('/transactions', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { page = 1, limit = 50, status, type } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const pool = getPool();

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (status) {
      params.push(status);
      whereClause += ` AND status = $${params.length}`;
    }

    if (type) {
      params.push(type);
      whereClause += ` AND type = $${params.length}`;
    }

    params.push(parseInt(limit as string), offset);

    const result = await pool.query(`
      SELECT
        t.*,
        o.name as organization_name,
        o.plan as organization_plan
      FROM transactions t
      LEFT JOIN organizations o ON t.organization_id = o.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    // Get total count
    const countResult = await pool.query(`
      SELECT COUNT(*) as total
      FROM transactions t
      ${whereClause}
    `, params.slice(0, -2));

    res.json({
      success: true,
      data: {
        transactions: result.rows,
        total: parseInt(countResult.rows[0].total),
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    });

  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get transactions'
    });
  }
});

// POST /api/admin/transactions - Create transaction (for manual entries)
router.post('/transactions', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { organization_id, amount, type, description } = req.body;

    if (!organization_id || !amount || !type) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID, amount, and type are required'
      });
    }

    const pool = getPool();

    const result = await pool.query(
      `INSERT INTO transactions (organization_id, amount, type, status, description, completed_at)
       VALUES ($1, $2, $3, 'completed', $4, NOW())
       RETURNING *`,
      [organization_id, Math.round(amount * 100), type, description]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Transaction created successfully'
    });

  } catch (error: any) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
});

// GET /api/admin/revenue-analytics - Get revenue analytics
router.get('/revenue-analytics', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const pool = getPool();

    // Monthly revenue trend (last 12 months)
    const monthlyResult = await pool.query(`
      SELECT
        DATE_TRUNC('month', created_at) as month,
        SUM(CASE WHEN status = 'completed' AND type IN ('payment', 'upgrade') THEN amount ELSE 0 END) as revenue,
        COUNT(*) as transactions
      FROM transactions
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    // Revenue by plan
    const planRevenueResult = await pool.query(`
      SELECT
        o.plan,
        SUM(CASE WHEN t.status = 'completed' AND t.type IN ('payment', 'upgrade') THEN t.amount ELSE 0 END) as revenue,
        COUNT(*) as transactions
      FROM transactions t
      JOIN organizations o ON t.organization_id = o.id
      WHERE t.created_at >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY o.plan
    `);

    // Top customers by revenue
    const topCustomersResult = await pool.query(`
      SELECT
        o.name,
        o.plan,
        SUM(CASE WHEN t.status = 'completed' AND t.type IN ('payment', 'upgrade') THEN t.amount ELSE 0 END) as total_revenue,
        COUNT(*) as transactions
      FROM transactions t
      JOIN organizations o ON t.organization_id = o.id
      GROUP BY o.id, o.name, o.plan
      ORDER BY total_revenue DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        monthlyTrend: monthlyResult.rows.map(row => ({
          month: row.month,
          revenue: parseInt(row.revenue) / 100,
          transactions: parseInt(row.transactions)
        })),
        planRevenue: planRevenueResult.rows.map(row => ({
          plan: row.plan,
          revenue: parseInt(row.revenue) / 100,
          transactions: parseInt(row.transactions)
        })),
        topCustomers: topCustomersResult.rows.map(row => ({
          name: row.name,
          plan: row.plan,
          revenue: parseInt(row.total_revenue) / 100,
          transactions: parseInt(row.transactions)
        }))
      }
    });

  } catch (error: any) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get revenue analytics'
    });
  }
});

// GET /api/admin/settings - Get system settings
router.get('/settings', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const pool = getPool();

    const result = await pool.query('SELECT * FROM system_settings ORDER BY key');

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error: any) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get settings'
    });
  }
});

// PUT /api/admin/settings/:key - Update system setting
router.put('/settings/:key', authenticateAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Value is required'
      });
    }

    const pool = getPool();

    const result = await pool.query(
      'UPDATE system_settings SET value = $1, updated_at = NOW() WHERE key = $2 RETURNING *',
      [value, key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Setting updated successfully'
    });

  } catch (error: any) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update setting'
    });
  }
});

export default router;

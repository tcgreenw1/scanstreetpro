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
    
    // Calculate monthly revenue (mock calculation)
    const monthlyRevenue = 
      (planDistribution.basic || 0) * 99 + 
      (planDistribution.pro || 0) * 199 + 
      (planDistribution.premium || 0) * 999;
    
    res.json({
      success: true,
      data: {
        totalOrganizations,
        totalUsers,
        monthlyRevenue,
        totalAssets: 0, // Mock for now
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

export default router;

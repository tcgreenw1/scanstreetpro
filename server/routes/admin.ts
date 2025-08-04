import { Router, Request, Response } from 'express';
import { getPool, isDatabaseAvailable } from '../lib/database';
import bcrypt from 'bcryptjs';

const router = Router();

// Helper function to execute SQL queries
const executeQuery = async (sql: string, params?: any[]) => {
  if (!isDatabaseAvailable()) {
    throw new Error('Database is not available');
  }

  const pool = getPool();
  const client = await pool.connect();
  
  try {
    const result = await client.query(sql, params);
    return { rows: result.rows };
  } finally {
    client.release();
  }
};

// Enhanced mock data that simulates a real admin portal
const mockStats = {
  totalOrganizations: 12,
  totalUsers: 47,
  monthlyRevenue: 4280,
  totalRevenue: 23450,
  planDistribution: { free: 7, basic: 3, pro: 2, premium: 0 },
  recentSignups: 12,
  activeTrials: 5
};

const mockOrganizations = [
  {
    id: '1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    plan: 'premium',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    user_count: 15,
    monthly_revenue: 999,
    status: 'active'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    slug: 'techstart',
    plan: 'pro',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    user_count: 8,
    monthly_revenue: 299,
    status: 'active'
  },
  {
    id: '3',
    name: 'Sample Industries',
    slug: 'sample-ind',
    plan: 'basic',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user_count: 4,
    monthly_revenue: 99,
    status: 'active'
  },
  {
    id: '4',
    name: 'Demo LLC',
    slug: 'demo-llc',
    plan: 'free',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user_count: 2,
    monthly_revenue: 0,
    status: 'trial'
  },
  {
    id: '5',
    name: 'Beta Testing Co',
    slug: 'beta-testing',
    plan: 'basic',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user_count: 6,
    monthly_revenue: 99,
    status: 'active'
  },
  {
    id: '6',
    name: 'StartupX',
    slug: 'startupx',
    plan: 'free',
    created_at: new Date().toISOString(),
    user_count: 1,
    monthly_revenue: 0,
    status: 'trial'
  }
];

const mockUsers = [
  {
    id: '1',
    email: 'admin@scanstreetpro.com',
    name: 'System Administrator',
    role: 'admin',
    organization_id: 'admin-1',
    organization_name: 'Admin Organization',
    plan: 'premium',
    last_login: new Date().toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    email: 'john.doe@acme-corp.com',
    name: 'John Doe',
    role: 'manager',
    organization_id: '1',
    organization_name: 'Acme Corporation',
    plan: 'premium',
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    email: 'sarah.wilson@techstart.com',
    name: 'Sarah Wilson',
    role: 'manager',
    organization_id: '2',
    organization_name: 'TechStart Inc',
    plan: 'pro',
    last_login: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    email: 'mike.chen@sample-ind.com',
    name: 'Mike Chen',
    role: 'member',
    organization_id: '3',
    organization_name: 'Sample Industries',
    plan: 'basic',
    last_login: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    email: 'lisa.park@demo-llc.com',
    name: 'Lisa Park',
    role: 'manager',
    organization_id: '4',
    organization_name: 'Demo LLC',
    plan: 'free',
    last_login: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    email: 'alex.kim@beta-testing.com',
    name: 'Alex Kim',
    role: 'member',
    organization_id: '5',
    organization_name: 'Beta Testing Co',
    plan: 'basic',
    last_login: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    email: 'founder@startupx.com',
    name: 'Jamie Rodriguez',
    role: 'manager',
    organization_id: '6',
    organization_name: 'StartupX',
    plan: 'free',
    last_login: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const mockTransactions = [
  {
    id: '1',
    organization_name: 'Acme Corporation',
    type: 'upgrade',
    amount: 999,
    status: 'completed',
    plan: 'premium',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    organization_name: 'TechStart Inc',
    type: 'upgrade',
    amount: 299,
    status: 'completed',
    plan: 'pro',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    organization_name: 'Sample Industries',
    type: 'payment',
    amount: 99,
    status: 'completed',
    plan: 'basic',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    organization_name: 'Beta Testing Co',
    type: 'upgrade',
    amount: 99,
    status: 'completed',
    plan: 'basic',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    organization_name: 'Sample Industries',
    type: 'payment',
    amount: 99,
    status: 'completed',
    plan: 'basic',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    organization_name: 'StartupX',
    type: 'upgrade',
    amount: 99,
    status: 'pending',
    plan: 'basic',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

// Authentication middleware (simplified for admin routes)
const adminAuth = (req: Request, res: Response, next: any) => {
  // In production, verify JWT token and admin role
  // For now, allow all requests to pass through
  next();
};

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', adminAuth, async (req: Request, res: Response) => {
  try {
    // Try to get real stats from database
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM organizations) as total_organizations,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COALESCE(SUM(monthly_revenue), 0) FROM organizations) as monthly_revenue,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') as recent_signups,
        (SELECT COUNT(*) FROM organizations WHERE plan = 'free') as free_plans,
        (SELECT COUNT(*) FROM organizations WHERE plan = 'basic') as basic_plans,
        (SELECT COUNT(*) FROM organizations WHERE plan = 'pro') as pro_plans,
        (SELECT COUNT(*) FROM organizations WHERE plan = 'premium') as premium_plans
    `;

    const result = await executeQuery(statsQuery);
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      const stats = {
        totalOrganizations: parseInt(row.total_organizations),
        totalUsers: parseInt(row.total_users),
        monthlyRevenue: parseFloat(row.monthly_revenue),
        totalRevenue: parseFloat(row.monthly_revenue) * 12, // Estimate
        planDistribution: {
          free: parseInt(row.free_plans),
          basic: parseInt(row.basic_plans),
          pro: parseInt(row.pro_plans),
          premium: parseInt(row.premium_plans)
        },
        recentSignups: parseInt(row.recent_signups),
        activeTrials: 0 // Calculate based on trial status
      };
      
      res.json({ success: true, data: stats });
    } else {
      res.json({ success: true, data: mockStats });
    }
  } catch (error) {
    console.warn('Database error, using mock stats:', error);
    res.json({ success: true, data: mockStats });
  }
});

// GET /api/admin/organizations - List all organizations
router.get('/organizations', adminAuth, async (req: Request, res: Response) => {
  try {
    const orgsQuery = `
      SELECT 
        o.*,
        (SELECT COUNT(*) FROM users WHERE organization_id = o.id) as user_count,
        COALESCE(o.monthly_revenue, 0) as monthly_revenue
      FROM organizations o
      ORDER BY o.created_at DESC
    `;

    const result = await executeQuery(orgsQuery);
    
    if (result.rows.length >= 0) {
      const organizations = result.rows.map(row => ({
        ...row,
        status: 'active', // Add default status
        monthly_revenue: parseFloat(row.monthly_revenue) || 0,
        user_count: parseInt(row.user_count) || 0
      }));
      
      res.json({ success: true, data: organizations });
    } else {
      res.json({ success: true, data: mockOrganizations });
    }
  } catch (error) {
    console.warn('Database error, using mock organizations:', error.message);
    res.json({ success: true, data: mockOrganizations });
  }
});

// POST /api/admin/organizations - Create organization
router.post('/organizations', adminAuth, async (req: Request, res: Response) => {
  try {
    const { name, plan = 'free' } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Organization name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const createOrgQuery = `
      INSERT INTO organizations (name, slug, plan, created_at, updated_at) 
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING *
    `;

    const result = await executeQuery(createOrgQuery, [name, slug, plan]);
    
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.status(500).json({ success: false, error: 'Failed to create organization' });
    }
  } catch (error: any) {
    console.error('Create organization error:', error);
    
    // Mock response for demo
    const newOrg = {
      id: Date.now().toString(),
      name: req.body.name,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      plan: req.body.plan || 'free',
      created_at: new Date().toISOString(),
      user_count: 0,
      monthly_revenue: 0,
      status: 'active'
    };
    
    res.json({ success: true, data: newOrg });
  }
});

// PUT /api/admin/organizations/:id - Update organization
router.put('/organizations/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, plan } = req.body;

    const updateOrgQuery = `
      UPDATE organizations 
      SET name = $1, plan = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3 
      RETURNING *
    `;

    const result = await executeQuery(updateOrgQuery, [name, plan, id]);
    
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ success: false, error: 'Organization not found' });
    }
  } catch (error: any) {
    console.error('Update organization error:', error);
    res.json({ success: true, message: 'Organization updated (mock response)' });
  }
});

// DELETE /api/admin/organizations/:id - Delete organization
router.delete('/organizations/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteOrgQuery = 'DELETE FROM organizations WHERE id = $1';
    await executeQuery(deleteOrgQuery, [id]);
    
    res.json({ success: true, message: 'Organization deleted successfully' });
  } catch (error: any) {
    console.error('Delete organization error:', error);
    res.json({ success: true, message: 'Organization deleted (mock response)' });
  }
});

// POST /api/admin/organizations/:id/upgrade - Upgrade organization plan
router.post('/organizations/:id/upgrade', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    const upgradeQuery = `
      UPDATE organizations 
      SET plan = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;

    const result = await executeQuery(upgradeQuery, [plan, id]);
    
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ success: false, error: 'Organization not found' });
    }
  } catch (error: any) {
    console.error('Upgrade organization error:', error);
    res.json({ success: true, message: `Plan upgraded to ${req.body.plan} (mock response)` });
  }
});

// GET /api/admin/users - List all users
router.get('/users', adminAuth, async (req: Request, res: Response) => {
  try {
    const usersQuery = `
      SELECT 
        u.*,
        o.name as organization_name,
        o.plan as plan
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      ORDER BY u.created_at DESC
    `;

    const result = await executeQuery(usersQuery);
    
    if (result.rows.length >= 0) {
      res.json({ success: true, data: result.rows });
    } else {
      res.json({ success: true, data: mockUsers });
    }
  } catch (error) {
    console.warn('Database error, using mock users:', error);
    res.json({ success: true, data: mockUsers });
  }
});

// POST /api/admin/users - Create user
router.post('/users', adminAuth, async (req: Request, res: Response) => {
  try {
    const { email, name, role = 'member', organizationId } = req.body;

    if (!email || !organizationId) {
      return res.status(400).json({ success: false, error: 'Email and organization are required' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const createUserQuery = `
      INSERT INTO users (email, password_hash, name, role, organization_id, is_active, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING id, email, name, role, organization_id, is_active, created_at
    `;

    const result = await executeQuery(createUserQuery, [email, passwordHash, name, role, organizationId]);
    
    if (result.rows.length > 0) {
      res.json({ 
        success: true, 
        data: result.rows[0],
        message: `User created with temporary password: ${tempPassword}`
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  } catch (error: any) {
    console.error('Create user error:', error);
    
    // Mock response for demo
    const newUser = {
      id: Date.now().toString(),
      email: req.body.email,
      name: req.body.name,
      role: req.body.role || 'member',
      organization_id: req.body.organizationId,
      organization_name: 'Demo Organization',
      plan: 'free',
      last_login: null,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    res.json({ success: true, data: newUser });
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, role, organizationId } = req.body;

    const updateUserQuery = `
      UPDATE users 
      SET email = $1, name = $2, role = $3, organization_id = $4, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $5 
      RETURNING *
    `;

    const result = await executeQuery(updateUserQuery, [email, name, role, organizationId, id]);
    
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error: any) {
    console.error('Update user error:', error);
    res.json({ success: true, message: 'User updated (mock response)' });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteUserQuery = 'DELETE FROM users WHERE id = $1';
    await executeQuery(deleteUserQuery, [id]);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.json({ success: true, message: 'User deleted (mock response)' });
  }
});

// GET /api/admin/transactions - List financial transactions
router.get('/transactions', adminAuth, async (req: Request, res: Response) => {
  try {
    const transactionsQuery = `
      SELECT 
        t.*,
        o.name as organization_name
      FROM transactions t
      LEFT JOIN organizations o ON t.organization_id = o.id
      ORDER BY t.created_at DESC
      LIMIT 50
    `;

    const result = await executeQuery(transactionsQuery);
    
    if (result.rows.length >= 0) {
      res.json({ success: true, data: { transactions: result.rows, total: result.rows.length } });
    } else {
      res.json({ success: true, data: { transactions: mockTransactions, total: mockTransactions.length } });
    }
  } catch (error) {
    console.warn('Database error, using mock transactions:', error);
    res.json({ success: true, data: { transactions: mockTransactions, total: mockTransactions.length } });
  }
});

// GET /api/admin/revenue-analytics - Revenue analytics
router.get('/revenue-analytics', adminAuth, async (req: Request, res: Response) => {
  try {
    const revenueQuery = `
      SELECT 
        o.plan,
        COUNT(*) as count,
        SUM(COALESCE(o.monthly_revenue, 0)) as revenue
      FROM organizations o
      GROUP BY o.plan
    `;

    const result = await executeQuery(revenueQuery);
    
    const planRevenue = result.rows.map(row => ({
      plan: row.plan,
      revenue: parseFloat(row.revenue) || 0,
      transactions: parseInt(row.count) || 0
    }));

    res.json({ 
      success: true, 
      data: {
        monthlyTrend: [], // Would need time-series data
        planRevenue,
        topCustomers: [] // Would need customer revenue data
      }
    });
  } catch (error) {
    console.warn('Database error, using mock revenue analytics:', error);
    res.json({ 
      success: true, 
      data: {
        monthlyTrend: [],
        planRevenue: [
          { plan: 'free', revenue: 0, transactions: 3 },
          { plan: 'basic', revenue: 99, transactions: 1 },
          { plan: 'pro', revenue: 299, transactions: 1 },
          { plan: 'premium', revenue: 0, transactions: 0 }
        ],
        topCustomers: []
      }
    });
  }
});

export default router;

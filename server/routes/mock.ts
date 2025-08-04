import { Router, Request, Response } from 'express';

const router = Router();

// Mock data for when database is unavailable
const mockStats = {
  totalOrganizations: 5,
  totalUsers: 25,
  monthlyRevenue: 2500,
  totalRevenue: 15000,
  totalTransactions: 150,
  planDistribution: { 
    free: 3, 
    basic: 1, 
    pro: 1, 
    premium: 0 
  }
};

const mockOrganizations = [
  {
    id: '1',
    name: 'Demo Organization',
    slug: 'demo-org',
    plan: 'free',
    created_at: new Date().toISOString(),
    user_count: 5
  },
  {
    id: '2',
    name: 'Sample Company',
    slug: 'sample-co',
    plan: 'basic',
    created_at: new Date().toISOString(),
    user_count: 10
  }
];

const mockUsers = [
  {
    id: '1',
    email: 'admin@demo.com',
    name: 'Demo Admin',
    role: 'admin',
    organization_id: '1',
    created_at: new Date().toISOString(),
    organization: {
      id: '1',
      name: 'Demo Organization',
      plan: 'free'
    }
  },
  {
    id: '2',
    email: 'user@sample.com',
    name: 'Sample User',
    role: 'member',
    organization_id: '2',
    created_at: new Date().toISOString(),
    organization: {
      id: '2',
      name: 'Sample Company',
      plan: 'basic'
    }
  }
];

// Mock admin user for testing
const mockAdminUser = {
  id: 'admin-1',
  email: 'admin@scanstreetpro.com',
  name: 'System Administrator',
  role: 'admin',
  organization_id: 'admin-org-1',
  is_active: true,
  created_at: new Date().toISOString(),
  org_name: 'Admin Organization',
  org_plan: 'premium'
};

// Mock authentication middleware (always passes)
const mockAuth = (req: Request, res: Response, next: any) => {
  (req as any).user = { id: '1', role: 'admin' };
  next();
};

// GET /api/mock/stats - Mock admin dashboard stats
router.get('/stats', mockAuth, async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockStats
  });
});

// GET /api/mock/organizations - Mock organizations
router.get('/organizations', mockAuth, async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockOrganizations
  });
});

// GET /api/mock/users - Mock users
router.get('/users', mockAuth, async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockUsers
  });
});

// GET /api/mock/transactions - Mock transactions
router.get('/transactions', mockAuth, async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      transactions: [],
      total: 0,
      page: 1,
      limit: 50
    }
  });
});

// GET /api/mock/revenue-analytics - Mock revenue analytics
router.get('/revenue-analytics', mockAuth, async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      monthlyTrend: [],
      planRevenue: [
        { plan: 'free', revenue: 0, transactions: 0 },
        { plan: 'basic', revenue: 99, transactions: 1 },
        { plan: 'pro', revenue: 0, transactions: 0 },
        { plan: 'premium', revenue: 0, transactions: 0 }
      ],
      topCustomers: []
    }
  });
});

// GET /api/mock/settings - Mock settings
router.get('/settings', mockAuth, async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: []
  });
});

// POST /api/mock/login - Mock login endpoint
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check for admin credentials
  if (email === 'admin@scanstreetpro.com' && password === 'zobfig-mirme9-qiMdas') {
    res.json({
      success: true,
      data: {
        user: mockAdminUser,
        organization: {
          id: mockAdminUser.organization_id,
          name: mockAdminUser.org_name,
          plan: mockAdminUser.org_plan
        },
        token: 'mock-admin-token-12345'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

// GET /api/mock/me - Mock user verification
router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (authHeader === 'Bearer mock-admin-token-12345') {
    res.json({
      success: true,
      data: {
        user: mockAdminUser,
        organization: {
          id: mockAdminUser.organization_id,
          name: mockAdminUser.org_name,
          plan: mockAdminUser.org_plan
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export default router;

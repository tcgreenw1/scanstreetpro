import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  organizationName?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// POST /api/signup - Create user and organization
router.post('/signup', async (req: Request, res: Response<ApiResponse>) => {
  const client = await getPool().connect();
  
  try {
    await client.query('BEGIN');
    
    const { email, password, fullName, organizationName }: SignupRequest = req.body;
    
    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required'
      });
    }
    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }
    
    // Check if email already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create organization
    const orgName = organizationName || `${fullName}'s Organization`;
    const orgSlug = `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const organizationResult = await client.query(
      `INSERT INTO organizations (name, slug, plan)
       VALUES ($1, $2, 'free')
       RETURNING id, name, slug, plan, created_at`,
      [orgName, orgSlug]
    );
    
    const organization = organizationResult.rows[0];
    
    // Create user as manager
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role, organization_id) 
       VALUES ($1, $2, 'manager', $3) 
       RETURNING id, email, role, organization_id, created_at`,
      [email.toLowerCase(), passwordHash, organization.id]
    );
    
    const user = userResult.rows[0];
    
    // Create subscription (free trial for 30 days)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);
    
    const subscriptionResult = await client.query(
      `INSERT INTO subscriptions (organization_id, plan, price, status, end_date) 
       VALUES ($1, 'free', 0, 'trial', $2) 
       RETURNING id, plan, status, start_date, end_date`,
      [organization.id, trialEndDate]
    );
    
    const subscription = subscriptionResult.rows[0];
    
    await client.query('COMMIT');
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organization_id
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organization_id,
          createdAt: user.created_at
        },
        organization: {
          id: organization.id,
          name: organization.name,
          plan: organization.plan,
          createdAt: organization.created_at
        },
        subscription: {
          id: subscription.id,
          plan: subscription.plan,
          status: subscription.status,
          startDate: subscription.start_date,
          endDate: subscription.end_date
        },
        token
      },
      message: 'Account created successfully'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Signup error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to create account. Please try again.'
    });
  } finally {
    client.release();
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Get user with organization data
    const result = await getPool().query(
      `SELECT u.id, u.email, u.password_hash, u.role, u.organization_id, u.created_at,
              o.name as organization_name, o.plan as organization_plan
       FROM users u
       JOIN organizations o ON u.organization_id = o.id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organization_id
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organization_id,
          createdAt: user.created_at
        },
        organization: {
          id: user.organization_id,
          name: user.organization_name,
          plan: user.organization_plan
        },
        token
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Get user with organization and subscription data
    const result = await getPool().query(
      `SELECT u.id, u.email, u.role, u.organization_id, u.created_at,
              o.name as organization_name, o.plan as organization_plan,
              s.status as subscription_status, s.end_date as subscription_end_date
       FROM users u
       JOIN organizations o ON u.organization_id = o.id
       LEFT JOIN subscriptions s ON o.id = s.organization_id AND s.status = 'active'
       WHERE u.id = $1`,
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const user = result.rows[0];
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organization_id,
          createdAt: user.created_at
        },
        organization: {
          id: user.organization_id,
          name: user.organization_name,
          plan: user.organization_plan
        },
        subscription: {
          status: user.subscription_status,
          endDate: user.subscription_end_date
        }
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export default router;

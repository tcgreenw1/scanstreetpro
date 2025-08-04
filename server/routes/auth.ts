import { RequestHandler } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In a real app, this would be from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const NEON_PROJECT_ID = 'hidden-queen-27037107';

// Helper function to execute Neon SQL queries
const executeNeonQuery = async (sql: string, params?: any[]) => {
  try {
    // This would be replaced with actual Neon SDK calls
    // For now, we'll simulate the database calls
    console.log('Executing SQL:', sql, 'with params:', params);
    
    // Simulate database response
    return { rows: [] };
  } catch (error: any) {
    throw new Error(`Database error: ${error.message}`);
  }
};

export const signIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const userQuery = `
      SELECT u.*, o.name as org_name, o.plan as org_plan 
      FROM users u 
      LEFT JOIN organizations o ON u.organization_id = o.id 
      WHERE u.email = $1 AND u.is_active = true
    `;

    const userResult = await executeNeonQuery(userQuery, [email]);

    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    const user = userResult.rows[0];

    // Verify password
    if (!user.password_hash) {
      return res.status(401).json({ 
        message: 'Account not properly configured. Please contact admin.' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    await executeNeonQuery(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        organizationId: user.organization_id
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password hash)
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });

  } catch (error: any) {
    console.error('Sign in error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

export const signUp: RequestHandler = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUser = await executeNeonQuery(existingUserQuery, [email]);

    if (existingUser.rows && existingUser.rows.length > 0) {
      return res.status(400).json({ 
        message: 'An account with this email already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create organization for the user (free plan)
    const orgName = name ? `${name}'s Organization` : `${email.split('@')[0]}'s Organization`;
    const orgSlug = `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const createOrgQuery = `
      INSERT INTO organizations (name, slug, plan) 
      VALUES ($1, $2, 'free') 
      RETURNING id
    `;

    const orgResult = await executeNeonQuery(createOrgQuery, [orgName, orgSlug]);
    
    if (!orgResult.rows || orgResult.rows.length === 0) {
      return res.status(500).json({ 
        message: 'Failed to create organization' 
      });
    }

    const organizationId = orgResult.rows[0].id;

    // Create user
    const createUserQuery = `
      INSERT INTO users (email, password_hash, name, role, organization_id, is_active) 
      VALUES ($1, $2, $3, 'manager', $4, true) 
      RETURNING id, email, name, role, organization_id, is_active, created_at
    `;

    const userResult = await executeNeonQuery(createUserQuery, [
      email,
      passwordHash,
      name || null,
      organizationId
    ]);

    if (!userResult.rows || userResult.rows.length === 0) {
      return res.status(500).json({ 
        message: 'Failed to create user account' 
      });
    }

    const newUser = userResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        role: newUser.role,
        organizationId: newUser.organization_id
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: newUser,
      token
    });

  } catch (error: any) {
    console.error('Sign up error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

export const verifyToken: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Fetch current user data
      const userQuery = `
        SELECT u.*, o.name as org_name, o.plan as org_plan 
        FROM users u 
        LEFT JOIN organizations o ON u.organization_id = o.id 
        WHERE u.id = $1 AND u.is_active = true
      `;

      const userResult = await executeNeonQuery(userQuery, [decoded.userId]);

      if (!userResult.rows || userResult.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const { password_hash, ...user } = userResult.rows[0];

      res.json({ user });

    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

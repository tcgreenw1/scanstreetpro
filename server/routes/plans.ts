import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const router = Router();

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// GET /api/plans/features - Get plan features for current user's organization
router.get('/features', authenticateToken, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user.userId;
    
    // Get user's organization plan
    const userResult = await pool.query(
      `SELECT o.plan 
       FROM users u 
       JOIN organizations o ON u.organization_id = o.id 
       WHERE u.id = $1`,
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User organization not found'
      });
    }
    
    const plan = userResult.rows[0].plan;
    
    // Get plan features
    const featuresResult = await pool.query(
      `SELECT feature_name, value 
       FROM plan_features 
       WHERE plan = $1`,
      [plan]
    );
    
    const features: { [key: string]: string } = {};
    featuresResult.rows.forEach(row => {
      features[row.feature_name] = row.value;
    });
    
    res.json({
      success: true,
      data: {
        plan,
        features
      }
    });
    
  } catch (error) {
    console.error('Get plan features error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get plan features'
    });
  }
});

// GET /api/plans/ui-rules - Get UI rules for current user's organization
router.get('/ui-rules', authenticateToken, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = (req as any).user.userId;
    
    // Get user's organization plan
    const userResult = await pool.query(
      `SELECT o.plan 
       FROM users u 
       JOIN organizations o ON u.organization_id = o.id 
       WHERE u.id = $1`,
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User organization not found'
      });
    }
    
    const plan = userResult.rows[0].plan;
    
    // Get UI rules
    const rulesResult = await pool.query(
      `SELECT component_name, visible, sample_data, show_crown 
       FROM ui_rules 
       WHERE plan = $1`,
      [plan]
    );
    
    const rules: { [key: string]: any } = {};
    rulesResult.rows.forEach(row => {
      rules[row.component_name] = {
        visible: row.visible,
        sample_data: row.sample_data,
        show_crown: row.show_crown
      };
    });
    
    res.json({
      success: true,
      data: {
        plan,
        rules
      }
    });
    
  } catch (error) {
    console.error('Get UI rules error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get UI rules'
    });
  }
});

// GET /api/plans/all-features - Get all plan features (for admin)
router.get('/all-features', authenticateToken, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const result = await pool.query(
      `SELECT plan, feature_name, value 
       FROM plan_features 
       ORDER BY plan, feature_name`
    );
    
    const planFeatures: { [key: string]: { [key: string]: string } } = {};
    
    result.rows.forEach(row => {
      if (!planFeatures[row.plan]) {
        planFeatures[row.plan] = {};
      }
      planFeatures[row.plan][row.feature_name] = row.value;
    });
    
    res.json({
      success: true,
      data: planFeatures
    });
    
  } catch (error) {
    console.error('Get all plan features error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get plan features'
    });
  }
});

// GET /api/plans/all-ui-rules - Get all UI rules (for admin)
router.get('/all-ui-rules', authenticateToken, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const result = await pool.query(
      `SELECT plan, component_name, visible, sample_data, show_crown 
       FROM ui_rules 
       ORDER BY plan, component_name`
    );
    
    const planRules: { [key: string]: { [key: string]: any } } = {};
    
    result.rows.forEach(row => {
      if (!planRules[row.plan]) {
        planRules[row.plan] = {};
      }
      planRules[row.plan][row.component_name] = {
        visible: row.visible,
        sample_data: row.sample_data,
        show_crown: row.show_crown
      };
    });
    
    res.json({
      success: true,
      data: planRules
    });
    
  } catch (error) {
    console.error('Get all UI rules error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get UI rules'
    });
  }
});

// PUT /api/plans/feature - Update a plan feature (admin only)
router.put('/feature', authenticateToken, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { plan, feature_name, value } = req.body;
    
    if (!plan || !feature_name || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Plan, feature_name, and value are required'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO plan_features (plan, feature_name, value) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (plan, feature_name) 
       DO UPDATE SET value = EXCLUDED.value 
       RETURNING *`,
      [plan, feature_name, value]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Plan feature updated successfully'
    });
    
  } catch (error) {
    console.error('Update plan feature error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update plan feature'
    });
  }
});

// PUT /api/plans/ui-rule - Update a UI rule (admin only)
router.put('/ui-rule', authenticateToken, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { plan, component_name, visible, sample_data, show_crown } = req.body;
    
    if (!plan || !component_name) {
      return res.status(400).json({
        success: false,
        error: 'Plan and component_name are required'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO ui_rules (plan, component_name, visible, sample_data, show_crown) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (plan, component_name) 
       DO UPDATE SET 
         visible = EXCLUDED.visible,
         sample_data = EXCLUDED.sample_data,
         show_crown = EXCLUDED.show_crown 
       RETURNING *`,
      [plan, component_name, visible !== undefined ? visible : true, sample_data !== undefined ? sample_data : false, show_crown !== undefined ? show_crown : false]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'UI rule updated successfully'
    });
    
  } catch (error) {
    console.error('Update UI rule error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update UI rule'
    });
  }
});

export default router;

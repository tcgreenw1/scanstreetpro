import express from 'express';
import { getPool } from '../lib/database';

const router = express.Router();

// Create tracking table if it doesn't exist
router.post('/init', async (req, res) => {
  try {
    const pool = getPool();
    
    // Create the tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plan_implementation_tracking (
        id SERIAL PRIMARY KEY,
        page_name VARCHAR(100) NOT NULL UNIQUE,
        page_path VARCHAR(200) NOT NULL,
        implementation_status VARCHAR(50) NOT NULL DEFAULT 'pending',
        plan_restrictions_implemented BOOLEAN DEFAULT FALSE,
        free_plan_behavior TEXT,
        basic_plan_behavior TEXT,
        pro_plan_behavior TEXT,
        premium_plan_behavior TEXT,
        enterprise_plan_behavior TEXT,
        implementation_notes TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        implemented_by VARCHAR(100) DEFAULT 'assistant'
      )
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_tracking_status ON plan_implementation_tracking(implementation_status)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_plan_tracking_path ON plan_implementation_tracking(page_path)
    `);

    res.json({ success: true, message: 'Plan tracking table initialized' });
  } catch (error) {
    console.error('Error initializing plan tracking table:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all tracking data
router.get('/all', async (req, res) => {
  try {
    console.log('📊 Plan tracking /all endpoint called');

    const pool = getPool();
    console.log('✅ Database pool obtained');

    // Check if table exists first
    console.log('🔍 Checking if plan_implementation_tracking table exists...');
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'plan_implementation_tracking'
      );
    `);

    const exists = tableExists.rows[0].exists;
    console.log(`📋 Table exists: ${exists}`);

    if (!exists) {
      // Table doesn't exist, return empty result
      console.log('⚠️ Plan tracking table does not exist, returning empty data');
      return res.json({ success: true, data: [], message: 'Table not initialized' });
    }

    console.log('📝 Querying plan tracking data...');
    const result = await pool.query(`
      SELECT * FROM plan_implementation_tracking
      ORDER BY implementation_status DESC, page_name ASC
    `);

    console.log(`✅ Found ${result.rows.length} tracking records`);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('❌ Error in plan tracking /all endpoint:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update tracking data for a page
router.put('/update/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const {
      implementation_status,
      plan_restrictions_implemented,
      free_plan_behavior,
      basic_plan_behavior,
      pro_plan_behavior,
      premium_plan_behavior,
      enterprise_plan_behavior,
      implementation_notes
    } = req.body;

    const pool = getPool();
    const result = await pool.query(`
      UPDATE plan_implementation_tracking 
      SET 
        implementation_status = $2,
        plan_restrictions_implemented = $3,
        free_plan_behavior = $4,
        basic_plan_behavior = $5,
        pro_plan_behavior = $6,
        premium_plan_behavior = $7,
        enterprise_plan_behavior = $8,
        implementation_notes = $9,
        last_updated = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [pageId, implementation_status, plan_restrictions_implemented, free_plan_behavior, basic_plan_behavior, pro_plan_behavior, premium_plan_behavior, enterprise_plan_behavior, implementation_notes]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating plan tracking data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seed initial data
router.post('/seed', async (req, res) => {
  try {
    const pool = getPool();

    // Check if table exists first
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'plan_implementation_tracking'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Plan tracking table does not exist, cannot seed data');
      return res.status(400).json({
        success: false,
        error: 'Table not initialized. Please call /init first.'
      });
    }
    
    const pages = [
      {
        page_name: 'Dashboard',
        page_path: '/dashboard',
        implementation_status: 'completed',
        plan_restrictions_implemented: true,
        free_plan_behavior: 'Sample data + crowns on locked cards',
        basic_plan_behavior: 'Real data, assets/budget/expenses unlocked',
        pro_plan_behavior: 'Everything unlocked',
        premium_plan_behavior: 'Full access + AI features',
        enterprise_plan_behavior: 'Complete access',
        implementation_notes: 'Plan testing banner added, obvious plan differences'
      },
      {
        page_name: 'Asset Management',
        page_path: '/assets',
        implementation_status: 'completed',
        plan_restrictions_implemented: true,
        free_plan_behavior: 'Disabled with upsell banner',
        basic_plan_behavior: 'Fully enabled with real data',
        pro_plan_behavior: 'Fully enabled',
        premium_plan_behavior: 'Fully enabled',
        enterprise_plan_behavior: 'Fully enabled',
        implementation_notes: 'Clear access restrictions and upsell banners'
      },
      {
        page_name: 'Expenses',
        page_path: '/expenses',
        implementation_status: 'completed',
        plan_restrictions_implemented: true,
        free_plan_behavior: 'Locked with crown banner',
        basic_plan_behavior: 'Fully enabled',
        pro_plan_behavior: 'Fully enabled',
        premium_plan_behavior: 'Fully enabled',
        enterprise_plan_behavior: 'Fully enabled',
        implementation_notes: 'Plan restrictions and locked banner implemented'
      },
      {
        page_name: 'Maintenance Scheduler',
        page_path: '/maintenance',
        implementation_status: 'completed',
        plan_restrictions_implemented: true,
        free_plan_behavior: 'Hidden/locked page',
        basic_plan_behavior: 'Hidden/locked page',
        pro_plan_behavior: 'Fully enabled',
        premium_plan_behavior: 'Fully enabled',
        enterprise_plan_behavior: 'Fully enabled',
        implementation_notes: 'Early return with locked banner for non-Pro users'
      },
      {
        page_name: 'Citizen Engagement',
        page_path: '/citizen-reports',
        implementation_status: 'completed',
        plan_restrictions_implemented: true,
        free_plan_behavior: 'Hidden/locked page',
        basic_plan_behavior: 'Hidden/locked page',
        pro_plan_behavior: 'Partial dashboard',
        premium_plan_behavior: 'Full engagement suite + AI',
        enterprise_plan_behavior: 'Complete access',
        implementation_notes: 'Early return with feature preview for non-Pro users'
      },
      {
        page_name: 'Reports & Exports',
        page_path: '/reports',
        implementation_status: 'completed',
        plan_restrictions_implemented: true,
        free_plan_behavior: 'Export limits (1/month)',
        basic_plan_behavior: 'Export limits (1/month)',
        pro_plan_behavior: 'Unlimited exports',
        premium_plan_behavior: 'Unlimited exports',
        enterprise_plan_behavior: 'Unlimited exports',
        implementation_notes: 'Export button restrictions and usage tracking'
      },
      // Pages that still need implementation
      {
        page_name: 'Contractors',
        page_path: '/contractors',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Need to implement contractor management restrictions'
      },
      {
        page_name: 'Inspections',
        page_path: '/inspections',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Need to implement inspection workflow restrictions'
      },
      {
        page_name: 'Road Inspection Dashboard',
        page_path: '/inspection-dashboard',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Premium feature - needs AI-powered restrictions'
      },
      {
        page_name: 'Budget Planning',
        page_path: '/budget',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Need to implement budget simulation restrictions'
      },
      {
        page_name: 'Cost Estimator',
        page_path: '/estimates',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Basic feature - should be available to all plans'
      },
      {
        page_name: 'Funding Center',
        page_path: '/funding',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Pro+ feature - grants and funding management'
      },
      {
        page_name: 'Map View',
        page_path: '/map',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Basic feature with plan-based map access levels'
      },
      {
        page_name: 'Settings',
        page_path: '/settings',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Account settings - basic access for all'
      },
      {
        page_name: 'Integrations',
        page_path: '/integrations',
        implementation_status: 'pending',
        plan_restrictions_implemented: false,
        implementation_notes: 'Pro+ feature - API access and third-party connectors'
      }
    ];

    // Insert pages using ON CONFLICT to avoid duplicates
    for (const page of pages) {
      await pool.query(`
        INSERT INTO plan_implementation_tracking (
          page_name, page_path, implementation_status, plan_restrictions_implemented,
          free_plan_behavior, basic_plan_behavior, pro_plan_behavior, 
          premium_plan_behavior, enterprise_plan_behavior, implementation_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (page_name) DO UPDATE SET
          page_path = EXCLUDED.page_path,
          implementation_status = EXCLUDED.implementation_status,
          plan_restrictions_implemented = EXCLUDED.plan_restrictions_implemented,
          free_plan_behavior = EXCLUDED.free_plan_behavior,
          basic_plan_behavior = EXCLUDED.basic_plan_behavior,
          pro_plan_behavior = EXCLUDED.pro_plan_behavior,
          premium_plan_behavior = EXCLUDED.premium_plan_behavior,
          enterprise_plan_behavior = EXCLUDED.enterprise_plan_behavior,
          implementation_notes = EXCLUDED.implementation_notes,
          last_updated = CURRENT_TIMESTAMP
      `, [
        page.page_name, page.page_path, page.implementation_status, page.plan_restrictions_implemented,
        page.free_plan_behavior || null, page.basic_plan_behavior || null, page.pro_plan_behavior || null,
        page.premium_plan_behavior || null, page.enterprise_plan_behavior || null, page.implementation_notes
      ]);
    }

    res.json({ success: true, message: 'Tracking data seeded successfully' });
  } catch (error) {
    console.error('Error seeding plan tracking data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

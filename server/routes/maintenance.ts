import express from 'express';
import { getPool } from '../lib/database';

const router = express.Router();

// GET /api/maintenance - Get all maintenance tasks for an organization
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const organizationId = req.headers['x-organization-id'] as string;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    // Check if maintenance_tasks table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'maintenance_tasks'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Return sample data if table doesn't exist
      return res.json([
        {
          id: 'TASK-SAMPLE-001',
          title: 'Sample Pothole Repair',
          description: 'Sample maintenance task',
          assetId: 'ROAD-SAMPLE-001',
          assetName: 'Sample Road',
          contractor: 'Sample Contractor',
          priority: 'high',
          status: 'scheduled',
          scheduledDate: '2023-12-18',
          estimatedDuration: 4,
          estimatedCost: 850,
          progress: 0,
          materials: ['Hot Mix Asphalt', 'Tack Coat'],
          weatherSensitive: true,
          assignedCrew: 'Sample Crew',
          pciScore: 45,
          isSampleData: true
        }
      ]);
    }

    const result = await pool.query(`
      SELECT * FROM maintenance_tasks 
      WHERE organization_id = $1
      ORDER BY scheduled_date DESC
    `, [organizationId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching maintenance tasks:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance tasks' });
  }
});

// POST /api/maintenance - Create new maintenance task
router.post('/', async (req, res) => {
  try {
    const pool = getPool();
    const organizationId = req.headers['x-organization-id'] as string;
    const taskData = req.body;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    // Check if maintenance_tasks table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'maintenance_tasks'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Create maintenance_tasks table if it doesn't exist
      await pool.query(`
        CREATE TABLE maintenance_tasks (
          id SERIAL PRIMARY KEY,
          organization_id VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          asset_id VARCHAR(255) NOT NULL,
          asset_name VARCHAR(255) NOT NULL,
          contractor VARCHAR(255) NOT NULL,
          priority VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          scheduled_date DATE NOT NULL,
          estimated_duration INTEGER,
          estimated_cost INTEGER,
          actual_cost INTEGER,
          progress INTEGER DEFAULT 0,
          materials JSONB,
          weather_sensitive BOOLEAN DEFAULT false,
          assigned_crew VARCHAR(255),
          pci_score INTEGER,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
    }

    const result = await pool.query(`
      INSERT INTO maintenance_tasks (
        organization_id, title, description, asset_id, asset_name,
        contractor, priority, status, scheduled_date, estimated_duration,
        estimated_cost, actual_cost, progress, materials, weather_sensitive,
        assigned_crew, pci_score
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      organizationId,
      taskData.title,
      taskData.description,
      taskData.assetId,
      taskData.assetName,
      taskData.contractor,
      taskData.priority,
      taskData.status,
      taskData.scheduledDate,
      taskData.estimatedDuration,
      taskData.estimatedCost,
      taskData.actualCost,
      taskData.progress,
      JSON.stringify(taskData.materials),
      taskData.weatherSensitive,
      taskData.assignedCrew,
      taskData.pciScore
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating maintenance task:', error);
    res.status(500).json({ error: 'Failed to create maintenance task' });
  }
});

// PUT /api/maintenance/:id - Update maintenance task
router.put('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const organizationId = req.headers['x-organization-id'] as string;
    const { id } = req.params;
    const taskData = req.body;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const result = await pool.query(`
      UPDATE maintenance_tasks 
      SET title = $1, description = $2, asset_id = $3, asset_name = $4,
          contractor = $5, priority = $6, status = $7, scheduled_date = $8,
          estimated_duration = $9, estimated_cost = $10, actual_cost = $11,
          progress = $12, materials = $13, weather_sensitive = $14,
          assigned_crew = $15, pci_score = $16, updated_at = NOW()
      WHERE id = $17 AND organization_id = $18
      RETURNING *
    `, [
      taskData.title,
      taskData.description,
      taskData.assetId,
      taskData.assetName,
      taskData.contractor,
      taskData.priority,
      taskData.status,
      taskData.scheduledDate,
      taskData.estimatedDuration,
      taskData.estimatedCost,
      taskData.actualCost,
      taskData.progress,
      JSON.stringify(taskData.materials),
      taskData.weatherSensitive,
      taskData.assignedCrew,
      taskData.pciScore,
      id,
      organizationId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maintenance task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating maintenance task:', error);
    res.status(500).json({ error: 'Failed to update maintenance task' });
  }
});

// DELETE /api/maintenance/:id - Delete maintenance task
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const organizationId = req.headers['x-organization-id'] as string;
    const { id } = req.params;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const result = await pool.query(`
      DELETE FROM maintenance_tasks 
      WHERE id = $1 AND organization_id = $2
      RETURNING id
    `, [id, organizationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maintenance task not found' });
    }

    res.json({ message: 'Maintenance task deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance task:', error);
    res.status(500).json({ error: 'Failed to delete maintenance task' });
  }
});

export default router;

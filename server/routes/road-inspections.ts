import express from 'express';
import { getPool } from '../lib/database';

const router = express.Router();

// GET /api/road-inspections - Get all road inspections for an organization
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const organizationId = req.headers['x-organization-id'] as string;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    // Check if road_inspections table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'road_inspections'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Return sample data if table doesn't exist
      return res.json([
        {
          id: 'INS-SAMPLE-001',
          roadId: 'RD-SAMPLE-001',
          roadName: 'Sample Road',
          location: 'Sample Location',
          coordinates: { lat: 40.7589, lng: -73.9851 },
          inspector: 'Sample Inspector',
          date: '2024-01-15',
          status: 'completed',
          priority: 'medium',
          pciScore: 72,
          surfaceType: 'Asphalt',
          distressTypes: ['Cracking', 'Rutting'],
          photos: 8,
          weatherConditions: 'Clear',
          trafficVolume: 'High',
          findings: 'Sample finding data',
          recommendations: 'Sample recommendations',
          isSampleData: true
        }
      ]);
    }

    const result = await pool.query(`
      SELECT * FROM road_inspections 
      WHERE organization_id = $1
      ORDER BY date DESC
    `, [organizationId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching road inspections:', error);
    res.status(500).json({ error: 'Failed to fetch road inspections' });
  }
});

// POST /api/road-inspections - Create new road inspection
router.post('/', async (req, res) => {
  try {
    const pool = getPool();
    const organizationId = req.headers['x-organization-id'] as string;
    const inspectionData = req.body;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    // Check if road_inspections table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'road_inspections'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Create road_inspections table if it doesn't exist
      await pool.query(`
        CREATE TABLE road_inspections (
          id SERIAL PRIMARY KEY,
          organization_id VARCHAR(255) NOT NULL,
          road_id VARCHAR(255) NOT NULL,
          road_name VARCHAR(255) NOT NULL,
          location VARCHAR(500) NOT NULL,
          coordinates JSONB NOT NULL,
          inspector VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          status VARCHAR(50) NOT NULL,
          priority VARCHAR(50) NOT NULL,
          pci_score INTEGER,
          surface_type VARCHAR(100),
          distress_types JSONB,
          photos INTEGER DEFAULT 0,
          weather_conditions VARCHAR(255),
          traffic_volume VARCHAR(100),
          findings TEXT,
          recommendations TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
    }

    const result = await pool.query(`
      INSERT INTO road_inspections (
        organization_id, road_id, road_name, location, coordinates, 
        inspector, date, status, priority, pci_score, surface_type, 
        distress_types, photos, weather_conditions, traffic_volume, 
        findings, recommendations
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      organizationId,
      inspectionData.roadId,
      inspectionData.roadName,
      inspectionData.location,
      JSON.stringify(inspectionData.coordinates),
      inspectionData.inspector,
      inspectionData.date,
      inspectionData.status,
      inspectionData.priority,
      inspectionData.pciScore,
      inspectionData.surfaceType,
      JSON.stringify(inspectionData.distressTypes),
      inspectionData.photos,
      inspectionData.weatherConditions,
      inspectionData.trafficVolume,
      inspectionData.findings,
      inspectionData.recommendations
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating road inspection:', error);
    res.status(500).json({ error: 'Failed to create road inspection' });
  }
});

// PUT /api/road-inspections/:id - Update road inspection
router.put('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const organizationId = req.headers['x-organization-id'] as string;
    const { id } = req.params;
    const inspectionData = req.body;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const result = await pool.query(`
      UPDATE road_inspections 
      SET road_id = $1, road_name = $2, location = $3, coordinates = $4,
          inspector = $5, date = $6, status = $7, priority = $8,
          pci_score = $9, surface_type = $10, distress_types = $11,
          photos = $12, weather_conditions = $13, traffic_volume = $14,
          findings = $15, recommendations = $16, updated_at = NOW()
      WHERE id = $17 AND organization_id = $18
      RETURNING *
    `, [
      inspectionData.roadId,
      inspectionData.roadName,
      inspectionData.location,
      JSON.stringify(inspectionData.coordinates),
      inspectionData.inspector,
      inspectionData.date,
      inspectionData.status,
      inspectionData.priority,
      inspectionData.pciScore,
      inspectionData.surfaceType,
      JSON.stringify(inspectionData.distressTypes),
      inspectionData.photos,
      inspectionData.weatherConditions,
      inspectionData.trafficVolume,
      inspectionData.findings,
      inspectionData.recommendations,
      id,
      organizationId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Road inspection not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating road inspection:', error);
    res.status(500).json({ error: 'Failed to update road inspection' });
  }
});

// DELETE /api/road-inspections/:id - Delete road inspection
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const organizationId = req.headers['x-organization-id'] as string;
    const { id } = req.params;
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const result = await pool.query(`
      DELETE FROM road_inspections 
      WHERE id = $1 AND organization_id = $2
      RETURNING id
    `, [id, organizationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Road inspection not found' });
    }

    res.json({ message: 'Road inspection deleted successfully' });
  } catch (error) {
    console.error('Error deleting road inspection:', error);
    res.status(500).json({ error: 'Failed to delete road inspection' });
  }
});

export default router;

import neonAuth from '../lib/neonAuth';

// Types for database entities
export interface Asset {
  id: string;
  name: string;
  type: 'road' | 'bridge' | 'sidewalk' | 'drainage' | 'lighting' | 'signage';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  condition: {
    pci: number;
    lastInspected: Date;
    nextInspection: Date;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  };
  metadata: {
    yearBuilt?: number;
    length?: number;
    width?: number;
    material?: string;
    cost?: number;
  };
  organizationId: string;
  isSampleData: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'revenue' | 'budget_allocation';
  amount: number;
  currency: string;
  description: string;
  category: string;
  date: Date;
  assetId?: string;
  contractorId?: string;
  organizationId: string;
  tags: string[];
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
}

export interface InspectionReport {
  id: string;
  assetId: string;
  inspectorId: string;
  date: Date;
  type: 'routine' | 'detailed' | 'emergency';
  pciScore: number;
  findings: {
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    photos?: string[];
  }[];
  recommendations: string[];
  estimatedCost?: number;
  organizationId: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  createdAt: Date;
}

export interface Contractor {
  id: string;
  name: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  specialties: string[];
  rating: number;
  certifications: string[];
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
  };
  performanceMetrics: {
    projectsCompleted: number;
    onTimeDelivery: number;
    costAccuracy: number;
    qualityScore: number;
  };
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  assetId: string;
  assignedTo?: string;
  contractorId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed';
  scheduledDate: Date;
  estimatedDuration: number; // hours
  actualDuration?: number;
  estimatedCost: number;
  actualCost?: number;
  organizationId: string;
  createdAt: Date;
  completedAt?: Date;
}

// Database service class
class NeonService {
  private db: any = null;
  
  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      this.db = await neonAuth.connect();
    } catch (error) {
      console.error('Failed to initialize Neon connection:', error);
    }
  }

  // Asset Management
  async getAssets(organizationId: string, includeSampleData: boolean = false): Promise<Asset[]> {
    try {
      const query = `
        SELECT * FROM assets 
        WHERE organization_id = $1 
        ${!includeSampleData ? 'AND is_sample_data = false' : ''}
        ORDER BY created_at DESC
      `;
      const result = await this.db?.query(query, [organizationId]);
      return this.mapAssetsFromDB(result?.rows || []);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      return this.getFallbackAssets(organizationId, includeSampleData);
    }
  }

  async createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    try {
      const query = `
        INSERT INTO assets (
          name, type, location_lat, location_lng, location_address,
          pci, last_inspected, next_inspection, condition_status,
          year_built, length, width, material, cost,
          organization_id, is_sample_data
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;
      
      const values = [
        asset.name, asset.type, asset.location.lat, asset.location.lng, asset.location.address,
        asset.condition.pci, asset.condition.lastInspected, asset.condition.nextInspection, asset.condition.status,
        asset.metadata.yearBuilt, asset.metadata.length, asset.metadata.width, asset.metadata.material, asset.metadata.cost,
        asset.organizationId, asset.isSampleData
      ];
      
      const result = await this.db?.query(query, values);
      return this.mapAssetFromDB(result?.rows[0]);
    } catch (error) {
      console.error('Failed to create asset:', error);
      throw error;
    }
  }

  // Financial Management
  async getTransactions(organizationId: string, filters?: {
    type?: string;
    category?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Transaction[]> {
    try {
      let query = 'SELECT * FROM transactions WHERE organization_id = $1';
      const params = [organizationId];
      let paramCount = 1;

      if (filters?.type) {
        query += ` AND type = $${++paramCount}`;
        params.push(filters.type);
      }
      if (filters?.category) {
        query += ` AND category = $${++paramCount}`;
        params.push(filters.category);
      }
      if (filters?.dateFrom) {
        query += ` AND date >= $${++paramCount}`;
        params.push(filters.dateFrom);
      }
      if (filters?.dateTo) {
        query += ` AND date <= $${++paramCount}`;
        params.push(filters.dateTo);
      }

      query += ' ORDER BY date DESC';
      
      const result = await this.db?.query(query, params);
      return this.mapTransactionsFromDB(result?.rows || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return this.getFallbackTransactions(organizationId);
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    try {
      const query = `
        INSERT INTO transactions (
          type, amount, currency, description, category, date,
          asset_id, contractor_id, organization_id, tags,
          status, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      
      const values = [
        transaction.type, transaction.amount, transaction.currency,
        transaction.description, transaction.category, transaction.date,
        transaction.assetId, transaction.contractorId, transaction.organizationId,
        JSON.stringify(transaction.tags), transaction.status, transaction.createdBy
      ];
      
      const result = await this.db?.query(query, values);
      return this.mapTransactionFromDB(result?.rows[0]);
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  }

  // Dashboard Analytics
  async getDashboardMetrics(organizationId: string): Promise<{
    totalAssets: number;
    avgPCI: number;
    criticalAssets: number;
    totalBudget: number;
    monthlyExpenses: number;
    upcomingInspections: number;
    activeProjects: number;
    teamMembers: number;
  }> {
    try {
      const [assetsResult, financialResult, tasksResult, usersResult] = await Promise.all([
        this.db?.query(`
          SELECT 
            COUNT(*) as total_assets,
            AVG(pci) as avg_pci,
            COUNT(*) FILTER (WHERE condition_status = 'critical') as critical_assets
          FROM assets 
          WHERE organization_id = $1 AND is_sample_data = false
        `, [organizationId]),
        
        this.db?.query(`
          SELECT 
            SUM(CASE WHEN type = 'budget_allocation' THEN amount ELSE 0 END) as total_budget,
            SUM(CASE WHEN type = 'expense' AND date >= date_trunc('month', CURRENT_DATE) THEN amount ELSE 0 END) as monthly_expenses
          FROM transactions 
          WHERE organization_id = $1
        `, [organizationId]),
        
        this.db?.query(`
          SELECT 
            COUNT(*) FILTER (WHERE next_inspection <= CURRENT_DATE + INTERVAL '30 days') as upcoming_inspections,
            COUNT(*) FILTER (WHERE status IN ('scheduled', 'in_progress')) as active_projects
          FROM maintenance_tasks 
          WHERE organization_id = $1
        `, [organizationId]),
        
        this.db?.query(`
          SELECT COUNT(*) as team_members 
          FROM users 
          WHERE organization_id = $1 AND is_active = true
        `, [organizationId])
      ]);

      return {
        totalAssets: parseInt(assetsResult?.rows[0]?.total_assets || '0'),
        avgPCI: parseFloat(assetsResult?.rows[0]?.avg_pci || '0'),
        criticalAssets: parseInt(assetsResult?.rows[0]?.critical_assets || '0'),
        totalBudget: parseFloat(financialResult?.rows[0]?.total_budget || '0'),
        monthlyExpenses: parseFloat(financialResult?.rows[0]?.monthly_expenses || '0'),
        upcomingInspections: parseInt(tasksResult?.rows[0]?.upcoming_inspections || '0'),
        activeProjects: parseInt(tasksResult?.rows[0]?.active_projects || '0'),
        teamMembers: parseInt(usersResult?.rows[0]?.team_members || '0')
      };
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      return this.getFallbackDashboardMetrics();
    }
  }

  // Contractors
  async getContractors(organizationId: string): Promise<Contractor[]> {
    try {
      const query = `
        SELECT * FROM contractors 
        WHERE organization_id = $1 AND is_active = true
        ORDER BY rating DESC, name ASC
      `;
      const result = await this.db?.query(query, [organizationId]);
      return this.mapContractorsFromDB(result?.rows || []);
    } catch (error) {
      console.error('Failed to fetch contractors:', error);
      return this.getFallbackContractors(organizationId);
    }
  }

  // Maintenance Tasks
  async getMaintenanceTasks(organizationId: string, status?: string): Promise<MaintenanceTask[]> {
    try {
      let query = 'SELECT * FROM maintenance_tasks WHERE organization_id = $1';
      const params = [organizationId];

      if (status) {
        query += ' AND status = $2';
        params.push(status);
      }

      query += ' ORDER BY scheduled_date ASC';
      
      const result = await this.db?.query(query, params);
      return this.mapMaintenanceTasksFromDB(result?.rows || []);
    } catch (error) {
      console.error('Failed to fetch maintenance tasks:', error);
      return this.getFallbackMaintenanceTasks(organizationId);
    }
  }

  // Inspection Reports
  async getInspectionReports(organizationId: string, assetId?: string): Promise<InspectionReport[]> {
    try {
      let query = 'SELECT * FROM inspection_reports WHERE organization_id = $1';
      const params = [organizationId];

      if (assetId) {
        query += ' AND asset_id = $2';
        params.push(assetId);
      }

      query += ' ORDER BY date DESC';
      
      const result = await this.db?.query(query, params);
      return this.mapInspectionReportsFromDB(result?.rows || []);
    } catch (error) {
      console.error('Failed to fetch inspection reports:', error);
      return this.getFallbackInspectionReports(organizationId);
    }
  }

  // Utility methods for mapping database results
  private mapAssetsFromDB(rows: any[]): Asset[] {
    return rows.map(row => this.mapAssetFromDB(row));
  }

  private mapAssetFromDB(row: any): Asset {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      location: {
        lat: row.location_lat,
        lng: row.location_lng,
        address: row.location_address
      },
      condition: {
        pci: row.pci,
        lastInspected: new Date(row.last_inspected),
        nextInspection: new Date(row.next_inspection),
        status: row.condition_status
      },
      metadata: {
        yearBuilt: row.year_built,
        length: row.length,
        width: row.width,
        material: row.material,
        cost: row.cost
      },
      organizationId: row.organization_id,
      isSampleData: row.is_sample_data,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapTransactionsFromDB(rows: any[]): Transaction[] {
    return rows.map(row => this.mapTransactionFromDB(row));
  }

  private mapTransactionFromDB(row: any): Transaction {
    return {
      id: row.id,
      type: row.type,
      amount: row.amount,
      currency: row.currency,
      description: row.description,
      category: row.category,
      date: new Date(row.date),
      assetId: row.asset_id,
      contractorId: row.contractor_id,
      organizationId: row.organization_id,
      tags: JSON.parse(row.tags || '[]'),
      status: row.status,
      createdBy: row.created_by,
      createdAt: new Date(row.created_at)
    };
  }

  private mapContractorsFromDB(rows: any[]): Contractor[] {
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      contactInfo: JSON.parse(row.contact_info),
      specialties: JSON.parse(row.specialties),
      rating: row.rating,
      certifications: JSON.parse(row.certifications),
      insurance: JSON.parse(row.insurance),
      performanceMetrics: JSON.parse(row.performance_metrics),
      organizationId: row.organization_id,
      isActive: row.is_active,
      createdAt: new Date(row.created_at)
    }));
  }

  private mapMaintenanceTasksFromDB(rows: any[]): MaintenanceTask[] {
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      assetId: row.asset_id,
      assignedTo: row.assigned_to,
      contractorId: row.contractor_id,
      priority: row.priority,
      status: row.status,
      scheduledDate: new Date(row.scheduled_date),
      estimatedDuration: row.estimated_duration,
      actualDuration: row.actual_duration,
      estimatedCost: row.estimated_cost,
      actualCost: row.actual_cost,
      organizationId: row.organization_id,
      createdAt: new Date(row.created_at),
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined
    }));
  }

  private mapInspectionReportsFromDB(rows: any[]): InspectionReport[] {
    return rows.map(row => ({
      id: row.id,
      assetId: row.asset_id,
      inspectorId: row.inspector_id,
      date: new Date(row.date),
      type: row.type,
      pciScore: row.pci_score,
      findings: JSON.parse(row.findings),
      recommendations: JSON.parse(row.recommendations),
      estimatedCost: row.estimated_cost,
      organizationId: row.organization_id,
      status: row.status,
      createdAt: new Date(row.created_at)
    }));
  }

  // Fallback methods for when database is unavailable
  private getFallbackAssets(organizationId: string, includeSampleData: boolean): Asset[] {
    return [
      {
        id: 'asset-1',
        name: 'Main Street Bridge',
        type: 'bridge',
        location: { lat: 40.7128, lng: -74.0060, address: '123 Main St' },
        condition: {
          pci: 72,
          lastInspected: new Date('2024-01-15'),
          nextInspection: new Date('2024-07-15'),
          status: 'good'
        },
        metadata: { yearBuilt: 1985, length: 150, width: 12, material: 'concrete', cost: 250000 },
        organizationId,
        isSampleData: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private getFallbackTransactions(organizationId: string): Transaction[] {
    return [
      {
        id: 'txn-1',
        type: 'expense',
        amount: 15000,
        currency: 'USD',
        description: 'Road repair - Main Street',
        category: 'Maintenance',
        date: new Date(),
        organizationId,
        tags: ['urgent', 'safety'],
        status: 'completed',
        createdBy: 'user-1',
        createdAt: new Date()
      }
    ];
  }

  private getFallbackDashboardMetrics() {
    return {
      totalAssets: 124,
      avgPCI: 68.5,
      criticalAssets: 8,
      totalBudget: 2500000,
      monthlyExpenses: 185000,
      upcomingInspections: 12,
      activeProjects: 5,
      teamMembers: 7
    };
  }

  private getFallbackContractors(organizationId: string): Contractor[] {
    return [
      {
        id: 'contractor-1',
        name: 'Premier Paving Co.',
        contactInfo: {
          email: 'contact@premierpaving.com',
          phone: '555-0123',
          address: '456 Industrial Way'
        },
        specialties: ['Asphalt', 'Concrete', 'Bridge Repair'],
        rating: 4.8,
        certifications: ['DOT Certified', 'OSHA 30'],
        insurance: {
          provider: 'Acme Insurance',
          policyNumber: 'POL-123456',
          expiryDate: new Date('2024-12-31')
        },
        performanceMetrics: {
          projectsCompleted: 45,
          onTimeDelivery: 95,
          costAccuracy: 92,
          qualityScore: 4.7
        },
        organizationId,
        isActive: true,
        createdAt: new Date()
      }
    ];
  }

  private getFallbackMaintenanceTasks(organizationId: string): MaintenanceTask[] {
    return [
      {
        id: 'task-1',
        title: 'Pothole Repair - Oak Avenue',
        description: 'Fill and seal potholes on Oak Avenue between 1st and 3rd streets',
        assetId: 'asset-1',
        priority: 'high',
        status: 'scheduled',
        scheduledDate: new Date('2024-02-15'),
        estimatedDuration: 4,
        estimatedCost: 2500,
        organizationId,
        createdAt: new Date()
      }
    ];
  }

  private getFallbackInspectionReports(organizationId: string): InspectionReport[] {
    return [
      {
        id: 'report-1',
        assetId: 'asset-1',
        inspectorId: 'user-1',
        date: new Date('2024-01-20'),
        type: 'routine',
        pciScore: 72,
        findings: [
          {
            category: 'Surface',
            severity: 'medium',
            description: 'Minor cracking observed on south side'
          }
        ],
        recommendations: ['Monitor for expansion', 'Schedule crack sealing'],
        estimatedCost: 3500,
        organizationId,
        status: 'approved',
        createdAt: new Date()
      }
    ];
  }
}

export const neonService = new NeonService();

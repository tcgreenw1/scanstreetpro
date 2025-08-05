// Client-side service for making HTTP requests to the server API
// This replaces direct database connections which should only happen server-side

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

// HTTP client service class
class NeonService {
  private baseUrl: string;
  
  constructor() {
    // Use the current domain for API requests
    this.baseUrl = '/api';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & { organizationId?: string } = {}
  ): Promise<T> {
    const { organizationId, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (organizationId) {
      headers['x-organization-id'] = organizationId;
    }

    console.log(`Making request to: ${this.baseUrl}${endpoint}`, {
      headers,
      method: fetchOptions.method || 'GET',
      organizationId
    });

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    console.log(`Response status: ${response.status} for ${endpoint}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error for ${endpoint}:`, response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log(`Response data for ${endpoint}:`, data);
    return data;
  }

  // Asset Management
  async getAssets(organizationId: string, includeSampleData: boolean = false): Promise<Asset[]> {
    console.log('getAssets called with:', { organizationId, includeSampleData });

    if (!organizationId) {
      console.warn('No organizationId provided, using fallback data');
      return this.getFallbackAssets('default-org', includeSampleData);
    }

    try {
      const assets = await this.makeRequest<any[]>(`/assets`, {
        organizationId,
      });

      console.log('Received assets from API:', assets);

      return assets.map(asset => ({
        ...asset,
        condition: {
          ...asset.condition,
          lastInspected: new Date(asset.condition.lastInspected),
          nextInspection: new Date(asset.condition.nextInspection),
        },
        createdAt: new Date(asset.createdAt),
        updatedAt: new Date(asset.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch assets from API:', error);
      console.log('Falling back to sample data');
      return this.getFallbackAssets(organizationId, includeSampleData);
    }
  }

  async createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    try {
      const result = await this.makeRequest<any>(`/assets`, {
        method: 'POST',
        organizationId: asset.organizationId,
        body: JSON.stringify(asset),
      });
      
      return {
        ...result,
        condition: {
          ...result.condition,
          lastInspected: new Date(result.condition.lastInspected),
          nextInspection: new Date(result.condition.nextInspection),
        },
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      };
    } catch (error) {
      console.error('Failed to create asset:', error);
      throw error;
    }
  }

  async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
    try {
      const result = await this.makeRequest<any>(`/assets/${id}`, {
        method: 'PUT',
        organizationId: asset.organizationId,
        body: JSON.stringify(asset),
      });
      
      return {
        ...result,
        condition: {
          ...result.condition,
          lastInspected: new Date(result.condition.lastInspected),
          nextInspection: new Date(result.condition.nextInspection),
        },
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      };
    } catch (error) {
      console.error('Failed to update asset:', error);
      throw error;
    }
  }

  async deleteAsset(id: string, organizationId: string): Promise<void> {
    try {
      await this.makeRequest(`/assets/${id}`, {
        method: 'DELETE',
        organizationId,
      });
    } catch (error) {
      console.error('Failed to delete asset:', error);
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
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom.toISOString());
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo.toISOString());

      const endpoint = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const transactions = await this.makeRequest<any[]>(endpoint, { organizationId });
      
      return transactions.map(txn => ({
        ...txn,
        date: new Date(txn.date),
        createdAt: new Date(txn.createdAt),
      }));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return this.getFallbackTransactions(organizationId);
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    try {
      const result = await this.makeRequest<any>(`/transactions`, {
        method: 'POST',
        organizationId: transaction.organizationId,
        body: JSON.stringify(transaction),
      });
      
      return {
        ...result,
        date: new Date(result.date),
        createdAt: new Date(result.createdAt),
      };
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
      return await this.makeRequest<any>(`/dashboard/metrics`, { organizationId });
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      return this.getFallbackDashboardMetrics();
    }
  }

  // Contractors
  async getContractors(organizationId: string): Promise<Contractor[]> {
    try {
      const contractors = await this.makeRequest<any[]>(`/contractors`, { organizationId });
      
      return contractors.map(contractor => ({
        ...contractor,
        insurance: {
          ...contractor.insurance,
          expiryDate: new Date(contractor.insurance.expiryDate),
        },
        createdAt: new Date(contractor.createdAt),
      }));
    } catch (error) {
      console.error('Failed to fetch contractors:', error);
      return this.getFallbackContractors(organizationId);
    }
  }

  // Maintenance Tasks
  async getMaintenanceTasks(organizationId: string, status?: string): Promise<MaintenanceTask[]> {
    try {
      const endpoint = `/maintenance${status ? `?status=${status}` : ''}`;
      const tasks = await this.makeRequest<any[]>(endpoint, { organizationId });
      
      return tasks.map(task => ({
        ...task,
        scheduledDate: new Date(task.scheduledDate),
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch maintenance tasks:', error);
      return this.getFallbackMaintenanceTasks(organizationId);
    }
  }

  // Inspection Reports
  async getInspectionReports(organizationId: string, assetId?: string): Promise<InspectionReport[]> {
    try {
      const endpoint = `/road-inspections${assetId ? `?assetId=${assetId}` : ''}`;
      const reports = await this.makeRequest<any[]>(endpoint, { organizationId });
      
      return reports.map(report => ({
        ...report,
        date: new Date(report.date),
        createdAt: new Date(report.createdAt),
      }));
    } catch (error) {
      console.error('Failed to fetch inspection reports:', error);
      return this.getFallbackInspectionReports(organizationId);
    }
  }

  // Fallback methods for when API is unavailable
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

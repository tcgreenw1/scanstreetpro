import { sampleData } from './sampleData';

// Mock data service that provides sample data
// In a real implementation, this would connect to your Neon PostgreSQL database

interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
}

// Get auth token for API calls
const getAuthToken = () => {
  return localStorage.getItem('neon_auth_token');
};

// API call helper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  
  return data;
};

// Get current user's organization from Neon database
const getCurrentOrganization = async (): Promise<Organization | null> => {
  try {
    const result = await apiCall('/api/auth/verify');
    return result.organization || null;
  } catch (error) {
    console.error('Failed to get organization:', error);
    return null;
  }
};

// Check if organization has feature access based on plan
const hasFeatureAccess = (org: Organization | null, feature: string): boolean => {
  if (!org) return false;
  
  const planFeatures = {
    free: ['contractors_basic', 'inspections_basic', 'assets_basic'],
    basic: ['contractors_basic', 'contractors_advanced', 'inspections_basic', 'inspections_advanced', 'assets_basic', 'assets_advanced'],
    pro: ['all'],
    premium: ['all']
  };
  
  const features = planFeatures[org.plan] || [];
  return features.includes('all') || features.includes(feature);
};

// Use sample data if organization doesn't have access or if database is unavailable
const shouldUseSampleData = async (feature: string = 'basic'): Promise<boolean> => {
  try {
    const org = await getCurrentOrganization();
    if (!org) return true;
    
    // Always use sample data for free plan
    if (org.plan === 'free') return true;
    
    // Check if organization has access to this feature
    return !hasFeatureAccess(org, feature);
  } catch (error) {
    console.warn('Using sample data due to connection error:', error);
    return true;
  }
};

export const dataService = {
  // Contractors
  async getContractors() {
    const useSample = await shouldUseSampleData('contractors_basic');
    if (useSample) {
      return { data: sampleData.contractors, error: null };
    }
    
    try {
      const result = await apiCall('/api/contractors');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch contractors:', error);
      return { data: sampleData.contractors, error: error.message };
    }
  },

  async createContractor(contractor: any) {
    const useSample = await shouldUseSampleData('contractors_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to create contractors' };
    }
    
    try {
      const result = await apiCall('/api/contractors', {
        method: 'POST',
        body: JSON.stringify(contractor)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async updateContractor(id: string, updates: any) {
    const useSample = await shouldUseSampleData('contractors_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to edit contractors' };
    }
    
    try {
      const result = await apiCall(`/api/contractors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  async deleteContractor(id: string) {
    const useSample = await shouldUseSampleData('contractors_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to delete contractors' };
    }
    
    try {
      await apiCall(`/api/contractors/${id}`, { method: 'DELETE' });
      return { data: { success: true }, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Inspections
  async getInspections() {
    const useSample = await shouldUseSampleData('inspections_basic');
    if (useSample) {
      return { data: sampleData.inspections, error: null };
    }
    
    try {
      const result = await apiCall('/api/inspections');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch inspections:', error);
      return { data: sampleData.inspections, error: error.message };
    }
  },

  async createInspection(inspection: any) {
    const useSample = await shouldUseSampleData('inspections_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to create inspections' };
    }
    
    try {
      const result = await apiCall('/api/inspections', {
        method: 'POST',
        body: JSON.stringify(inspection)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Assets
  async getAssets() {
    const useSample = await shouldUseSampleData('assets_basic');
    if (useSample) {
      return { data: sampleData.assets, error: null };
    }
    
    try {
      const result = await apiCall('/api/assets');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch assets:', error);
      return { data: sampleData.assets, error: error.message };
    }
  },

  async createAsset(asset: any) {
    const useSample = await shouldUseSampleData('assets_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to create assets' };
    }
    
    try {
      const result = await apiCall('/api/assets', {
        method: 'POST',
        body: JSON.stringify(asset)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Maintenance Tasks
  async getMaintenanceTasks() {
    const useSample = await shouldUseSampleData('maintenance_basic');
    if (useSample) {
      return { data: sampleData.maintenanceTasks, error: null };
    }
    
    try {
      const result = await apiCall('/api/maintenance-tasks');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch maintenance tasks:', error);
      return { data: sampleData.maintenanceTasks, error: error.message };
    }
  },

  async createMaintenanceTask(task: any) {
    const useSample = await shouldUseSampleData('maintenance_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to create maintenance tasks' };
    }
    
    try {
      const result = await apiCall('/api/maintenance-tasks', {
        method: 'POST',
        body: JSON.stringify(task)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Projects
  async getProjects() {
    const useSample = await shouldUseSampleData('projects_basic');
    if (useSample) {
      return { data: sampleData.projects, error: null };
    }
    
    try {
      const result = await apiCall('/api/projects');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      return { data: sampleData.projects, error: error.message };
    }
  },

  // Funding Sources
  async getFundingSources() {
    const useSample = await shouldUseSampleData('funding_basic');
    if (useSample) {
      return { data: sampleData.fundingSources, error: null };
    }
    
    try {
      const result = await apiCall('/api/funding-sources');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch funding sources:', error);
      return { data: sampleData.fundingSources, error: error.message };
    }
  },

  async createFundingSource(source: any) {
    const useSample = await shouldUseSampleData('funding_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to create funding sources' };
    }
    
    try {
      const result = await apiCall('/api/funding-sources', {
        method: 'POST',
        body: JSON.stringify(source)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Grants
  async getGrants() {
    const useSample = await shouldUseSampleData('grants_basic');
    if (useSample) {
      return { data: sampleData.grants, error: null };
    }
    
    try {
      const result = await apiCall('/api/grants');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch grants:', error);
      return { data: sampleData.grants, error: error.message };
    }
  },

  // Expenses
  async getExpenses() {
    const useSample = await shouldUseSampleData('expenses_basic');
    if (useSample) {
      return { data: sampleData.expenses, error: null };
    }
    
    try {
      const result = await apiCall('/api/expenses');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch expenses:', error);
      return { data: sampleData.expenses, error: error.message };
    }
  },

  async createExpense(expense: any) {
    const useSample = await shouldUseSampleData('expenses_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to create expenses' };
    }
    
    try {
      const result = await apiCall('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expense)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Citizen Reports
  async getCitizenReports() {
    const useSample = await shouldUseSampleData('citizen_reports_basic');
    if (useSample) {
      return { data: sampleData.citizenReports, error: null };
    }
    
    try {
      const result = await apiCall('/api/citizen-reports');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch citizen reports:', error);
      return { data: sampleData.citizenReports, error: error.message };
    }
  },

  async updateCitizenReport(id: string, updates: any) {
    const useSample = await shouldUseSampleData('citizen_reports_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to update citizen reports' };
    }
    
    try {
      const result = await apiCall(`/api/citizen-reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Scan Issues
  async getScanIssues() {
    const useSample = await shouldUseSampleData('scan_issues_basic');
    if (useSample) {
      return { data: sampleData.scanIssues, error: null };
    }
    
    try {
      const result = await apiCall('/api/scan-issues');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch scan issues:', error);
      return { data: sampleData.scanIssues, error: error.message };
    }
  },

  // Budget Scenarios
  async getBudgetScenarios() {
    const useSample = await shouldUseSampleData('budget_scenarios_basic');
    if (useSample) {
      return { data: sampleData.budgetScenarios, error: null };
    }
    
    try {
      const result = await apiCall('/api/budget-scenarios');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch budget scenarios:', error);
      return { data: sampleData.budgetScenarios, error: error.message };
    }
  },

  async createBudgetScenario(scenario: any) {
    const useSample = await shouldUseSampleData('budget_scenarios_advanced');
    if (useSample) {
      return { data: null, error: 'Upgrade required to create budget scenarios' };
    }
    
    try {
      const result = await apiCall('/api/budget-scenarios', {
        method: 'POST',
        body: JSON.stringify(scenario)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Users
  async getUsers() {
    try {
      const result = await apiCall('/api/users');
      return { data: result.data || [], error: null };
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      return { data: [], error: error.message };
    }
  },

  async updateUser(id: string, updates: any) {
    try {
      const result = await apiCall(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
};

export default dataService;

import { supabase, getUserOrganization } from '@/lib/supabase';
import { sampleData } from './sampleData';
import { getErrorMessage } from '@/utils/errorHandler';

interface DataServiceOptions {
  forceRealData?: boolean;
}

class DataService {
  private organizationPlan: string | null = null;
  private organizationId: string | null = null;

  // Initialize with user's organization plan
  async initialize() {
    try {
      const organization = await getUserOrganization();
      if (organization) {
        this.organizationPlan = organization.plan;
        this.organizationId = organization.id;
      }
    } catch (error) {
      console.error('Failed to initialize DataService:', error);
      // Default to free plan for demo purposes
      this.organizationPlan = 'free';
    }
  }

  // Determine if we should use sample data or real data
  private shouldUseSampleData(options?: DataServiceOptions): boolean {
    if (options?.forceRealData) return false;
    
    // For free plan users, always show sample data
    // For paid plan users, show real data (empty initially)
    return this.organizationPlan === 'free';
  }

  // CONTRACTORS
  async getContractors(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.contractors, error: null };
    }

    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }

  async createContractor(contractor: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to add real contractors.' } 
      };
    }

    const { data, error } = await supabase
      .from('contractors')
      .insert([{ ...contractor, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  async updateContractor(id: string, updates: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to edit contractors.' } 
      };
    }

    const { data, error } = await supabase
      .from('contractors')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', this.organizationId)
      .select()
      .single();

    return { data, error };
  }

  async deleteContractor(id: string) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to delete contractors.' } 
      };
    }

    const { data, error } = await supabase
      .from('contractors')
      .delete()
      .eq('id', id)
      .eq('organization_id', this.organizationId);

    return { data, error };
  }

  // INSPECTIONS
  async getInspections(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.inspections, error: null };
    }

    const { data, error } = await supabase
      .from('inspections')
      .select(`
        *,
        assets (name, asset_id, type),
        contractors (name, company),
        users!inspector_id (name, email)
      `)
      .eq('organization_id', this.organizationId)
      .order('date', { ascending: false });

    return { data: data || [], error };
  }

  async createInspection(inspection: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to create real inspections.' } 
      };
    }

    const { data, error } = await supabase
      .from('inspections')
      .insert([{ ...inspection, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  // ASSETS
  async getAssets(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.assets, error: null };
    }

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }

  async createAsset(asset: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to manage real assets.' } 
      };
    }

    const { data, error } = await supabase
      .from('assets')
      .insert([{ ...asset, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  // MAINTENANCE TASKS
  async getMaintenanceTasks(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.maintenanceTasks, error: null };
    }

    const { data, error } = await supabase
      .from('maintenance_tasks')
      .select(`
        *,
        assets (name, asset_id),
        contractors (name, company)
      `)
      .eq('organization_id', this.organizationId)
      .order('scheduled_date', { ascending: true });

    return { data: data || [], error };
  }

  async createMaintenanceTask(task: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to schedule real maintenance.' } 
      };
    }

    const { data, error } = await supabase
      .from('maintenance_tasks')
      .insert([{ ...task, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  // PROJECTS
  async getProjects(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.projects, error: null };
    }

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        contractors (name, company)
      `)
      .eq('organization_id', this.organizationId)
      .order('start_date', { ascending: false });

    return { data: data || [], error };
  }

  // FUNDING SOURCES
  async getFundingSources(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.fundingSources, error: null };
    }

    const { data, error } = await supabase
      .from('funding_sources')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }

  async createFundingSource(source: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to manage real funding sources.' } 
      };
    }

    const { data, error } = await supabase
      .from('funding_sources')
      .insert([{ ...source, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  // GRANTS
  async getGrants(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.grants, error: null };
    }

    const { data, error } = await supabase
      .from('grants')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('deadline', { ascending: true });

    return { data: data || [], error };
  }

  // EXPENSES
  async getExpenses(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.expenses, error: null };
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('date', { ascending: false });

    return { data: data || [], error };
  }

  async createExpense(expense: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to track real expenses.' } 
      };
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...expense, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  // CITIZEN REPORTS
  async getCitizenReports(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.citizenReports, error: null };
    }

    const { data, error } = await supabase
      .from('citizen_reports')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('submitted_date', { ascending: false });

    return { data: data || [], error };
  }

  async createCitizenReport(report: any) {
    // Citizen reports can be created even on free plan for demo purposes
    if (this.shouldUseSampleData()) {
      // For demo, just simulate creation
      return { 
        data: { ...report, id: `demo-${Date.now()}` }, 
        error: null 
      };
    }

    const { data, error } = await supabase
      .from('citizen_reports')
      .insert([{ ...report, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  // SCAN ISSUES (AI Road Inspection Data)
  async getScanIssues(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.scanIssues, error: null };
    }

    const { data, error } = await supabase
      .from('scan_issues')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('detected_at', { ascending: false });

    return { data: data || [], error };
  }

  // BUDGET SCENARIOS
  async getBudgetScenarios(options?: DataServiceOptions) {
    if (this.shouldUseSampleData(options)) {
      return { data: sampleData.budgetScenarios, error: null };
    }

    const { data, error } = await supabase
      .from('budget_scenarios')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }

  async createBudgetScenario(scenario: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to create unlimited budget scenarios.' } 
      };
    }

    const { data, error } = await supabase
      .from('budget_scenarios')
      .insert([{ ...scenario, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  // USER MANAGEMENT (Admin only)
  async getUsers() {
    if (this.shouldUseSampleData()) {
      return { data: sampleData.users, error: null };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', this.organizationId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }

  async createUser(user: any) {
    if (this.shouldUseSampleData()) {
      return { 
        data: null, 
        error: { message: 'This is sample data. Upgrade to manage real users.' } 
      };
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ ...user, organization_id: this.organizationId }])
      .select()
      .single();

    return { data, error };
  }

  // ANALYTICS & STATISTICS
  async getAnalytics() {
    if (this.shouldUseSampleData()) {
      return { data: sampleData.analytics, error: null };
    }

    // Complex analytics queries would go here
    // For now, return basic counts
    const [contractorsResult, assetsResult, inspectionsResult, reportsResult] = await Promise.all([
      this.getContractors(),
      this.getAssets(),
      this.getInspections(),
      this.getCitizenReports()
    ]);

    const analytics = {
      totalContractors: contractorsResult.data?.length || 0,
      totalAssets: assetsResult.data?.length || 0,
      totalInspections: inspectionsResult.data?.length || 0,
      totalReports: reportsResult.data?.length || 0,
      completedInspections: inspectionsResult.data?.filter(i => i.status === 'completed').length || 0,
      pendingReports: reportsResult.data?.filter(r => r.status === 'queued').length || 0,
    };

    return { data: analytics, error: null };
  }

  // Utility methods
  getPlanName(): string {
    return this.organizationPlan || 'free';
  }

  isPremiumPlan(): boolean {
    return this.organizationPlan !== 'free';
  }

  getOrganizationId(): string | null {
    return this.organizationId;
  }
}

// Export singleton instance
export const dataService = new DataService();

// Initialize on app load
dataService.initialize().catch(console.error);

export default dataService;

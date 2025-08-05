// Utility functions for plan tracking API
const BASE_URL = '/api/plan-tracking';

export interface PlanTrackingData {
  id?: number;
  page_name: string;
  page_path: string;
  implementation_status: 'pending' | 'in_progress' | 'completed';
  plan_restrictions_implemented: boolean;
  free_plan_behavior?: string;
  basic_plan_behavior?: string;
  pro_plan_behavior?: string;
  premium_plan_behavior?: string;
  enterprise_plan_behavior?: string;
  implementation_notes?: string;
}

export const planTrackingApi = {
  // Initialize the tracking table
  async init() {
    try {
      const response = await fetch(`${BASE_URL}/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to initialize plan tracking:', error);
      return { success: false, error: error?.message || 'Network error' };
    }
  },

  // Seed initial data
  async seed() {
    try {
      const response = await fetch(`${BASE_URL}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to seed plan tracking data:', error);
      return { success: false, error: error?.message || 'Network error' };
    }
  },

  // Get all tracking data
  async getAll() {
    try {
      const response = await fetch(`${BASE_URL}/all`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch plan tracking data:', error);
      return { success: false, error: error?.message || 'Network error' };
    }
  },

  // Update tracking data for a page
  async updatePage(pageId: number, data: Partial<PlanTrackingData>) {
    try {
      const response = await fetch(`${BASE_URL}/update/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update plan tracking data:', error);
      return { success: false, error: error?.message || 'Network error' };
    }
  },

  // Log completion of a page implementation
  async markPageCompleted(pageName: string, behaviors: {
    free?: string;
    basic?: string;
    pro?: string;
    premium?: string;
    enterprise?: string;
  }, notes?: string) {
    try {
      // Ensure tracking system is ready first (non-blocking)
      const readyResult = await ensurePlanTrackingReady();
      if (!readyResult.success) {
        console.warn(`⚠️ Plan tracking not available for ${pageName}, continuing anyway`);
        return { success: false, error: 'Tracking system unavailable' };
      }

      // First get all data to find the page
      const allData = await this.getAll();
      if (!allData.success) {
        console.warn(`⚠️ Could not track completion for ${pageName}: ${allData.error}`);
        return { success: false, error: allData.error };
      }

      const page = allData.data.find((p: any) => p.page_name === pageName);
      if (!page) {
        console.warn(`⚠️ Page ${pageName} not found in tracking data`);
        return { success: false, error: 'Page not found' };
      }

      const result = await this.updatePage(page.id, {
        implementation_status: 'completed',
        plan_restrictions_implemented: true,
        free_plan_behavior: behaviors.free,
        basic_plan_behavior: behaviors.basic,
        pro_plan_behavior: behaviors.pro,
        premium_plan_behavior: behaviors.premium,
        enterprise_plan_behavior: behaviors.enterprise,
        implementation_notes: notes
      });

      if (result.success) {
        console.log(`✅ Tracked completion of ${pageName}`);
      } else {
        console.warn(`⚠️ Failed to track completion for ${pageName}: ${result.error}`);
      }

      return result;
    } catch (error) {
      console.warn(`⚠️ Error tracking completion for ${pageName}:`, error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }
};

// Track initialization state
let isInitialized = false;
let initPromise: Promise<any> | null = null;

// Lazy initialization function
export const ensurePlanTrackingReady = async () => {
  if (isInitialized) return { success: true };

  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // First check if the service is healthy
      console.log('🔍 Checking plan tracking service health...');

      try {
        const healthResponse = await fetch(`${BASE_URL}/health`);
        if (!healthResponse.ok) {
          throw new Error(`Health check failed: HTTP ${healthResponse.status}`);
        }
        const healthData = await healthResponse.json();
        if (!healthData.success) {
          throw new Error(`Health check failed: ${healthData.error}`);
        }
        console.log('✅ Plan tracking service is healthy');
      } catch (healthError) {
        console.warn('⚠️ Plan tracking health check failed, service may not be ready:', healthError);
        return { success: false, error: `Service health check failed: ${healthError?.message}` };
      }

      const initResult = await planTrackingApi.init();
      if (initResult.success) {
        console.log('✅ Plan tracking initialized');

        // Seed data if needed
        const seedResult = await planTrackingApi.seed();
        if (seedResult.success) {
          console.log('✅ Plan tracking data seeded');
        } else {
          console.warn('⚠️ Plan tracking seed failed, continuing anyway:', seedResult.error);
        }

        isInitialized = true;
        return { success: true };
      } else {
        console.warn('⚠️ Plan tracking init failed, will work offline:', initResult.error);
        return { success: false, error: initResult.error };
      }
    } catch (error) {
      console.warn('⚠️ Plan tracking initialization error, will work offline:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
};

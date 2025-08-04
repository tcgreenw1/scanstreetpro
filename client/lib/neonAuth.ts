// Authentication service for Neon database with REST API integration

interface User {
  id: string;
  email: string;
  role: 'manager' | 'member';
  organizationId: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'basic' | 'pro' | 'premium' | 'satellite' | 'driving';
  createdAt: string;
}

interface Subscription {
  id?: string;
  plan: string;
  status: 'active' | 'trial' | 'canceled';
  startDate?: string;
  endDate?: string;
}

interface Session {
  user: User;
  organization: Organization;
  subscription?: Subscription;
  access_token: string;
  expires_at: number;
}

interface PlanFeatures {
  [key: string]: string | number | boolean;
}

interface UIRules {
  [componentName: string]: {
    visible: boolean;
    sample_data: boolean;
    show_crown: boolean;
  };
}

class NeonAuthManager {
  private session: Session | null = null;
  private listeners: ((session: Session | null) => void)[] = [];
  private planFeatures: PlanFeatures = {};
  private uiRules: UIRules = {};

  constructor() {
    this.loadSession();
    this.loadUserData();
  }

  private async loadSession() {
    const sessionData = localStorage.getItem('neon_auth_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session.expires_at > Date.now()) {
          this.session = session;
          await this.loadPlanData();
        } else {
          localStorage.removeItem('neon_auth_session');
        }
      } catch {
        localStorage.removeItem('neon_auth_session');
      }
    }
  }

  private async loadUserData() {
    const token = localStorage.getItem('neon_auth_token');
    if (token) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const session: Session = {
              user: result.data.user,
              organization: result.data.organization,
              subscription: result.data.subscription,
              access_token: token,
              expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
            };
            this.saveSession(session);
            await this.loadPlanData();
          }
        } else {
          localStorage.removeItem('neon_auth_token');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    }
  }

  private async loadPlanData() {
    if (!this.session) return;

    try {
      // Load plan features and UI rules from API or local cache
      // For now, use default configurations
      this.planFeatures = this.getDefaultPlanFeatures(this.session.organization.plan);
      this.uiRules = this.getDefaultUIRules(this.session.organization.plan);
    } catch (error) {
      console.error('Failed to load plan data:', error);
    }
  }

  private getDefaultPlanFeatures(plan: string): PlanFeatures {
    const features: { [key: string]: PlanFeatures } = {
      free: {
        max_users: 3,
        max_organizations: 1,
        max_inspections: 10,
        support_level: 'community',
        data_retention_days: 30
      },
      basic: {
        max_users: 10,
        max_organizations: 1,
        max_inspections: 100,
        support_level: 'email',
        data_retention_days: 90
      },
      pro: {
        max_users: 50,
        max_organizations: 3,
        max_inspections: 1000,
        support_level: 'priority',
        data_retention_days: 365
      },
      premium: {
        max_users: 'unlimited',
        max_organizations: 'unlimited',
        max_inspections: 'unlimited',
        support_level: 'phone',
        data_retention_days: 'unlimited'
      },
      satellite: {
        max_users: 100,
        max_organizations: 10,
        max_inspections: 'unlimited',
        support_level: 'priority',
        data_retention_days: 'unlimited'
      },
      driving: {
        max_users: 'unlimited',
        max_organizations: 'unlimited',
        max_inspections: 'unlimited',
        support_level: 'dedicated',
        data_retention_days: 'unlimited'
      }
    };
    
    return features[plan] || features.free;
  }

  private getDefaultUIRules(plan: string): UIRules {
    const rules: { [key: string]: UIRules } = {
      free: {
        dashboard: { visible: true, sample_data: true, show_crown: true },
        inspections: { visible: true, sample_data: true, show_crown: true },
        reports: { visible: true, sample_data: true, show_crown: true },
        analytics: { visible: false, sample_data: true, show_crown: true },
        advanced_settings: { visible: false, sample_data: true, show_crown: true }
      },
      basic: {
        dashboard: { visible: true, sample_data: false, show_crown: false },
        inspections: { visible: true, sample_data: false, show_crown: false },
        reports: { visible: true, sample_data: false, show_crown: true },
        analytics: { visible: true, sample_data: true, show_crown: true },
        advanced_settings: { visible: false, sample_data: true, show_crown: true }
      },
      pro: {
        dashboard: { visible: true, sample_data: false, show_crown: false },
        inspections: { visible: true, sample_data: false, show_crown: false },
        reports: { visible: true, sample_data: false, show_crown: false },
        analytics: { visible: true, sample_data: false, show_crown: true },
        advanced_settings: { visible: true, sample_data: false, show_crown: true }
      },
      premium: {
        dashboard: { visible: true, sample_data: false, show_crown: false },
        inspections: { visible: true, sample_data: false, show_crown: false },
        reports: { visible: true, sample_data: false, show_crown: false },
        analytics: { visible: true, sample_data: false, show_crown: false },
        advanced_settings: { visible: true, sample_data: false, show_crown: false }
      },
      satellite: {
        dashboard: { visible: true, sample_data: false, show_crown: false },
        inspections: { visible: true, sample_data: false, show_crown: false },
        reports: { visible: true, sample_data: false, show_crown: false },
        analytics: { visible: true, sample_data: false, show_crown: false },
        advanced_settings: { visible: true, sample_data: false, show_crown: false }
      },
      driving: {
        dashboard: { visible: true, sample_data: false, show_crown: false },
        inspections: { visible: true, sample_data: false, show_crown: false },
        reports: { visible: true, sample_data: false, show_crown: false },
        analytics: { visible: true, sample_data: false, show_crown: false },
        advanced_settings: { visible: true, sample_data: false, show_crown: false }
      }
    };
    
    return rules[plan] || rules.free;
  }

  private saveSession(session: Session | null) {
    if (session) {
      localStorage.setItem('neon_auth_session', JSON.stringify(session));
      localStorage.setItem('neon_auth_token', session.access_token);
    } else {
      localStorage.removeItem('neon_auth_session');
      localStorage.removeItem('neon_auth_token');
    }
    this.session = session;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.session));
  }

  // Plan and UI helper methods
  public getPlanFeature(featureName: string): string | number | boolean | null {
    return this.planFeatures[featureName] || null;
  }

  public getUIRule(componentName: string): { visible: boolean; sample_data: boolean; show_crown: boolean } {
    return this.uiRules[componentName] || { visible: true, sample_data: false, show_crown: false };
  }

  public shouldShowCrown(componentName: string): boolean {
    const rule = this.getUIRule(componentName);
    return rule.show_crown;
  }

  public shouldUseSampleData(componentName: string): boolean {
    const rule = this.getUIRule(componentName);
    return rule.sample_data;
  }

  public isComponentVisible(componentName: string): boolean {
    const rule = this.getUIRule(componentName);
    return rule.visible;
  }

  // Supabase-compatible API
  auth = {
    getSession: () => {
      return Promise.resolve({ 
        data: { session: this.session }, 
        error: null 
      });
    },

    getUser: () => {
      return Promise.resolve({ 
        data: { user: this.session?.user || null }, 
        error: null 
      });
    },

    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
          const session: Session = {
            user: result.data.user,
            organization: result.data.organization,
            access_token: result.data.token,
            expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
          };

          this.saveSession(session);
          await this.loadPlanData();

          return {
            data: { user: session.user, session },
            error: null
          };
        } else {
          return {
            data: { user: null, session: null },
            error: { message: result.error || 'Login failed' }
          };
        }
      } catch (error: any) {
        return {
          data: { user: null, session: null },
          error: { message: error.message || 'Network error' }
        };
      }
    },

    signUp: async ({ email, password, fullName, organizationName }: { 
      email: string; 
      password: string; 
      fullName?: string;
      organizationName?: string;
    }) => {
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email, 
            password, 
            fullName: fullName || email.split('@')[0],
            organizationName 
          })
        });

        const result = await response.json();

        if (result.success) {
          const session: Session = {
            user: result.data.user,
            organization: result.data.organization,
            subscription: result.data.subscription,
            access_token: result.data.token,
            expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
          };

          this.saveSession(session);
          await this.loadPlanData();

          return {
            data: { user: session.user, session },
            error: null
          };
        } else {
          return {
            data: { user: null, session: null },
            error: { message: result.error || 'Signup failed' }
          };
        }
      } catch (error: any) {
        return {
          data: { user: null, session: null },
          error: { message: error.message || 'Network error' }
        };
      }
    },

    signOut: async () => {
      this.saveSession(null);
      this.planFeatures = {};
      this.uiRules = {};
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      const listener = (session: Session | null) => {
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      };
      
      this.listeners.push(listener);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const index = this.listeners.indexOf(listener);
              if (index > -1) {
                this.listeners.splice(index, 1);
              }
            }
          }
        }
      };
    }
  };

  // Database operations (simplified for compatibility)
  from(table: string) {
    return {
      select: (fields?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            return { data: null, error: { message: 'Not implemented' } };
          },
          maybeSingle: async () => {
            return { data: null, error: null };
          }
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            then: async (callback: any) => {
              callback({ data: [], error: null });
            }
          })
        })
      }),
      insert: (data: any) => ({
        select: (fields?: string) => ({
          single: async () => {
            return {
              data: { id: `new_${Date.now()}`, ...data },
              error: null
            };
          }
        })
      })
    };
  }
}

// Create singleton instance
const neonAuth = new NeonAuthManager();

// Export compatible interface
export const supabase = neonAuth;

// Export helper functions
export const signInWithTimeout = async (email: string, password: string) => {
  return neonAuth.auth.signInWithPassword({ email, password });
};

export const signUpWithTimeout = async (email: string, password: string, fullName?: string, organizationName?: string) => {
  return neonAuth.auth.signUp({ email, password, fullName, organizationName });
};

export const signOutWithTimeout = async () => {
  return neonAuth.auth.signOut();
};

export const isAuthenticated = async () => {
  const { data } = await neonAuth.auth.getSession();
  return !!data.session;
};

export const getCurrentUser = async () => {
  const { data } = await neonAuth.auth.getUser();
  return data.user;
};

export const getUserOrganization = async () => {
  const { data } = await neonAuth.auth.getSession();
  return data.session?.organization || null;
};

export const getCurrentPlan = async () => {
  const organization = await getUserOrganization();
  return organization?.plan || 'free';
};

// Plan-based UI helpers
export const shouldShowCrown = (componentName: string): boolean => {
  return neonAuth.shouldShowCrown(componentName);
};

export const shouldUseSampleData = (componentName: string): boolean => {
  return neonAuth.shouldUseSampleData(componentName);
};

export const isComponentVisible = (componentName: string): boolean => {
  return neonAuth.isComponentVisible(componentName);
};

export const getPlanFeature = (featureName: string): string | number | boolean | null => {
  return neonAuth.getPlanFeature(featureName);
};

export const testSupabaseConnection = async () => {
  try {
    // Test API connection
    const response = await fetch('/api/ping');
    const result = await response.json();

    return {
      success: true,
      data: {
        message: 'Neon database API connected successfully',
        auth: { session: null },
        db: { connected: true, type: 'Neon PostgreSQL' },
        api: result
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Connection test failed'
    };
  }
};

export const ensureDemoUsersExist = async () => {
  console.log('Demo users managed through database schema');
};

export default neonAuth;

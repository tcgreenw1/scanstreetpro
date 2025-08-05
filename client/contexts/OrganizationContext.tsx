import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlanType, PLAN_FEATURES, PlanFeatures, getPagePermissions, canUseFeature } from '../lib/planPermissions';

export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  planExpiry?: Date;
  isActive: boolean;
  settings: {
    timezone: string;
    currency: string;
    logoUrl?: string;
  };
  usage: {
    exportsThisMonth: number;
    teamMembers: number;
    rescansThisYear: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  organizationId: string;
  isActive: boolean;
  lastLogin?: Date;
}

interface OrganizationContextType {
  user: User | null;
  organization: Organization | null;
  planFeatures: PlanFeatures | null;
  isLoading: boolean;
  error: string | null;
  
  // Plan utilities
  canAccess: (feature: keyof PlanFeatures) => boolean;
  getPagePermissions: (page: string) => any;
  shouldShowUpgrade: () => boolean;
  isFeatureUnlocked: (feature: string) => boolean;
  
  // Usage tracking
  incrementUsage: (feature: string) => Promise<boolean>;
  getRemainingUsage: (feature: string) => number | 'unlimited';
  
  // Data management
  refreshUserData: () => Promise<void>;
  updateOrganization: (updates: Partial<Organization>) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get plan features based on current organization plan
  const planFeatures = organization ? PLAN_FEATURES[organization.plan] : null;

  // Initialize user and organization data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if user is logged in
        const authToken = localStorage.getItem('neon_auth_token') || localStorage.getItem('authToken');
        if (!authToken) {
          setIsLoading(false);
          return;
        }

        // Fetch user data from API/database
        const userData = await fetchUserData(authToken);
        setUser(userData);

        // Fetch organization data
        if (userData?.organizationId) {
          const orgData = await fetchOrganizationData(userData.organizationId);
          setOrganization(orgData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data');
        console.error('Failed to initialize user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch user data from database
  const fetchUserData = async (authToken: string): Promise<User> => {
    try {
      // First try the main auth endpoint
      let response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      // If main auth fails, try mock auth as fallback
      if (!response.ok && authToken === 'mock-admin-token-12345') {
        response = await fetch('/api/mock/me', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
      }

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.user) {
          return {
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.name || result.data.user.email.split('@')[0],
            role: result.data.user.role,
            organizationId: result.data.user.organizationId,
            isActive: result.data.user.isActive !== false,
            lastLogin: result.data.user.lastLogin ? new Date(result.data.user.lastLogin) : new Date()
          };
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }

    // Fallback to mock data if database fails
    return {
      id: 'user-1',
      email: 'admin@city.gov',
      name: 'Tyler Greenwood',
      role: 'admin',
      organizationId: 'org-1',
      isActive: true,
      lastLogin: new Date()
    };
  };

  // Fetch organization data from database
  const fetchOrganizationData = async (orgId: string): Promise<Organization> => {
    try {
      const authToken = localStorage.getItem('authToken') || localStorage.getItem('neon_auth_token');

      if (authToken) {
        // First try the main organization endpoint
        let response = await fetch(`/api/organizations/${orgId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        // If main endpoint fails, try mock endpoint
        if (!response.ok && authToken === 'mock-admin-token-12345') {
          response = await fetch(`/api/mock/organizations/${orgId}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
        }

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const org = result.data;
            return {
              id: org.id,
              name: org.name,
              plan: org.plan || 'free', // Ensure we have a plan
              planExpiry: org.planExpiry ? new Date(org.planExpiry) : new Date('2024-12-31'),
              isActive: org.isActive !== false,
              settings: {
                timezone: org.timezone || 'America/New_York',
                currency: org.currency || 'USD',
                logoUrl: org.logoUrl || '/city-logo.png'
              },
              usage: {
                exportsThisMonth: org.exportsThisMonth || 0,
                teamMembers: org.teamMembers || 1,
                rescansThisYear: org.rescansThisYear || 0
              }
            };
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch organization data:', error);
    }

    // Fallback to mock data with different plans for testing
    // Check URL or localStorage for test plan override
    const testPlan = localStorage.getItem('testPlan') ||
                     new URLSearchParams(window.location.search).get('plan') ||
                     'free';

    const validPlans = ['free', 'basic', 'pro', 'premium', 'satellite_enterprise', 'driving_enterprise'];
    const planToUse = validPlans.includes(testPlan) ? testPlan : 'free';

    return {
      id: orgId,
      name: 'City of Springfield',
      plan: planToUse as PlanType,
      planExpiry: new Date('2024-12-31'),
      isActive: true,
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        logoUrl: '/city-logo.png'
      },
      usage: {
        exportsThisMonth: planToUse === 'free' ? 1 : 0, // Free plan has used 1 export
        teamMembers: planToUse === 'free' ? 1 : planToUse === 'basic' ? 3 : 10,
        rescansThisYear: planToUse === 'free' ? 0 : 1
      }
    };
  };

  // Check if user can access a feature
  const canAccess = (feature: keyof PlanFeatures): boolean => {
    if (!organization) return false;
    return canUseFeature(organization.plan, feature);
  };

  // Get page permissions
  const getPagePermissionsWrapper = (page: string) => {
    if (!organization) return { canAccess: false, requiresUpgrade: true, lockedFeatures: [], showCrownIcon: true };
    return getPagePermissions(organization.plan, page);
  };

  // Check if should show upgrade banner
  const shouldShowUpgrade = (): boolean => {
    if (!organization) return true;
    return organization.plan === 'free' || organization.plan === 'basic';
  };

  // Check if specific feature is unlocked
  const isFeatureUnlocked = (feature: string): boolean => {
    if (!organization || !planFeatures) return false;
    
    // Map feature names to plan features
    const featureMap: Record<string, keyof PlanFeatures> = {
      'assetManagement': 'assetManagement',
      'maintenanceScheduling': 'maintenanceScheduling',
      'citizenEngagement': 'citizenEngagement',
      'contractorManagement': 'contractorManagement',
      'fundingCenter': 'fundingCenter',
      'customizableReports': 'customizableReports',
      'fullIntegrations': 'fullIntegrations',
      'mobileApp': 'mobileApp',
      'aiAssistance': 'aiAssistance'
    };

    const planFeature = featureMap[feature];
    return planFeature ? canAccess(planFeature) : false;
  };

  // Increment usage tracking
  const incrementUsage = async (feature: string): Promise<boolean> => {
    if (!organization) return false;

    try {
      // This would connect to your database to track usage
      // For now, just update local state
      const updatedOrg = { ...organization };
      
      switch (feature) {
        case 'export':
          if (planFeatures?.exportsPerMonth !== -1 && 
              updatedOrg.usage.exportsThisMonth >= (planFeatures?.exportsPerMonth || 0)) {
            return false; // Usage limit exceeded
          }
          updatedOrg.usage.exportsThisMonth += 1;
          break;
        case 'rescan':
          if (planFeatures?.rescansPerYear !== -1 && 
              updatedOrg.usage.rescansThisYear >= (planFeatures?.rescansPerYear || 0)) {
            return false; // Usage limit exceeded
          }
          updatedOrg.usage.rescansThisYear += 1;
          break;
      }
      
      setOrganization(updatedOrg);
      // TODO: Save to database
      return true;
    } catch (err) {
      console.error('Failed to increment usage:', err);
      return false;
    }
  };

  // Get remaining usage for a feature
  const getRemainingUsage = (feature: string): number | 'unlimited' => {
    if (!organization || !planFeatures) return 0;

    switch (feature) {
      case 'export':
        if (planFeatures.exportsPerMonth === -1) return 'unlimited';
        return Math.max(0, planFeatures.exportsPerMonth - organization.usage.exportsThisMonth);
      case 'rescan':
        if (planFeatures.rescansPerYear === -1) return 'unlimited';
        return Math.max(0, planFeatures.rescansPerYear - organization.usage.rescansThisYear);
      case 'teamMembers':
        if (planFeatures.teamMembers === -1) return 'unlimited';
        return Math.max(0, planFeatures.teamMembers - organization.usage.teamMembers);
      default:
        return 0;
    }
  };

  // Refresh user data
  const refreshUserData = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        const userData = await fetchUserData(authToken);
        setUser(userData);
        
        if (userData.organizationId) {
          const orgData = await fetchOrganizationData(userData.organizationId);
          setOrganization(orgData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh user data');
    }
  };

  // Update organization
  const updateOrganization = async (updates: Partial<Organization>): Promise<void> => {
    if (!organization) return;

    try {
      const updatedOrg = { ...organization, ...updates };
      setOrganization(updatedOrg);
      // TODO: Save to database
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization');
    }
  };

  const contextValue: OrganizationContextType = {
    user,
    organization,
    planFeatures,
    isLoading,
    error,
    canAccess,
    getPagePermissions: getPagePermissionsWrapper,
    shouldShowUpgrade,
    isFeatureUnlocked,
    incrementUsage,
    getRemainingUsage,
    refreshUserData,
    updateOrganization
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

// Hook for checking specific permissions
export const usePermissions = () => {
  const { canAccess, getPagePermissions, shouldShowUpgrade, isFeatureUnlocked } = useOrganization();
  
  return {
    canAccess,
    getPagePermissions,
    shouldShowUpgrade,
    isFeatureUnlocked
  };
};

// Hook for usage tracking
export const useUsageTracking = () => {
  const { incrementUsage, getRemainingUsage, organization, planFeatures } = useOrganization();
  
  return {
    incrementUsage,
    getRemainingUsage,
    hasUsageLimit: (feature: string) => {
      if (!planFeatures) return false;
      switch (feature) {
        case 'export': return planFeatures.exportsPerMonth !== -1;
        case 'rescan': return planFeatures.rescansPerYear !== -1;
        case 'teamMembers': return planFeatures.teamMembers !== -1;
        default: return false;
      }
    },
    isUsageLimitReached: (feature: string) => {
      const remaining = getRemainingUsage(feature);
      return remaining !== 'unlimited' && remaining <= 0;
    }
  };
};

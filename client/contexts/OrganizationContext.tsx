import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlanType, PLAN_FEATURES, PlanFeatures, getPagePermissions, canUseFeature } from '../lib/planPermissions';
import { useAuth } from './AuthContext';
import { getPlanOverride } from '../utils/planOverride';

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
  const { user: authUser, organization: authOrganization, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Use data from AuthContext, with fallback for testing
  const user: User | null = authUser ? {
    id: authUser.id,
    email: authUser.email,
    name: authUser.name || authUser.email.split('@')[0],
    role: authUser.role as 'admin' | 'manager' | 'user',
    organizationId: authUser.organizationId,
    isActive: true,
    lastLogin: new Date()
  } : null;

  const organization: Organization | null = authOrganization ? {
    id: authOrganization.id,
    name: authOrganization.name,
    plan: authOrganization.plan as PlanType,
    planExpiry: new Date('2024-12-31'),
    isActive: true,
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      logoUrl: '/city-logo.png'
    },
    usage: {
      exportsThisMonth: 0,
      teamMembers: 1,
      rescansThisYear: 0
    }
  } : (() => {
    // Fallback to test plan for development/testing
    const testPlan = localStorage.getItem('testPlan') ||
                     new URLSearchParams(window.location.search).get('plan') ||
                     'free';
    const validPlans = ['free', 'basic', 'pro', 'premium', 'satellite_enterprise', 'driving_enterprise'];
    const planToUse = validPlans.includes(testPlan) ? testPlan : 'free';

    return {
      id: 'test-org',
      name: 'Test Organization',
      plan: planToUse as PlanType,
      planExpiry: new Date('2024-12-31'),
      isActive: true,
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        logoUrl: '/city-logo.png'
      },
      usage: {
        exportsThisMonth: planToUse === 'free' ? 1 : 0,
        teamMembers: planToUse === 'free' ? 1 : planToUse === 'basic' ? 3 : 10,
        rescansThisYear: planToUse === 'free' ? 0 : 1
      }
    };
  })();

  const isLoading = authLoading;

  // Debug logging
  console.log('🔍 OrganizationContext DEBUG:', {
    authUser,
    authOrganization,
    authLoading,
    finalUser: user,
    finalOrganization: organization,
    finalPlan: organization?.plan
  });

  // Get plan features based on current organization plan
  const planFeatures = organization ? PLAN_FEATURES[organization.plan] : null;

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

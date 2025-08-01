import { createContext, useContext, ReactNode, useState } from 'react';

export type PlanType = 'free' | 'standard' | 'pro' | 'enterprise';

export interface PlanFeatures {
  maxAssets: number;
  maxCitizenSubmissions: number;
  maxExportsPerMonth: number;
  maxTeamMembers: number;
  hasAdvancedDashboard: boolean;
  hasAssetManagement: boolean;
  hasSatelliteScans: boolean;
  hasDrivingScans: boolean;
  hasMaintenanceCalendar: boolean;
  hasInspectionTools: boolean;
  hasContractorDatabase: boolean;
  hasBudgetPlanner: boolean;
  hasIntegrations: boolean;
  hasAPIAccess: boolean;
  hasWhiteLabeling: boolean;
  removeBranding: boolean;
}

export interface PlanDetails {
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeatures;
  popular?: boolean;
}

const PLAN_CONFIGS: Record<PlanType, PlanDetails> = {
  free: {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for small organizations getting started',
    features: {
      maxAssets: 20,
      maxCitizenSubmissions: 10,
      maxExportsPerMonth: 1,
      maxTeamMembers: 1,
      hasAdvancedDashboard: false,
      hasAssetManagement: false,
      hasSatelliteScans: false,
      hasDrivingScans: false,
      hasMaintenanceCalendar: false,
      hasInspectionTools: false,
      hasContractorDatabase: false,
      hasBudgetPlanner: false,
      hasIntegrations: false,
      hasAPIAccess: false,
      hasWhiteLabeling: false,
      removeBranding: false
    }
  },
  standard: {
    name: 'Standard',
    price: 99,
    period: 'month',
    description: 'Great for growing organizations',
    features: {
      maxAssets: -1, // unlimited
      maxCitizenSubmissions: -1,
      maxExportsPerMonth: -1,
      maxTeamMembers: 3,
      hasAdvancedDashboard: false,
      hasAssetManagement: true,
      hasSatelliteScans: false,
      hasDrivingScans: false,
      hasMaintenanceCalendar: true,
      hasInspectionTools: true,
      hasContractorDatabase: true,
      hasBudgetPlanner: false,
      hasIntegrations: false,
      hasAPIAccess: false,
      hasWhiteLabeling: false,
      removeBranding: true
    }
  },
  pro: {
    name: 'Pro',
    price: 249,
    period: 'month',
    description: 'Advanced features for larger organizations',
    popular: true,
    features: {
      maxAssets: -1,
      maxCitizenSubmissions: -1,
      maxExportsPerMonth: -1,
      maxTeamMembers: 10,
      hasAdvancedDashboard: true,
      hasAssetManagement: true,
      hasSatelliteScans: true,
      hasDrivingScans: false,
      hasMaintenanceCalendar: true,
      hasInspectionTools: true,
      hasContractorDatabase: true,
      hasBudgetPlanner: true,
      hasIntegrations: false,
      hasAPIAccess: false,
      hasWhiteLabeling: false,
      removeBranding: true
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 0, // Contact sales
    period: 'custom',
    description: 'Complete solution for large organizations',
    features: {
      maxAssets: -1,
      maxCitizenSubmissions: -1,
      maxExportsPerMonth: -1,
      maxTeamMembers: -1,
      hasAdvancedDashboard: true,
      hasAssetManagement: true,
      hasSatelliteScans: true,
      hasDrivingScans: true,
      hasMaintenanceCalendar: true,
      hasInspectionTools: true,
      hasContractorDatabase: true,
      hasBudgetPlanner: true,
      hasIntegrations: true,
      hasAPIAccess: true,
      hasWhiteLabeling: true,
      removeBranding: true
    }
  }
};

interface UsageStats {
  assetsUsed: number;
  citizenSubmissionsUsed: number;
  exportsUsed: number;
  teamMembersUsed: number;
}

interface PricingContextType {
  currentPlan: PlanType;
  planDetails: PlanDetails;
  features: PlanFeatures;
  usage: UsageStats;
  upgradePlan: (plan: PlanType) => void;
  hasFeature: (feature: keyof PlanFeatures) => boolean;
  isWithinLimit: (limit: keyof UsageStats) => boolean;
  getUpgradePrompt: (feature: keyof PlanFeatures) => string;
  getAllPlans: () => Record<PlanType, PlanDetails>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

interface PricingProviderProps {
  children: ReactNode;
}

export function PricingProvider({ children }: PricingProviderProps) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [usage, setUsage] = useState<UsageStats>({
    assetsUsed: 12,
    citizenSubmissionsUsed: 3,
    exportsUsed: 0,
    teamMembersUsed: 1
  });

  const planDetails = PLAN_CONFIGS[currentPlan];
  const features = planDetails.features;

  const upgradePlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    // In a real app, this would call an API to update the subscription
    console.log(`Upgrading to ${plan} plan`);
  };

  const hasFeature = (feature: keyof PlanFeatures): boolean => {
    return features[feature] as boolean;
  };

  const isWithinLimit = (limit: keyof UsageStats): boolean => {
    const maxLimit = features[`max${limit.charAt(0).toUpperCase() + limit.slice(1).replace('Used', '')}` as keyof PlanFeatures] as number;
    if (maxLimit === -1) return true; // unlimited
    return usage[limit] < maxLimit;
  };

  const getUpgradePrompt = (feature: keyof PlanFeatures): string => {
    if (currentPlan === 'free') {
      if (features[feature]) return '';
      if (PLAN_CONFIGS.standard.features[feature]) return 'Upgrade to Standard to access this feature';
      if (PLAN_CONFIGS.pro.features[feature]) return 'Upgrade to Pro to access this feature';
      return 'Upgrade to Enterprise to access this feature';
    }
    if (currentPlan === 'standard') {
      if (features[feature]) return '';
      if (PLAN_CONFIGS.pro.features[feature]) return 'Upgrade to Pro to access this feature';
      return 'Upgrade to Enterprise to access this feature';
    }
    if (currentPlan === 'pro') {
      if (features[feature]) return '';
      return 'Upgrade to Enterprise to access this feature';
    }
    return '';
  };

  const getAllPlans = () => PLAN_CONFIGS;

  return (
    <PricingContext.Provider value={{
      currentPlan,
      planDetails,
      features,
      usage,
      upgradePlan,
      hasFeature,
      isWithinLimit,
      getUpgradePrompt,
      getAllPlans
    }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}

// Helper component for feature gates
interface FeatureGateProps {
  feature: keyof PlanFeatures;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { hasFeature } = usePricing();
  
  if (hasFeature(feature)) {
    return <>{children}</>;
  }
  
  return <>{fallback || null}</>;
}

// Helper component for upgrade prompts
interface UpgradePromptProps {
  feature: keyof PlanFeatures;
  className?: string;
  children?: ReactNode;
}

export function UpgradePrompt({ feature, className, children }: UpgradePromptProps) {
  const { getUpgradePrompt, hasFeature } = usePricing();
  
  if (hasFeature(feature)) return null;
  
  const prompt = getUpgradePrompt(feature);
  
  return (
    <div className={`bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 ${className}`}>
      <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
        {prompt}
      </p>
      {children}
    </div>
  );
}

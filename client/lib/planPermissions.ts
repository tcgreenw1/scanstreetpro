export type PlanType = 'free' | 'basic' | 'pro' | 'premium' | 'satellite_enterprise' | 'driving_enterprise';

export interface PlanFeatures {
  // Data access
  sampleDataOnly: boolean;
  realTimeData: boolean;
  
  // Core features
  assetManagement: boolean;
  budgetSimulations: boolean;
  expenseManagement: boolean;
  maintenanceScheduling: boolean;
  citizenEngagement: boolean;
  
  // Team & collaboration
  teamMembers: number;
  interactiveCalendar: boolean;
  
  // Reports & exports
  exportsPerMonth: number;
  customizableReports: boolean;
  councilReports: boolean;
  
  // Advanced features
  contractorManagement: boolean;
  roadInspectionDashboard: boolean;
  fundingCenter: boolean;
  fullIntegrations: boolean;
  
  // Mobile & web
  mobileApp: boolean;
  websiteIntegrations: boolean;
  
  // Support & enterprise
  dedicatedSupport: boolean;
  aiAssistance: boolean;
  engineeringAssistance: boolean;
  
  // Scanning & frequency
  rescansPerYear: number;
  scanningFrequencyDashboard: boolean;
  
  // Map features
  mapAccess: 'openstreetmap' | 'enhanced' | 'full';
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  free: {
    sampleDataOnly: true,
    realTimeData: false,
    assetManagement: false,
    budgetSimulations: false,
    expenseManagement: false,
    maintenanceScheduling: false,
    citizenEngagement: false,
    teamMembers: 1,
    interactiveCalendar: false,
    exportsPerMonth: 1,
    customizableReports: false,
    councilReports: false,
    contractorManagement: false,
    roadInspectionDashboard: false,
    fundingCenter: false,
    fullIntegrations: false,
    mobileApp: false,
    websiteIntegrations: false,
    dedicatedSupport: false,
    aiAssistance: false,
    engineeringAssistance: false,
    rescansPerYear: 0,
    scanningFrequencyDashboard: false,
    mapAccess: 'openstreetmap'
  },
  
  basic: {
    sampleDataOnly: false,
    realTimeData: true,
    assetManagement: true,
    budgetSimulations: true,
    expenseManagement: true,
    maintenanceScheduling: false,
    citizenEngagement: false,
    teamMembers: 3,
    interactiveCalendar: true,
    exportsPerMonth: 1,
    customizableReports: false,
    councilReports: false,
    contractorManagement: false,
    roadInspectionDashboard: false,
    fundingCenter: false,
    fullIntegrations: false,
    mobileApp: false,
    websiteIntegrations: false,
    dedicatedSupport: false,
    aiAssistance: false,
    engineeringAssistance: false,
    rescansPerYear: 0,
    scanningFrequencyDashboard: false,
    mapAccess: 'enhanced'
  },
  
  pro: {
    sampleDataOnly: false,
    realTimeData: true,
    assetManagement: true,
    budgetSimulations: true,
    expenseManagement: true,
    maintenanceScheduling: true,
    citizenEngagement: true,
    teamMembers: 10,
    interactiveCalendar: true,
    exportsPerMonth: -1, // unlimited
    customizableReports: true,
    councilReports: false,
    contractorManagement: true,
    roadInspectionDashboard: true,
    fundingCenter: true,
    fullIntegrations: true,
    mobileApp: false,
    websiteIntegrations: false,
    dedicatedSupport: false,
    aiAssistance: false,
    engineeringAssistance: false,
    rescansPerYear: 1,
    scanningFrequencyDashboard: false,
    mapAccess: 'full'
  },
  
  premium: {
    sampleDataOnly: false,
    realTimeData: true,
    assetManagement: true,
    budgetSimulations: true,
    expenseManagement: true,
    maintenanceScheduling: true,
    citizenEngagement: true,
    teamMembers: -1, // unlimited
    interactiveCalendar: true,
    exportsPerMonth: -1, // unlimited
    customizableReports: true,
    councilReports: false,
    contractorManagement: true,
    roadInspectionDashboard: true,
    fundingCenter: true,
    fullIntegrations: true,
    mobileApp: true,
    websiteIntegrations: true,
    dedicatedSupport: true,
    aiAssistance: false,
    engineeringAssistance: false,
    rescansPerYear: 2,
    scanningFrequencyDashboard: true,
    mapAccess: 'full'
  },
  
  satellite_enterprise: {
    sampleDataOnly: false,
    realTimeData: true,
    assetManagement: true,
    budgetSimulations: true,
    expenseManagement: true,
    maintenanceScheduling: true,
    citizenEngagement: true,
    teamMembers: -1, // unlimited
    interactiveCalendar: true,
    exportsPerMonth: -1, // unlimited
    customizableReports: true,
    councilReports: true,
    contractorManagement: true,
    roadInspectionDashboard: true,
    fundingCenter: true,
    fullIntegrations: true,
    mobileApp: true,
    websiteIntegrations: true,
    dedicatedSupport: true,
    aiAssistance: true,
    engineeringAssistance: true,
    rescansPerYear: 5,
    scanningFrequencyDashboard: true,
    mapAccess: 'full'
  },
  
  driving_enterprise: {
    sampleDataOnly: false,
    realTimeData: true,
    assetManagement: true,
    budgetSimulations: true,
    expenseManagement: true,
    maintenanceScheduling: true,
    citizenEngagement: true,
    teamMembers: -1, // unlimited
    interactiveCalendar: true,
    exportsPerMonth: -1, // unlimited
    customizableReports: true,
    councilReports: true,
    contractorManagement: true,
    roadInspectionDashboard: true,
    fundingCenter: true,
    fullIntegrations: true,
    mobileApp: true,
    websiteIntegrations: true,
    dedicatedSupport: true,
    aiAssistance: true,
    engineeringAssistance: true,
    rescansPerYear: 5,
    scanningFrequencyDashboard: true,
    mapAccess: 'full'
  }
};

export interface PagePermissions {
  canAccess: boolean;
  requiresUpgrade: boolean;
  lockedFeatures: string[];
  showCrownIcon: boolean;
}

export const getPagePermissions = (planType: PlanType, page: string): PagePermissions => {
  const features = PLAN_FEATURES[planType];
  
  switch (page) {
    case '/assets':
      return {
        canAccess: true,
        requiresUpgrade: !features.assetManagement,
        lockedFeatures: features.assetManagement ? [] : ['Asset Creation', 'Asset Editing', 'Bulk Operations'],
        showCrownIcon: !features.assetManagement
      };
      
    case '/maintenance':
      return {
        canAccess: true,
        requiresUpgrade: !features.maintenanceScheduling,
        lockedFeatures: features.maintenanceScheduling ? [] : ['Schedule Creation', 'Task Assignment', 'Automated Workflows'],
        showCrownIcon: !features.maintenanceScheduling
      };
      
    case '/contractors':
      return {
        canAccess: true,
        requiresUpgrade: !features.contractorManagement,
        lockedFeatures: features.contractorManagement ? [] : ['Contractor Database', 'Performance Tracking', 'Contract Management'],
        showCrownIcon: !features.contractorManagement
      };
      
    case '/citizen-reports':
      return {
        canAccess: true,
        requiresUpgrade: !features.citizenEngagement,
        lockedFeatures: features.citizenEngagement ? [] : ['Citizen Portal', 'Report Management', 'Public Communications'],
        showCrownIcon: !features.citizenEngagement
      };
      
    case '/funding':
      return {
        canAccess: true,
        requiresUpgrade: !features.fundingCenter,
        lockedFeatures: features.fundingCenter ? [] : ['Grant Applications', 'Funding Tracking', 'Budget Integration'],
        showCrownIcon: !features.fundingCenter
      };
      
    case '/inspection-dashboard':
      return {
        canAccess: true,
        requiresUpgrade: !features.roadInspectionDashboard,
        lockedFeatures: features.roadInspectionDashboard ? [] : ['Advanced Analytics', 'Custom Reports', 'Historical Trends'],
        showCrownIcon: !features.roadInspectionDashboard
      };
      
    case '/integrations':
      return {
        canAccess: true,
        requiresUpgrade: !features.fullIntegrations,
        lockedFeatures: features.fullIntegrations ? [] : ['API Access', 'Third-party Connectors', 'Custom Webhooks'],
        showCrownIcon: !features.fullIntegrations
      };
      
    default:
      return {
        canAccess: true,
        requiresUpgrade: false,
        lockedFeatures: [],
        showCrownIcon: false
      };
  }
};

export const canUseFeature = (planType: PlanType, feature: keyof PlanFeatures): boolean => {
  const features = PLAN_FEATURES[planType];
  const featureValue = features[feature];
  
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  
  if (typeof featureValue === 'number') {
    return featureValue > 0 || featureValue === -1; // -1 means unlimited
  }
  
  return true;
};

export const getFeatureLimit = (planType: PlanType, feature: keyof PlanFeatures): number | 'unlimited' => {
  const features = PLAN_FEATURES[planType];
  const featureValue = features[feature];
  
  if (typeof featureValue === 'number') {
    return featureValue === -1 ? 'unlimited' : featureValue;
  }
  
  return 0;
};

export const shouldShowUpgradeBanner = (planType: PlanType): boolean => {
  return planType === 'free' || planType === 'basic';
};

export const getUpgradeMessage = (planType: PlanType, feature: string): string => {
  switch (planType) {
    case 'free':
      return `Upgrade to Basic Plan to unlock ${feature}`;
    case 'basic':
      return `Upgrade to Pro Plan to unlock ${feature}`;
    case 'pro':
      return `Upgrade to Premium Plan to unlock ${feature}`;
    default:
      return `Contact sales to unlock ${feature}`;
  }
};

// Export usage tracking for features with limits
export const trackFeatureUsage = (planType: PlanType, feature: string, orgId: string): boolean => {
  // This would connect to the database to track usage
  // Return true if usage is within limits, false if exceeded
  return true;
};

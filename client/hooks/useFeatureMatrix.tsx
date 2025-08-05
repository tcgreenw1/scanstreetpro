import { useOrganization } from '../contexts/OrganizationContext';
import { PlanType } from '../lib/planPermissions';

export type FeatureState = 'shown' | 'sample_data' | 'paywall' | 'not_shown';

export interface FeatureMatrix {
  dashboard: {
    sampleRoads: FeatureState;
    averagePCIScore: FeatureState;
    criticalIssues: FeatureState;
    monthlyBudget: FeatureState;
    chooseYourPCIScanningMethod: FeatureState;
    satelliteVsDrivingPCIScanComparison: FeatureState;
    sampleDataControls: FeatureState;
  };
  navMenu: {
    roadInspection: FeatureState;
    assetManager: FeatureState;
    maintenance: FeatureState;
    inspections: FeatureState;
    mapView: FeatureState;
    budgetPlanning: FeatureState;
    costEstimator: FeatureState;
    fundingCenter: FeatureState;
    expenses: FeatureState;
    contractors: FeatureState;
    citizenReports: FeatureState;
    reports: FeatureState;
    pricing: FeatureState;
    integrations: FeatureState;
    settings: FeatureState;
  };
  roadInspections: {
    dataSource: FeatureState;
    upgradeCard: FeatureState;
  };
  assetManager: {
    assetInventory: FeatureState;
    predictiveMaintenance: FeatureState;
  };
  maintenanceScheduler: {
    unlockAdvancedSchedulingCard: FeatureState;
    functionality: FeatureState;
  };
}

// Feature matrix based on the provided table
const FEATURE_MATRIX: Record<PlanType, FeatureMatrix> = {
  free: {
    dashboard: {
      sampleRoads: 'sample_data',
      averagePCIScore: 'sample_data',
      criticalIssues: 'sample_data',
      monthlyBudget: 'sample_data',
      chooseYourPCIScanningMethod: 'shown',
      satelliteVsDrivingPCIScanComparison: 'shown',
      sampleDataControls: 'shown',
    },
    navMenu: {
      roadInspection: 'paywall',
      assetManager: 'paywall',
      maintenance: 'paywall',
      inspections: 'paywall',
      mapView: 'sample_data',
      budgetPlanning: 'sample_data',
      costEstimator: 'paywall',
      fundingCenter: 'paywall',
      expenses: 'paywall',
      contractors: 'paywall',
      citizenReports: 'paywall',
      reports: 'sample_data',
      pricing: 'shown',
      integrations: 'sample_data',
      settings: 'shown',
    },
    roadInspections: {
      dataSource: 'sample_data',
      upgradeCard: 'shown',
    },
    assetManager: {
      assetInventory: 'paywall',
      predictiveMaintenance: 'paywall',
    },
    maintenanceScheduler: {
      unlockAdvancedSchedulingCard: 'shown',
      functionality: 'paywall',
    },
  },
  basic: {
    dashboard: {
      sampleRoads: 'sample_data',
      averagePCIScore: 'sample_data',
      criticalIssues: 'shown',
      monthlyBudget: 'shown',
      chooseYourPCIScanningMethod: 'shown',
      satelliteVsDrivingPCIScanComparison: 'shown',
      sampleDataControls: 'not_shown',
    },
    navMenu: {
      roadInspection: 'shown',
      assetManager: 'shown',
      maintenance: 'paywall',
      inspections: 'paywall',
      mapView: 'shown',
      budgetPlanning: 'shown',
      costEstimator: 'shown',
      fundingCenter: 'paywall',
      expenses: 'shown',
      contractors: 'paywall',
      citizenReports: 'paywall',
      reports: 'shown',
      pricing: 'shown',
      integrations: 'shown',
      settings: 'shown',
    },
    roadInspections: {
      dataSource: 'shown',
      upgradeCard: 'not_shown',
    },
    assetManager: {
      assetInventory: 'shown',
      predictiveMaintenance: 'shown',
    },
    maintenanceScheduler: {
      unlockAdvancedSchedulingCard: 'shown',
      functionality: 'paywall',
    },
  },
  pro: {
    dashboard: {
      sampleRoads: 'sample_data',
      averagePCIScore: 'sample_data',
      criticalIssues: 'shown',
      monthlyBudget: 'shown',
      chooseYourPCIScanningMethod: 'shown',
      satelliteVsDrivingPCIScanComparison: 'shown',
      sampleDataControls: 'not_shown',
    },
    navMenu: {
      roadInspection: 'shown',
      assetManager: 'shown',
      maintenance: 'shown',
      inspections: 'shown',
      mapView: 'shown',
      budgetPlanning: 'shown',
      costEstimator: 'shown',
      fundingCenter: 'shown',
      expenses: 'shown',
      contractors: 'shown',
      citizenReports: 'shown',
      reports: 'shown',
      pricing: 'shown',
      integrations: 'shown',
      settings: 'shown',
    },
    roadInspections: {
      dataSource: 'shown',
      upgradeCard: 'not_shown',
    },
    assetManager: {
      assetInventory: 'shown',
      predictiveMaintenance: 'shown',
    },
    maintenanceScheduler: {
      unlockAdvancedSchedulingCard: 'not_shown',
      functionality: 'shown',
    },
  },
  premium: {
    dashboard: {
      sampleRoads: 'sample_data',
      averagePCIScore: 'sample_data',
      criticalIssues: 'shown',
      monthlyBudget: 'shown',
      chooseYourPCIScanningMethod: 'shown',
      satelliteVsDrivingPCIScanComparison: 'shown',
      sampleDataControls: 'not_shown',
    },
    navMenu: {
      roadInspection: 'shown',
      assetManager: 'shown',
      maintenance: 'shown',
      inspections: 'shown',
      mapView: 'shown',
      budgetPlanning: 'shown',
      costEstimator: 'shown',
      fundingCenter: 'shown',
      expenses: 'shown',
      contractors: 'shown',
      citizenReports: 'shown',
      reports: 'shown',
      pricing: 'shown',
      integrations: 'shown',
      settings: 'shown',
    },
  },
  satellite_enterprise: {
    dashboard: {
      sampleRoads: 'shown',
      averagePCIScore: 'shown',
      criticalIssues: 'shown',
      monthlyBudget: 'shown',
      chooseYourPCIScanningMethod: 'not_shown',
      satelliteVsDrivingPCIScanComparison: 'not_shown',
      sampleDataControls: 'not_shown',
    },
    navMenu: {
      roadInspection: 'shown',
      assetManager: 'shown',
      maintenance: 'shown',
      inspections: 'shown',
      mapView: 'shown',
      budgetPlanning: 'shown',
      costEstimator: 'shown',
      fundingCenter: 'shown',
      expenses: 'shown',
      contractors: 'shown',
      citizenReports: 'shown',
      reports: 'shown',
      pricing: 'shown',
      integrations: 'shown',
      settings: 'shown',
    },
  },
  driving_enterprise: {
    dashboard: {
      sampleRoads: 'shown',
      averagePCIScore: 'shown',
      criticalIssues: 'shown',
      monthlyBudget: 'shown',
      chooseYourPCIScanningMethod: 'not_shown',
      satelliteVsDrivingPCIScanComparison: 'not_shown',
      sampleDataControls: 'not_shown',
    },
    navMenu: {
      roadInspection: 'shown',
      assetManager: 'shown',
      maintenance: 'shown',
      inspections: 'shown',
      mapView: 'shown',
      budgetPlanning: 'shown',
      costEstimator: 'shown',
      fundingCenter: 'shown',
      expenses: 'shown',
      contractors: 'shown',
      citizenReports: 'shown',
      reports: 'shown',
      pricing: 'shown',
      integrations: 'shown',
      settings: 'shown',
    },
  },
};

export const useFeatureMatrix = () => {
  const { organization } = useOrganization();
  
  // Map plan types to matrix keys (handle enterprise variants)
  const getPlanKey = (plan: PlanType): keyof typeof FEATURE_MATRIX => {
    if (plan === 'satellite' || plan === 'satellite_enterprise') {
      return 'satellite_enterprise';
    }
    if (plan === 'driving' || plan === 'driving_enterprise') {
      return 'driving_enterprise';
    }
    return plan as keyof typeof FEATURE_MATRIX;
  };

  const userPlan = organization?.plan || 'free';
  const planKey = getPlanKey(userPlan);
  const currentMatrix = FEATURE_MATRIX[planKey];

  // Helper functions to check feature states
  const getFeatureState = (section: keyof FeatureMatrix, feature: string): FeatureState => {
    const sectionMatrix = currentMatrix[section] as any;
    return sectionMatrix[feature] || 'not_shown';
  };

  const isFeatureShown = (section: keyof FeatureMatrix, feature: string): boolean => {
    return getFeatureState(section, feature) === 'shown';
  };

  const isFeatureSampleData = (section: keyof FeatureMatrix, feature: string): boolean => {
    return getFeatureState(section, feature) === 'sample_data';
  };

  const isFeaturePaywall = (section: keyof FeatureMatrix, feature: string): boolean => {
    return getFeatureState(section, feature) === 'paywall';
  };

  const isFeatureNotShown = (section: keyof FeatureMatrix, feature: string): boolean => {
    return getFeatureState(section, feature) === 'not_shown';
  };

  const shouldShowFeature = (section: keyof FeatureMatrix, feature: string): boolean => {
    const state = getFeatureState(section, feature);
    return state === 'shown' || state === 'sample_data';
  };

  const shouldShowPaywall = (section: keyof FeatureMatrix, feature: string): boolean => {
    return getFeatureState(section, feature) === 'paywall';
  };

  const shouldUseRealData = (section: keyof FeatureMatrix, feature: string): boolean => {
    return getFeatureState(section, feature) === 'shown';
  };

  const shouldUseSampleData = (section: keyof FeatureMatrix, feature: string): boolean => {
    return getFeatureState(section, feature) === 'sample_data';
  };

  return {
    userPlan,
    matrix: currentMatrix,
    getFeatureState,
    isFeatureShown,
    isFeatureSampleData,
    isFeaturePaywall,
    isFeatureNotShown,
    shouldShowFeature,
    shouldShowPaywall,
    shouldUseRealData,
    shouldUseSampleData,
  };
};

// Helper hook for specific dashboard features
export const useDashboardFeatures = () => {
  const featureMatrix = useFeatureMatrix();
  
  return {
    sampleRoads: {
      state: featureMatrix.getFeatureState('dashboard', 'sampleRoads'),
      show: featureMatrix.shouldShowFeature('dashboard', 'sampleRoads'),
      useRealData: featureMatrix.shouldUseRealData('dashboard', 'sampleRoads'),
      useSampleData: featureMatrix.shouldUseSampleData('dashboard', 'sampleRoads'),
    },
    averagePCIScore: {
      state: featureMatrix.getFeatureState('dashboard', 'averagePCIScore'),
      show: featureMatrix.shouldShowFeature('dashboard', 'averagePCIScore'),
      useRealData: featureMatrix.shouldUseRealData('dashboard', 'averagePCIScore'),
      useSampleData: featureMatrix.shouldUseSampleData('dashboard', 'averagePCIScore'),
    },
    criticalIssues: {
      state: featureMatrix.getFeatureState('dashboard', 'criticalIssues'),
      show: featureMatrix.shouldShowFeature('dashboard', 'criticalIssues'),
      useRealData: featureMatrix.shouldUseRealData('dashboard', 'criticalIssues'),
      useSampleData: featureMatrix.shouldUseSampleData('dashboard', 'criticalIssues'),
    },
    monthlyBudget: {
      state: featureMatrix.getFeatureState('dashboard', 'monthlyBudget'),
      show: featureMatrix.shouldShowFeature('dashboard', 'monthlyBudget'),
      useRealData: featureMatrix.shouldUseRealData('dashboard', 'monthlyBudget'),
      useSampleData: featureMatrix.shouldUseSampleData('dashboard', 'monthlyBudget'),
    },
    chooseYourPCIScanningMethod: {
      state: featureMatrix.getFeatureState('dashboard', 'chooseYourPCIScanningMethod'),
      show: featureMatrix.shouldShowFeature('dashboard', 'chooseYourPCIScanningMethod'),
      notShown: featureMatrix.isFeatureNotShown('dashboard', 'chooseYourPCIScanningMethod'),
    },
    satelliteVsDrivingPCIScanComparison: {
      state: featureMatrix.getFeatureState('dashboard', 'satelliteVsDrivingPCIScanComparison'),
      show: featureMatrix.shouldShowFeature('dashboard', 'satelliteVsDrivingPCIScanComparison'),
      notShown: featureMatrix.isFeatureNotShown('dashboard', 'satelliteVsDrivingPCIScanComparison'),
    },
    sampleDataControls: {
      state: featureMatrix.getFeatureState('dashboard', 'sampleDataControls'),
      show: featureMatrix.shouldShowFeature('dashboard', 'sampleDataControls'),
      notShown: featureMatrix.isFeatureNotShown('dashboard', 'sampleDataControls'),
    },
  };
};

// Helper hook for navigation menu features
export const useNavFeatures = () => {
  const featureMatrix = useFeatureMatrix();
  
  const features = [
    'roadInspection', 'assetManager', 'maintenance', 'inspections', 'mapView',
    'budgetPlanning', 'costEstimator', 'fundingCenter', 'expenses', 'contractors',
    'citizenReports', 'reports', 'pricing', 'integrations', 'settings'
  ];
  
  const navFeatures: Record<string, {
    state: FeatureState;
    show: boolean;
    showPaywall: boolean;
    useSampleData: boolean;
    useRealData: boolean;
  }> = {};
  
  features.forEach(feature => {
    navFeatures[feature] = {
      state: featureMatrix.getFeatureState('navMenu', feature),
      show: featureMatrix.shouldShowFeature('navMenu', feature),
      showPaywall: featureMatrix.shouldShowPaywall('navMenu', feature),
      useSampleData: featureMatrix.shouldUseSampleData('navMenu', feature),
      useRealData: featureMatrix.shouldUseRealData('navMenu', feature),
    };
  });
  
  return navFeatures;
};

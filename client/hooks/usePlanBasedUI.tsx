import { useOrganization } from '../contexts/OrganizationContext';
import { PlanType } from '../lib/planPermissions';

export interface PlanBasedUIState {
  userPlan: PlanType;
  showCrowns: boolean;
  showSampleData: boolean;
  allowExport: boolean;
  disableAssetManagement: boolean;
  unlockAssetManagement: boolean;
  unlockBudgetSimulations: boolean;
  unlockExpenseManagement: boolean;
  unlockCalendar: boolean;
  unlockMaintenanceScheduling: boolean;
  unlockCitizenEngagement: boolean;
  unlockContractorManagement: boolean;
  unlockFundingCenter: boolean;
  unlockAdvancedReports: boolean;
  unlockFullIntegrations: boolean;
  unlockMobileApp: boolean;
  unlockAIAssistance: boolean;
  unlockEverything: boolean;
  exportsRemaining: number | 'unlimited';
  upgradeMessage: string;
}

export const usePlanBasedUI = (): PlanBasedUIState => {
  const { organization, planFeatures } = useOrganization();

  const userPlan: PlanType = organization?.plan || 'free';

  // Debug logging
  console.log('🔍 usePlanBasedUI DEBUG:', {
    userPlan,
    organization: organization?.name,
    planFeatures: !!planFeatures
  });
  
  // Step 2: Hardcode visibility logic as requested
  let showCrowns = true;
  let showSampleData = true;
  let allowExport = false;
  let disableAssetManagement = true;
  let unlockAssetManagement = false;
  let unlockBudgetSimulations = false;
  let unlockExpenseManagement = false;
  let unlockCalendar = false;
  let unlockMaintenanceScheduling = false;
  let unlockCitizenEngagement = false;
  let unlockContractorManagement = false;
  let unlockFundingCenter = false;
  let unlockAdvancedReports = false;
  let unlockFullIntegrations = false;
  let unlockMobileApp = false;
  let unlockAIAssistance = false;
  let unlockEverything = false;
  
  // Free plan logic
  if (userPlan === 'free') {
    showCrowns = true;
    showSampleData = true;
    allowExport = (organization?.usage.exportsThisMonth || 0) < 1;
    disableAssetManagement = true;
  }
  
  // Basic plan logic
  if (userPlan === 'basic') {
    showCrowns = true;
    showSampleData = false;
    unlockAssetManagement = true;
    unlockBudgetSimulations = true;
    unlockExpenseManagement = true;
    unlockCalendar = true;
    disableAssetManagement = false;
    allowExport = (organization?.usage.exportsThisMonth || 0) < 1;
  }
  
  // Pro, Premium, and Enterprise plans logic
  if (userPlan === 'pro' || userPlan === 'premium' || userPlan.includes('enterprise')) {
    showCrowns = false;
    showSampleData = false;
    unlockEverything = true;
    unlockAssetManagement = true;
    unlockBudgetSimulations = true;
    unlockExpenseManagement = true;
    unlockCalendar = true;
    unlockMaintenanceScheduling = true;
    unlockContractorManagement = true;
    unlockFundingCenter = true;
    unlockAdvancedReports = true;
    unlockFullIntegrations = true;
    disableAssetManagement = false;
    allowExport = true;
  }
  
  // Premium and Enterprise specific features
  if (userPlan === 'premium' || userPlan.includes('enterprise')) {
    unlockCitizenEngagement = true;
    unlockMobileApp = true;
  }
  
  // Enterprise specific features
  if (userPlan.includes('enterprise')) {
    unlockAIAssistance = true;
  }
  
  // Calculate exports remaining
  let exportsRemaining: number | 'unlimited' = 0;
  if (planFeatures) {
    if (planFeatures.exportsPerMonth === -1) {
      exportsRemaining = 'unlimited';
    } else {
      exportsRemaining = Math.max(0, planFeatures.exportsPerMonth - (organization?.usage.exportsThisMonth || 0));
    }
  }
  
  // Generate upgrade message
  let upgradeMessage = 'Upgrade to unlock this feature';
  switch (userPlan) {
    case 'free':
      upgradeMessage = 'Upgrade to Basic Plan to unlock this feature';
      break;
    case 'basic':
      upgradeMessage = 'Upgrade to Pro Plan to unlock this feature';
      break;
    case 'pro':
      upgradeMessage = 'Upgrade to Premium Plan to unlock this feature';
      break;
    default:
      upgradeMessage = 'Contact sales to unlock this feature';
  }
  
  return {
    userPlan,
    showCrowns,
    showSampleData,
    allowExport,
    disableAssetManagement,
    unlockAssetManagement,
    unlockBudgetSimulations,
    unlockExpenseManagement,
    unlockCalendar,
    unlockMaintenanceScheduling,
    unlockCitizenEngagement,
    unlockContractorManagement,
    unlockFundingCenter,
    unlockAdvancedReports,
    unlockFullIntegrations,
    unlockMobileApp,
    unlockAIAssistance,
    unlockEverything,
    exportsRemaining,
    upgradeMessage
  };
};

// Additional helper hooks for specific use cases
export const useFeatureAccess = (feature: string) => {
  const planState = usePlanBasedUI();
  
  const featureMap: { [key: string]: boolean } = {
    assetManagement: planState.unlockAssetManagement,
    budgetSimulations: planState.unlockBudgetSimulations,
    expenseManagement: planState.unlockExpenseManagement,
    calendar: planState.unlockCalendar,
    maintenanceScheduling: planState.unlockMaintenanceScheduling,
    citizenEngagement: planState.unlockCitizenEngagement,
    contractorManagement: planState.unlockContractorManagement,
    fundingCenter: planState.unlockFundingCenter,
    advancedReports: planState.unlockAdvancedReports,
    fullIntegrations: planState.unlockFullIntegrations,
    mobileApp: planState.unlockMobileApp,
    aiAssistance: planState.unlockAIAssistance,
  };
  
  return {
    hasAccess: featureMap[feature] || false,
    showCrown: planState.showCrowns && !featureMap[feature],
    upgradeMessage: planState.upgradeMessage
  };
};

export const useDataVisibility = () => {
  const planState = usePlanBasedUI();
  
  return {
    useSampleData: planState.showSampleData,
    useRealData: !planState.showSampleData,
    userPlan: planState.userPlan
  };
};

export const useExportLimits = () => {
  const planState = usePlanBasedUI();
  
  return {
    canExport: planState.allowExport,
    exportsRemaining: planState.exportsRemaining,
    isUnlimited: planState.exportsRemaining === 'unlimited'
  };
};

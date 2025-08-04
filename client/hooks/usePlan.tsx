import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { getCurrentPlan, getPlanFeature, shouldShowCrown, shouldUseSampleData, isComponentVisible } from '@/lib/neonAuth';

interface PlanContextType {
  plan: string;
  features: { [key: string]: string | number | boolean };
  loading: boolean;
  refresh: () => Promise<void>;
  
  // Helper methods
  getPlanFeature: (featureName: string) => string | number | boolean | null;
  shouldShowCrown: (componentName: string) => boolean;
  shouldUseSampleData: (componentName: string) => boolean;
  isComponentVisible: (componentName: string) => boolean;
  
  // Plan checks
  isFreePlan: boolean;
  isBasicPlan: boolean;
  isProPlan: boolean;
  isPremiumPlan: boolean;
  isSatellitePlan: boolean;
  isDrivingPlan: boolean;
}

const PlanContext = createContext<PlanContextType | null>(null);

interface PlanProviderProps {
  children: ReactNode;
}

export function PlanProvider({ children }: PlanProviderProps) {
  const [plan, setPlan] = useState<string>('free');
  const [features, setFeatures] = useState<{ [key: string]: string | number | boolean }>({});
  const [loading, setLoading] = useState(true);

  const loadPlanData = async () => {
    try {
      setLoading(true);
      const currentPlan = await getCurrentPlan();
      setPlan(currentPlan);
      
      // Load features from API if authenticated
      const token = localStorage.getItem('neon_auth_token');
      if (token) {
        try {
          const response = await fetch('/api/plans/features', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setFeatures(result.data.features);
            }
          }
        } catch (error) {
          console.error('Failed to load plan features from API:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load plan data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanData();
  }, []);

  const contextValue: PlanContextType = {
    plan,
    features,
    loading,
    refresh: loadPlanData,
    
    // Helper methods
    getPlanFeature: (featureName: string) => getPlanFeature(featureName),
    shouldShowCrown: (componentName: string) => shouldShowCrown(componentName),
    shouldUseSampleData: (componentName: string) => shouldUseSampleData(componentName),
    isComponentVisible: (componentName: string) => isComponentVisible(componentName),
    
    // Plan checks
    isFreePlan: plan === 'free',
    isBasicPlan: plan === 'basic',
    isProPlan: plan === 'pro',
    isPremiumPlan: plan === 'premium',
    isSatellitePlan: plan === 'satellite',
    isDrivingPlan: plan === 'driving'
  };

  return (
    <PlanContext.Provider value={contextValue}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}

// Individual hooks for common use cases
export function usePlanFeature(featureName: string) {
  const { getPlanFeature } = usePlan();
  return getPlanFeature(featureName);
}

export function useComponentVisibility(componentName: string) {
  const { isComponentVisible } = usePlan();
  return isComponentVisible(componentName);
}

export function useCrownVisibility(componentName: string) {
  const { shouldShowCrown } = usePlan();
  return shouldShowCrown(componentName);
}

export function useSampleData(componentName: string) {
  const { shouldUseSampleData } = usePlan();
  return shouldUseSampleData(componentName);
}

export function usePlanCheck() {
  const { plan, isFreePlan, isBasicPlan, isProPlan, isPremiumPlan, isSatellitePlan, isDrivingPlan } = usePlan();
  
  return {
    plan,
    isFreePlan,
    isBasicPlan, 
    isProPlan,
    isPremiumPlan,
    isSatellitePlan,
    isDrivingPlan,
    isPaidPlan: !isFreePlan,
    isProfessionalTier: isProPlan || isPremiumPlan || isSatellitePlan || isDrivingPlan,
    hasUnlimitedFeatures: isPremiumPlan || isSatellitePlan || isDrivingPlan
  };
}

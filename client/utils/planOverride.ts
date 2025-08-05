import { PlanType } from '@/lib/planPermissions';

// Simple utility to override plan for testing without authentication
export const getPlanOverride = (): PlanType | null => {
  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const urlPlan = urlParams.get('plan');
  
  // Check localStorage second
  const localPlan = localStorage.getItem('testPlan');
  
  // Check if it's a valid plan
  const validPlans: PlanType[] = ['free', 'basic', 'pro', 'premium', 'satellite_enterprise', 'driving_enterprise'];
  
  const testPlan = (urlPlan || localPlan) as PlanType;
  
  if (testPlan && validPlans.includes(testPlan)) {
    return testPlan;
  }
  
  return null;
};

export const setPlanOverride = (plan: PlanType) => {
  localStorage.setItem('testPlan', plan);
  // Also update URL for immediate feedback
  const url = new URL(window.location.href);
  url.searchParams.set('plan', plan);
  window.history.pushState({}, '', url.toString());
};

export const clearPlanOverride = () => {
  localStorage.removeItem('testPlan');
  const url = new URL(window.location.href);
  url.searchParams.delete('plan');
  window.history.pushState({}, '', url.toString());
};

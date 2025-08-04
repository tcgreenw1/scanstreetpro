import React, { ReactNode } from 'react';
import { usePlan, useComponentVisibility, useCrownVisibility, useSampleData } from '@/hooks/usePlan';
import { Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PlanGuardProps {
  children: ReactNode;
  component?: string;
  plan?: string | string[];
  feature?: string;
  fallback?: ReactNode;
  showUpgrade?: boolean;
  className?: string;
}

export function PlanGuard({ 
  children, 
  component, 
  plan, 
  feature, 
  fallback, 
  showUpgrade = true,
  className 
}: PlanGuardProps) {
  const { plan: currentPlan, getPlanFeature } = usePlan();
  const isVisible = component ? useComponentVisibility(component) : true;

  // Check if current plan matches required plan(s)
  const hasRequiredPlan = plan 
    ? Array.isArray(plan) 
      ? plan.includes(currentPlan)
      : currentPlan === plan
    : true;

  // Check if user has required feature
  const hasRequiredFeature = feature 
    ? !!getPlanFeature(feature)
    : true;

  // If component-based visibility is disabled, show upgrade prompt
  if (component && !isVisible) {
    if (fallback) return <>{fallback}</>;
    
    if (showUpgrade) {
      return (
        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className}`}>
          <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
          <p className="text-gray-500 mb-4">Upgrade your plan to access this feature</p>
          <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      );
    }
    
    return null;
  }

  // If plan requirement not met, show upgrade prompt
  if (!hasRequiredPlan) {
    if (fallback) return <>{fallback}</>;
    
    if (showUpgrade) {
      return (
        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className}`}>
          <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {Array.isArray(plan) ? plan.join(' or ') : plan} Plan Required
          </h3>
          <p className="text-gray-500 mb-4">Upgrade to access this feature</p>
          <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      );
    }
    
    return null;
  }

  // If feature requirement not met, show upgrade prompt
  if (!hasRequiredFeature) {
    if (fallback) return <>{fallback}</>;
    
    if (showUpgrade) {
      return (
        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className}`}>
          <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Feature Not Available</h3>
          <p className="text-gray-500 mb-4">This feature is not included in your current plan</p>
          <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      );
    }
    
    return null;
  }

  return <div className={className}>{children}</div>;
}

interface CrownBadgeProps {
  component: string;
  children?: ReactNode;
  className?: string;
}

export function CrownBadge({ component, children, className }: CrownBadgeProps) {
  const showCrown = useCrownVisibility(component);
  
  if (!showCrown) return <>{children}</>;
  
  return (
    <div className={`relative ${className}`}>
      {children}
      <Badge 
        variant="secondary" 
        className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-2 py-1"
      >
        <Crown className="h-3 w-3 mr-1" />
        PRO
      </Badge>
    </div>
  );
}

interface SampleDataBadgeProps {
  component: string;
  children?: ReactNode;
  className?: string;
}

export function SampleDataBadge({ component, children, className }: SampleDataBadgeProps) {
  const useSample = useSampleData(component);
  
  if (!useSample) return <>{children}</>;
  
  return (
    <div className={`relative ${className}`}>
      {children}
      <Badge 
        variant="outline" 
        className="absolute top-2 left-2 bg-blue-50 text-blue-600 border-blue-200 text-xs px-2 py-1"
      >
        Sample Data
      </Badge>
    </div>
  );
}

interface PlanBadgeProps {
  className?: string;
}

export function PlanBadge({ className }: PlanBadgeProps) {
  const { plan } = usePlan();
  
  const planColors = {
    free: 'bg-gray-100 text-gray-800 border-gray-300',
    basic: 'bg-blue-100 text-blue-800 border-blue-300',
    pro: 'bg-purple-100 text-purple-800 border-purple-300',
    premium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    satellite: 'bg-green-100 text-green-800 border-green-300',
    driving: 'bg-red-100 text-red-800 border-red-300'
  };
  
  const planColor = planColors[plan as keyof typeof planColors] || planColors.free;
  
  return (
    <Badge variant="outline" className={`${planColor} ${className}`}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
    </Badge>
  );
}

// Utility component for plan-based conditional rendering
interface PlanConditionalProps {
  children: ReactNode;
  condition: 'free' | 'paid' | 'professional' | 'unlimited';
  fallback?: ReactNode;
}

export function PlanConditional({ children, condition, fallback }: PlanConditionalProps) {
  const { isFreePlan, isPaidPlan, isProfessionalTier, hasUnlimitedFeatures } = usePlan();
  
  const shouldShow = {
    free: isFreePlan,
    paid: isPaidPlan,
    professional: isProfessionalTier,
    unlimited: hasUnlimitedFeatures
  }[condition];
  
  return shouldShow ? <>{children}</> : <>{fallback || null}</>;
}

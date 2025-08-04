import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrganization, usePermissions } from '@/contexts/OrganizationContext';
import { PlanFeatures } from '@/lib/planPermissions';

interface PlanGuardProps {
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradeButton?: boolean;
  className?: string;
}

export const PlanGuard: React.FC<PlanGuardProps> = ({
  feature,
  children,
  fallback,
  showUpgradeButton = false,
  className
}) => {
  const { canAccess } = usePermissions();
  const hasAccess = canAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={cn("relative", className)}>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-4">
          <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            This feature requires a higher plan
          </p>
          {showUpgradeButton && (
            <Button 
              size="sm"
              onClick={() => window.location.href = '/pricing'}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface FeatureBadgeProps {
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  className?: string;
}

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  feature,
  children,
  className
}) => {
  const { canAccess } = usePermissions();
  const hasAccess = canAccess(feature);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
      {!hasAccess && <Crown className="w-4 h-4 text-amber-500" />}
    </div>
  );
};

interface PlanRestrictedButtonProps {
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

export const PlanRestrictedButton: React.FC<PlanRestrictedButtonProps> = ({
  feature,
  children,
  onClick,
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  ...props
}) => {
  const { canAccess } = usePermissions();
  const hasAccess = canAccess(feature);

  const handleClick = () => {
    if (hasAccess && onClick) {
      onClick();
    } else if (!hasAccess) {
      window.location.href = '/pricing';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        !hasAccess && "opacity-75",
        className
      )}
      {...props}
    >
      {children}
      {!hasAccess && <Crown className="w-4 h-4 ml-2 text-amber-500" />}
    </Button>
  );
};

interface PlanRestrictedInputProps {
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  className?: string;
}

export const PlanRestrictedInput: React.FC<PlanRestrictedInputProps> = ({
  feature,
  children,
  className
}) => {
  const { canAccess } = usePermissions();
  const hasAccess = canAccess(feature);

  return React.cloneElement(children as React.ReactElement, {
    disabled: !hasAccess,
    placeholder: hasAccess 
      ? (children as React.ReactElement).props.placeholder 
      : 'Upgrade required',
    className: cn(
      (children as React.ReactElement).props.className,
      !hasAccess && "opacity-75",
      className
    )
  });
};

interface SampleDataBadgeProps {
  className?: string;
}

export const SampleDataBadge: React.FC<SampleDataBadgeProps> = ({ className }) => {
  const { planFeatures } = useOrganization();

  if (!planFeatures?.sampleDataOnly) {
    return null;
  }

  return (
    <Badge variant="outline" className={cn("bg-blue-100 text-blue-700 border-blue-200", className)}>
      Sample Data
    </Badge>
  );
};

interface UpgradeBannerProps {
  feature?: string;
  className?: string;
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ 
  feature = "advanced features", 
  className 
}) => {
  const { shouldShowUpgrade } = usePermissions();

  if (!shouldShowUpgrade()) {
    return null;
  }

  return (
    <div className={cn(
      "glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-amber-600" />
          <div>
            <p className="font-medium text-slate-800 dark:text-white">
              Unlock {feature}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Upgrade your plan to access premium features
            </p>
          </div>
        </div>
        <Button 
          size="sm"
          onClick={() => window.location.href = '/pricing'}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade
        </Button>
      </div>
    </div>
  );
};

// Hook for conditional rendering based on plan
export const usePlanAccess = (feature: keyof PlanFeatures) => {
  const { canAccess } = usePermissions();
  return canAccess(feature);
};

// Higher-order component for plan-based protection
export const withPlanAccess = <P extends object>(
  Component: React.ComponentType<P>,
  feature: keyof PlanFeatures,
  fallback?: React.ComponentType<P>
) => {
  return (props: P) => {
    const hasAccess = usePlanAccess(feature);
    
    if (hasAccess) {
      return <Component {...props} />;
    }
    
    if (fallback) {
      return <fallback {...props} />;
    }
    
    return (
      <PlanGuard feature={feature} showUpgradeButton>
        <Component {...props} />
      </PlanGuard>
    );
  };
};

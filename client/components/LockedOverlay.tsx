import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Eye, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LockedOverlayProps {
  children: ReactNode;
  requiredPlan: string;
  featureName: string;
  isLocked: boolean;
  showBlur?: boolean;
  className?: string;
}

export function LockedOverlay({ 
  children, 
  requiredPlan, 
  featureName, 
  isLocked, 
  showBlur = true,
  className 
}: LockedOverlayProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Blurred content */}
      <div className={cn(
        "transition-all duration-300",
        showBlur ? "blur-sm filter grayscale-50 opacity-60 pointer-events-none select-none" : ""
      )}>
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40 backdrop-blur-sm z-10">
        <div className="h-full flex items-center justify-center p-6">
          <Card className="max-w-md mx-auto border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 mb-3">
                <Lock className="w-3 h-3 mr-1" />
                {requiredPlan}+ Required
              </Badge>
              <CardTitle className="text-xl text-slate-800 dark:text-white">
                Upgrade to {requiredPlan} to use {featureName}
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
                You're currently viewing a preview. Upgrade to unlock full functionality.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Eye className="w-3 h-3" />
                  Preview Mode Active
                </div>
                <div className="flex gap-2">
                  <Link to="/pricing" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="px-3">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface LockedBannerProps {
  requiredPlan: string;
  featureName: string;
  className?: string;
}

export function LockedBanner({ requiredPlan, featureName, className }: LockedBannerProps) {
  return (
    <div className={cn(
      "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {featureName} - Preview Mode
            </h3>
            <p className="text-sm text-amber-600 dark:text-amber-300">
              Upgrade to {requiredPlan} to unlock full functionality
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Badge>
          <Link to="/pricing">
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface PreviewModeWrapperProps {
  children: ReactNode;
  isPreviewMode: boolean;
  requiredPlan: string;
  featureName: string;
  showBanner?: boolean;
  disableInteractions?: boolean;
  className?: string;
}

export function PreviewModeWrapper({ 
  children, 
  isPreviewMode, 
  requiredPlan, 
  featureName,
  showBanner = true,
  disableInteractions = true,
  className 
}: PreviewModeWrapperProps) {
  if (!isPreviewMode) {
    return <>{children}</>;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {showBanner && (
        <LockedBanner 
          requiredPlan={requiredPlan} 
          featureName={featureName} 
        />
      )}
      
      <div className={cn(
        "relative",
        disableInteractions && "pointer-events-none select-none"
      )}>
        <div className="filter brightness-90 contrast-90">
          {children}
        </div>
        
        {/* Subtle overlay to indicate preview mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-50/20 dark:to-amber-900/10 pointer-events-none" />
      </div>
    </div>
  );
}

// Hook to determine preview mode state
export function usePreviewMode(featureState: string, currentPlan: string) {
  const getRequiredPlan = (currentPlan: string): string => {
    switch (currentPlan) {
      case 'free': return 'Basic';
      case 'basic': return 'Pro';
      case 'pro': return 'Premium';
      case 'premium': return 'Enterprise';
      default: return 'Pro';
    }
  };

  return {
    isPreviewMode: featureState === 'paywall',
    requiredPlan: getRequiredPlan(currentPlan),
    shouldShowBanner: featureState === 'paywall',
    shouldDisableInteractions: featureState === 'paywall'
  };
}

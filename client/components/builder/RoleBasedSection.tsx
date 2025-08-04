'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/hooks/usePlan";

interface RoleBasedSectionProps {
  requiredPlan?: string;
  requiredRole?: string;
  fallbackMessage?: string;
  children?: ReactNode;
}

export const RoleBasedSection = ({
  requiredPlan = 'free',
  requiredRole = 'member',
  fallbackMessage = 'Upgrade to access this feature',
  children
}: RoleBasedSectionProps) => {
  const { user } = useAuth();
  const { currentPlan } = usePlan();

  // Plan hierarchy for comparison
  const planHierarchy = {
    'free': 0,
    'basic': 1,
    'pro': 2,
    'premium': 3
  };

  // Role hierarchy for comparison
  const roleHierarchy = {
    'member': 0,
    'manager': 1,
    'admin': 2
  };

  // Check if user meets plan requirements
  const hasPlanAccess = () => {
    if (!currentPlan || !requiredPlan) return false;
    const userPlanLevel = planHierarchy[currentPlan as keyof typeof planHierarchy] ?? 0;
    const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] ?? 0;
    return userPlanLevel >= requiredPlanLevel;
  };

  // Check if user meets role requirements
  const hasRoleAccess = () => {
    if (!user?.role || !requiredRole) return false;
    const userRoleLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] ?? 0;
    const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 0;
    return userRoleLevel >= requiredRoleLevel;
  };

  const hasAccess = hasPlanAccess() && hasRoleAccess();

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'pro': return <Zap className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  // If user has access, render children
  if (hasAccess) {
    return (
      <div className="space-y-4">
        {children || (
          <div className="border-2 border-dashed border-green-200 rounded-lg p-8 text-center text-green-600">
            ✓ This content is visible because you have {requiredPlan}+ plan and {requiredRole}+ role
          </div>
        )}
      </div>
    );
  }

  // Show upgrade prompt
  return (
    <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {getPlanIcon(requiredPlan)}
        </div>
        <CardTitle className="text-lg">Feature Locked</CardTitle>
        <CardDescription>{fallbackMessage}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="space-y-2">
          <div className="flex justify-center space-x-2">
            <span className="text-sm text-muted-foreground">Required:</span>
            <Badge className={getPlanBadgeColor(requiredPlan)}>
              {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Plan
            </Badge>
            <Badge className={getRoleBadgeColor(requiredRole)}>
              {requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} Role
            </Badge>
          </div>
          
          <div className="flex justify-center space-x-2">
            <span className="text-sm text-muted-foreground">Current:</span>
            <Badge className={getPlanBadgeColor(currentPlan || 'free')}>
              {(currentPlan || 'free').charAt(0).toUpperCase() + (currentPlan || 'free').slice(1)} Plan
            </Badge>
            <Badge className={getRoleBadgeColor(user?.role || 'member')}>
              {(user?.role || 'member').charAt(0).toUpperCase() + (user?.role || 'member').slice(1)} Role
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          {!hasPlanAccess() && (
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/pricing'}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
            </Button>
          )}
          
          {!hasRoleAccess() && hasPlanAccess() && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <p className="text-yellow-800">
                Contact your organization admin to upgrade your role to {requiredRole}.
              </p>
            </div>
          )}
        </div>

        {/* Feature Preview */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-muted-foreground mb-2">Preview of locked content:</p>
          <div className="bg-white border rounded p-4 opacity-50 pointer-events-none">
            {children || (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

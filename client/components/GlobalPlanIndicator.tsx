import { useLocation } from 'react-router-dom';
import { usePlanBasedUI, useFeatureAccess } from '@/hooks/usePlanBasedUI';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Crown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPlanOverride } from '@/utils/planOverride';

const PAGE_RULES: Record<string, { name: string; freeAccess: boolean; basicAccess: boolean; proAccess: boolean }> = {
  '/dashboard': { name: 'Dashboard', freeAccess: true, basicAccess: true, proAccess: true },
  '/assets': { name: 'Asset Management', freeAccess: false, basicAccess: true, proAccess: true },
  '/expenses': { name: 'Expense Tracking', freeAccess: false, basicAccess: true, proAccess: true },
  '/maintenance': { name: 'Maintenance Scheduling', freeAccess: false, basicAccess: false, proAccess: true },
  '/citizen-reports': { name: 'Citizen Engagement', freeAccess: false, basicAccess: false, proAccess: true },
  '/reports': { name: 'Reports & Exports', freeAccess: false, basicAccess: true, proAccess: true },
};

export function GlobalPlanIndicator() {
  const location = useLocation();
  const planState = usePlanBasedUI();
  const { organization } = useOrganization();
  const planOverride = getPlanOverride();

  const currentPage = PAGE_RULES[location.pathname];
  if (!currentPage) return null;

  const hasAccess = () => {
    switch (planState.userPlan) {
      case 'free': return currentPage.freeAccess;
      case 'basic': return currentPage.basicAccess;
      case 'pro':
      case 'premium':
      case 'satellite_enterprise':
      case 'driving_enterprise':
        return currentPage.proAccess;
      default: return false;
    }
  };

  const shouldHaveAccess = hasAccess();
  
  return (
    <div className={cn(
      "fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-4 py-2 rounded-xl text-sm font-medium shadow-lg border-2",
      shouldHaveAccess
        ? "bg-green-100 text-green-800 border-green-300"
        : "bg-red-100 text-red-800 border-red-300"
    )}>
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center space-x-2">
          {shouldHaveAccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Crown className="w-4 h-4" />
          )}
          <span className="font-bold">
            {currentPage.name} - {planState.userPlan.toUpperCase()} Plan: {shouldHaveAccess ? 'ACCESS GRANTED' : 'ACCESS RESTRICTED'}
          </span>
        </div>
        <div className="text-xs opacity-75">
          Override: {planOverride || 'None'} | Org: {organization?.name || 'None'} | Plan: {organization?.plan || 'None'}
        </div>
      </div>
    </div>
  );
}

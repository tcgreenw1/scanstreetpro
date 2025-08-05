import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Zap } from 'lucide-react';
import { PlanType } from '@/lib/planPermissions';
import { getPlanOverride, setPlanOverride } from '@/utils/planOverride';

const PLANS: { value: PlanType; label: string; color: string }[] = [
  { value: 'free', label: 'Free Plan', color: 'bg-blue-500' },
  { value: 'basic', label: 'Basic Plan', color: 'bg-green-500' },
  { value: 'pro', label: 'Pro Plan', color: 'bg-purple-500' },
  { value: 'premium', label: 'Premium Plan', color: 'bg-amber-500' },
  { value: 'satellite_enterprise', label: 'Satellite Enterprise', color: 'bg-red-500' },
  { value: 'driving_enterprise', label: 'Driving Enterprise', color: 'bg-indigo-500' }
];

export function TestPlanSwitcher() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>(
    getPlanOverride() || 'free'
  );

  const handlePlanChange = (plan: PlanType) => {
    setCurrentPlan(plan);
    setPlanOverride(plan);
    // Force page reload to apply plan changes
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-card p-4 rounded-xl border border-white/20 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <Zap className="w-5 h-5 text-orange-500" />
        <div className="text-sm">
          <div className="font-medium">Test Plan Switcher</div>
          <div className="text-xs text-slate-500">Current: {currentPlan}</div>
        </div>
        <Select value={currentPlan} onValueChange={handlePlanChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/20">
            {PLANS.map((plan) => (
              <SelectItem key={plan.value} value={plan.value}>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                  <span>{plan.label}</span>
                  {plan.value === 'free' && <Crown className="w-3 h-3 text-amber-500" />}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

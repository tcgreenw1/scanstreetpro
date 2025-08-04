import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Shield, BarChart3, Users, Calendar, DollarSign } from "lucide-react";
import { usePricing } from "@/contexts/PricingContext";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PremiumUpgradeCardProps {
  title?: string;
  description?: string;
  features?: Feature[];
  className?: string;
}

const defaultFeatures: Feature[] = [
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "Unlimited Access",
    description: "No limits on users, projects, or data"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-green-500" />,
    title: "Advanced Analytics",
    description: "Deep insights and custom reports"
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-500" />,
    title: "Enterprise Security",
    description: "SSO, audit logs, and compliance"
  }
];

export function PremiumUpgradeCard({
  title = "Unlock Premium Features",
  description = "Upgrade to access advanced functionality, unlimited usage, and enterprise-grade features for professional municipal management.",
  features = defaultFeatures,
  className = ""
}: PremiumUpgradeCardProps) {
  const { currentPlan } = usePricing();

  // Don't show if already on premium plan
  if (currentPlan !== 'free') {
    return null;
  }

  return (
    <Card className={`glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 ${className}`}>
      <CardContent className="p-8">
        <div className="text-center">
          <div className="relative mb-6">
            <Crown className="w-16 h-16 text-amber-500 mx-auto animate-pulse-glow" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            {title}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30 hover-scale"
              >
                <div className="mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/pricing'}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover-glow"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                30-day trial
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                No setup fees
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Specialized variants for different contexts
export function ContractorUpgradeCard() {
  const contractorFeatures: Feature[] = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Unlimited Contractors",
      description: "Manage unlimited contractor relationships"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      title: "Advanced Analytics",
      description: "Performance insights & detailed reports"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-purple-500" />,
      title: "Payment Automation",
      description: "Automated invoicing & payment processing"
    }
  ];

  return (
    <PremiumUpgradeCard
      title="Unlock Advanced Contractor Management"
      description="Upgrade to manage unlimited contractors, automate payments, and access comprehensive performance analytics for professional project oversight."
      features={contractorFeatures}
    />
  );
}

export function InspectionUpgradeCard() {
  const inspectionFeatures: Feature[] = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      title: "Mobile Forms",
      description: "Optimized for tablets & smartphones"
    },
    {
      icon: <Zap className="w-8 h-8 text-green-500" />,
      title: "Offline Capability",
      description: "Work without internet connection"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "Compliance Tracking",
      description: "Automated regulatory reporting"
    }
  ];

  return (
    <PremiumUpgradeCard
      title="Unlock Mobile Inspection Features"
      description="Upgrade to access mobile-optimized forms, offline capabilities, GPS auto-tagging, and automated compliance tracking for field teams."
      features={inspectionFeatures}
    />
  );
}

export function PlanningUpgradeCard() {
  const planningFeatures: Feature[] = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      title: "Unlimited Scenarios",
      description: "Model complex funding strategies"
    },
    {
      icon: <Zap className="w-8 h-8 text-green-500" />,
      title: "Advanced Modeling",
      description: "Monte Carlo & risk analysis"
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-500" />,
      title: "20-Year Planning",
      description: "Extended planning horizons"
    }
  ];

  return (
    <PremiumUpgradeCard
      title="Unlock Advanced Planning Features"
      description="Upgrade to access unlimited scenarios, advanced modeling, 20-year projections, Monte Carlo simulation, and enterprise reporting."
      features={planningFeatures}
    />
  );
}

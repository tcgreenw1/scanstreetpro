'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Crown, 
  Check, 
  Zap, 
  Star, 
  ArrowRight,
  CreditCard,
  Shield,
  Users,
  Database,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/hooks/usePlan";

interface PlanUpgradeModalProps {
  triggerText?: string;
  primaryColor?: string;
}

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  color: string;
  icon: React.ComponentType<any>;
}

export const PlanUpgradeModal = ({ 
  triggerText = 'Upgrade Plan',
  primaryColor = '#3b82f6'
}: PlanUpgradeModalProps) => {
  const { user } = useAuth();
  const { currentPlan } = usePlan();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const plans: Plan[] = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for trying out our platform',
      color: 'border-gray-200',
      icon: Database,
      features: [
        { name: 'Sample Data Only', included: true },
        { name: 'OpenStreetMap PCI Example', included: true },
        { name: '3 Users', included: true, limit: '3' },
        { name: 'Community Support', included: true },
        { name: '30-day Data Retention', included: true },
        { name: 'Basic Reports', included: false },
        { name: 'Advanced Analytics', included: false },
        { name: 'Priority Support', included: false }
      ]
    },
    {
      name: 'Basic',
      price: 99,
      period: 'month',
      description: 'Great for small teams getting started',
      color: 'border-blue-200',
      icon: Users,
      features: [
        { name: 'Real Data Access', included: true },
        { name: 'Full Platform Features', included: true },
        { name: '10 Users', included: true, limit: '10' },
        { name: 'Email Support', included: true },
        { name: '90-day Data Retention', included: true },
        { name: 'Basic Reports', included: true },
        { name: 'Advanced Analytics', included: false },
        { name: 'Priority Support', included: false }
      ]
    },
    {
      name: 'Pro',
      price: 199,
      period: 'month',
      description: 'For growing teams with advanced needs',
      color: 'border-purple-200',
      icon: Zap,
      popular: true,
      features: [
        { name: 'Everything in Basic', included: true },
        { name: '50 Users', included: true, limit: '50' },
        { name: 'Priority Support', included: true },
        { name: '1-year Data Retention', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Custom Reports', included: true },
        { name: 'API Access', included: true },
        { name: 'Integrations', included: true }
      ]
    },
    {
      name: 'Premium',
      price: 999,
      period: 'month',
      description: 'Enterprise-grade solution with unlimited access',
      color: 'border-yellow-200',
      icon: Crown,
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Unlimited Users', included: true, limit: '∞' },
        { name: 'Phone Support', included: true },
        { name: 'Unlimited Data Retention', included: true },
        { name: 'White-label Options', included: true },
        { name: 'Custom Integrations', included: true },
        { name: 'Dedicated Account Manager', included: true },
        { name: 'SLA Guarantee', included: true }
      ]
    }
  ];

  // Get auth token for API calls
  const getAuthToken = () => {
    return localStorage.getItem('neon_auth_token');
  };

  // Upgrade plan
  const upgradePlan = async (planName: string) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch('/api/admin/upgrade-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: planName.toLowerCase() })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Successfully upgraded to ${planName} plan!`);
        window.location.reload(); // Refresh to update plan info
      } else {
        throw new Error(data.error || 'Upgrade failed');
      }
    } catch (error: any) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadgeColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isCurrentPlan = (planName: string) => {
    return currentPlan?.toLowerCase() === planName.toLowerCase();
  };

  const canUpgrade = (planName: string) => {
    const planHierarchy = { 'free': 0, 'basic': 1, 'pro': 2, 'premium': 3 };
    const currentLevel = planHierarchy[currentPlan?.toLowerCase() as keyof typeof planHierarchy] ?? 0;
    const targetLevel = planHierarchy[planName.toLowerCase() as keyof typeof planHierarchy] ?? 0;
    return targetLevel > currentLevel;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: primaryColor }}>
          <Crown className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <span>Choose Your Plan</span>
          </DialogTitle>
          <DialogDescription>
            Select the perfect plan for your organization's needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isCurrent = isCurrentPlan(plan.name);
            const canUpgradeToThis = canUpgrade(plan.name);

            return (
              <Card 
                key={plan.name} 
                className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-purple-500' : ''} ${
                  selectedPlan === plan.name ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <span>{plan.name}</span>
                    {isCurrent && (
                      <Badge className={getPlanBadgeColor(plan.name)}>Current</Badge>
                    )}
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 border border-gray-300 rounded flex-shrink-0"></div>
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                          {feature.name}
                          {feature.limit && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {feature.limit}
                            </Badge>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    {isCurrent ? (
                      <Button disabled className="w-full">
                        <Check className="h-4 w-4 mr-2" />
                        Current Plan
                      </Button>
                    ) : canUpgradeToThis ? (
                      <Button 
                        className="w-full" 
                        onClick={() => upgradePlan(plan.name)}
                        disabled={loading}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Upgrade to {plan.name}
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Downgrade Not Available
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Billing Information
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                • All plans include a 14-day free trial
              </p>
              <p className="text-sm text-gray-600">
                • Cancel anytime with no penalties
              </p>
              <p className="text-sm text-gray-600">
                • Prorated billing for plan changes
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                • Secure payment processing
              </p>
              <p className="text-sm text-gray-600">
                • 99.9% uptime SLA guarantee
              </p>
              <p className="text-sm text-gray-600">
                • 24/7 priority support for Pro+
              </p>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Need help choosing? 
            <Button variant="link" className="p-0 h-auto ml-1">
              <Support className="h-4 w-4 mr-1" />
              Contact our sales team
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

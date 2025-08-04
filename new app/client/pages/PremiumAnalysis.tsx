import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Zap, Lock, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { usePricing } from "@/contexts/PricingContext";

interface FeatureComparison {
  feature: string;
  free: boolean;
  starter: boolean;
  professional: boolean;
  enterprise: boolean;
  description: string;
}

const featureMatrix: FeatureComparison[] = [
  {
    feature: "Basic Dashboard",
    free: true,
    starter: true,
    professional: true,
    enterprise: true,
    description: "Access to main dashboard and overview"
  },
  {
    feature: "Road Inspection",
    free: true,
    starter: true,
    professional: true,
    enterprise: true,
    description: "AI-powered road monitoring"
  },
  {
    feature: "Asset Manager",
    free: false,
    starter: true,
    professional: true,
    enterprise: true,
    description: "Track infrastructure assets"
  },
  {
    feature: "Maintenance Scheduling",
    free: false,
    starter: true,
    professional: true,
    enterprise: true,
    description: "Schedule and track maintenance"
  },
  {
    feature: "Cost Estimator",
    free: false,
    starter: false,
    professional: true,
    enterprise: true,
    description: "PCI-based cost projections"
  },
  {
    feature: "Contractor Portal",
    free: false,
    starter: false,
    professional: true,
    enterprise: true,
    description: "Contractor management portal"
  },
  {
    feature: "Integrations",
    free: false,
    starter: false,
    professional: true,
    enterprise: true,
    description: "Third-party system integrations"
  },
  {
    feature: "Advanced Analytics",
    free: false,
    starter: false,
    professional: false,
    enterprise: true,
    description: "Detailed reporting and analytics"
  },
  {
    feature: "Custom Branding",
    free: false,
    starter: false,
    professional: false,
    enterprise: true,
    description: "White-label customization"
  },
  {
    feature: "Priority Support",
    free: false,
    starter: false,
    professional: false,
    enterprise: true,
    description: "24/7 priority customer support"
  }
];

export default function PremiumAnalysis() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [status, setStatus] = useState('');
  const { currentPlan, planDetails } = usePricing();
  const { user, switchToOrganization } = useAuth();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*');
      
      if (error) throw error;
      setOrganizations(data || []);
    } catch (error: any) {
      setStatus(`Error loading organizations: ${error.message}`);
    }
  };

  const testOrgAccess = async (orgId: string, orgPlan: string) => {
    try {
      setStatus(`Testing access to ${orgPlan} organization...`);
      
      // Try to switch to this organization
      await switchToOrganization(orgId);
      
      const selectedOrg = organizations.find(org => org.id === orgId);
      setSelectedOrg(selectedOrg);
      
      setStatus(`Successfully switched to ${selectedOrg?.name} (${orgPlan} plan)`);
    } catch (error: any) {
      setStatus(`Error switching organizations: ${error.message}`);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-blue-100 text-blue-800';
      case 'starter': return 'bg-green-100 text-green-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeatureIcon = (hasFeature: boolean) => {
    return hasFeature ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <X className="w-4 h-4 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-amber-500" />
              <span>Premium vs Free Feature Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Current Context</h3>
                <p>User: {user?.email}</p>
                <p>Current Plan: <Badge className={getPlanColor(currentPlan)}>{planDetails.name}</Badge></p>
                {selectedOrg && (
                  <p>Selected Org: {selectedOrg.name} ({selectedOrg.plan})</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Test Organizations</h3>
                <div className="space-y-2">
                  {organizations.map((org) => (
                    <Button
                      key={org.id}
                      variant="outline"
                      size="sm"
                      onClick={() => testOrgAccess(org.id, org.plan)}
                      className="w-full justify-between"
                    >
                      <span>{org.name}</span>
                      <Badge className={getPlanColor(org.plan)}>{org.plan}</Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {status && (
              <Alert>
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Feature</th>
                    <th className="text-center p-3">
                      <Badge className={getPlanColor('free')}>Free</Badge>
                    </th>
                    <th className="text-center p-3">
                      <Badge className={getPlanColor('starter')}>Starter</Badge>
                    </th>
                    <th className="text-center p-3">
                      <Badge className={getPlanColor('professional')}>Professional</Badge>
                    </th>
                    <th className="text-center p-3">
                      <Badge className={getPlanColor('enterprise')}>Enterprise</Badge>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureMatrix.map((feature, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{feature.feature}</p>
                          <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        {getFeatureIcon(feature.free)}
                      </td>
                      <td className="text-center p-3">
                        {getFeatureIcon(feature.starter)}
                      </td>
                      <td className="text-center p-3">
                        {getFeatureIcon(feature.professional)}
                      </td>
                      <td className="text-center p-3">
                        {getFeatureIcon(feature.enterprise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['free', 'starter', 'professional', 'enterprise'].map((plan) => {
            const planPricing = {
              free: { price: 0, features: featureMatrix.filter(f => f.free).length },
              starter: { price: 29, features: featureMatrix.filter(f => f.starter).length },
              professional: { price: 99, features: featureMatrix.filter(f => f.professional).length },
              enterprise: { price: 299, features: featureMatrix.filter(f => f.enterprise).length }
            } as any;

            return (
              <Card key={plan} className="text-center">
                <CardHeader>
                  <CardTitle className="capitalize flex items-center justify-center space-x-2">
                    {plan === 'enterprise' ? <Crown className="w-5 h-5 text-amber-500" /> : <Zap className="w-5 h-5" />}
                    <span>{plan}</span>
                  </CardTitle>
                  <div className="text-2xl font-bold">
                    ${planPricing[plan].price}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {planPricing[plan].features} features included
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

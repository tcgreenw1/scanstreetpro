import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Crown,
  Check,
  Star,
  Zap,
  Building2,
  Users,
  Calendar,
  MapPin,
  FileText,
  Shield,
  Smartphone,
  Globe,
  ChevronRight,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePricing, PlanType } from '@/contexts/PricingContext';

const featureCategories = [
  {
    title: 'Dashboard & Analytics',
    features: [
      { name: 'PCI Summary Dashboard', free: true, standard: true, pro: true, enterprise: true },
      { name: 'Basic Charts (1 bar chart)', free: true, standard: false, pro: false, enterprise: false },
      { name: 'Full Chart Suite', free: false, standard: true, pro: true, enterprise: true },
      { name: 'Advanced Analytics', free: false, standard: false, pro: true, enterprise: true },
      { name: 'Custom Reports', free: false, standard: false, pro: true, enterprise: true }
    ]
  },
  {
    title: 'Asset Management',
    features: [
      { name: 'Up to 20 Assets', free: true, standard: false, pro: false, enterprise: false },
      { name: 'Unlimited Assets', free: false, standard: true, pro: true, enterprise: true },
      { name: 'GPS Asset Tracking', free: false, standard: true, pro: true, enterprise: true },
      { name: 'Predictive Maintenance', free: false, standard: false, pro: true, enterprise: true },
      { name: 'Asset History Tracking', free: false, standard: true, pro: true, enterprise: true }
    ]
  },
  {
    title: 'Inspections & Maintenance',
    features: [
      { name: 'Read-only Calendar', free: true, standard: false, pro: false, enterprise: false },
      { name: 'Interactive Calendar', free: false, standard: true, pro: true, enterprise: true },
      { name: 'Mobile Inspection Forms', free: false, standard: true, pro: true, enterprise: true },
      { name: 'Photo/GPS Capture', free: false, standard: false, pro: true, enterprise: true },
      { name: 'Offline Support', free: false, standard: false, pro: true, enterprise: true },
      { name: 'Gantt Timeline View', free: false, standard: false, pro: true, enterprise: true }
    ]
  },
  {
    title: 'Mapping & Scanning',
    features: [
      { name: 'OpenStreetMap + PCI Overlays', free: true, standard: true, pro: true, enterprise: true },
      { name: 'PCI Color-coded Maps', free: false, standard: true, pro: true, enterprise: true },
      { name: 'Satellite Scan Viewer', free: false, standard: false, pro: true, enterprise: true },
      { name: 'Driving-based Scan Viewer', free: false, standard: false, pro: false, enterprise: true },
      { name: 'Real-time Data Updates', free: false, standard: false, pro: true, enterprise: true }
    ]
  },
  {
    title: 'Team & Collaboration',
    features: [
      { name: '1 Team Member', free: true, standard: false, pro: false, enterprise: false },
      { name: '3 Team Members', free: false, standard: true, pro: false, enterprise: false },
      { name: '10 Team Members', free: false, standard: false, pro: true, enterprise: false },
      { name: 'Unlimited Users', free: false, standard: false, pro: false, enterprise: true },
      { name: 'Role-based Permissions', free: false, standard: false, pro: true, enterprise: true }
    ]
  },
  {
    title: 'Citizen Engagement',
    features: [
      { name: '10 Citizen Submissions/month', free: true, standard: false, pro: false, enterprise: false },
      { name: 'Unlimited Submissions', free: false, standard: true, pro: true, enterprise: true },
      { name: 'Auto-categorization', free: false, standard: true, pro: true, enterprise: true },
      { name: 'SMS/Email Notifications', free: false, standard: false, pro: true, enterprise: true },
      { name: 'Deduplication Engine', free: false, standard: false, pro: true, enterprise: true }
    ]
  }
];

export default function Pricing() {
  const { currentPlan, upgradePlan, getAllPlans } = usePricing();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  });

  const plans = getAllPlans();
  const planOrder: PlanType[] = ['free', 'standard', 'pro', 'enterprise'];

  const getPrice = (plan: PlanType) => {
    const basePrice = plans[plan].price;
    if (plan === 'enterprise' || basePrice === 0) return basePrice;
    return billingPeriod === 'annual' ? Math.floor(basePrice * 0.8) : basePrice;
  };

  const handleUpgrade = (plan: PlanType) => {
    if (plan === 'enterprise') {
      setShowContactForm(true);
    } else {
      upgradePlan(plan);
      // In a real app, this would integrate with Stripe
      alert(`Upgrading to ${plans[plan].name} plan for $${getPrice(plan)}/${billingPeriod === 'annual' ? 'year' : 'month'}`);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you! Our sales team will contact you within 24 hours.');
    setShowContactForm(false);
    setContactForm({ name: '', email: '', phone: '', organization: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center py-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-6">
          Choose Your Scan Street Pro Plan
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
          From small towns to large cities, we have a plan that fits your infrastructure management needs.
          Start free and scale as you grow.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={cn("text-sm font-medium", billingPeriod === 'monthly' ? 'text-slate-800 dark:text-white' : 'text-slate-500')}>
            Monthly
          </span>
          <Switch
            checked={billingPeriod === 'annual'}
            onCheckedChange={(checked) => setBillingPeriod(checked ? 'annual' : 'monthly')}
          />
          <span className={cn("text-sm font-medium", billingPeriod === 'annual' ? 'text-slate-800 dark:text-white' : 'text-slate-500')}>
            Annual
          </span>
          <Badge className="bg-green-100 text-green-800 border-green-200">Save 20%</Badge>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {planOrder.map((planKey) => {
          const plan = plans[planKey];
          const price = getPrice(planKey);
          const isCurrentPlan = currentPlan === planKey;
          const isPopular = plan.popular;
          
          return (
            <Card 
              key={planKey}
              className={cn(
                "relative glass-card border-white/20 hover:shadow-2xl transition-all duration-300",
                isPopular && "border-blue-500/50 shadow-xl scale-105",
                isCurrentPlan && "ring-2 ring-blue-500"
              )}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    <Check className="w-3 h-3 mr-1" />
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  {planKey === 'free' && <Zap className="w-8 h-8 text-white" />}
                  {planKey === 'standard' && <Building2 className="w-8 h-8 text-white" />}
                  {planKey === 'pro' && <Crown className="w-8 h-8 text-white" />}
                  {planKey === 'enterprise' && <Shield className="w-8 h-8 text-white" />}
                </div>
                
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  {plan.name}
                </CardTitle>
                
                <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-6">
                  {planKey === 'enterprise' ? (
                    <div>
                      <p className="text-3xl font-bold text-slate-800 dark:text-white">Custom</p>
                      <p className="text-sm text-slate-500">Contact for pricing</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-slate-800 dark:text-white">
                          ${price}
                        </span>
                        {price > 0 && (
                          <span className="text-slate-500 ml-1">
                            /{billingPeriod === 'annual' ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      {billingPeriod === 'annual' && price > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Save ${Math.floor(plans[planKey].price * 0.2 * 12)}/year
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800 dark:text-white">Key Features:</h4>
                  <ul className="space-y-2 text-sm">
                    {planKey === 'free' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Up to 20 assets
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Basic dashboard
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          OpenStreetMap integration
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          1 export per month
                        </li>
                      </>
                    )}
                    {planKey === 'standard' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Unlimited assets
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Interactive calendar
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Basic inspection tools
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          3 team members
                        </li>
                      </>
                    )}
                    {planKey === 'pro' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Satellite scan viewer
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Advanced analytics
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Full inspection toolkit
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          10 team members
                        </li>
                      </>
                    )}
                    {planKey === 'enterprise' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Everything in Pro
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Driving scan viewer
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Full API access
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          White-label branding
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleUpgrade(planKey)}
                  disabled={isCurrentPlan}
                  className={cn(
                    "w-full",
                    isCurrentPlan ? "bg-gray-400 cursor-not-allowed" :
                    planKey === 'enterprise' ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" :
                    isPopular ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" :
                    "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {isCurrentPlan ? "Current Plan" :
                   planKey === 'free' ? "Start Free" :
                   planKey === 'enterprise' ? "Contact Sales" :
                   `Upgrade to ${plan.name}`}
                  {!isCurrentPlan && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-8">
          Feature Comparison
        </h2>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-8">
            {featureCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8 last:mb-0">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {category.title}
                </h3>
                
                <div className="grid grid-cols-5 gap-4">
                  <div className="font-medium text-slate-600 dark:text-slate-300">Feature</div>
                  <div className="font-medium text-slate-600 dark:text-slate-300 text-center">Free</div>
                  <div className="font-medium text-slate-600 dark:text-slate-300 text-center">Standard</div>
                  <div className="font-medium text-slate-600 dark:text-slate-300 text-center">Pro</div>
                  <div className="font-medium text-slate-600 dark:text-slate-300 text-center">Enterprise</div>
                  
                  {category.features.map((feature, featureIndex) => (
                    <React.Fragment key={`feature-${categoryIndex}-${featureIndex}`}>
                      <div className="text-sm text-slate-700 dark:text-slate-300 py-2">
                        {feature.name}
                      </div>
                      <div className="text-center py-2">
                        {feature.free ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <div className="w-4 h-4"></div>}
                      </div>
                      <div className="text-center py-2">
                        {feature.standard ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <div className="w-4 h-4"></div>}
                      </div>
                      <div className="text-center py-2">
                        {feature.pro ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <div className="w-4 h-4"></div>}
                      </div>
                      <div className="text-center py-2">
                        {feature.enterprise ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <div className="w-4 h-4"></div>}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Contact Sales</CardTitle>
              <CardDescription>
                Let's discuss your organization's needs and create a custom plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={contactForm.organization}
                    onChange={(e) => setContactForm({...contactForm, organization: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Tell us about your needs</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={() => setShowContactForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">
          Questions? We're here to help.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            sales@municipalsystems.com
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            1-800-MUNICIPAL
          </Button>
        </div>
      </div>
    </div>
  );
}

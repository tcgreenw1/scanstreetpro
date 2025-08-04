import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ArrowRight,
  CreditCard,
  Lock
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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PlanType | null>(null);

  // Check for Stripe checkout result
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      alert('🎉 Payment successful! Welcome to your new plan!');
      // Clean up URL
      window.history.replaceState({}, '', '/pricing');
    } else if (urlParams.get('canceled') === 'true') {
      alert('Payment was canceled. You can try again anytime.');
      // Clean up URL
      window.history.replaceState({}, '', '/pricing');
    }
  }, []);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  });

  const plans = getAllPlans();
  const planOrder: PlanType[] = ['free', 'basic', 'pro', 'premium', 'satellite', 'driving'];

  const getPrice = (planKey: PlanType): number => {
    return getPlanPrice(planKey);
  };

  const getPlanInfo = (planKey: string) => {
    const planData = {
      free: { name: 'Free', description: 'Perfect for getting started with sample data', price: 0 },
      basic: { name: 'Basic', description: 'Essential features for small municipalities', price: 99 },
      pro: { name: 'Pro', description: 'Advanced features for growing cities', price: 199, popular: true },
      premium: { name: 'Premium', description: 'Custom solution with dedicated support', price: 999 },
      satellite: { name: 'Satellite Enterprise', description: 'AI-powered satellite-based data collection', price: 0 },
      driving: { name: 'Driving Enterprise', description: 'High-precision driving-based data collection', price: 0 }
    };
    return planData[planKey] || planData.free;
  };

  const getPlanPrice = (planKey: string) => {
    const plan = getPlanInfo(planKey);
    return plan.price;
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach' | 'invoice'>('card');

  const handleUpgrade = async (plan: PlanType) => {
    if (plan === 'satellite' || plan === 'driving') {
      setShowContactForm(true);
      return;
    }

    if (plan === 'free') {
      upgradePlan(plan);
      alert('Downgraded to Free plan successfully!');
      return;
    }

    // Simulate Stripe payment processing
    setIsProcessingPayment(true);

    try {
      // In a real implementation, this would call Stripe API
      const mockStripeSession = {
        id: 'cs_' + Math.random().toString(36).substring(2, 15),
        amount: getPrice(plan) * (billingPeriod === 'annual' ? 12 : 1) * 100, // Convert to cents
        currency: 'usd',
        customer_email: 'user@example.com',
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plans[plan].name} Plan`,
              description: plans[plan].description
            },
            unit_amount: getPrice(plan) * 100,
            recurring: {
              interval: billingPeriod === 'annual' ? 'year' : 'month'
            }
          },
          quantity: 1
        }],
        mode: 'subscription',
        success_url: window.location.origin + '/pricing?success=true',
        cancel_url: window.location.origin + '/pricing?canceled=true'
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful payment
      upgradePlan(plan);
      alert(`Payment successful! Welcome to ${plans[plan].name} plan! 🎉\\n\\nSession ID: ${mockStripeSession.id}\\nAmount: $${(mockStripeSession.amount / 100).toFixed(2)}\\n\\nIn a real app, this would redirect to Stripe Checkout.`);

      // In a real app, you would redirect to Stripe Checkout:
      // window.location.href = stripeSession.url;

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again or contact support.');
    } finally {
      setIsProcessingPayment(false);
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

        {/* Billing Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto mb-8">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            All plans billed annually – contact us for monthly pricing.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Core Plans */}
        {planOrder.slice(0, 4).map((planKey) => {
          const plan = plans[planKey] || getPlanInfo(planKey);
          const price = getPlanPrice(planKey);
          const isCurrentPlan = currentPlan === planKey;
          const isPopular = planKey === 'pro';

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
                  {(planKey === 'premium' && price > 500) || planKey === 'satellite' || planKey === 'driving' ? (
                    <div>
                      <p className="text-3xl font-bold text-slate-800 dark:text-white">
                        {price === 999 ? '$999/mo' : 'Custom'}
                      </p>
                      <p className="text-sm text-slate-500">Contact for pricing</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-slate-800 dark:text-white">
                          ${price}
                        </span>
                        {price > 0 && (
                          <span className="text-slate-500 ml-1">/mo</span>
                        )}
                      </div>
                      {price > 0 && (
                        <p className="text-sm text-blue-600 mt-1">
                          Billed annually
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
                          Sample Data
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          OpenStreetMap PCI Example
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          1 export/month
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Basic dashboard
                        </li>
                      </>
                    )}
                    {planKey === 'basic' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Unlimited Asset Management
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Budget Simulations
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Expense Management
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          3 team members
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Interactive calendar
                        </li>
                      </>
                    )}
                    {planKey === 'pro' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Everything in Basic plus:
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Maintenance Scheduling
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Unlimited Exports
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Full Integrations
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Funding Center
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Road Inspection Dashboard
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Contractor Dashboard
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Custom Reports
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Citizen Engagement
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          10 team members
                        </li>
                      </>
                    )}
                    {planKey === 'premium' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Everything in Pro plus:
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Personalized Mobile & Web App
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Website Integration
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Dedicated IT Setup
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* CTA Button */}
                {planKey === 'free' || isCurrentPlan ? (
                  <Button
                    onClick={() => handleUpgrade(planKey)}
                    disabled={isCurrentPlan}
                    className={cn(
                      "w-full",
                      isCurrentPlan ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    {isCurrentPlan ? "Current Plan" : "Start Free"}
                    {!isCurrentPlan && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                ) : planKey === 'premium' || planKey === 'satellite' || planKey === 'driving' ? (
                  <Button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Contact Sales
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedPlanForPayment(planKey)}
                        disabled={isProcessingPayment}
                        className={cn(
                          "w-full",
                          isPopular ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : "bg-blue-600 hover:bg-blue-700"
                        )}
                      >
                        {isProcessingPayment ? 'Processing...' : `Upgrade to ${plan.name}`}
                        {!isProcessingPayment && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Complete Your Upgrade</DialogTitle>
                        <DialogDescription>
                          Upgrade to {plan.name} plan for ${getPrice(planKey)}/{billingPeriod === 'annual' ? 'year' : 'month'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Payment Method</Label>
                          <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="card">💳 Credit/Debit Card</SelectItem>
                              <SelectItem value="ach">🏦 Bank Transfer (ACH)</SelectItem>
                              <SelectItem value="invoice">📄 Invoice (Enterprise)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Order Summary</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>{plan.name} Plan</span>
                              <span>${getPrice(planKey)}/{billingPeriod === 'annual' ? 'year' : 'month'}</span>
                            </div>
                            {billingPeriod === 'annual' && (
                              <div className="flex justify-between text-green-600">
                                <span>Annual Discount (20%)</span>
                                <span>-${(getPrice(planKey) * 12 * 0.2).toFixed(0)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Total {billingPeriod === 'annual' ? 'Annual' : 'Monthly'}</span>
                              <span>${billingPeriod === 'annual' ? (getPrice(planKey) * 12 * 0.8).toFixed(0) : getPrice(planKey)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm">
                          <p className="text-blue-800 dark:text-blue-300">
                            🔒 Secure payment powered by Stripe. Cancel anytime.
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex-1">Cancel</Button>
                          <Button
                            onClick={() => handleUpgrade(selectedPlanForPayment!)}
                            disabled={isProcessingPayment}
                            className="flex-1"
                          >
                            {isProcessingPayment ? 'Processing...' : 'Complete Payment'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enterprise Plans */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Enterprise Data Collection Plans</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Advanced scanning solutions with AI assistance and dedicated engineering support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Satellite Enterprise */}
        <Card className="glass-card border-white/20 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
              Satellite Enterprise
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
              AI-powered satellite-based data collection
            </CardDescription>
            <div className="mt-6">
              <p className="text-3xl font-bold text-slate-800 dark:text-white">Custom</p>
              <p className="text-sm text-slate-500">Contact for pricing</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800 dark:text-white">Key Features:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Everything in Pro plus:
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  AI & Engineer Help
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Scan up to 5x/year
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Fast Rescans
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Council Reports
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Basic Citizen Reports
                </li>
              </ul>
            </div>
            <Button
              onClick={() => setShowContactForm(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Contact Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Driving Enterprise */}
        <Card className="glass-card border-white/20 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
              Driving Enterprise
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
              High-precision driving-based data collection
            </CardDescription>
            <div className="mt-6">
              <p className="text-3xl font-bold text-slate-800 dark:text-white">Custom</p>
              <p className="text-sm text-slate-500">Contact for pricing</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800 dark:text-white">Key Features:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Same as Satellite Enterprise
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  AI & Engineer Help
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Scan up to 5x/year
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Fast Rescans
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Council Reports
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Basic Citizen Reports
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Driving-based data collection
                </li>
              </ul>
            </div>
            <Button
              onClick={() => setShowContactForm(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Contact Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
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

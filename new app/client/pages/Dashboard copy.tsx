import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { CityMap } from "@/components/dashboard/CityMap";
import { ModulesGrid } from "@/components/dashboard/ModulesGrid";
import { UpgradeCTA } from "@/components/dashboard/UpgradeCTA";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { OnboardingTutorial } from "@/components/onboarding/OnboardingTutorial";

export default function Dashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-50 to-civic-100">
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-8">
        {/* Dashboard Overview Section */}
        <div className="dashboard-overview space-y-8">
          {/* Welcome Card */}
          <WelcomeCard className="animate-fade-in" />
          
          {/* At-a-Glance Metrics */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Key Performance Indicators
              </h2>
              <p className="text-muted-foreground">
                Real-time overview of your city's infrastructure status
              </p>
            </div>
            <MetricsCards className="animate-slide-in-up delay-200" />
          </div>
          
          {/* Interactive Map */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                City Infrastructure Map
              </h2>
              <p className="text-muted-foreground">
                Interactive GIS visualization of your municipal assets and operations
              </p>
            </div>
            <CityMap className="animate-slide-in-up delay-400" />
          </div>
          
          {/* Modules Grid */}
          <div className="space-y-4">
            <ModulesGrid className="animate-slide-in-up delay-600" />
          </div>
          
          {/* Upgrade CTA */}
          <UpgradeCTA className="animate-slide-in-up delay-800" />
        </div>
      </main>
      
      {/* Footer */}
      <div className="container mx-auto px-4 lg:px-6">
        <DashboardFooter />
      </div>
      
      {/* Onboarding Tutorial */}
      <OnboardingTutorial onComplete={handleOnboardingComplete} />
    </div>
  );
}

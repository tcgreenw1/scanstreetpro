import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Your Municipal Dashboard",
    description: "Hello! Let's take a quick tour of your new unified city management platform. This will only take a minute.",
  },
  {
    id: "dashboard",
    title: "Dashboard Overview",
    description: "This is your main dashboard where you'll see all critical city metrics at a glance - from PCI scores to budget status.",
    target: ".dashboard-overview",
  },
  {
    id: "metrics",
    title: "Key Performance Indicators",
    description: "View your PCI scores, open inspections, scheduled repairs, and budget information right here.",
    target: ".metrics-cards",
  },
  {
    id: "map",
    title: "Interactive City Map",
    description: "Your GIS map shows real-time data including PCI layers, assets, repair tickets, and citizen submissions.",
    target: ".city-map",
  },
  {
    id: "modules",
    title: "Management Modules",
    description: "Access all your city management tools: Asset Manager, Maintenance Scheduler, Contractor Portal, and more.",
    target: ".modules-grid",
  },
  {
    id: "citizen-reports",
    title: "Fix My Road Submissions",
    description: "Monitor and respond to citizen-submitted issues through the Fix My Road system.",
    target: ".citizen-reports",
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "You're ready to manage your city like a pro. Explore the dashboard and start optimizing your municipal operations.",
  },
];

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem("municipalDashboardTutorialCompleted");
    if (!tutorialCompleted) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("municipalDashboardTutorialCompleted", "true");
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem("municipalDashboardTutorialCompleted", "true");
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full h-full">
        {/* Spotlight effect for targeted elements */}
        {step.target && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        
        {/* Tutorial card */}
        <div className={cn(
          "absolute max-w-md p-6 transform -translate-x-1/2 -translate-y-1/2",
          step.target ? "top-1/4 left-1/2" : "top-1/2 left-1/2"
        )}>
          <Card className="glass border-civic-200/50 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {isLastStep ? <CheckCircle className="w-4 h-4" /> : currentStep + 1}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {isLastStep ? "Complete" : `Step ${currentStep + 1} of ${onboardingSteps.length}`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground mb-6">{step.description}</p>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentStep ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isLastStep ? "Get Started" : "Next"}
                  {!isLastStep && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Animated arrow pointing to target */}
        {step.target && (
          <div className="absolute animate-bounce pointer-events-none">
            <div className="w-4 h-4 bg-primary transform rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
}

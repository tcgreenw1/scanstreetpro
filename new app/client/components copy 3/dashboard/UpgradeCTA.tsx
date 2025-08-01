import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Sparkles,
  FileText,
  Smartphone,
  Brain,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeCTAProps {
  className?: string;
}

export function UpgradeCTA({ className }: UpgradeCTAProps) {
  const premiumFeatures = [
    {
      icon: Brain,
      name: "AI Planning Assistant",
      description: "Intelligent infrastructure recommendations",
    },
    {
      icon: FileText,
      name: "Advanced PDF Reports",
      description: "Council-ready professional reports",
    },
    {
      icon: Smartphone,
      name: "Mobile Access",
      description: "Full mobile app for field work",
    },
    {
      icon: Sparkles,
      name: "Advanced Analytics",
      description: "Predictive maintenance insights",
    },
  ];

  return (
    <Card className={cn("glass border-gradient-to-r from-yellow-200 to-orange-200 bg-gradient-to-br from-yellow-50 to-orange-50", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse-soft">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Unlock Advanced Municipal Tools
              </h3>
              <p className="text-gray-600">
                Upgrade to access AI planning, advanced reports, mobile access, and more
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
            Premium
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {premiumFeatures.map((feature) => (
            <div key={feature.name} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-yellow-200">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">
                  {feature.name}
                </h4>
                <p className="text-xs text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Starting at <span className="font-semibold text-gray-900">$99/month</span>
            </p>
            <p className="text-xs text-gray-500">
              30-day free trial • Cancel anytime
            </p>
          </div>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0">
            Upgrade Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

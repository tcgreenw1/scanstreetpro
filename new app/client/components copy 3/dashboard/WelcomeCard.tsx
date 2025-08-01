import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeCardProps {
  userName?: string;
  className?: string;
}

export function WelcomeCard({ userName = "Alex", className }: WelcomeCardProps) {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { greeting: "Good evening", icon: Moon };
    if (hour < 12) return { greeting: "Good morning", icon: Sunrise };
    if (hour < 17) return { greeting: "Good afternoon", icon: Sun };
    return { greeting: "Good evening", icon: Sunset };
  };

  const { greeting, icon: TimeIcon } = getTimeOfDay();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className={cn("glass border-civic-200/50 animate-fade-in", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TimeIcon className="w-5 h-5 text-civic-600" />
              <h2 className="text-2xl font-semibold text-foreground">
                {greeting}, {userName}.
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Here's a summary of your city operations for {currentDate}.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                All Systems Operational
              </Badge>
              <Badge variant="outline" className="border-civic-200 text-civic-600">
                3 Pending Reviews
              </Badge>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-civic-400 to-civic-600 flex items-center justify-center animate-pulse-soft">
              <TimeIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

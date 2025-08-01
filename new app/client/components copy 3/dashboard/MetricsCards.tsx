import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  FileText,
  MapPin,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ElementType;
  status?: "good" | "warning" | "critical";
  progress?: number;
  className?: string;
}

function MetricCard({
  title,
  value,
  subValue,
  trend,
  trendValue,
  icon: Icon,
  status = "good",
  progress,
  className,
}: MetricCardProps) {
  const statusColors = {
    good: "text-green-600 bg-green-50 border-green-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
    critical: "text-red-600 bg-red-50 border-red-200",
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <Card className={cn("glass border-civic-200/50 hover:shadow-lg transition-all duration-300 animate-slide-in-up", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", statusColors[status])}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {trend && trendValue && (
              <div className={cn("flex items-center gap-1 text-sm", trendColors[trend])}>
                {trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : trend === "down" ? (
                  <TrendingDown className="w-3 h-3" />
                ) : null}
                {trendValue}
              </div>
            )}
          </div>
          {subValue && (
            <p className="text-xs text-muted-foreground">{subValue}</p>
          )}
          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{progress}% of target</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricsCardsProps {
  className?: string;
}

export function MetricsCards({ className }: MetricsCardsProps) {
  const metrics = [
    {
      title: "Average PCI Score",
      value: "7.8",
      subValue: "Out of 10 (Good condition)",
      trend: "up" as const,
      trendValue: "+0.2 from last month",
      icon: CheckCircle,
      status: "good" as const,
      progress: 78,
    },
    {
      title: "Open Inspection Tickets",
      value: "23",
      subValue: "5 high priority, 18 routine",
      trend: "down" as const,
      trendValue: "-8 from last week",
      icon: AlertTriangle,
      status: "warning" as const,
    },
    {
      title: "Miles Scheduled for Repair",
      value: "12.3",
      subValue: "Across 8 work zones",
      trend: "up" as const,
      trendValue: "+3.1 miles added",
      icon: Wrench,
      status: "good" as const,
    },
    {
      title: "Budget Status",
      value: "$847K",
      subValue: "Available of $1.2M allocated",
      trend: "neutral" as const,
      trendValue: "71% remaining",
      icon: DollarSign,
      status: "good" as const,
      progress: 71,
    },
    {
      title: "Pending Grants",
      value: "4",
      subValue: "$2.3M total value pending",
      trend: "up" as const,
      trendValue: "2 new applications",
      icon: FileText,
      status: "good" as const,
    },
    {
      title: "Fix My Road Submissions",
      value: "18",
      subValue: "Last 7 days",
      trend: "up" as const,
      trendValue: "+6 from previous week",
      icon: MapPin,
      status: "warning" as const,
    },
  ];

  return (
    <div className={cn("metrics-cards", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            className={`delay-${index * 100}`}
          />
        ))}
      </div>
    </div>
  );
}

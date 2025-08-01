import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Building2,
  Calendar,
  Users,
  ClipboardCheck,
  DollarSign,
  Calculator,
  TrendingUp,
  MessageSquare,
  FileText,
  Settings,
  ArrowRight,
  Lock,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  status?: "active" | "locked" | "premium";
  preview?: {
    label: string;
    value: string | number;
  };
  className?: string;
}

function ModuleCard({
  title,
  description,
  icon: Icon,
  href,
  status = "active",
  preview,
  className,
}: ModuleCardProps) {
  const isLocked = status === "locked" || status === "premium";

  return (
    <Card
      className={cn(
        "glass border-civic-200/50 hover:shadow-lg transition-all duration-300 group animate-slide-in-up",
        isLocked && "opacity-75",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              status === "active" ? "bg-civic-500 text-white" :
              status === "premium" ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" :
              "bg-civic-200 text-civic-500"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {preview && (
                <div className="text-lg font-semibold text-civic-600 mt-1">
                  {preview.value}
                  <span className="text-xs text-muted-foreground ml-1">
                    {preview.label}
                  </span>
                </div>
              )}
            </div>
          </div>
          {status === "premium" && (
            <Crown className="w-4 h-4 text-yellow-500" />
          )}
          {status === "locked" && (
            <Lock className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        {status === "active" ? (
          <Link to={href}>
            <Button variant="outline" size="sm" className="w-full group-hover:bg-civic-50">
              Open Module
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={status === "locked"}
          >
            {status === "premium" ? "Upgrade Required" : "Coming Soon"}
            {status === "premium" && <Crown className="w-4 h-4 ml-2" />}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface ModulesGridProps {
  className?: string;
}

export function ModulesGrid({ className }: ModulesGridProps) {
  const modules = [
    {
      title: "Asset Manager",
      description: "Manage signs, lights, barriers, and other infrastructure assets with detailed tracking and maintenance schedules.",
      icon: Building2,
      href: "/assets",
      status: "active" as const,
      preview: {
        label: "assets tracked",
        value: "1,284",
      },
    },
    {
      title: "Maintenance Scheduler",
      description: "Schedule, track, and assign maintenance tasks. View upcoming, overdue items and contractor assignments.",
      icon: Calendar,
      href: "/maintenance",
      status: "active" as const,
      preview: {
        label: "tasks this week",
        value: "12",
      },
    },
    {
      title: "Contractor Portal",
      description: "Monitor live jobs, track status updates, manage invoices and communicate with contractors in real-time.",
      icon: Users,
      href: "/contractors",
      status: "active" as const,
      preview: {
        label: "active jobs",
        value: "8",
      },
    },
    {
      title: "Inspection Tool",
      description: "Track submitted inspections, review overdue items, and manage the inspection workflow efficiently.",
      icon: ClipboardCheck,
      href: "/inspections",
      status: "active" as const,
      preview: {
        label: "pending reviews",
        value: "23",
      },
    },
    {
      title: "Funding Center",
      description: "Discover available grants, manage drafts, track submitted applications and funding opportunities.",
      icon: DollarSign,
      href: "/funding",
      status: "premium" as const,
      preview: {
        label: "pending grants",
        value: "4",
      },
    },
    {
      title: "Budget Planner",
      description: "View historical spending patterns and create 5-year budget projections with intelligent forecasting.",
      icon: TrendingUp,
      href: "/budget",
      status: "premium" as const,
      preview: {
        label: "remaining budget",
        value: "$847K",
      },
    },
    {
      title: "Estimate Tool",
      description: "PCI-based cost projection simulator for infrastructure planning and budget forecasting.",
      icon: Calculator,
      href: "/estimates",
      status: "premium" as const,
    },
    {
      title: "Fix My Road Feed",
      description: "Monitor citizen-submitted issues with map pins, photos, and priority-based workflow management.",
      icon: MessageSquare,
      href: "/citizen-reports",
      status: "active" as const,
      preview: {
        label: "new reports",
        value: "18",
      },
    },
    {
      title: "Public Reports Generator",
      description: "Generate comprehensive reports for council meetings with export options to PDF and Excel formats.",
      icon: FileText,
      href: "/reports",
      status: "premium" as const,
    },
    {
      title: "Settings & Billing",
      description: "Manage account settings, user permissions, subscription billing, and platform configuration.",
      icon: Settings,
      href: "/settings",
      status: "active" as const,
    },
  ];

  return (
    <div className={cn("modules-grid", className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Management Modules
        </h2>
        <p className="text-muted-foreground">
          Access all your city management tools in one unified platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((module, index) => (
          <ModuleCard
            key={module.title}
            {...module}
            className={`delay-${index * 75}`}
          />
        ))}
      </div>
    </div>
  );
}

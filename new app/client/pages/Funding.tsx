import PlaceholderPage from "@/components/PlaceholderPage";
import { Banknote } from "lucide-react";

export default function Funding() {
  const features = [
    "Input forms for sales tax revenue, state/federal grants, infrastructure bonds, and special assessments",
    "Multi-year funding timeline visualization and planning",
    "Interactive donut chart and stacked bar charts showing funding breakdown by type",
    "Automatic balance calculations vs expenditures with real-time updates",
    "Grant application deadline tracking and renewal notifications",
    "Integration with state and federal funding databases",
    "Scenario planning tools for different funding combinations",
    "Export capabilities for budget reports and grant applications"
  ];

  return (
    <PlaceholderPage
      title="Funding Sources"
      description="Manage and track all revenue streams including taxes, grants, bonds, and special assessments"
      features={features}
      icon={<Banknote className="w-8 h-8" />}
    />
  );
}

import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Calendar } from "lucide-react";

export default function Planning() {
  const features = [
    "5-10 year budget goal setting with adjustable parameters",
    "Funding scenario simulation (grant added/removed impact analysis)",
    "PCI (Pavement Condition Index) projection charts with budget correlation",
    "Asphalt vs concrete road type cost analysis and planning",
    "Early warning system for PCI scores below acceptable thresholds",
    "Interactive toggles for annual inflation, material costs, and lane miles",
    "What-if analysis for different maintenance strategies",
    "Long-term capital improvement program (CIP) planning tools",
    "Integration with asset management systems for lifecycle planning"
  ];

  return (
    <PlaceholderPage
      title="Multi-Year Planning"
      description="Strategic budget planning and PCI forecasting for 5-10 year infrastructure goals"
      features={features}
      icon={<Calendar className="w-8 h-8" />}
    />
  );
}

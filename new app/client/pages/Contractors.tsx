import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Users } from "lucide-react";

export default function Contractors() {
  const features = [
    "Comprehensive contractor database with contact info and performance history",
    "Project assignment and cost estimation tracking",
    "Deadline management with automated notifications and alerts",
    "Completion status tracking with progress percentages",
    "Interactive Gantt-style timeline for all active and pending projects",
    "Quote and contract document upload and attachment system",
    "Performance metrics and rating system for contractor evaluation",
    "Payment scheduling and invoice tracking",
    "Contractor certification and license verification",
    "Bid comparison tools for competitive project selection"
  ];

  return (
    <PlaceholderPage
      title="Contractor & Maintenance Scheduling"
      description="Manage contractors, projects, deadlines, and track maintenance scheduling"
      features={features}
      icon={<Users className="w-8 h-8" />}
    />
  );
}

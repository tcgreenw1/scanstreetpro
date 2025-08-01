import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Settings } from "lucide-react";

export default function Integrations() {
  const features = [
    "Compatible integrations with Excel, Tyler Tech, Incode, and Caselle systems",
    "Admin panel with secure API token management system",
    "Two-way data synchronization with existing city budget software",
    "Option to fully replace legacy systems with seamless data migration",
    "Real-time sync status monitoring and error handling",
    "Custom field mapping for different software configurations",
    "Automated backup and data validation systems",
    "Integration with popular accounting software (QuickBooks, SAP, etc.)",
    "API documentation and developer tools for custom integrations",
    "White-label options for municipal software vendors"
  ];

  return (
    <PlaceholderPage
      title="Integrations & System Replacement"
      description="Connect with existing systems or replace legacy budget management software"
      features={features}
      icon={<Settings className="w-8 h-8" />}
    />
  );
}

import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PlaceholderPage } from "./components/PlaceholderPage";
import HomePage from "./pages/HomePage";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AssetManager from "./pages/AssetManager";
import NewInspection from "./pages/NewInspection";
import StartGrant from "./pages/StartGrant";
import Applications from "./pages/Applications";
import Funding from "./pages/Funding";
import Contractors from "./pages/Contractors";
import CitizenHistory from "./pages/CitizenHistory";
import Expenses from "./pages/Expenses";
import Planning from "./pages/Planning";
import VerifyPage from "./pages/VerifyPage";
import MapPage from "./pages/MapPage";
import ReportsPage from "./pages/ReportsPage";
import AdminDashboard from "./pages/AdminDashboard";
import Integrations from "./pages/Integrations";
import TaskDetails from "./pages/TaskDetails";
import MapView from "./pages/MapView";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
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
} from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Main Dashboard */}
            <Route path="/" element={<HomePage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inspection-dashboard" element={<Index />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Infrastructure Management */}
            <Route path="/assets" element={<AssetManager />} />
            <Route
              path="/maintenance"
              element={
                <PlaceholderPage
                  title="Maintenance Scheduler"
                  description="Schedule, track, and assign maintenance tasks. View upcoming and overdue items with contractor assignments."
                  icon={<Calendar className="w-8 h-8" />}
                  features={[
                    "Drag-and-drop calendar interface for task scheduling",
                    "Automated task generation based on asset conditions",
                    "Contractor assignment and communication tools",
                    "Priority-based task management system",
                    "Weather-dependent scheduling adjustments",
                    "Material and equipment requirement tracking",
                    "Progress tracking with photo updates",
                    "Integration with budget and cost tracking"
                  ]}
                />
              }
            />
            <Route path="/contractors" element={<Contractors />} />
            <Route
              path="/inspections"
              element={
                <PlaceholderPage
                  title="Inspection Tool"
                  description="Track submitted inspections, review overdue items, and manage the inspection workflow efficiently."
                  icon={<ClipboardCheck className="w-8 h-8" />}
                  features={[
                    "Mobile inspection forms with offline capability",
                    "Photo and video documentation integration",
                    "GPS location tagging for all inspections",
                    "Automated inspection scheduling based on asset type",
                    "Digital signature capture for approvals",
                    "Integration with maintenance task generation",
                    "Compliance tracking and regulatory reporting",
                    "Custom inspection templates and checklists"
                  ]}
                />
              }
            />
            <Route path="/map" element={<MapPage />} />
            <Route path="/map-view" element={<MapView />} />
            <Route path="/verify" element={<VerifyPage />} />

            {/* Financial Management */}
            <Route path="/budget" element={<Dashboard />} />
            <Route
              path="/estimates"
              element={
                <PlaceholderPage
                  title="Estimate Tool"
                  description="PCI-based cost projection simulator for infrastructure planning and budget forecasting."
                  icon={<Calculator className="w-8 h-8" />}
                  features={[
                    "PCI-based deterioration modeling and cost projections",
                    "Multiple treatment option comparisons",
                    "5-year and 10-year budget scenario planning",
                    "Integration with actual project cost database",
                    "Inflation adjustment and regional cost factors",
                    "Grant funding opportunity matching",
                    "ROI analysis for different treatment strategies",
                    "Export capabilities for budget presentations"
                  ]}
                />
              }
            />
            <Route path="/funding" element={<Funding />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/planning" element={<Planning />} />

            {/* Grant Management */}
            <Route path="/start-grant" element={<StartGrant />} />
            <Route path="/applications" element={<Applications />} />

            {/* Public Services */}
            <Route
              path="/citizen-reports"
              element={
                <PlaceholderPage
                  title="Fix My Road Feed"
                  description="Monitor citizen-submitted issues with map pins, photos, and priority-based workflow management."
                  icon={<MessageSquare className="w-8 h-8" />}
                  features={[
                    "Public submission portal with photo upload",
                    "GPS location capture and address verification",
                    "Automated issue categorization and priority assignment",
                    "Real-time status updates for citizens",
                    "Integration with work order and scheduling systems",
                    "Duplicate issue detection and consolidation",
                    "Analytics dashboard for issue trends and hotspots",
                    "Email and SMS notifications for status updates"
                  ]}
                />
              }
            />
            <Route path="/citizen-history" element={<CitizenHistory />} />
            <Route path="/reports" element={<ReportsPage />} />

            {/* Administrative */}
            <Route path="/task-details" element={<TaskDetails />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route
              path="/settings"
              element={
                <PlaceholderPage
                  title="Settings & Billing"
                  description="Manage account settings, user permissions, subscription billing, and platform configuration."
                  icon={<Settings className="w-8 h-8" />}
                  features={[
                    "User management and role-based permissions",
                    "Organization settings and branding customization",
                    "Subscription management and billing history",
                    "Data export and backup configuration",
                    "Integration settings for third-party systems",
                    "Notification preferences and alert configuration",
                    "Security settings and audit logs",
                    "API key management and webhook configuration"
                  ]}
                />
              }
            />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

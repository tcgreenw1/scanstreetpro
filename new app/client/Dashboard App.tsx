import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PlaceholderPage } from "./components/PlaceholderPage";
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
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Module Routes */}
          <Route
            path="/assets"
            element={
              <PlaceholderPage
                title="Asset Manager"
                description="Manage signs, lights, barriers, and other infrastructure assets with detailed tracking and maintenance schedules."
                icon={Building2}
              />
            }
          />
          <Route
            path="/maintenance"
            element={
              <PlaceholderPage
                title="Maintenance Scheduler"
                description="Schedule, track, and assign maintenance tasks. View upcoming and overdue items with contractor assignments."
                icon={Calendar}
              />
            }
          />
          <Route
            path="/contractors"
            element={
              <PlaceholderPage
                title="Contractor Portal"
                description="Monitor live jobs, track status updates, manage invoices and communicate with contractors in real-time."
                icon={Users}
              />
            }
          />
          <Route
            path="/inspections"
            element={
              <PlaceholderPage
                title="Inspection Tool"
                description="Track submitted inspections, review overdue items, and manage the inspection workflow efficiently."
                icon={ClipboardCheck}
              />
            }
          />
          <Route
            path="/funding"
            element={
              <PlaceholderPage
                title="Funding Center"
                description="Discover available grants, manage drafts, track submitted applications and funding opportunities."
                icon={DollarSign}
              />
            }
          />
          <Route
            path="/budget"
            element={
              <PlaceholderPage
                title="Budget Planner"
                description="View historical spending patterns and create 5-year budget projections with intelligent forecasting."
                icon={TrendingUp}
              />
            }
          />
          <Route
            path="/estimates"
            element={
              <PlaceholderPage
                title="Estimate Tool"
                description="PCI-based cost projection simulator for infrastructure planning and budget forecasting."
                icon={Calculator}
              />
            }
          />
          <Route
            path="/citizen-reports"
            element={
              <PlaceholderPage
                title="Fix My Road Feed"
                description="Monitor citizen-submitted issues with map pins, photos, and priority-based workflow management."
                icon={MessageSquare}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <PlaceholderPage
                title="Public Reports Generator"
                description="Generate comprehensive reports for council meetings with export options to PDF and Excel formats."
                icon={FileText}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PlaceholderPage
                title="Settings & Billing"
                description="Manage account settings, user permissions, subscription billing, and platform configuration."
                icon={Settings}
              />
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

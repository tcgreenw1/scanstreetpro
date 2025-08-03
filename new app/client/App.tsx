import "./global.css";
import "./global-enhancements.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { PricingProvider } from "./contexts/PricingContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoadInspection from "./pages/RoadInspection";
import Dashboard from "./pages/Dashboard";
import AssetManager from "./pages/AssetManager";
import NewInspection from "./pages/NewInspection";
import Pricing from "./pages/Pricing";
import StartGrant from "./pages/StartGrant";
import Applications from "./pages/Applications";
import Funding from "./pages/Funding";
import Contractors from "./pages/Contractors";
import CitizenHistory from "./pages/CitizenHistory";
import Expenses from "./pages/Expenses";
import Planning from "./pages/Planning";
import VerifyPage from "./pages/VerifyPage";
import MapPage from "./pages/MapPage";
import Reports from "./pages/Reports";
import CitizenEngagement from "./pages/CitizenEngagement";
import MaintenanceScheduler from "./pages/MaintenanceScheduler";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPortal from "./pages/AdminPortal";
import Integrations from "./pages/Integrations";
import CostEstimator from "./pages/CostEstimator";
import Inspections from "./pages/Inspections";
import Settings from "./pages/Settings";
import TaskDetails from "./pages/TaskDetails";
import MapView from "./pages/MapView";
import Login from "./pages/Login";
import DatabaseSetup from "./pages/DatabaseSetup";
import DatabaseTest from "./pages/DatabaseTest";
import TestOrgCreation from "./pages/TestOrgCreation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PricingProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/database-setup" element={<DatabaseSetup />} />
            <Route path="/database-test" element={<DatabaseTest />} />
            <Route path="/test-org-creation" element={<TestOrgCreation />} />

            {/* Protected Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* Main Dashboard */}
                    <Route path="/" element={<Dashboard />} />

                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/inspection-dashboard" element={<RoadInspection />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />

                    {/* Admin Only Routes */}
                    <Route path="/admin-portal" element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminPortal />
                      </ProtectedRoute>
                    } />

                    {/* Infrastructure Management */}
                    <Route path="/assets" element={<AssetManager />} />
                    <Route path="/maintenance" element={<MaintenanceScheduler />} />
                    <Route path="/contractors" element={<Contractors />} />
                    <Route path="/inspections" element={<Inspections />} />
                    <Route path="/inspections/new" element={<NewInspection />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/map-view" element={<MapView />} />
                    <Route path="/verify" element={<VerifyPage />} />

                    {/* Financial Management */}
                    <Route path="/budget" element={<Planning />} />
                    <Route path="/estimates" element={<CostEstimator />} />
                    <Route path="/funding" element={<Funding />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/planning" element={<Planning />} />

                    {/* Grant Management */}
                    <Route path="/start-grant" element={<StartGrant />} />
                    <Route path="/applications" element={<Applications />} />

                    {/* Public Services */}
                    <Route path="/citizen-reports" element={<CitizenEngagement />} />
                    <Route path="/citizen-history" element={<CitizenHistory />} />
                    <Route path="/reports" element={<Reports />} />

                    {/* Administrative */}
                    <Route path="/task-details" element={<TaskDetails />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Pricing */}
                    <Route path="/pricing" element={<Pricing />} />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </PricingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

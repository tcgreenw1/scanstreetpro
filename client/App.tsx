import "./global.css";
import "./global-enhancements.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
// import { seedDemoUsers } from "./utils/seedUsers"; // No longer needed with Neon
import "./utils/errorTracer"; // Import to initialize error tracing
import { Layout } from "./components/Layout";
import { PlaceholderPage } from "./components/PlaceholderPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { PricingProvider } from "./contexts/PricingContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PlanProvider } from "./hooks/usePlan";
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
import SignUp from "./pages/SignUp";
import DatabaseSetup from "./pages/DatabaseSetup";
import DatabaseTest from "./pages/DatabaseTest";
import TestOrgCreation from "./pages/TestOrgCreation";
import PremiumAnalysis from "./pages/PremiumAnalysis";
import DebugEnv from "./pages/DebugEnv";
import ConnectionTest from "./pages/ConnectionTest";
import ErrorTest from "./pages/ErrorTest";
import InitDatabase from "./pages/InitDatabase";
import CreateDemoUsers from "./pages/CreateDemoUsers";
import MigrationHelper from "./pages/MigrationHelper";
import Setup from "./pages/Setup";
import BuilderTest from "./pages/BuilderTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // App initialization - demo users are pre-configured in Neon database
    const hasInitialized = localStorage.getItem('app-initialized');
    if (!hasInitialized) {
      console.log('✅ Neon database configured with demo users');
      localStorage.setItem('app-initialized', 'true');
    }
  }, []);

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PlanProvider>
        <PricingProvider>
          <TooltipProvider>
        <AppInitializer>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/database-setup" element={<DatabaseSetup />} />
            <Route path="/database-test" element={<DatabaseTest />} />
            <Route path="/test-org-creation" element={<TestOrgCreation />} />
            <Route path="/premium-analysis" element={<PremiumAnalysis />} />
            <Route path="/debug-env" element={<DebugEnv />} />
            <Route path="/connection-test" element={<ConnectionTest />} />
            <Route path="/error-test" element={<ErrorTest />} />
            <Route path="/init-database" element={<InitDatabase />} />
            <Route path="/create-demo-users" element={<CreateDemoUsers />} />
            <Route path="/migration-helper" element={<MigrationHelper />} />
            <Route path="/setup" element={<Setup />} />

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
                    <Route path="/admin-portal" element={<AdminPortal />} />

                    {/* Infrastructure Management */}
                    <Route path="/assets" element={<AssetManager />} />
                    <Route path="/maintenance" element={<MaintenanceScheduler />} />
                    <Route path="/contractors" element={<Contractors />} />
                    <Route path="/inspections" element={<Inspections />} />
                    <Route path="/inspections/new" element={<NewInspection />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/map-view" element={<MapView />} />


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
        </AppInitializer>
          </TooltipProvider>
        </PricingProvider>
      </PlanProvider>
    </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

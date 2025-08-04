import { AdminDashboard } from "../components/builder/AdminDashboard";
import { AdminStatsCards } from "../components/builder/AdminStatsCards";
import { RoleBasedSection } from "../components/builder/RoleBasedSection";
import { PlanUpgradeModal } from "../components/builder/PlanUpgradeModal";
import { ExportButton } from "../components/builder/ExportButton";

export default function BuilderTest() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Builder.io Components Test</h1>
        <p className="text-gray-600 mt-2">Testing all Builder.io admin components</p>
      </div>

      {/* Admin Stats Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Admin Stats Cards</h2>
        <AdminStatsCards layout="grid" showTrends={true} />
      </section>

      {/* Export Button */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Export Functionality</h2>
        <div className="flex space-x-4">
          <ExportButton 
            exportType="dropdown" 
            dataEndpoint="/api/export/organizations" 
            buttonText="Export Organizations"
          />
          <ExportButton 
            exportType="csv" 
            dataEndpoint="/api/export/users" 
            buttonText="Export Users (CSV)"
          />
        </div>
      </section>

      {/* Plan Upgrade Modal */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Plan Upgrade Modal</h2>
        <PlanUpgradeModal triggerText="Test Upgrade Modal" primaryColor="#8b5cf6" />
      </section>

      {/* Role-Based Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Role-Based Content</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <RoleBasedSection requiredPlan="free" requiredRole="member">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              ✅ This content is visible to everyone (Free plan, Member role)
            </div>
          </RoleBasedSection>
          
          <RoleBasedSection requiredPlan="premium" requiredRole="admin">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              👑 This content requires Premium plan and Admin role
            </div>
          </RoleBasedSection>
        </div>
      </section>

      {/* Full Admin Dashboard */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Full Admin Dashboard</h2>
        <AdminDashboard 
          title="Test Admin Dashboard" 
          showStats={true} 
          showFinancials={true}
        >
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            This is custom content inside the AdminDashboard component
          </div>
        </AdminDashboard>
      </section>
    </div>
  );
}

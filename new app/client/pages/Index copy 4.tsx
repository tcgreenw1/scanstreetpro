import { MaintenanceBudgetEstimator } from "@/components/MaintenanceBudgetEstimator";

export default function Index() {
  try {
    return <MaintenanceBudgetEstimator />;
  } catch (error) {
    console.error("Error rendering MaintenanceBudgetEstimator:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Application</h1>
          <p className="text-slate-600">Please check the console for details.</p>
        </div>
      </div>
    );
  }
}

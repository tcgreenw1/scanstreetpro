import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  DollarSign,
  MapPin,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { ProjectionResults, SurfaceInputs } from "@/lib/pci-calculations";

interface SummaryCardsProps {
  results: ProjectionResults;
  inputs: SurfaceInputs;
  activeTab: "both" | "asphalt" | "concrete";
}

export function SummaryCards({ results, inputs, activeTab }: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!results || !results.projections) {
    return <div>Loading summary data...</div>;
  }

  const finalProjection = results.projections[results.projections.length - 1];
  
  const getAsphaltAverage = () => {
    if (!finalProjection) return "0.0";
    return ((finalProjection.asphaltWithMaintenance + finalProjection.asphaltNoMaintenance) / 2).toFixed(1);
  };

  const getConcreteAverage = () => {
    if (!finalProjection) return "0.0";
    return ((finalProjection.concreteWithMaintenance + finalProjection.concreteNoMaintenance) / 2).toFixed(1);
  };

  const getPCIStatus = (pci: number) => {
    if (pci >= 70) return { label: "Good", color: "bg-green-100 text-green-800" };
    if (pci >= 60) return { label: "Fair", color: "bg-yellow-100 text-yellow-800" };
    if (pci >= 40) return { label: "Poor", color: "bg-orange-100 text-orange-800" };
    return { label: "Very Poor", color: "bg-red-100 text-red-800" };
  };

  const getBudgetRecommendation = () => {
    const currentBudget = inputs.annualBudget;
    const suggested = results.suggestedBudget;
    
    if (currentBudget >= suggested) {
      return {
        status: "Adequate",
        color: "text-green-600",
        icon: TrendingUp,
        message: "Budget meets recommended maintenance levels"
      };
    } else {
      const shortage = suggested - currentBudget;
      return {
        status: "Insufficient",
        color: "text-red-600",
        icon: AlertCircle,
        message: `${formatCurrency(shortage)} additional funding recommended`
      };
    }
  };

  const budgetRec = getBudgetRecommendation();
  const BudgetIcon = budgetRec.icon;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Projected Average PCI - Asphalt */}
      {(activeTab === "both" || activeTab === "asphalt") && (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full opacity-50"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-amber-600" />
              Asphalt PCI (5-Year Avg)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-slate-800">{getAsphaltAverage()}</span>
              <Badge className={getPCIStatus(parseFloat(getAsphaltAverage())).color}>
                {getPCIStatus(parseFloat(getAsphaltAverage())).label}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Current: {inputs.asphaltPCI} → Final: {finalProjection?.asphaltWithMaintenance?.toFixed(1) || "N/A"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Projected Average PCI - Concrete */}
      {(activeTab === "both" || activeTab === "concrete") && (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100 rounded-bl-full opacity-50"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-slate-600" />
              Concrete PCI (5-Year Avg)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-slate-800">{getConcreteAverage()}</span>
              <Badge className={getPCIStatus(parseFloat(getConcreteAverage())).color}>
                {getPCIStatus(parseFloat(getConcreteAverage())).label}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Current: {inputs.concretePCI} → Final: {finalProjection?.concreteWithMaintenance?.toFixed(1) || "N/A"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Budget Recommendation */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-50"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Budget Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BudgetIcon className={`h-5 w-5 ${budgetRec.color}`} />
              <span className={`font-semibold ${budgetRec.color}`}>{budgetRec.status}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">
                Current: {formatCurrency(inputs.annualBudget)}
              </p>
              <p className="text-sm text-slate-600">
                Suggested: {formatCurrency(results.suggestedBudget)}
              </p>
            </div>
            <p className="text-xs text-slate-500">{budgetRec.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Surface Mileage Recap */}
      <Card className="relative overflow-hidden md:col-span-2 lg:col-span-3">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-30"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            Surface Mileage Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(activeTab === "both" || activeTab === "asphalt") && (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{inputs.asphaltMiles}</p>
                  <p className="text-sm text-slate-600">Asphalt Miles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{inputs.asphaltPCI}</p>
                  <p className="text-sm text-slate-600">Current Asphalt PCI</p>
                </div>
              </>
            )}
            {(activeTab === "both" || activeTab === "concrete") && (
              <>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-600">{inputs.concreteMiles}</p>
                  <p className="text-sm text-slate-600">Concrete Miles</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-600">{inputs.concretePCI}</p>
                  <p className="text-sm text-slate-600">Current Concrete PCI</p>
                </div>
              </>
            )}
            {activeTab === "both" && (
              <>
                <div className="text-center md:col-span-2">
                  <p className="text-2xl font-bold text-blue-600">{inputs.asphaltMiles + inputs.concreteMiles}</p>
                  <p className="text-sm text-slate-600">Total Road Miles</p>
                </div>
                <div className="text-center md:col-span-2">
                  <p className="text-2xl font-bold text-blue-600">
                    {((inputs.asphaltPCI * inputs.asphaltMiles + inputs.concretePCI * inputs.concreteMiles) / 
                      (inputs.asphaltMiles + inputs.concreteMiles)).toFixed(1)}
                  </p>
                  <p className="text-sm text-slate-600">Weighted Average PCI</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

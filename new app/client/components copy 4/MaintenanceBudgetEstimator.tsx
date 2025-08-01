import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, TrendingDown, TrendingUp } from "lucide-react";
import { calculateProjections, SurfaceInputs, ProjectionResults } from "@/lib/pci-calculations";
import { PCIProjectionChart } from "./PCIProjectionChart";
import { SummaryCards } from "./SummaryCards";

export function MaintenanceBudgetEstimator() {
  const [inputs, setInputs] = useState<SurfaceInputs>({
    asphaltMiles: 100,
    concreteMiles: 50,
    asphaltPCI: 75,
    concretePCI: 80,
    annualBudget: 5000000
  });

  const [results, setResults] = useState<ProjectionResults | null>(null);
  const [activeTab, setActiveTab] = useState<"both" | "asphalt" | "concrete">("both");

  const handleInputChange = (field: keyof SurfaceInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newInputs = { ...inputs, [field]: numValue };
    setInputs(newInputs);
    
    // Real-time calculation
    if (newInputs.asphaltMiles > 0 || newInputs.concreteMiles > 0) {
      setResults(calculateProjections(newInputs));
    }
  };

  // Initialize with default calculation
  useEffect(() => {
    setResults(calculateProjections(inputs));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isBudgetTooLow = results?.projections.some(p => 
    p.asphaltWithMaintenance < 60 || p.concreteWithMaintenance < 60
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Municipal Maintenance Budget Estimator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Forecast Pavement Condition Index (PCI) over 5 years based on road surface type and annual maintenance budget
          </p>
          <Badge variant="outline" className="mt-2">
            Forecast assumes typical deterioration rates per FHWA models
          </Badge>
        </div>

        {/* Surface Type Toggle */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <div className="flex justify-center">
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="both">Both Surfaces</TabsTrigger>
                <TabsTrigger value="asphalt">Asphalt Only</TabsTrigger>
                <TabsTrigger value="concrete">Concrete Only</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Road Infrastructure Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(activeTab === "both" || activeTab === "asphalt") && (
                  <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h3 className="font-semibold text-amber-800">Asphalt Roads</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="asphaltMiles">Total Miles</Label>
                        <Input
                          id="asphaltMiles"
                          type="number"
                          min="0"
                          step="0.1"
                          value={inputs.asphaltMiles}
                          onChange={(e) => handleInputChange("asphaltMiles", e.target.value)}
                          className="mt-1"
                          placeholder="e.g., 100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="asphaltPCI">Current PCI</Label>
                        <Input
                          id="asphaltPCI"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={inputs.asphaltPCI}
                          onChange={(e) => handleInputChange("asphaltPCI", e.target.value)}
                          className="mt-1"
                          placeholder="0-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(activeTab === "both" || activeTab === "concrete") && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-800">Concrete Roads</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="concreteMiles">Total Miles</Label>
                        <Input
                          id="concreteMiles"
                          type="number"
                          min="0"
                          step="0.1"
                          value={inputs.concreteMiles}
                          onChange={(e) => handleInputChange("concreteMiles", e.target.value)}
                          className="mt-1"
                          placeholder="e.g., 50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="concretePCI">Current PCI</Label>
                        <Input
                          id="concretePCI"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={inputs.concretePCI}
                          onChange={(e) => handleInputChange("concretePCI", e.target.value)}
                          className="mt-1"
                          placeholder="0-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Label htmlFor="annualBudget" className="font-semibold text-green-800">
                    Proposed Annual Repair Budget
                  </Label>
                  <Input
                    id="annualBudget"
                    type="number"
                    step="10000"
                    value={inputs.annualBudget}
                    onChange={(e) => handleInputChange("annualBudget", e.target.value)}
                    className="mt-1"
                    placeholder="Enter annual budget in USD"
                  />
                  <p className="text-sm text-green-700">
                    {formatCurrency(inputs.annualBudget)} per year
                  </p>
                  {results && inputs.annualBudget < results.suggestedBudget && (
                    <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                      💡 Consider increasing budget to {formatCurrency(results.suggestedBudget)} for optimal PCI maintenance
                    </p>
                  )}
                </div>

                {isBudgetTooLow && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Budget Warning</p>
                      <p className="text-sm text-red-700">
                        Current budget may be insufficient to prevent PCI falling below 60.
                      </p>
                    </div>
                  </div>
                )}

                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {results && (
              <>
                {/* Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-slate-600" />
                      5-Year PCI Projections
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                      Comparison of PCI trends with and without maintenance investment
                    </p>
                  </CardHeader>
                  <CardContent>
                    <PCIProjectionChart
                      data={results.projections}
                      activeTab={activeTab}
                    />
                  </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Asphalt PCI Average</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {results ? ((results.projections[5]?.asphaltWithMaintenance || 0) + (results.projections[5]?.asphaltNoMaintenance || 0)) / 2 : 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Concrete PCI Average</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {results ? ((results.projections[5]?.concreteWithMaintenance || 0) + (results.projections[5]?.concreteNoMaintenance || 0)) / 2 : 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Suggested Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{formatCurrency(results?.suggestedBudget || 0)}</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

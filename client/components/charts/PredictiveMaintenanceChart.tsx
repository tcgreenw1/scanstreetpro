import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Wrench
} from 'lucide-react';

interface MaintenancePrediction {
  assetId: string;
  assetName: string;
  currentPCI: number;
  predictedPCI: number;
  maintenanceNeeded: string;
  costEstimate: number;
  timeframe: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  maintenanceType: string;
}

const samplePredictions: MaintenancePrediction[] = [
  {
    assetId: 'RD-001',
    assetName: 'Main Street (1st-2nd Ave)',
    currentPCI: 65,
    predictedPCI: 45,
    maintenanceNeeded: 'Crack Sealing',
    costEstimate: 8500,
    timeframe: '6 months',
    priority: 'medium',
    maintenanceType: 'Preventive'
  },
  {
    assetId: 'RD-002',
    assetName: 'Oak Avenue (Mile 1-2)',
    currentPCI: 45,
    predictedPCI: 25,
    maintenanceNeeded: 'Surface Treatment',
    costEstimate: 25000,
    timeframe: '3 months',
    priority: 'high',
    maintenanceType: 'Corrective'
  },
  {
    assetId: 'RD-003',
    assetName: 'Pine Street',
    currentPCI: 78,
    predictedPCI: 68,
    maintenanceNeeded: 'Routine Maintenance',
    costEstimate: 3500,
    timeframe: '12 months',
    priority: 'low',
    maintenanceType: 'Preventive'
  },
  {
    assetId: 'BR-001',
    assetName: 'River Crossing Bridge',
    currentPCI: 55,
    predictedPCI: 35,
    maintenanceNeeded: 'Structural Repair',
    costEstimate: 75000,
    timeframe: '2 months',
    priority: 'urgent',
    maintenanceType: 'Major Repair'
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPCIColor = (pci: number) => {
  if (pci >= 80) return 'text-green-600';
  if (pci >= 60) return 'text-yellow-600';
  if (pci >= 40) return 'text-orange-600';
  return 'text-red-600';
};

export function PredictiveMaintenanceChart() {
  const totalCost = samplePredictions.reduce((sum, pred) => sum + pred.costEstimate, 0);
  const urgentItems = samplePredictions.filter(p => p.priority === 'urgent' || p.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Predicted Cost</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  ${totalCost.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Assets Needing Attention</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {urgentItems}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI Predictions</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {samplePredictions.length}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Details */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-white">AI-Powered Maintenance Predictions</CardTitle>
          <CardDescription>
            Machine learning analysis of asset conditions with predicted maintenance needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {samplePredictions.map((prediction) => {
              const degradation = prediction.currentPCI - prediction.predictedPCI;
              
              return (
                <div key={prediction.assetId} className="p-4 border border-white/20 rounded-lg bg-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-white">
                        {prediction.assetName}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Asset ID: {prediction.assetId}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getPriorityColor(prediction.priority)}>
                        {prediction.priority.charAt(0).toUpperCase() + prediction.priority.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {prediction.maintenanceType}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Current vs Predicted PCI */}
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">PCI Condition</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Current:</span>
                          <span className={`font-bold ${getPCIColor(prediction.currentPCI)}`}>
                            {prediction.currentPCI}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Predicted:</span>
                          <span className={`font-bold ${getPCIColor(prediction.predictedPCI)}`}>
                            {prediction.predictedPCI}
                          </span>
                        </div>
                        <Progress value={prediction.predictedPCI} className="h-2" />
                      </div>
                    </div>

                    {/* Degradation Rate */}
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Degradation</p>
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-600">
                          -{degradation} points
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        in {prediction.timeframe}
                      </p>
                    </div>

                    {/* Maintenance Needed */}
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Required Action</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {prediction.maintenanceNeeded}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Within {prediction.timeframe}
                        </span>
                      </div>
                    </div>

                    {/* Cost Estimate */}
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Estimated Cost</p>
                      <p className="text-lg font-bold text-green-600">
                        ${prediction.costEstimate.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Labor + Materials
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics Graph */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-white">PCI Degradation Forecast</CardTitle>
          <CardDescription>
            6-month condition forecast for monitored assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Interactive PCI Chart
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Real-time visualization showing predicted PCI degradation curves, maintenance impact analysis, and cost optimization scenarios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

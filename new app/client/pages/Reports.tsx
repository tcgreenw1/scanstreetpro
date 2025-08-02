import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";
import {
  FileText,
  Download,
  Crown,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Calendar,
  FileSpreadsheet,
  FileX,
  Printer,
  Info,
  Users,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

// Sample data for charts
const pciDistribution = [
  { condition: 'Good', count: 4, percentage: 33.3, color: '#10B981', range: '80-100' },
  { condition: 'Fair', count: 5, percentage: 41.7, color: '#F59E0B', range: '60-79' },
  { condition: 'Poor', count: 2, percentage: 16.7, color: '#F97316', range: '40-59' },
  { condition: 'Failed', count: 1, percentage: 8.3, color: '#EF4444', range: '0-39' }
];

const pciTrends = [
  { year: '2019', avgPCI: 78, lanemiles: 145.2 },
  { year: '2020', avgPCI: 75, lanemiles: 148.7 },
  { year: '2021', avgPCI: 73, lanemiles: 151.2 },
  { year: '2022', avgPCI: 71, lanemiles: 155.8 },
  { year: '2023', avgPCI: 72, lanemiles: 159.4 }
];

const laneMilesByTier = [
  { tier: 'Good (80-100)', miles: 52.7, percentage: 33.1 },
  { tier: 'Fair (60-79)', miles: 66.4, percentage: 41.7 },
  { tier: 'Poor (40-59)', miles: 26.6, percentage: 16.7 },
  { tier: 'Failed (0-39)', miles: 13.7, percentage: 8.6 }
];

export default function Reports() {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [reportType, setReportType] = useState('summary');
  const { currentPlan } = usePricing();

  const handleExport = (format: string) => {
    // In a real app, this would trigger the actual export
    console.log(`Exporting report as ${format}`);
    alert(`${format} export functionality would be implemented here. Upgrade to access full export features.`);
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card border-white/20 p-3 shadow-xl">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'avgPCI' ? '' : ' miles'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Infrastructure Reports</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Comprehensive PCI analysis and lane mile summaries for council meetings and public reporting
          </p>
          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            {currentPlan === 'free' ? 'Free Plan - Sample Data' : 'Premium Data'}
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px] glass-card border-white/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[150px] glass-card border-white/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="summary">Summary Report</SelectItem>
              <SelectItem value="detailed">Detailed Analysis</SelectItem>
              <SelectItem value="council">Council Presentation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Export Buttons */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800 dark:text-white">
            <Download className="w-5 h-5 mr-2" />
            Export Reports
          </CardTitle>
          <CardDescription>
            Download reports in various formats for sharing with stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleExport('PDF')}
              className={cn(
                "flex flex-col items-center py-6 h-auto space-y-2",
                currentPlan === 'free' && "opacity-60"
              )}
              disabled={currentPlan === 'free'}
            >
              <FileText className="w-8 h-8 text-red-500" />
              <span className="font-medium">PDF Report</span>
              <span className="text-xs text-slate-500">Council Ready</span>
              {currentPlan === 'free' && <Crown className="w-4 h-4 text-amber-500" />}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleExport('CSV')}
              className={cn(
                "flex flex-col items-center py-6 h-auto space-y-2",
                currentPlan === 'free' && "opacity-60"
              )}
              disabled={currentPlan === 'free'}
            >
              <FileSpreadsheet className="w-8 h-8 text-green-500" />
              <span className="font-medium">CSV Data</span>
              <span className="text-xs text-slate-500">Raw Numbers</span>
              {currentPlan === 'free' && <Crown className="w-4 h-4 text-amber-500" />}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleExport('Excel')}
              className={cn(
                "flex flex-col items-center py-6 h-auto space-y-2",
                currentPlan === 'free' && "opacity-60"
              )}
              disabled={currentPlan === 'free'}
            >
              <FileX className="w-8 h-8 text-blue-500" />
              <span className="font-medium">Excel File</span>
              <span className="text-xs text-slate-500">With Charts</span>
              {currentPlan === 'free' && <Crown className="w-4 h-4 text-amber-500" />}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleExport('Print')}
              className="flex flex-col items-center py-6 h-auto space-y-2"
            >
              <Printer className="w-8 h-8 text-slate-500" />
              <span className="font-medium">Print View</span>
              <span className="text-xs text-slate-500">Browser Print</span>
            </Button>
          </div>
          
          {currentPlan === 'free' && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start space-x-3">
                <Crown className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Premium Export Features</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Upgrade to access PDF, CSV, and Excel exports with custom branding and detailed analytics.
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={handleUpgrade}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PCI Distribution Pie Chart */}
        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800 dark:text-white">
              <PieChartIcon className="w-5 h-5 mr-2" />
              PCI Condition Distribution
            </CardTitle>
            <CardDescription>
              Current pavement condition breakdown across all road segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pciDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ condition, percentage }) => `${condition}: ${percentage}%`}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="count"
                    animationDuration={1000}
                  >
                    {pciDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pciDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-800 dark:text-white">{item.condition}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.range} PCI</p>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 5-Year PCI Trends */}
        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800 dark:text-white">
              <TrendingUp className="w-5 h-5 mr-2" />
              5-Year PCI Trends
            </CardTitle>
            <CardDescription>
              Average pavement condition index over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pciTrends}>
                  <defs>
                    <linearGradient id="pciGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    domain={[60, 85]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="avgPCI"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    fill="url(#pciGradient)"
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Current Average PCI</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Network-wide condition</p>
                </div>
                <span className="text-2xl font-bold text-blue-800 dark:text-blue-300">72</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lane Miles by PCI Tier */}
      <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800 dark:text-white">
            <BarChart3 className="w-5 h-5 mr-2" />
            Total Lane Miles by PCI Tier
          </CardTitle>
          <CardDescription>
            Infrastructure inventory breakdown by condition rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laneMilesByTier} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                <XAxis type="number" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="tier"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="miles" 
                  fill="#3B82F6"
                  radius={[0, 4, 4, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {laneMilesByTier.map((tier, index) => (
              <div key={index} className="text-center p-4 bg-white/30 dark:bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{tier.miles}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Lane Miles</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{tier.percentage}% of network</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Explanatory Text for Councils and Citizens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800 dark:text-white">
              <Building className="w-5 h-5 mr-2" />
              For City Council
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Understanding PCI Scores</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The Pavement Condition Index (PCI) is a standard rating system from 0-100 that measures 
                road surface condition. Higher scores indicate better pavement condition requiring less 
                immediate maintenance investment.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Strategic Planning</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Roads with PCI scores of 70+ are cost-effective candidates for preventive maintenance. 
                Scores below 40 typically require full reconstruction, which costs 5-7x more than 
                preventive treatments.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Budget Impact</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our current network average of 72 PCI indicates the majority of roads are in fair to 
                good condition. Maintaining this level through strategic timing can extend pavement 
                life and optimize budget allocation.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800 dark:text-white">
              <Users className="w-5 h-5 mr-2" />
              For Citizens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">What These Numbers Mean</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                These reports show the condition of roads in your community using a scientific rating 
                system. Green areas indicate roads in excellent condition, while red areas show roads 
                that need immediate attention.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">How We Prioritize Work</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The city uses this data to prioritize which roads get fixed first, focusing on safety, 
                traffic volume, and cost-effectiveness. This helps ensure your tax dollars are used 
                efficiently to maintain the road network.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Reporting Issues</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                If you notice potholes, cracks, or other road problems, please report them through 
                our citizen portal. Your reports help us identify issues that may not show up in 
                scheduled inspections.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Free Version Watermark */}
      {currentPlan === 'free' && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Sample Data Report
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                This report contains sample data for demonstration purposes. Upgrade to Scan Street Pro 
                to access real PCI data, advanced analytics, custom branding, and unlimited exports.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Professional Reports</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Council-ready PDF exports</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Real PCI Data</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Actual road condition analysis</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Custom Branding</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Your city logo and colors</p>
                </div>
              </div>
              
              <Button 
                onClick={handleUpgrade}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Professional Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

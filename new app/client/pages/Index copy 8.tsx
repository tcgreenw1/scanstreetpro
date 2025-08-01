import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Settings, MapPin, TrendingUp, BarChart3, PieChart, FileText } from 'lucide-react';

// Sample data
const reportData = {
  cityName: "Springfield",
  reportDate: "December 2024",
  contactInfo: "Public Works Department | (555) 123-4567 | publicworks@springfield.gov",
  currentYear: {
    avgPCI: 78,
    totalMiles: 342.5,
    excellent: 12,
    good: 45,
    fair: 28,
    poor: 12,
    failed: 3
  },
  previousYear: {
    avgPCI: 75
  },
  treatments: [
    { type: "Crack Sealing", miles: 45.2, costRange: "$800 - $1,200/mile" },
    { type: "Overlay", miles: 23.1, costRange: "$45,000 - $65,000/mile" },
    { type: "Mill & Fill", miles: 18.7, costRange: "$75,000 - $95,000/mile" },
    { type: "Reconstruction", miles: 8.3, costRange: "$150,000 - $250,000/mile" }
  ]
};

const conditionColors = {
  excellent: 'bg-excellent text-white',
  good: 'bg-good text-white',
  fair: 'bg-fair text-black',
  poor: 'bg-poor text-white',
  failed: 'bg-failed text-white'
};

function PCIChart() {
  const data = reportData.currentYear;
  const total = data.excellent + data.good + data.fair + data.poor + data.failed;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'Excellent', value: data.excellent, color: 'excellent' },
          { label: 'Good', value: data.good, color: 'good' },
          { label: 'Fair', value: data.fair, color: 'fair' },
          { label: 'Poor', value: data.poor, color: 'poor' },
          { label: 'Failed', value: data.failed, color: 'failed' }
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div 
              className={`w-full h-24 rounded-lg ${conditionColors[item.color]} flex items-center justify-center text-lg font-bold transition-all duration-300 hover:scale-105`}
              style={{ height: `${Math.max(40, (item.value / total) * 200)}px` }}
            >
              {item.value}%
            </div>
            <p className="text-sm font-medium mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChart() {
  const data = reportData.currentYear;
  const segments = [
    { label: 'Excellent', value: data.excellent, color: 'stroke-excellent' },
    { label: 'Good', value: data.good, color: 'stroke-good' },
    { label: 'Fair', value: data.fair, color: 'stroke-fair' },
    { label: 'Poor', value: data.poor, color: 'stroke-poor' },
    { label: 'Failed', value: data.failed, color: 'stroke-failed' }
  ];
  
  let cumulativePercentage = 0;
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
          {segments.map((segment, index) => {
            const percentage = segment.value;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="15.91549430918954"
                fill="transparent"
                strokeWidth="8"
                className={segment.color}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{
                  strokeLinecap: 'round',
                  animation: `draw 1s ease-out ${index * 0.2}s both`
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{reportData.currentYear.avgPCI}</div>
            <div className="text-xs text-muted-foreground">Avg PCI</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [theme, setTheme] = useState('modern');
  const [darkMode, setDarkMode] = useState(false);
  const [showBranding, setShowBranding] = useState(true);
  const [customizationOpen, setCustomizationOpen] = useState(false);

  const themes = {
    modern: 'bg-gradient-to-br from-blue-50 via-white to-green-50',
    traditional: 'bg-gradient-to-b from-gray-50 to-white',
    civic: 'bg-gradient-to-br from-blue-100 via-white to-blue-50'
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen ${themes[theme]} transition-all duration-500`}>
        {/* Header Controls */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-primary">PCI Report Generator</h1>
                <Badge variant="secondary" className="hidden sm:inline-flex">Public Preview</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomizationOpen(!customizationOpen)}
                  className="hidden sm:flex"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
                
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
            
            {/* Customization Panel */}
            {customizationOpen && (
              <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Theme Style</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="civic">Civic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="city-branding"
                      checked={showBranding}
                      onCheckedChange={setShowBranding}
                    />
                    <Label htmlFor="city-branding">City Branding</Label>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    More options available in full version
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Report Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Cover Panel */}
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-accent p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  {showBranding && (
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      Annual Pavement Condition Report
                    </h1>
                    <h2 className="text-xl font-semibold mb-4">
                      {reportData.cityName}
                    </h2>
                    <p className="text-white/90">
                      {reportData.reportDate} • {reportData.contactInfo}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{reportData.currentYear.avgPCI}</div>
                  <div className="text-white/80">Overall PCI Score</div>
                  <div className="flex items-center mt-2 text-green-200">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{reportData.currentYear.avgPCI - reportData.previousYear.avgPCI} from last year
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Executive Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">{reportData.currentYear.totalMiles}</div>
                    <div className="text-sm text-muted-foreground">Total Miles Assessed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{reportData.currentYear.avgPCI}</div>
                    <div className="text-sm text-muted-foreground">Average PCI Score</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Condition Breakdown</h4>
                  {[
                    { label: 'Excellent (90-100)', value: reportData.currentYear.excellent, color: 'excellent' },
                    { label: 'Good (70-89)', value: reportData.currentYear.good, color: 'good' },
                    { label: 'Fair (50-69)', value: reportData.currentYear.fair, color: 'fair' },
                    { label: 'Poor (25-49)', value: reportData.currentYear.poor, color: 'poor' },
                    { label: 'Failed (0-24)', value: reportData.currentYear.failed, color: 'failed' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 bg-${item.color}`}></div>
                        {item.label}
                      </span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-semibold text-green-600">+3 Point Improvement</div>
                    <div className="text-sm text-muted-foreground">From Previous Year</div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium mb-2">AI-Enhanced Assessment</p>
                    <p className="text-muted-foreground">
                      Data collected using AI-powered image analysis and verified by licensed engineers 
                      following ASTM D6433 standards.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condition Breakdown Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Miles by Condition Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PCIChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Network Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart />
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'Excellent', value: reportData.currentYear.excellent, color: 'bg-excellent' },
                    { label: 'Good', value: reportData.currentYear.good, color: 'bg-good' },
                    { label: 'Fair', value: reportData.currentYear.fair, color: 'bg-fair' },
                    { label: 'Poor', value: reportData.currentYear.poor, color: 'bg-poor' },
                    { label: 'Failed', value: reportData.currentYear.failed, color: 'bg-failed' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
                        {item.label}
                      </span>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* City Map */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Pavement Condition Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-green-100 via-yellow-50 to-red-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <path d="M50 50 L350 50 L350 150 L50 150 Z" fill="#22c55e" opacity="0.6"/>
                    <path d="M80 80 L320 80 L320 120 L80 120 Z" fill="#3b82f6" opacity="0.6"/>
                    <path d="M120 100 L280 100 L280 140 L120 140 Z" fill="#f59e0b" opacity="0.6"/>
                    <path d="M150 120 L250 120 L250 160 L150 160 Z" fill="#ef4444" opacity="0.6"/>
                  </svg>
                </div>
                <div className="text-center z-10">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Interactive PCI Map</h3>
                  <p className="text-muted-foreground">
                    Detailed condition maps available upon request<br />
                    Color-coded by PCI rating for visual assessment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Plan */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5-Year Maintenance Plan Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Treatment Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Recommended Miles</th>
                      <th className="text-left py-3 px-4 font-semibold">Cost Range (per mile)</th>
                      <th className="text-left py-3 px-4 font-semibold">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.treatments.map((treatment, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{treatment.type}</td>
                        <td className="py-3 px-4">{treatment.miles}</td>
                        <td className="py-3 px-4">{treatment.costRange}</td>
                        <td className="py-3 px-4">
                          <Badge variant={index < 2 ? "default" : "secondary"}>
                            {index < 2 ? "High" : "Medium"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Budget Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  Total estimated cost for 5-year maintenance plan: <span className="font-bold text-primary">$12.3M - $18.7M</span>
                  <br />
                  Annual budget allocation recommended: <span className="font-bold">$2.5M - $3.7M</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes & Footnotes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes & Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Collection Methodology</h4>
                <p className="text-sm text-muted-foreground">
                  This report utilizes AI-powered image analysis technology to assess pavement conditions, 
                  with all data verified by licensed professional engineers. Assessments follow ASTM D6433 
                  standard procedures for visual inspection of pavement condition.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">PCI Rating System</h4>
                <p className="text-sm text-muted-foreground">
                  Pavement Condition Index (PCI) ranges from 0-100, where 100 represents excellent condition. 
                  Ratings: Excellent (90-100), Good (70-89), Fair (50-69), Poor (25-49), Failed (0-24).
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Report Limitations</h4>
                <p className="text-sm text-muted-foreground">
                  This assessment provides surface condition evaluation only. Structural integrity analysis 
                  and subsurface condition assessment require additional testing. Cost estimates are preliminary 
                  and subject to market conditions, material availability, and detailed engineering review.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Want this updated quarterly with live data? 
              <Button variant="link" className="p-0 h-auto font-semibold text-primary ml-2">
                Subscribe to our dashboard →
              </Button>
            </p>
            <p>Generated by PCI Analytics Platform • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CheckCircle,
  Settings,
  Key,
  RefreshCw,
  Zap,
  Crown,
  ExternalLink,
  Upload,
  Download,
  Clock,
  Shield,
  Database,
  FileSpreadsheet,
  Building2,
  Code,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  recordsCount: number;
  syncProgress?: number;
  isPremium?: boolean;
}

const integrations: Integration[] = [
  {
    id: 'excel',
    name: 'Microsoft Excel',
    description: 'Import/export spreadsheets and financial data',
    icon: <FileSpreadsheet className="w-8 h-8 text-green-600" />,
    status: 'connected',
    lastSync: '2 hours ago',
    recordsCount: 1247,
    syncProgress: 100
  },
  {
    id: 'tyler',
    name: 'Tyler Technologies',
    description: 'Municipal ERP and financial management system',
    icon: <Building2 className="w-8 h-8 text-blue-600" />,
    status: 'syncing',
    lastSync: '5 minutes ago',
    recordsCount: 8932,
    syncProgress: 67,
    isPremium: true
  },
  {
    id: 'incode',
    name: 'Incode Municipal',
    description: 'Accounting and budget management software',
    icon: <Database className="w-8 h-8 text-purple-600" />,
    status: 'disconnected',
    lastSync: 'Never',
    recordsCount: 0,
    isPremium: true
  },
  {
    id: 'caselle',
    name: 'Caselle Municipal',
    description: 'Comprehensive municipal management suite',
    icon: <Layers className="w-8 h-8 text-orange-600" />,
    status: 'error',
    lastSync: '1 day ago',
    recordsCount: 3456,
    isPremium: true
  }
];

const fieldMappings = [
  { source: 'Account_Number', target: 'account_id', type: 'Required', status: 'mapped' },
  { source: 'Description', target: 'description', type: 'Required', status: 'mapped' },
  { source: 'Amount', target: 'budget_amount', type: 'Required', status: 'mapped' },
  { source: 'Department', target: 'department_code', type: 'Optional', status: 'unmapped' },
  { source: 'Category', target: 'expense_category', type: 'Required', status: 'mapped' },
  { source: 'Fiscal_Year', target: 'fiscal_year', type: 'Required', status: 'conflict' }
];

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<string>('excel');
  const [apiTokens, setApiTokens] = useState<{[key: string]: string}>({
    excel: 'sk_live_4321••••••••••••••••',
    tyler: '',
    incode: '',
    caselle: 'sk_test_9876••••••••••••••••'
  });
  const [autoSync, setAutoSync] = useState<{[key: string]: boolean}>({
    excel: true,
    tyler: false,
    incode: false,
    caselle: true
  });
  const { currentPlan } = usePricing();

  const generateApiToken = (integrationId: string) => {
    if (currentPlan === 'free') {
      alert('API token generation is a premium feature. Upgrade to access full API capabilities.');
      return;
    }
    const newToken = `sk_live_${Math.random().toString(36).substring(2, 24)}••••••••••••••••`;
    setApiTokens(prev => ({ ...prev, [integrationId]: newToken }));
    alert('New API token generated successfully!');
  };

  const toggleSync = (integrationId: string) => {
    if (currentPlan === 'free') {
      alert('Automatic sync is a premium feature. Upgrade to enable real-time synchronization.');
      return;
    }
    setAutoSync(prev => ({ ...prev, [integrationId]: !prev[integrationId] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Syncing</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="text-slate-600"><Clock className="w-3 h-3 mr-1" />Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const selectedIntegrationData = integrations.find(i => i.id === selectedIntegration);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          System Integrations
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Connect with existing municipal systems or replace legacy software with seamless data migration.
        </p>
        <Badge variant="outline" className="mt-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
          {currentPlan === 'free' ? 'Basic Access' : 'Full API Access'} • {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Integration Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <Card 
                key={integration.id} 
                className={cn(
                  "glass-card border-white/20 cursor-pointer transition-all duration-300",
                  selectedIntegration === integration.id ? "ring-2 ring-blue-500" : "",
                  integration.isPremium && currentPlan === 'free' ? "opacity-60" : ""
                )}
                onClick={() => setSelectedIntegration(integration.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {integration.icon}
                      <div>
                        <CardTitle className="text-lg text-slate-800 dark:text-white">{integration.name}</CardTitle>
                        {integration.isPremium && (
                          <Crown className="w-4 h-4 text-amber-500 inline ml-2" />
                        )}
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Last Sync:</span>
                      <span className="text-slate-800 dark:text-white">{integration.lastSync}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Records:</span>
                      <span className="text-slate-800 dark:text-white">{integration.recordsCount.toLocaleString()}</span>
                    </div>
                    {integration.syncProgress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Sync Progress:</span>
                          <span className="text-slate-800 dark:text-white">{integration.syncProgress}%</span>
                        </div>
                        <Progress value={integration.syncProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Integration Details */}
          {selectedIntegrationData && (
            <Card className="glass-card border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-slate-800 dark:text-white">
                    {selectedIntegrationData.icon}
                    <span className="ml-3">{selectedIntegrationData.name} Configuration</span>
                  </CardTitle>
                  {selectedIntegrationData.isPremium && currentPlan === 'free' && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300">
                      <Crown className="w-3 h-3 mr-1" />Premium
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="connection" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 glass-card border-white/20">
                    <TabsTrigger value="connection">Connection</TabsTrigger>
                    <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
                    <TabsTrigger value="sync">Sync Settings</TabsTrigger>
                    <TabsTrigger value="docs">Documentation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="connection" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="api-token" className="text-slate-700 dark:text-slate-300">API Token</Label>
                        <div className="flex space-x-2 mt-1">
                          <Input
                            id="api-token"
                            type="password"
                            value={apiTokens[selectedIntegration] || ''}
                            readOnly
                            className="glass-card border-white/30"
                            placeholder="No token generated"
                          />
                          <Button 
                            onClick={() => generateApiToken(selectedIntegration)}
                            disabled={selectedIntegrationData.isPremium && currentPlan === 'free'}
                          >
                            <Key className="w-4 h-4 mr-2" />
                            Generate
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="endpoint" className="text-slate-700 dark:text-slate-300">Webhook Endpoint</Label>
                        <Input
                          id="endpoint"
                          value={`https://api.scanstreetpro.com/webhooks/${selectedIntegration}`}
                          readOnly
                          className="glass-card border-white/30 mt-1"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-800 dark:text-white">Replace Legacy System</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Migrate all data and retire the existing system
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Demo Migration
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Legacy System Migration Demo</DialogTitle>
                              <DialogDescription>
                                Preview how your data would be migrated from {selectedIntegrationData.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg">
                                  <h4 className="font-medium mb-2">Current System</h4>
                                  <ul className="text-sm space-y-1 text-slate-600">
                                    <li>• 15,000 budget line items</li>
                                    <li>• 5 years of historical data</li>
                                    <li>• 12 department categories</li>
                                    <li>• Custom field definitions</li>
                                  </ul>
                                </div>
                                <div className="p-4 border rounded-lg bg-green-50">
                                  <h4 className="font-medium mb-2">After Migration</h4>
                                  <ul className="text-sm space-y-1 text-green-700">
                                    <li>• All data preserved and enhanced</li>
                                    <li>• Improved categorization</li>
                                    <li>• Advanced analytics enabled</li>
                                    <li>• Cloud-based accessibility</li>
                                  </ul>
                                </div>
                              </div>
                              <Progress value={85} className="h-3" />
                              <p className="text-center text-sm text-slate-600">Migration typically completes in 2-4 hours</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mapping" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-slate-800 dark:text-white">Field Mapping Preview</h4>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Sample
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 grid grid-cols-4 gap-4 text-sm font-medium">
                          <span>Source Field</span>
                          <span>Target Field</span>
                          <span>Type</span>
                          <span>Status</span>
                        </div>
                        {fieldMappings.map((mapping, index) => (
                          <div key={index} className="px-4 py-3 grid grid-cols-4 gap-4 text-sm border-t">
                            <span className="font-mono text-slate-600 dark:text-slate-400">{mapping.source}</span>
                            <span className="font-mono text-slate-800 dark:text-white">{mapping.target}</span>
                            <Badge variant={mapping.type === 'Required' ? 'default' : 'outline'} className="w-fit">
                              {mapping.type}
                            </Badge>
                            <div className="flex items-center">
                              {mapping.status === 'mapped' && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {mapping.status === 'unmapped' && <Clock className="w-4 h-4 text-slate-400" />}
                              {mapping.status === 'conflict' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                              <span className="ml-2 text-xs">{mapping.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sync" className="space-y-4">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-800 dark:text-white">Automatic Sync</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Sync data every 15 minutes automatically
                          </p>
                        </div>
                        <Switch
                          checked={autoSync[selectedIntegration] || false}
                          onCheckedChange={() => toggleSync(selectedIntegration)}
                          disabled={selectedIntegrationData.isPremium && currentPlan === 'free'}
                        />
                      </div>

                      <div>
                        <Label className="text-slate-700 dark:text-slate-300">Sync Frequency</Label>
                        <Select defaultValue="15min" disabled={currentPlan === 'free'}>
                          <SelectTrigger className="glass-card border-white/30 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-white/20">
                            <SelectItem value="5min">Every 5 minutes</SelectItem>
                            <SelectItem value="15min">Every 15 minutes</SelectItem>
                            <SelectItem value="1hour">Every hour</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800 dark:text-white">Sync History</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {[
                            { time: '2 hours ago', status: 'success', records: 1247 },
                            { time: '17 hours ago', status: 'success', records: 1203 },
                            { time: '1 day ago', status: 'warning', records: 892 },
                            { time: '2 days ago', status: 'success', records: 1456 }
                          ].map((sync, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded">
                              <div className="flex items-center space-x-3">
                                {sync.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {sync.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                <span className="text-sm text-slate-800 dark:text-white">{sync.time}</span>
                              </div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {sync.records} records
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="docs" className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2 flex items-center">
                              <Code className="w-4 h-4 mr-2" />
                              API Documentation
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              Complete API reference and integration guides
                            </p>
                            <Button size="sm" variant="outline" className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Docs
                            </Button>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2 flex items-center">
                              <Shield className="w-4 h-4 mr-2" />
                              Security Guide
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              Best practices for secure integration setup
                            </p>
                            <Button size="sm" variant="outline" className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Security Docs
                            </Button>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Quick Start Guide</h4>
                        <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                          <li>Generate an API token for secure authentication</li>
                          <li>Configure webhook endpoint for real-time updates</li>
                          <li>Map your existing fields to Scan Street Pro schema</li>
                          <li>Test the connection with sample data</li>
                          <li>Enable automatic synchronization</li>
                        </ol>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Zap className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All Systems
              </Button>
              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Configuration
              </Button>
              <Button className="w-full" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Settings
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">API Health</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Data Sync</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Security</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Secured
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Integration Stats */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Integration Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Active Connections</span>
                <span className="font-medium text-slate-800 dark:text-white">2/4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Records</span>
                <span className="font-medium text-slate-800 dark:text-white">13,635</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Last 24h Syncs</span>
                <span className="font-medium text-slate-800 dark:text-white">48</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Success Rate</span>
                <span className="font-medium text-green-600">99.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Features Notice */}
      {currentPlan === 'free' && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Unlock Advanced Integration Features
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to access premium integrations, automatic synchronization, unlimited API access, 
                and enterprise-grade security features for seamless municipal system connectivity.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Auto Sync</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Real-time data synchronization</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Key className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Unlimited API</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No rate limits or restrictions</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Enterprise Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Advanced authentication & encryption</p>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/pricing'}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade for Full Integration Access
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Database, 
  Server, 
  Activity, 
  HardDrive, 
  Users, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  Upload,
  Trash2,
  Copy
} from 'lucide-react';
import '../styles/admin-liquid-glass.css';

interface DatabaseStats {
  totalTables: number;
  totalRecords: number;
  databaseSize: string;
  activeConnections: number;
  queryPerformance: number;
  lastBackup: string;
  uptime: string;
}

interface TableInfo {
  name: string;
  schema: string;
  rows: number;
  size: string;
  lastModified: string;
  type: 'table' | 'view' | 'materialized_view';
}

interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  storage: number;
  connections: number;
  issues: string[];
}

const AdminDatabase: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats>({
    totalTables: 24,
    totalRecords: 156789,
    databaseSize: '2.3 GB',
    activeConnections: 12,
    queryPerformance: 95,
    lastBackup: '2024-01-20 03:00:00',
    uptime: '15 days 6 hours'
  });

  const [health, setHealth] = useState<DatabaseHealth>({
    status: 'healthy',
    cpu: 45,
    memory: 67,
    storage: 23,
    connections: 12,
    issues: []
  });

  const [tables, setTables] = useState<TableInfo[]>([
    { name: 'users', schema: 'public', rows: 1247, size: '45.2 MB', lastModified: '2024-01-20 14:30:00', type: 'table' },
    { name: 'organizations', schema: 'public', rows: 89, size: '12.1 MB', lastModified: '2024-01-20 12:15:00', type: 'table' },
    { name: 'user_sessions', schema: 'public', rows: 5634, size: '234.5 MB', lastModified: '2024-01-20 15:45:00', type: 'table' },
    { name: 'audit_logs', schema: 'public', rows: 23456, size: '567.8 MB', lastModified: '2024-01-20 16:20:00', type: 'table' },
    { name: 'financial_transactions', schema: 'public', rows: 8901, size: '123.4 MB', lastModified: '2024-01-20 13:10:00', type: 'table' },
    { name: 'analytics_data', schema: 'public', rows: 45678, size: '789.1 MB', lastModified: '2024-01-20 11:50:00', type: 'table' }
  ]);

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<'success' | 'error' | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnectionResult('success');
    setIsTestingConnection(false);
  };

  const startBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBackupProgress(i);
    }
    
    setIsBackingUp(false);
    setStats(prev => ({
      ...prev,
      lastBackup: new Date().toLocaleString()
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Database Management</h1>
            <p className="text-gray-300">Monitor and manage your database infrastructure</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={testConnection}
              disabled={isTestingConnection}
              className="admin-glass-button flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isTestingConnection ? 'animate-spin' : ''}`} />
              Test Connection
            </Button>
            <Button 
              onClick={startBackup}
              disabled={isBackingUp}
              className="admin-glass-button flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isBackingUp ? 'Backing Up...' : 'Backup Database'}
            </Button>
          </div>
        </div>

        {/* Database Health Status */}
        <Card className="admin-glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {getStatusIcon(health.status)}
                Database Health
              </CardTitle>
              <CardDescription className="text-gray-300">
                Real-time system monitoring and performance metrics
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(health.status)} bg-transparent border`}>
              {health.status.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {connectionResult && (
              <Alert className={connectionResult === 'success' ? 'border-green-500' : 'border-red-500'}>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-white">
                  {connectionResult === 'success' 
                    ? 'Database connection successful!' 
                    : 'Database connection failed. Please check your configuration.'}
                </AlertDescription>
              </Alert>
            )}
            
            {isBackingUp && (
              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>Backup Progress</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} className="admin-glass-progress" />
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="admin-glass-metric">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">CPU Usage</span>
                </div>
                <div className="text-2xl font-bold text-white">{health.cpu}%</div>
                <Progress value={health.cpu} className="admin-glass-progress mt-2" />
              </div>
              
              <div className="admin-glass-metric">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Memory Usage</span>
                </div>
                <div className="text-2xl font-bold text-white">{health.memory}%</div>
                <Progress value={health.memory} className="admin-glass-progress mt-2" />
              </div>
              
              <div className="admin-glass-metric">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300 text-sm">Storage Usage</span>
                </div>
                <div className="text-2xl font-bold text-white">{health.storage}%</div>
                <Progress value={health.storage} className="admin-glass-progress mt-2" />
              </div>
              
              <div className="admin-glass-metric">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300 text-sm">Active Connections</span>
                </div>
                <div className="text-2xl font-bold text-white">{health.connections}</div>
                <div className="text-sm text-gray-400">of 100 max</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="admin-glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="admin-glass-icon">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Total Tables</p>
                  <p className="text-2xl font-bold text-white">{stats.totalTables}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="admin-glass-icon">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Total Records</p>
                  <p className="text-2xl font-bold text-white">{stats.totalRecords.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="admin-glass-icon">
                  <HardDrive className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Database Size</p>
                  <p className="text-2xl font-bold text-white">{stats.databaseSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="admin-glass-icon">
                  <Server className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Uptime</p>
                  <p className="text-2xl font-bold text-white">{stats.uptime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Management Tabs */}
        <Tabs defaultValue="tables" className="space-y-6">
          <TabsList className="admin-glass-tabs">
            <TabsTrigger value="tables">Tables & Views</TabsTrigger>
            <TabsTrigger value="queries">Query Performance</TabsTrigger>
            <TabsTrigger value="backups">Backups & Restore</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="tables">
            <Card className="admin-glass-card">
              <CardHeader>
                <CardTitle className="text-white">Database Tables</CardTitle>
                <CardDescription className="text-gray-300">
                  Overview of all tables and views in your database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Table Name</TableHead>
                        <TableHead className="text-gray-300">Schema</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Rows</TableHead>
                        <TableHead className="text-gray-300">Size</TableHead>
                        <TableHead className="text-gray-300">Last Modified</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tables.map((table, index) => (
                        <TableRow key={index} className="border-gray-700">
                          <TableCell className="text-white font-medium">{table.name}</TableCell>
                          <TableCell className="text-gray-300">{table.schema}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-gray-300 border-gray-600">
                              {table.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">{table.rows.toLocaleString()}</TableCell>
                          <TableCell className="text-gray-300">{table.size}</TableCell>
                          <TableCell className="text-gray-300">{table.lastModified}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queries">
            <Card className="admin-glass-card">
              <CardHeader>
                <CardTitle className="text-white">Query Performance</CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor and optimize database query performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="admin-glass-metric">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Overall Performance Score</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500">
                      {stats.queryPerformance}%
                    </Badge>
                  </div>
                  <Progress value={stats.queryPerformance} className="admin-glass-progress" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="admin-glass-metric">
                    <h4 className="text-white font-medium mb-2">Avg Query Time</h4>
                    <p className="text-2xl font-bold text-green-400">12.3ms</p>
                  </div>
                  <div className="admin-glass-metric">
                    <h4 className="text-white font-medium mb-2">Slow Queries</h4>
                    <p className="text-2xl font-bold text-yellow-400">3</p>
                  </div>
                  <div className="admin-glass-metric">
                    <h4 className="text-white font-medium mb-2">Failed Queries</h4>
                    <p className="text-2xl font-bold text-red-400">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backups">
            <Card className="admin-glass-card">
              <CardHeader>
                <CardTitle className="text-white">Backup Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure and manage database backups and recovery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700">
                  <div>
                    <h3 className="text-white font-medium">Last Backup</h3>
                    <p className="text-gray-300">{stats.lastBackup}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500">
                    Successful
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="admin-glass-button justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Manual Backup
                  </Button>
                  <Button className="admin-glass-button justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Backup Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="backup-frequency" className="text-gray-300">Frequency</Label>
                      <Input 
                        id="backup-frequency"
                        value="Daily at 3:00 AM"
                        className="admin-glass-input mt-1"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="retention-period" className="text-gray-300">Retention Period</Label>
                      <Input 
                        id="retention-period"
                        value="30 days"
                        className="admin-glass-input mt-1"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections">
            <Card className="admin-glass-card">
              <CardHeader>
                <CardTitle className="text-white">Active Connections</CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor database connections and sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="admin-glass-metric">
                    <h4 className="text-white font-medium mb-2">Active Connections</h4>
                    <p className="text-2xl font-bold text-blue-400">{stats.activeConnections}</p>
                  </div>
                  <div className="admin-glass-metric">
                    <h4 className="text-white font-medium mb-2">Max Connections</h4>
                    <p className="text-2xl font-bold text-gray-400">100</p>
                  </div>
                  <div className="admin-glass-metric">
                    <h4 className="text-white font-medium mb-2">Connection Pool</h4>
                    <p className="text-2xl font-bold text-green-400">Available</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-medium">Connection Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-connections" className="text-gray-300">Max Connections</Label>
                      <Input 
                        id="max-connections"
                        value="100"
                        className="admin-glass-input mt-1"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeout" className="text-gray-300">Connection Timeout</Label>
                      <Input 
                        id="timeout"
                        value="30 seconds"
                        className="admin-glass-input mt-1"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDatabase;

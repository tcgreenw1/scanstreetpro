import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Settings,
  Users,
  Shield,
  Bell,
  Database,
  CreditCard,
  Key,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Building,
  Crown,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Clock,
  ExternalLink,
  Palette,
  Globe,
  FileText,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'inspector' | 'viewer';
  status: 'active' | 'pending' | 'disabled';
  lastLogin: string;
  avatar?: string;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

const users: User[] = [
  {
    id: 'U001',
    name: 'John Mitchell',
    email: 'j.mitchell@cityname.gov',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-04-20T10:30:00Z',
    avatar: '/avatars/john.jpg'
  },
  {
    id: 'U002',
    name: 'Sarah Johnson',
    email: 's.johnson@cityname.gov',
    role: 'inspector',
    status: 'active',
    lastLogin: '2024-04-19T14:15:00Z'
  },
  {
    id: 'U003',
    name: 'Mike Rodriguez',
    email: 'm.rodriguez@cityname.gov',
    role: 'manager',
    status: 'pending',
    lastLogin: 'Never'
  }
];

const auditLogs: AuditLog[] = [
  {
    id: 'AL001',
    user: 'John Mitchell',
    action: 'Updated inspection',
    resource: 'INS001',
    timestamp: '2024-04-20T10:30:00Z',
    ipAddress: '192.168.1.101',
    details: 'Changed status from in-progress to completed'
  },
  {
    id: 'AL002',
    user: 'Sarah Johnson',
    action: 'Created contractor',
    resource: 'CON003',
    timestamp: '2024-04-20T09:15:00Z',
    ipAddress: '192.168.1.102',
    details: 'Added new contractor: ABC Construction'
  },
  {
    id: 'AL003',
    user: 'System',
    action: 'Data export',
    resource: 'Reports',
    timestamp: '2024-04-20T08:00:00Z',
    ipAddress: 'system',
    details: 'Automated monthly backup completed'
  }
];

const integrations: Integration[] = [
  {
    id: 'excel',
    name: 'Microsoft Excel',
    status: 'connected',
    lastSync: '2 hours ago'
  },
  {
    id: 'tyler',
    name: 'Tyler Technologies',
    status: 'disconnected',
    lastSync: 'Never'
  },
  {
    id: 'caselle',
    name: 'Caselle Municipal',
    status: 'error',
    lastSync: '1 day ago'
  }
];

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState('organization');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true,
    deadlines: true,
    inspections: true,
    budgetAlerts: false
  });
  const [organizationSettings, setOrganizationSettings] = useState({
    name: 'City of Springfield',
    address: '123 Main Street, Springfield, ST 12345',
    phone: '(555) 123-4567',
    email: 'info@springfield.gov',
    website: 'www.springfield.gov',
    timezone: 'America/New_York',
    fiscalYearStart: 'July'
  });
  const { currentPlan } = usePricing();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Manager</Badge>;
      case 'inspector':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Inspector</Badge>;
      case 'viewer':
        return <Badge variant="outline">Viewer</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><Check className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'disabled':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Disabled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getIntegrationStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const addUser = () => {
    if (currentPlan === 'free' && users.length >= 3) {
      alert('Free plan allows only 3 users. Upgrade to add unlimited team members.');
      return;
    }
    alert('Add user functionality would be implemented here.');
  };

  const generateApiKey = () => {
    if (currentPlan === 'free') {
      alert('API key management is a premium feature. Upgrade to access API functionality.');
      return;
    }
    alert('New API key generated successfully!');
  };

  const exportData = () => {
    if (currentPlan === 'free') {
      alert('Data export is a premium feature. Upgrade to access data backup and export functionality.');
      return;
    }
    alert('Data export initiated. You will receive an email when complete.');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          System Settings
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Manage your organization settings, user permissions, security preferences, and system configuration.
        </p>
        <Badge variant="outline" className="mt-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
          {users.length}/3 Users {currentPlan === 'free' ? '(Free Plan)' : '(Unlimited)'}
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 glass-card border-white/20">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <Building className="w-5 h-5 mr-2" />
                  Organization Details
                </CardTitle>
                <CardDescription>Basic information about your municipality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="org-name" className="text-slate-700 dark:text-slate-300">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={organizationSettings.name}
                    onChange={(e) => setOrganizationSettings({...organizationSettings, name: e.target.value})}
                    className="glass-card border-white/30 mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="org-address" className="text-slate-700 dark:text-slate-300">Address</Label>
                  <Textarea
                    id="org-address"
                    value={organizationSettings.address}
                    onChange={(e) => setOrganizationSettings({...organizationSettings, address: e.target.value})}
                    className="glass-card border-white/30 mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org-phone" className="text-slate-700 dark:text-slate-300">Phone</Label>
                    <Input
                      id="org-phone"
                      value={organizationSettings.phone}
                      onChange={(e) => setOrganizationSettings({...organizationSettings, phone: e.target.value})}
                      className="glass-card border-white/30 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-email" className="text-slate-700 dark:text-slate-300">Email</Label>
                    <Input
                      id="org-email"
                      value={organizationSettings.email}
                      onChange={(e) => setOrganizationSettings({...organizationSettings, email: e.target.value})}
                      className="glass-card border-white/30 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="org-website" className="text-slate-700 dark:text-slate-300">Website</Label>
                  <Input
                    id="org-website"
                    value={organizationSettings.website}
                    onChange={(e) => setOrganizationSettings({...organizationSettings, website: e.target.value})}
                    className="glass-card border-white/30 mt-1"
                  />
                </div>

                <Button className="w-full">
                  Save Organization Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <Globe className="w-5 h-5 mr-2" />
                  Regional Settings
                </CardTitle>
                <CardDescription>Timezone and fiscal year configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timezone" className="text-slate-700 dark:text-slate-300">Timezone</Label>
                  <Select value={organizationSettings.timezone} onValueChange={(value) => setOrganizationSettings({...organizationSettings, timezone: value})}>
                    <SelectTrigger className="glass-card border-white/30 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fiscal-year" className="text-slate-700 dark:text-slate-300">Fiscal Year Start</Label>
                  <Select value={organizationSettings.fiscalYearStart} onValueChange={(value) => setOrganizationSettings({...organizationSettings, fiscalYearStart: value})}>
                    <SelectTrigger className="glass-card border-white/30 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium text-slate-800 dark:text-white mb-3">Branding</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Palette className="w-4 h-4 mr-2" />
                      Customize Colors
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">User Management</h2>
            <Button onClick={addUser} disabled={currentPlan === 'free' && users.length >= 3}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card className="glass-card border-white/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white">{user.name}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.lastLogin === 'Never' ? (
                          <span className="text-slate-500">Never</span>
                        ) : (
                          <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Role Permissions</CardTitle>
              <CardDescription>Configure what each role can access and modify</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Admin</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Full system access</li>
                    <li>• User management</li>
                    <li>• System settings</li>
                    <li>• Billing & subscriptions</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Manager</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Project management</li>
                    <li>• Contractor oversight</li>
                    <li>• Budget planning</li>
                    <li>• Reporting access</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Inspector</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Inspection forms</li>
                    <li>• Photo/video upload</li>
                    <li>• Field data entry</li>
                    <li>• Mobile access</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2">Viewer</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Read-only access</li>
                    <li>• View reports</li>
                    <li>• Dashboard access</li>
                    <li>• Export basic data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure authentication and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Require 2FA for all users</p>
                  </div>
                  <Switch defaultChecked disabled={currentPlan === 'free'} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white">Single Sign-On (SSO)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable SSO integration</p>
                  </div>
                  <Switch disabled={currentPlan === 'free'} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white">Session Timeout</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Auto-logout after inactivity</p>
                  </div>
                  <Select defaultValue="4hours">
                    <SelectTrigger className="w-32 glass-card border-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1hour">1 hour</SelectItem>
                      <SelectItem value="4hours">4 hours</SelectItem>
                      <SelectItem value="8hours">8 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium text-slate-800 dark:text-white mb-3">Password Policy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      Minimum 8 characters
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      Require uppercase and lowercase
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      Require numbers and symbols
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      Password expiry: 90 days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <Key className="w-5 h-5 mr-2" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage API access and webhooks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Production API Key</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value="sk_live_1234••••••••••••••••••••••••"
                      readOnly
                      className="glass-card border-white/30"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Webhook Endpoint</Label>
                  <Input
                    value="https://api.scanstreetpro.com/webhooks"
                    readOnly
                    className="glass-card border-white/30 mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={generateApiKey}
                    disabled={currentPlan === 'free'}
                    className="w-full"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Generate New API Key
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    API Documentation
                  </Button>
                </div>

                {currentPlan === 'free' && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-2">
                      <Crown className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200">Premium Feature</p>
                        <p className="text-amber-700 dark:text-amber-300">API access requires a paid plan</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <History className="w-5 h-5 mr-2" />
                Audit Logs
              </CardTitle>
              <CardDescription>Track user activity and system changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-800 dark:text-white">{log.user}</span>
                        <span className="text-slate-600 dark:text-slate-400">{log.action}</span>
                        <Badge variant="outline" className="text-xs">{log.resource}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{log.details}</p>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div>{log.ipAddress}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline">
                  View All Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white mb-3">Delivery Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>Email</span>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span>SMS</span>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                        disabled={currentPlan === 'free'}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span>Browser</span>
                      </div>
                      <Switch
                        checked={notifications.browser}
                        onCheckedChange={(checked) => setNotifications({...notifications, browser: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white mb-3">Alert Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Grant Deadlines</span>
                      <Switch
                        checked={notifications.deadlines}
                        onCheckedChange={(checked) => setNotifications({...notifications, deadlines: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Inspection Due</span>
                      <Switch
                        checked={notifications.inspections}
                        onCheckedChange={(checked) => setNotifications({...notifications, inspections: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Budget Alerts</span>
                      <Switch
                        checked={notifications.budgetAlerts}
                        onCheckedChange={(checked) => setNotifications({...notifications, budgetAlerts: checked})}
                        disabled={currentPlan === 'free'}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white mb-3">Schedule</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300">Quiet Hours</Label>
                      <div className="flex space-x-2 mt-1">
                        <Select defaultValue="22:00">
                          <SelectTrigger className="glass-card border-white/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20:00">8:00 PM</SelectItem>
                            <SelectItem value="21:00">9:00 PM</SelectItem>
                            <SelectItem value="22:00">10:00 PM</SelectItem>
                            <SelectItem value="23:00">11:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="self-center">to</span>
                        <Select defaultValue="08:00">
                          <SelectTrigger className="glass-card border-white/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="06:00">6:00 AM</SelectItem>
                            <SelectItem value="07:00">7:00 AM</SelectItem>
                            <SelectItem value="08:00">8:00 AM</SelectItem>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300">Summary Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger className="glass-card border-white/30 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Database className="w-5 h-5 mr-2" />
                System Integrations
              </CardTitle>
              <CardDescription>Manage connections to external systems and data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">{integration.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Last sync: {integration.lastSync}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getIntegrationStatusBadge(integration.status)}
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Download className="w-5 h-5 mr-2" />
                Data Management
              </CardTitle>
              <CardDescription>Backup, export, and import your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={exportData} disabled={currentPlan === 'free'} className="h-20 flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  Export All Data
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Upload className="w-6 h-6 mb-2" />
                  Import Data
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Database className="w-6 h-6 mb-2" />
                  Schedule Backup
                </Button>
              </div>

              {currentPlan === 'free' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                  <div className="flex items-start space-x-2">
                    <Crown className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800 dark:text-amber-200">Premium Feature</p>
                      <p className="text-amber-700 dark:text-amber-300">Data export and automated backups require a paid plan</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <CreditCard className="w-5 h-5 mr-2" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>Manage your subscription plan and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white mb-3">Current Plan</h4>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-slate-800 dark:text-white capitalize">{currentPlan} Plan</span>
                      {currentPlan === 'free' && <Badge variant="outline">Free</Badge>}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {currentPlan === 'free' 
                        ? 'Limited features - upgrade for full access'
                        : 'Full access to all features and integrations'
                      }
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/pricing'}
                      className="w-full"
                    >
                      {currentPlan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white mb-3">Usage Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Users</span>
                      <span className="text-sm font-medium">{users.length}/3 {currentPlan === 'free' ? '(Limit)' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">API Calls</span>
                      <span className="text-sm font-medium">{currentPlan === 'free' ? '0/100 (Limit)' : '1,247 (Unlimited)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Storage</span>
                      <span className="text-sm font-medium">{currentPlan === 'free' ? '245 MB/1 GB' : '2.1 GB (Unlimited)'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {currentPlan !== 'free' && (
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white mb-3">Billing History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">March 2024</span>
                        <span className="text-sm text-slate-500 ml-2">Professional Plan</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">$89.00</span>
                        <Button variant="outline" size="sm" className="ml-2">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">February 2024</span>
                        <span className="text-sm text-slate-500 ml-2">Professional Plan</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">$89.00</span>
                        <Button variant="outline" size="sm" className="ml-2">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Premium Features Notice */}
      {currentPlan === 'free' && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Unlock Advanced Administration Features
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to access unlimited users, advanced security features, API access, automated backups, 
                SSO integration, and comprehensive audit logging for enterprise-grade municipal management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Unlimited Users</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Add team members without limits</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Enterprise Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">SSO, 2FA, and audit logging</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Key className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">API Access</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Full API and webhook integration</p>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/pricing'}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade for Advanced Administration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Crown, 
  ArrowUpRight,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Power,
  PowerOff,
  Users,
  DollarSign,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
  created_at: string;
  user_count: number;
  monthly_revenue: number;
  status: 'active' | 'suspended' | 'trial';
}

const AdminOrganizations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Form state
  const [orgForm, setOrgForm] = useState({ name: '', plan: 'free' as const });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadOrganizations();
    }
  }, [user]);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/organizations');
      const data = await response.json();
      if (data.success) {
        setOrganizations(data.data);
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
      toast({ title: "Error", description: "Failed to load organizations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async () => {
    try {
      const response = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgForm)
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ title: "Success", description: "Organization created successfully" });
        setShowCreateModal(false);
        setOrgForm({ name: '', plan: 'free' });
        loadOrganizations();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create organization", variant: "destructive" });
    }
  };

  const updateOrganization = async () => {
    if (!selectedOrg) return;
    
    try {
      const response = await fetch(`/api/admin/organizations/${selectedOrg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgForm)
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ title: "Success", description: "Organization updated successfully" });
        setShowEditModal(false);
        setSelectedOrg(null);
        setOrgForm({ name: '', plan: 'free' });
        loadOrganizations();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update organization", variant: "destructive" });
    }
  };

  const toggleOrganizationStatus = async (orgId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    try {
      const response = await fetch(`/api/admin/organizations/${orgId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ 
          title: "Success", 
          description: `Organization ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully` 
        });
        loadOrganizations();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update organization status", variant: "destructive" });
    }
  };

  const impersonateOrganization = async (orgId: string, orgName: string) => {
    try {
      // This would typically create a temporary session or token
      const response = await fetch(`/api/admin/impersonate/${orgId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ 
          title: "Impersonation Active", 
          description: `You are now viewing as ${orgName}`,
          duration: 5000
        });
        // Store impersonation state
        localStorage.setItem('admin_impersonating', JSON.stringify({
          orgId,
          orgName,
          adminUserId: user?.id,
          timestamp: Date.now()
        }));
        // Navigate to main dashboard
        navigate('/dashboard');
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to impersonate organization", variant: "destructive" });
    }
  };

  const deleteOrganization = async (orgId: string) => {
    try {
      const response = await fetch(`/api/admin/organizations/${orgId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ title: "Success", description: "Organization deleted successfully" });
        loadOrganizations();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete organization", variant: "destructive" });
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'admin-glass-badge text-gray-800';
      case 'basic': return 'admin-glass-badge text-blue-800';
      case 'pro': return 'admin-glass-badge text-purple-800';
      case 'premium': return 'admin-glass-badge text-yellow-800';
      default: return 'admin-glass-badge text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'trial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         org.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    const matchesPlan = planFilter === 'all' || org.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-liquid-glass">
      <div className="fixed inset-0 admin-glass-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/80"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="admin-glass-card rounded-3xl p-8 border border-white/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Button
                  onClick={() => navigate('/admin-portal')}
                  className="admin-glass-button rounded-xl"
                  variant="ghost"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin Portal
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Organization Management
                  </h1>
                  <p className="text-slate-600 text-lg">Manage organizations, plans, and access</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">{organizations.length}</p>
              <p className="text-slate-600">Total Organizations</p>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 admin-glass-input"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 admin-glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="admin-glass-modal">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-32 admin-glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="admin-glass-modal">
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="admin-glass-button gap-2">
                  <Plus className="h-4 w-4" />
                  Create Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="admin-glass-modal">
                <DialogHeader>
                  <DialogTitle>Create New Organization</DialogTitle>
                  <DialogDescription>
                    Add a new organization to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      value={orgForm.name}
                      onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                      placeholder="Enter organization name"
                      className="admin-glass-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-plan">Plan</Label>
                    <Select value={orgForm.plan} onValueChange={(value: any) => setOrgForm({ ...orgForm, plan: value })}>
                      <SelectTrigger className="admin-glass-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="admin-glass-modal">
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)} className="admin-glass-button">
                    Cancel
                  </Button>
                  <Button onClick={createOrganization} className="admin-glass-button">
                    Create Organization
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading organizations...</p>
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No organizations found</p>
            </div>
          ) : (
            filteredOrganizations.map((org) => (
              <div
                key={org.id}
                className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl hover:border-white/30 transition-all duration-300 group hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{org.name}</h3>
                    <p className="text-sm text-slate-600">{org.slug}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 admin-glass-button">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="admin-glass-modal">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => impersonateOrganization(org.id, org.name)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View as User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedOrg(org);
                        setOrgForm({ name: org.name, plan: org.plan });
                        setShowEditModal(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleOrganizationStatus(org.id, org.status)}>
                        {org.status === 'active' ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="admin-glass-modal">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{org.name}" and all associated data. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="admin-glass-button">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteOrganization(org.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Plan</span>
                    <Badge className={getPlanBadgeColor(org.plan)}>
                      {org.plan === 'premium' && <Crown className="h-3 w-3 mr-1" />}
                      {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <Badge className={getStatusBadgeColor(org.status)}>
                      {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Users</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-slate-500" />
                      <span className="text-sm font-medium text-slate-800">{org.user_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Revenue</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-slate-500" />
                      <span className="text-sm font-medium text-slate-800">${org.monthly_revenue}/mo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Created</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span className="text-sm text-slate-600">{new Date(org.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 admin-glass-button"
                    onClick={() => impersonateOrganization(org.id, org.name)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="admin-glass-button"
                    onClick={() => {
                      setSelectedOrg(org);
                      setOrgForm({ name: org.name, plan: org.plan });
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Organization Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="admin-glass-modal">
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
              <DialogDescription>
                Update organization details and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-org-name">Organization Name</Label>
                <Input
                  id="edit-org-name"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  placeholder="Enter organization name"
                  className="admin-glass-input"
                />
              </div>
              <div>
                <Label htmlFor="edit-org-plan">Plan</Label>
                <Select value={orgForm.plan} onValueChange={(value: any) => setOrgForm({ ...orgForm, plan: value })}>
                  <SelectTrigger className="admin-glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="admin-glass-modal">
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="admin-glass-button">
                Cancel
              </Button>
              <Button onClick={updateOrganization} className="admin-glass-button">
                Update Organization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminOrganizations;

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Crown,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface OrganizationTableProps {
  pageSize?: number;
  showActions?: boolean;
  allowCreate?: boolean;
}

interface Organization {
  id: string;
  name: string;
  slug?: string;
  plan: 'free' | 'basic' | 'pro' | 'premium';
  settings?: any;
  created_at: string;
  updated_at?: string;
  user_count: number;
}

export const OrganizationTable = ({ 
  pageSize = 10,
  showActions = true,
  allowCreate = true 
}: OrganizationTableProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    plan: 'free' as const
  });

  // Get auth token for API calls
  const getAuthToken = () => {
    return localStorage.getItem('neon_auth_token');
  };

  // API call helper
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return data;
  };

  // Load organizations
  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const result = await apiCall('/api/admin/organizations');
      setOrganizations(result.data || []);
    } catch (error: any) {
      console.error('Failed to load organizations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create organization
  const createOrganization = async () => {
    try {
      if (!newOrgForm.name) {
        setError('Organization name is required');
        return;
      }

      await apiCall('/api/admin/organizations', {
        method: 'POST',
        body: JSON.stringify(newOrgForm)
      });
      
      setNewOrgForm({ name: '', plan: 'free' });
      setShowCreateModal(false);
      await loadOrganizations();
      setSuccess('Organization created successfully');
    } catch (error: any) {
      console.error('Failed to create organization:', error);
      setError(error.message);
    }
  };

  // Update organization
  const updateOrganization = async (orgId: string, updates: Partial<Organization>) => {
    try {
      await apiCall(`/api/admin/organizations/${orgId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      await loadOrganizations();
      setEditingOrg(null);
      setSuccess('Organization updated successfully');
    } catch (error: any) {
      console.error('Failed to update organization:', error);
      setError(error.message);
    }
  };

  // Update organization plan
  const updateOrganizationPlan = async (orgId: string, plan: string) => {
    try {
      await apiCall(`/api/admin/organizations/${orgId}/plan`, {
        method: 'PUT',
        body: JSON.stringify({ plan })
      });
      await loadOrganizations();
      setSuccess('Plan updated successfully');
    } catch (error: any) {
      console.error('Failed to update plan:', error);
      setError(error.message);
    }
  };

  // Delete organization
  const deleteOrganization = async (orgId: string, orgName: string) => {
    if (!confirm(`Delete organization "${orgName}"? This will also delete all users in this organization.`)) {
      return;
    }

    try {
      await apiCall(`/api/admin/organizations/${orgId}`, {
        method: 'DELETE'
      });
      await loadOrganizations();
      setSuccess('Organization deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete organization:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  // Clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Filter and paginate organizations
  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || org.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const totalPages = Math.ceil(filteredOrgs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrgs = filteredOrgs.slice(startIndex, startIndex + pageSize);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Organizations</h2>
          <p className="text-muted-foreground">
            Manage all organizations and their subscription plans
          </p>
        </div>
        {allowCreate && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Building2 className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        )}
      </div>

      {/* Alerts */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Created</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="animate-pulse">Loading organizations...</div>
                </TableCell>
              </TableRow>
            ) : paginatedOrgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrgs.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center">
                        {org.name}
                        {org.plan === 'premium' && <Crown className="h-4 w-4 ml-2 text-yellow-500" />}
                      </div>
                      {org.slug && <div className="text-sm text-muted-foreground">{org.slug}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanBadgeColor(org.plan)}>
                      {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {org.user_count}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(org.created_at)}
                    </div>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingOrg(org)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Select
                          value={org.plan}
                          onValueChange={(value) => updateOrganizationPlan(org.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteOrganization(org.id, org.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredOrgs.length)} of {filteredOrgs.length}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Organization Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Add a new organization to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                placeholder="Acme Corp"
                value={newOrgForm.name}
                onChange={(e) => setNewOrgForm({...newOrgForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-plan">Initial Plan</Label>
              <Select
                value={newOrgForm.plan}
                onValueChange={(value: any) => setNewOrgForm({...newOrgForm, plan: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={createOrganization}>Create Organization</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Modal */}
      {editingOrg && (
        <Dialog open={!!editingOrg} onOpenChange={() => setEditingOrg(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
              <DialogDescription>
                Update organization details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-org-name">Organization Name</Label>
                <Input
                  id="edit-org-name"
                  value={editingOrg.name}
                  onChange={(e) => setEditingOrg({...editingOrg, name: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingOrg(null)}>Cancel</Button>
              <Button onClick={() => updateOrganization(editingOrg.id, { name: editingOrg.name })}>
                Update Organization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

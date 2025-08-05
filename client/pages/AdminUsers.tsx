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
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Search,
  MoreHorizontal,
  UserPlus,
  Mail,
  Lock,
  Unlock,
  Eye,
  Calendar,
  Building2,
  ArrowLeft,
  Crown,
  AlertTriangle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
  organization_id: string;
  organization_name: string;
  plan: string;
  last_login: string;
  is_active: boolean;
  created_at: string;
}

interface Organization {
  id: string;
  name: string;
  plan: string;
}

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state
  const [userForm, setUserForm] = useState({ 
    email: '', 
    name: '', 
    role: 'viewer' as const, 
    organizationId: '',
    password: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, orgsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/organizations')
      ]);

      const [usersData, orgsData] = await Promise.all([
        usersRes.json(),
        orgsRes.json()
      ]);

      if (usersData.success) setUsers(usersData.data);
      if (orgsData.success) setOrganizations(orgsData.data);

    } catch (error) {
      console.error('Failed to load data:', error);
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });

      const result = await response.json();

      if (result.success) {
        const message = result.tempPassword ?
          `User created successfully! Temporary password: ${result.tempPassword}` :
          result.message || "User created successfully";

        toast({
          title: "Success",
          description: message,
          duration: 10000 // Show for 10 seconds so user can copy password
        });

        setShowCreateModal(false);
        setUserForm({ email: '', name: '', role: 'viewer', organizationId: '', password: '' });
        loadData();
      } else {
        toast({ title: "Error", description: result.error || "Failed to create user", variant: "destructive" });
      }
    } catch (error) {
      console.error('Create user error:', error);
      toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ title: "Success", description: "User updated successfully" });
        setShowEditModal(false);
        setSelectedUser(null);
        setUserForm({ email: '', name: '', role: 'viewer', organizationId: '', password: '' });
        loadData();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ 
          title: "Success", 
          description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully` 
        });
        loadData();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update user status", variant: "destructive" });
    }
  };

  const resetPassword = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        const message = result.tempPassword ?
          `Password reset successfully! New temporary password: ${result.tempPassword}` :
          result.message || "Password reset successfully";

        toast({
          title: "Success",
          description: message,
          duration: 10000 // Show for 10 seconds so user can copy password
        });

        setShowPasswordResetModal(false);
        setSelectedUser(null);
        setUserForm({ email: '', name: '', role: 'viewer', organizationId: '', password: '' });
      } else {
        toast({ title: "Error", description: result.error || "Failed to reset password", variant: "destructive" });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({ title: "Error", description: "Failed to reset password", variant: "destructive" });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ title: "Success", description: "User deleted successfully" });
        loadData();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  const impersonateUser = async (userId: string, userName: string) => {
    try {
      const response = await fetch(`/api/admin/impersonate-user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      
      if (result.success) {
        toast({ 
          title: "Impersonation Active", 
          description: `You are now viewing as ${userName}`,
          duration: 5000
        });
        localStorage.setItem('admin_impersonating_user', JSON.stringify({
          userId,
          userName,
          adminUserId: user?.id,
          timestamp: Date.now()
        }));
        navigate('/dashboard');
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to impersonate user", variant: "destructive" });
    }
  };

  const getRoleBadgeColor = (role: string | undefined | null) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inspector': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contractor': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'viewer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
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
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    User Management
                  </h1>
                  <p className="text-slate-600 text-lg">Manage users, roles, and permissions</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">{users.length}</p>
              <p className="text-slate-600">Total Users</p>
              <p className="text-sm text-slate-500">{users.filter(u => u.is_active).length} active</p>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 admin-glass-input"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 admin-glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="admin-glass-modal">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="inspector">Inspector</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 admin-glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="admin-glass-modal">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="admin-glass-button gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="admin-glass-modal">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to an organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="user@example.com"
                      className="admin-glass-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-name">Name</Label>
                    <Input
                      id="user-name"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="Full name"
                      className="admin-glass-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-password">Temporary Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="Temporary password"
                      className="admin-glass-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-role">Role</Label>
                    <Select value={userForm.role} onValueChange={(value: any) => setUserForm({ ...userForm, role: value })}>
                      <SelectTrigger className="admin-glass-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="admin-glass-modal">
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="user-org">Organization</Label>
                    <Select value={userForm.organizationId} onValueChange={(value) => setUserForm({ ...userForm, organizationId: value })}>
                      <SelectTrigger className="admin-glass-input">
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent className="admin-glass-modal">
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)} className="admin-glass-button">
                    Cancel
                  </Button>
                  <Button onClick={createUser} className="admin-glass-button">
                    Create User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="admin-glass-card rounded-2xl p-6 border border-white/20 backdrop-blur-xl hover:border-white/30 transition-all duration-300 group hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{user.name || 'Unnamed User'}</h3>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 admin-glass-button">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="admin-glass-modal">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => impersonateUser(user.id, user.name || user.email)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View as User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedUser(user);
                        setUserForm({ 
                          email: user.email, 
                          name: user.name || '', 
                          role: user.role, 
                          organizationId: user.organization_id,
                          password: ''
                        });
                        setShowEditModal(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedUser(user);
                        setShowPasswordResetModal(true);
                      }}>
                        <Lock className="h-4 w-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.is_active)}>
                        {user.is_active ? (
                          <>
                            <Unlock className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
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
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{user.name}" ({user.email}). This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="admin-glass-button">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUser(user.id)}
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
                    <span className="text-sm text-slate-600">Role</span>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Viewer'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <Badge className={user.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Organization</span>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-600 truncate max-w-24">{user.organization_name || 'No Organization'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Plan</span>
                    <Badge className="admin-glass-badge text-slate-700">
                      {user.plan === 'premium' && <Crown className="h-3 w-3 mr-1" />}
                      {user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Last Login</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-600">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 admin-glass-button"
                    onClick={() => impersonateUser(user.id, user.name || user.email)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="admin-glass-button"
                    onClick={() => {
                      setSelectedUser(user);
                      setUserForm({ 
                        email: user.email, 
                        name: user.name || '', 
                        role: user.role, 
                        organizationId: user.organization_id,
                        password: ''
                      });
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

        {/* Edit User Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="admin-glass-modal">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-user-email">Email</Label>
                <Input
                  id="edit-user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="admin-glass-input"
                />
              </div>
              <div>
                <Label htmlFor="edit-user-name">Name</Label>
                <Input
                  id="edit-user-name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="admin-glass-input"
                />
              </div>
              <div>
                <Label htmlFor="edit-user-role">Role</Label>
                <Select value={userForm.role} onValueChange={(value: any) => setUserForm({ ...userForm, role: value })}>
                  <SelectTrigger className="admin-glass-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="admin-glass-modal">
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="inspector">Inspector</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-user-org">Organization</Label>
                <Select value={userForm.organizationId} onValueChange={(value) => setUserForm({ ...userForm, organizationId: value })}>
                  <SelectTrigger className="admin-glass-input">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent className="admin-glass-modal">
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="admin-glass-button">
                Cancel
              </Button>
              <Button onClick={updateUser} className="admin-glass-button">
                Update User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Password Reset Modal */}
        <Dialog open={showPasswordResetModal} onOpenChange={setShowPasswordResetModal}>
          <DialogContent className="admin-glass-modal">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new password for {selectedUser?.name || selectedUser?.email}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="Enter new password"
                  className="admin-glass-input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordResetModal(false)} className="admin-glass-button">
                Cancel
              </Button>
              <Button onClick={resetPassword} className="admin-glass-button">
                Reset Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminUsers;

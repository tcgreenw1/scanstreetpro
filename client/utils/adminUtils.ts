import { getErrorMessage } from './errorHandler';

// Admin utility functions for user management and system administration

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

export const adminUtils = {
  // Clear admin cache and sensitive data
  clearAdminCache: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('admin-') || key.startsWith('neon-')) {
          localStorage.removeItem(key);
        }
      });
      console.log('✅ Admin cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear admin cache:', getErrorMessage(error));
    }
  },

  // Get system health status
  getSystemHealth: async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      return {
        success: true,
        data: {
          status: data.status || 'unknown',
          database: data.database || 'unknown',
          uptime: data.uptime || 0,
          version: data.version || 'unknown'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Get all organizations
  getOrganizations: async () => {
    try {
      const result = await apiCall('/api/admin/organizations');
      return {
        success: true,
        data: result.data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Create new organization
  createOrganization: async (orgData: {
    name: string;
    plan: string;
    settings?: any;
  }) => {
    try {
      const result = await apiCall('/api/admin/organizations', {
        method: 'POST',
        body: JSON.stringify(orgData)
      });
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Update organization
  updateOrganization: async (orgId: string, updates: any) => {
    try {
      const result = await apiCall(`/api/admin/organizations/${orgId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Delete organization
  deleteOrganization: async (orgId: string) => {
    try {
      await apiCall(`/api/admin/organizations/${orgId}`, {
        method: 'DELETE'
      });
      return {
        success: true,
        message: 'Organization deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const result = await apiCall('/api/admin/users');
      return {
        success: true,
        data: result.data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Create new user
  createUser: async (userData: {
    email: string;
    password: string;
    name?: string;
    role: string;
    organization_id: string;
  }) => {
    try {
      const result = await apiCall('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Update user
  updateUser: async (userId: string, updates: any) => {
    try {
      const result = await apiCall(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Delete user
  deleteUser: async (userId: string) => {
    try {
      await apiCall(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Get admin statistics
  getAdminStats: async () => {
    try {
      const result = await apiCall('/api/admin/stats');
      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Export data
  exportData: async (type: string, format: string = 'csv') => {
    try {
      const response = await fetch(`/api/export/${type}?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return {
        success: true,
        message: 'Export completed successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Test database connection
  testDatabaseConnection: async () => {
    try {
      const response = await fetch('/api/db/test');
      const data = await response.json();
      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Apply database migration
  applyMigration: async (migrationType: string = 'financial') => {
    try {
      const result = await apiCall(`/api/migrate/${migrationType}`, {
        method: 'POST'
      });
      return {
        success: true,
        message: result.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Check user existence in database
  checkUserExists: async (email: string) => {
    try {
      const result = await apiCall(`/api/admin/users/check/${email}`);
      return {
        success: true,
        exists: result.exists,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Reset user password
  resetUserPassword: async (userId: string, newPassword: string) => {
    try {
      const result = await apiCall(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ password: newPassword })
      });
      return {
        success: true,
        message: result.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  },

  // Get system logs
  getSystemLogs: async (limit: number = 100) => {
    try {
      const result = await apiCall(`/api/admin/logs?limit=${limit}`);
      return {
        success: true,
        data: result.data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }
};

export default adminUtils;

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw,
  Download,
  Filter
} from "lucide-react";

interface CRUDTableProps {
  entityType: string;
  title?: string;
  pageSize?: number;
}

export const CRUDTable = ({ 
  entityType = 'organizations',
  title = 'Data Table',
  pageSize = 10 
}: CRUDTableProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get auth token
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

  // Load data based on entity type
  const loadData = async () => {
    try {
      setLoading(true);
      let endpoint = '';
      
      switch (entityType) {
        case 'organizations':
          endpoint = '/api/admin/organizations';
          break;
        case 'users':
          endpoint = '/api/admin/users';
          break;
        case 'transactions':
          endpoint = '/api/admin/transactions';
          break;
        default:
          endpoint = `/api/admin/${entityType}`;
      }

      const result = await apiCall(endpoint);
      setData(result.data?.transactions || result.data || []);
    } catch (error: any) {
      console.error(`Failed to load ${entityType}:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [entityType]);

  // Filter data based on search
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const searchableFields = Object.values(item).join(' ').toLowerCase();
    return searchableFields.includes(searchTerm.toLowerCase());
  });

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Get table columns based on entity type
  const getColumns = () => {
    switch (entityType) {
      case 'organizations':
        return [
          { key: 'name', label: 'Name' },
          { key: 'plan', label: 'Plan' },
          { key: 'user_count', label: 'Users' },
          { key: 'created_at', label: 'Created' }
        ];
      case 'users':
        return [
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'organization_name', label: 'Organization' },
          { key: 'created_at', label: 'Created' }
        ];
      case 'transactions':
        return [
          { key: 'organization_name', label: 'Organization' },
          { key: 'amount', label: 'Amount' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'created_at', label: 'Date' }
        ];
      default:
        // Auto-detect columns from first data item
        if (data.length > 0) {
          return Object.keys(data[0]).map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')
          }));
        }
        return [];
    }
  };

  // Format cell value
  const formatCellValue = (value: any, columnKey: string) => {
    if (value === null || value === undefined) return '-';
    
    // Format dates
    if (columnKey.includes('_at') || columnKey.includes('date')) {
      return new Date(value).toLocaleDateString();
    }
    
    // Format amounts
    if (columnKey === 'amount' && typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value / 100);
    }
    
    // Format badges for status/plan/role
    if (['plan', 'role', 'status', 'type'].includes(columnKey)) {
      const badgeColors = {
        // Plans
        free: 'bg-gray-100 text-gray-800',
        basic: 'bg-blue-100 text-blue-800',
        pro: 'bg-purple-100 text-purple-800',
        premium: 'bg-yellow-100 text-yellow-800',
        // Roles
        admin: 'bg-red-100 text-red-800',
        manager: 'bg-blue-100 text-blue-800',
        member: 'bg-gray-100 text-gray-800',
        // Status
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800',
        canceled: 'bg-gray-100 text-gray-800',
        // Types
        payment: 'bg-green-100 text-green-800',
        refund: 'bg-red-100 text-red-800',
        upgrade: 'bg-blue-100 text-blue-800',
        downgrade: 'bg-orange-100 text-orange-800'
      };
      
      const colorClass = badgeColors[value as keyof typeof badgeColors] || 'bg-gray-100 text-gray-800';
      
      return (
        <Badge className={colorClass}>
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </Badge>
      );
    }
    
    return String(value);
  };

  const columns = getColumns();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">
            Manage {entityType} with full CRUD operations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded">
          Error: {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${entityType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Data Stats */}
      <div className="flex space-x-4 text-sm text-muted-foreground">
        <span>Total: {data.length}</span>
        <span>Filtered: {filteredData.length}</span>
        <span>Page: {currentPage} of {totalPages}</span>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  <div className="animate-pulse">Loading {entityType}...</div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  No {entityType} found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {formatCellValue(item[column.key], column.key)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length}
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
              <span className="flex items-center px-3 text-sm">
                {currentPage} / {totalPages}
              </span>
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
    </div>
  );
};

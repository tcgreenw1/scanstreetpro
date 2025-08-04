import { type RegisteredComponent } from "@builder.io/sdk-react";
import dynamic from 'next/dynamic';

// Dynamic imports for all admin components
const AdminDashboard = dynamic(() => 
  import('./client/components/builder/AdminDashboard').then(mod => ({ default: mod.AdminDashboard }))
);

const OrganizationTable = dynamic(() => 
  import('./client/components/builder/OrganizationTable').then(mod => ({ default: mod.OrganizationTable }))
);

const UserManagement = dynamic(() => 
  import('./client/components/builder/UserManagement').then(mod => ({ default: mod.UserManagement }))
);

const FinancialDashboard = dynamic(() => 
  import('./client/components/builder/FinancialDashboard').then(mod => ({ default: mod.FinancialDashboard }))
);

const PlanUpgradeModal = dynamic(() => 
  import('./client/components/builder/PlanUpgradeModal').then(mod => ({ default: mod.PlanUpgradeModal }))
);

const AnalyticsChart = dynamic(() => 
  import('./client/components/builder/AnalyticsChart').then(mod => ({ default: mod.AnalyticsChart }))
);

const CRUDTable = dynamic(() => 
  import('./client/components/builder/CRUDTable').then(mod => ({ default: mod.CRUDTable }))
);

const RoleBasedSection = dynamic(() => 
  import('./client/components/builder/RoleBasedSection').then(mod => ({ default: mod.RoleBasedSection }))
);

const ExportButton = dynamic(() => 
  import('./client/components/builder/ExportButton').then(mod => ({ default: mod.ExportButton }))
);

const AdminStatsCards = dynamic(() => 
  import('./client/components/builder/AdminStatsCards').then(mod => ({ default: mod.AdminStatsCards }))
);

export const customComponents: RegisteredComponent[] = [
  {
    component: AdminDashboard,
    name: 'AdminDashboard',
    inputs: [
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Admin Dashboard',
        required: true,
      },
      {
        name: 'showStats',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'showFinancials',
        type: 'boolean',
        defaultValue: true,
      }
    ],
    canHaveChildren: true,
  },
  {
    component: OrganizationTable,
    name: 'OrganizationTable',
    inputs: [
      {
        name: 'pageSize',
        type: 'number',
        defaultValue: 10,
      },
      {
        name: 'showActions',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'allowCreate',
        type: 'boolean',
        defaultValue: true,
      }
    ],
  },
  {
    component: UserManagement,
    name: 'UserManagement',
    inputs: [
      {
        name: 'pageSize',
        type: 'number',
        defaultValue: 10,
      },
      {
        name: 'showRoleFilter',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'allowInvite',
        type: 'boolean',
        defaultValue: true,
      }
    ],
  },
  {
    component: FinancialDashboard,
    name: 'FinancialDashboard',
    inputs: [
      {
        name: 'currency',
        type: 'string',
        defaultValue: 'USD',
      },
      {
        name: 'showTrends',
        type: 'boolean',
        defaultValue: true,
      },
      {
        name: 'timeRange',
        type: 'string',
        defaultValue: '12months',
      }
    ],
  },
  {
    component: PlanUpgradeModal,
    name: 'PlanUpgradeModal',
    inputs: [
      {
        name: 'triggerText',
        type: 'string',
        defaultValue: 'Upgrade Plan',
      },
      {
        name: 'primaryColor',
        type: 'color',
        defaultValue: '#3b82f6',
      }
    ],
  },
  {
    component: AnalyticsChart,
    name: 'AnalyticsChart',
    inputs: [
      {
        name: 'chartType',
        type: 'string',
        defaultValue: 'line',
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Analytics',
        required: true,
      },
      {
        name: 'height',
        type: 'number',
        defaultValue: 300,
      }
    ],
  },
  {
    component: CRUDTable,
    name: 'CRUDTable',
    inputs: [
      {
        name: 'entityType',
        type: 'string',
        defaultValue: 'organizations',
        required: true,
      },
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Data Table',
      },
      {
        name: 'pageSize',
        type: 'number',
        defaultValue: 10,
      }
    ],
  },
  {
    component: RoleBasedSection,
    name: 'RoleBasedSection',
    inputs: [
      {
        name: 'requiredPlan',
        type: 'string',
        defaultValue: 'free',
      },
      {
        name: 'requiredRole',
        type: 'string',
        defaultValue: 'member',
      },
      {
        name: 'fallbackMessage',
        type: 'string',
        defaultValue: 'Upgrade to access this feature',
      }
    ],
    canHaveChildren: true,
  },
  {
    component: ExportButton,
    name: 'ExportButton',
    inputs: [
      {
        name: 'exportType',
        type: 'string',
        defaultValue: 'csv',
      },
      {
        name: 'dataEndpoint',
        type: 'string',
        defaultValue: '/api/admin/export',
        required: true,
      },
      {
        name: 'buttonText',
        type: 'string',
        defaultValue: 'Export Data',
      }
    ],
  },
  {
    component: AdminStatsCards,
    name: 'AdminStatsCards',
    inputs: [
      {
        name: 'layout',
        type: 'string',
        defaultValue: 'grid',
      },
      {
        name: 'showTrends',
        type: 'boolean',
        defaultValue: true,
      }
    ],
  }
];

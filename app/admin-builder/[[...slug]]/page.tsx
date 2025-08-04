import {
  Content,
  fetchOneEntry,
  isPreviewing,
  isEditing,
} from '@builder.io/sdk-react';
import { customComponents } from '../../../builder-registry';

interface PageProps {
  params: {
    slug: string[];
  };
  searchParams: Record<string, string>;
}

// Builder.io API key
const BUILDER_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

export default async function AdminBuilderPage(props: PageProps) {
  // Initialize Builder.io components
  const { initializeNodeRuntime } = await import('@builder.io/sdk-react/node/init');
  initializeNodeRuntime();

  const urlPath = '/admin-builder/' + (props.params?.slug?.join('/') || '');

  const content = await fetchOneEntry({
    options: props.searchParams,
    apiKey: BUILDER_PUBLIC_API_KEY,
    model: 'page',
    userAttributes: { urlPath },
  });

  const canShowContent =
    content || isPreviewing(props.searchParams) || isEditing(props.searchParams);
  
  if (!canShowContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Admin Portal Builder</h1>
          <p className="text-gray-600">
            Create your admin portal content at builder.io
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Available components:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>AdminDashboard - Full admin dashboard with stats</li>
              <li>OrganizationTable - CRUD table for organizations</li>
              <li>UserManagement - User management with roles</li>
              <li>FinancialDashboard - Revenue analytics and transactions</li>
              <li>PlanUpgradeModal - Plan upgrade interface</li>
              <li>AnalyticsChart - Data visualization charts</li>
              <li>CRUDTable - Generic data table with CRUD operations</li>
              <li>RoleBasedSection - Conditional content based on user role/plan</li>
              <li>ExportButton - Data export functionality</li>
              <li>AdminStatsCards - Dashboard statistics cards</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Content 
      content={content} 
      apiKey={BUILDER_PUBLIC_API_KEY} 
      model={'page'} 
      customComponents={customComponents}
    />
  );
}

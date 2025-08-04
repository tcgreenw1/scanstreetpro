# Plan-Based User & Organization System - Usage Guide

## 🎯 Overview

The new plan-based system creates organizations with users automatically upon signup and provides:
- User & Organization management with role-based access
- Plan-based features and UI controls
- Automatic subscription tracking
- Flexible plan configuration

## 📊 Database Schema

### Tables Created:
- `users` - User accounts with roles (manager/member)
- `organizations` - Company/organization entities with plans
- `subscriptions` - Billing and plan tracking
- `plan_features` - Configurable feature limits per plan
- `ui_rules` - UI visibility and behavior rules per plan

### Plans Available:
- `free` - Limited features, sample data, crowns shown
- `basic` - Basic features, minimal crowns
- `pro` - Advanced features, limited crowns
- `premium` - Full features, no crowns
- `satellite` - Enterprise tier
- `driving` - Top tier with unlimited everything

## 🔧 Backend API Usage

### Signup Flow (Creates User + Organization + Subscription)
```javascript
POST /api/signup
{
  "email": "user@company.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "organizationName": "Acme Corp" // optional
}

// Response includes user, organization, subscription, and JWT token
```

### Authentication
```javascript
POST /api/login
{
  "email": "user@company.com",
  "password": "securePassword123"
}
```

### Plan Features API
```javascript
GET /api/plans/features
Authorization: Bearer <token>
// Returns current organization's plan features

GET /api/plans/ui-rules  
Authorization: Bearer <token>
// Returns UI rules for current organization's plan
```

## 🎨 Frontend Usage

### 1. Using Plan Hooks

```typescript
import { usePlan, usePlanCheck, usePlanFeature } from '@/hooks/usePlan';

function MyComponent() {
  const { plan, loading } = usePlan();
  const { isFreePlan, isPaidPlan } = usePlanCheck();
  const maxUsers = usePlanFeature('max_users');
  
  if (loading) return <div>Loading plan data...</div>;
  
  return (
    <div>
      <h1>Current Plan: {plan}</h1>
      <p>Max Users: {maxUsers}</p>
      {isFreePlan && <p>Upgrade to unlock more features!</p>}
    </div>
  );
}
```

### 2. Plan-Based Component Visibility

```typescript
import { PlanGuard } from '@/components/PlanGuard';

function AdvancedFeature() {
  return (
    <PlanGuard 
      component="analytics" 
      plan={['pro', 'premium']}
      showUpgrade={true}
    >
      <AnalyticsComponent />
    </PlanGuard>
  );
}
```

### 3. Crown Badges for Upselling

```typescript
import { CrownBadge } from '@/components/PlanGuard';

function ReportsPage() {
  return (
    <CrownBadge component="reports">
      <Card>
        <CardTitle>Advanced Reports</CardTitle>
        <CardContent>Premium reporting features...</CardContent>
      </Card>
    </CrownBadge>
  );
}
```

### 4. Sample Data Indicators

```typescript
import { SampleDataBadge } from '@/components/PlanGuard';

function Dashboard() {
  return (
    <SampleDataBadge component="dashboard">
      <DataTable data={dashboardData} />
    </SampleDataBadge>
  );
}
```

### 5. Plan Conditional Rendering

```typescript
import { PlanConditional } from '@/components/PlanGuard';

function FeatureSection() {
  return (
    <div>
      <PlanConditional condition="free" fallback={<PremiumFeatures />}>
        <BasicFeatures />
      </PlanConditional>
      
      <PlanConditional condition="professional">
        <AdvancedAnalytics />
      </PlanConditional>
    </div>
  );
}
```

## ⚙️ Admin Configuration

### Update Plan Features
```javascript
PUT /api/plans/feature
{
  "plan": "pro",
  "feature_name": "max_inspections",
  "value": "2000"
}
```

### Update UI Rules
```javascript
PUT /api/plans/ui-rule
{
  "plan": "free",
  "component_name": "advanced_settings",
  "visible": false,
  "sample_data": true,
  "show_crown": true
}
```

## 🔄 Component Integration Examples

### Dashboard with Plan-Based Features
```typescript
function Dashboard() {
  const { plan, shouldUseSampleData, shouldShowCrown } = usePlan();
  const maxInspections = usePlanFeature('max_inspections');
  
  return (
    <div className="dashboard">
      <PlanBadge />
      
      <PlanGuard component="dashboard">
        <SampleDataBadge component="dashboard">
          <StatsGrid data={shouldUseSampleData('dashboard') ? sampleData : realData} />
        </SampleDataBadge>
      </PlanGuard>
      
      <CrownBadge component="analytics">
        <PlanGuard 
          component="analytics" 
          fallback={<UpgradePrompt feature="Advanced Analytics" />}
        >
          <AnalyticsSection />
        </PlanGuard>
      </CrownBadge>
      
      <div className="usage-meter">
        <p>Inspections: {currentCount}/{maxInspections}</p>
      </div>
    </div>
  );
}
```

### Settings Page with Feature Limits
```typescript
function SettingsPage() {
  const maxUsers = usePlanFeature('max_users');
  const { isComponentVisible } = usePlan();
  
  return (
    <div>
      <UserManagement maxUsers={maxUsers} />
      
      {isComponentVisible('advanced_settings') && (
        <AdvancedSettings />
      )}
      
      <PlanGuard plan={['premium', 'satellite', 'driving']}>
        <APIAccessSettings />
      </PlanGuard>
    </div>
  );
}
```

## 🛠️ Development Notes

### Environment Setup
1. Ensure Neon database connection string is set
2. Run schema migration: `psql $DATABASE_URL < server/database/schema.sql`
3. JWT secret should be configured for authentication

### Plan Feature Configuration
- Features are stored in `plan_features` table
- UI rules control component visibility and behavior
- Easy to add new plans or modify existing ones
- No code changes needed for plan updates

### Security Considerations
- All API endpoints require JWT authentication
- Organization isolation enforced at database level
- Role-based access controls implemented
- Subscription status validation included

## 🎨 Styling and UX

The system includes beautiful UI components for:
- ✨ Crown badges for premium features
- 🏷️ Plan badges showing current tier
- 🎯 Upgrade prompts with gradient buttons
- 📊 Sample data indicators
- 🔒 Feature-locked states with clear CTAs

All components are responsive and include dark mode support!

# Builder.io Fusion Admin Portal

A comprehensive admin portal built with Builder.io Fusion, featuring dynamic data connections to Neon PostgreSQL, real-time analytics, and role-based access controls.

## 🚀 Features

### **Dynamic Data Management**
- **Organizations**: Full CRUD operations with plan management
- **Users**: Role-based user management with invitations
- **Financial Tracking**: Revenue analytics and transaction monitoring
- **Real-time Stats**: Live dashboard with key metrics

### **Role-Based Access Control**
- **Plan-Based Features**: Free, Basic ($99/mo), Pro ($199/mo), Premium ($999/mo)
- **User Roles**: Admin, Manager, Member with hierarchical permissions
- **Conditional Rendering**: Components that show/hide based on user access level

### **Builder.io Integration**
- **Visual Editor**: Drag-and-drop interface for admin portal customization
- **Custom Components**: Pre-built admin components ready for Builder.io
- **Dynamic Content**: Real database connections with live data
- **Responsive Design**: Mobile-first approach with responsive layouts

## 📁 Project Structure

```
├── builder-registry.ts              # Builder.io component registry
├── app/admin-builder/[[...slug]]/   # Builder.io catch-all route
│   └── page.tsx                     # Dynamic admin portal pages
├── client/components/builder/       # Builder.io components
│   ├── AdminDashboard.tsx          # Main dashboard with stats
│   ├── OrganizationTable.tsx       # Organization management
│   ├── UserManagement.tsx          # User management interface
│   ├── FinancialDashboard.tsx      # Revenue analytics
│   ├── PlanUpgradeModal.tsx        # Plan upgrade interface
│   ├── AnalyticsChart.tsx          # Data visualization
│   ├── CRUDTable.tsx               # Generic data table
│   ├── RoleBasedSection.tsx        # Conditional content
│   ├── ExportButton.tsx            # Data export functionality
│   └── AdminStatsCards.tsx         # Statistics cards
├── server/routes/                   # API endpoints
│   ├── admin.ts                    # Admin CRUD operations
│   ├── export.ts                   # Data export endpoints
│   └── migrate.ts                  # Database migrations
└── server/database/
    └── schema.sql                  # Database schema
```

## 🎯 Builder.io Components

### **AdminDashboard**
Main dashboard component with configurable stats and analytics.

**Props:**
- `title`: Dashboard title (default: "Admin Dashboard")
- `showStats`: Show statistics cards (default: true)
- `showFinancials`: Show financial metrics (default: true)

**Features:**
- Real-time statistics
- Activity monitoring
- Plan distribution charts
- Custom content areas

### **OrganizationTable**
Complete organization management with CRUD operations.

**Props:**
- `pageSize`: Number of items per page (default: 10)
- `showActions`: Show action buttons (default: true)
- `allowCreate`: Allow creating new organizations (default: true)

**Features:**
- Search and filtering
- Plan upgrades/downgrades
- User count tracking
- Real-time updates

### **UserManagement**
Comprehensive user management system.

**Props:**
- `pageSize`: Number of items per page (default: 10)
- `showRoleFilter`: Show role filtering (default: true)
- `allowInvite`: Allow user invitations (default: true)

**Features:**
- Role-based permissions
- User invitations
- Organization assignment
- Activity tracking

### **FinancialDashboard**
Revenue analytics and transaction monitoring.

**Props:**
- `currency`: Currency format (default: "USD")
- `showTrends`: Show trend analysis (default: true)
- `timeRange`: Time range for analytics (default: "12months")

**Features:**
- Revenue tracking
- Transaction history
- Plan-based revenue analysis
- Export functionality

### **RoleBasedSection**
Conditional content rendering based on user permissions.

**Props:**
- `requiredPlan`: Minimum plan required (default: "free")
- `requiredRole`: Minimum role required (default: "member")
- `fallbackMessage`: Message for unauthorized users

**Features:**
- Plan hierarchy checking
- Role permission validation
- Upgrade prompts
- Content previews

## 🔌 API Endpoints

### **Admin Management**
```
GET    /api/admin/stats               # Dashboard statistics
GET    /api/admin/organizations       # List organizations
POST   /api/admin/organizations       # Create organization
PUT    /api/admin/organizations/:id   # Update organization
DELETE /api/admin/organizations/:id   # Delete organization

GET    /api/admin/users               # List users
POST   /api/admin/users               # Create user
PUT    /api/admin/users/:id           # Update user
DELETE /api/admin/users/:id           # Delete user
PUT    /api/admin/users/:id/role      # Update user role
```

### **Financial Tracking**
```
GET    /api/admin/transactions        # List transactions
POST   /api/admin/transactions        # Create transaction
GET    /api/admin/revenue-analytics   # Revenue analytics
GET    /api/admin/settings            # System settings
PUT    /api/admin/settings/:key       # Update setting
```

### **Data Export**
```
GET    /api/export/organizations?format=csv  # Export organizations
GET    /api/export/users?format=json         # Export users
GET    /api/export/transactions?format=csv   # Export transactions
GET    /api/export/analytics?format=json     # Export analytics
```

## 🗄️ Database Schema

### **Core Tables**
- `organizations` - Organization data with plans
- `users` - User accounts with roles
- `subscriptions` - Plan subscriptions
- `transactions` - Financial transactions
- `system_settings` - Configuration settings

### **Plan System**
```sql
CREATE TYPE organization_plan AS ENUM ('free', 'basic', 'pro', 'premium');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'upgrade', 'downgrade');
```

## 🚀 Getting Started

### **1. Setup Builder.io**
1. Sign up at [Builder.io](https://builder.io)
2. Get your API key from settings
3. Set `NEXT_PUBLIC_BUILDER_API_KEY` environment variable

### **2. Database Migration**
Visit `/setup` to apply the database migration for financial tracking tables.

### **3. Builder.io Configuration**
1. Go to [Builder.io dashboard](https://builder.io/content)
2. Create a new page with URL `/admin-builder`
3. Add components from the registry:
   - AdminDashboard
   - OrganizationTable
   - UserManagement
   - FinancialDashboard

### **4. Component Registration**
All components are automatically registered in `builder-registry.ts`. No additional setup required.

## 📊 Plan-Based Features

### **Free Plan** ($0/month)
- Sample data only
- 3 users maximum
- Community support
- 30-day data retention

### **Basic Plan** ($99/month)
- Real data access
- 10 users
- Email support
- 90-day data retention
- Basic reports

### **Pro Plan** ($199/month)
- Everything in Basic
- 50 users
- Priority support
- 1-year data retention
- Advanced analytics
- API access

### **Premium Plan** ($999/month)
- Everything in Pro
- Unlimited users
- Phone support
- Unlimited data retention
- White-label options
- Dedicated account manager

## 🔧 Customization

### **Adding New Components**
1. Create component in `client/components/builder/`
2. Export with named export
3. Add to `builder-registry.ts`
4. Define props interface with Builder.io input types

### **Extending API**
1. Add routes in `server/routes/`
2. Update `server/index.ts` to include routes
3. Ensure authentication middleware is applied

### **Database Updates**
1. Update `server/database/schema.sql`
2. Create migration in `server/routes/migrate.ts`
3. Apply via `/setup` endpoint

## 🔒 Security

- **JWT Authentication**: Token-based auth for all API calls
- **Role-Based Access**: Hierarchical permission system
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure credential management

## 📱 Responsive Design

All components are built with Tailwind CSS and follow mobile-first responsive design principles:
- Mobile: Stack layouts, simplified navigation
- Tablet: Two-column layouts, condensed tables
- Desktop: Full feature set, multi-column layouts

## 🧪 Testing

Visit the following URLs to test functionality:
- `/admin-builder` - Builder.io visual editor
- `/admin-portal` - Traditional admin portal
- `/setup` - Database migration utility

## 🚀 Deployment

1. Set environment variables:
   - `NEXT_PUBLIC_BUILDER_API_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`

2. Run database migration:
   ```bash
   curl -X POST /api/migrate/financial
   ```

3. Deploy to your platform of choice (Vercel, Netlify, etc.)

## 📞 Support

For Builder.io specific questions, visit [Builder.io Documentation](https://www.builder.io/c/docs).
For custom development support, contact the development team.

---

**Built with Builder.io Fusion - The visual development platform for modern web applications**

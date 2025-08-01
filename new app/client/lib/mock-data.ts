// Budget Overview Data
export const budgetOverview = {
  currentYear: 2024,
  totalBudget: 12500000,
  availableFunds: 4000000,
  percentSpent: 68,
  spentAmount: 8500000
};

// 5-Year Spending Data
export const yearlySpending = [
  { year: 2020, funding: 10000000, spending: 9500000 },
  { year: 2021, funding: 11000000, spending: 10200000 },
  { year: 2022, funding: 11500000, spending: 10800000 },
  { year: 2023, funding: 12000000, spending: 11400000 },
  { year: 2024, funding: 12500000, spending: 8500000 }
];

// Spending Trends for Road Maintenance
export const spendingTrends = [
  { year: 2020, amount: 3200000 },
  { year: 2021, amount: 3800000 },
  { year: 2022, amount: 4100000 },
  { year: 2023, amount: 4500000 },
  { year: 2024, amount: 3200000 }
];

// Spending Distribution by Category
export const spendingDistribution = [
  { name: 'Road Maintenance', amount: 3200000, percentage: 38, color: '#3b82f6' },
  { name: 'Asset Management', amount: 1700000, percentage: 20, color: '#10b981' },
  { name: 'Public Works', amount: 1275000, percentage: 15, color: '#f59e0b' },
  { name: 'Infrastructure', amount: 1190000, percentage: 14, color: '#ef4444' },
  { name: 'Administration', amount: 850000, percentage: 10, color: '#8b5cf6' },
  { name: 'Emergency Repairs', amount: 283000, percentage: 3, color: '#06b6d4' }
];

// Upcoming Deadlines
export const upcomingDeadlines = [
  {
    id: '1',
    title: 'Federal Highway Grant Application',
    date: '2024-02-15',
    amount: 2500000,
    status: 'urgent',
    type: 'Grant'
  },
  {
    id: '2',
    title: 'Annual Infrastructure Bond Payment',
    date: '2024-03-01',
    amount: 750000,
    status: 'normal',
    type: 'Payment'
  },
  {
    id: '3',
    title: 'State DOT Compliance Report',
    date: '2024-03-15',
    status: 'warning',
    type: 'Report'
  },
  {
    id: '4',
    title: 'Bridge Inspection Contract Renewal',
    date: '2024-04-01',
    amount: 125000,
    status: 'normal',
    type: 'Contract'
  },
  {
    id: '5',
    title: 'EPA Environmental Impact Assessment',
    date: '2024-01-30',
    status: 'urgent',
    type: 'Compliance'
  }
];

// Municipal Statistics
export const municipalStats = {
  totalRoadMiles: 847.2,
  avgPciScore: 65,
  totalAssets: 12847,
  activeProjects: 23,
  activeBudget: 12500000,
  citizenReports: 89,
  contractorCount: 15,
  avgResponseTime: '2.3 days'
};

// Grant Opportunities
export const grantOpportunities = [
  {
    id: '1',
    title: 'Rural Infrastructure Development Grant',
    agency: 'USDA',
    amount: 5000000,
    deadline: '2024-03-15',
    eligibility: 95,
    status: 'open',
    category: 'Infrastructure'
  },
  {
    id: '2',
    title: 'Smart City Technology Initiative',
    agency: 'DOT',
    amount: 2500000,
    deadline: '2024-02-28',
    eligibility: 87,
    status: 'open',
    category: 'Technology'
  },
  {
    id: '3',
    title: 'Green Infrastructure Climate Resilience',
    agency: 'EPA',
    amount: 3200000,
    deadline: '2024-04-10',
    eligibility: 92,
    status: 'open',
    category: 'Environmental'
  }
];

// Asset Categories
export const assetCategories = [
  { name: 'Roads & Pavements', count: 847, icon: 'road' },
  { name: 'Bridges & Structures', count: 23, icon: 'bridge' },
  { name: 'Traffic Signals', count: 156, icon: 'traffic-light' },
  { name: 'Street Lighting', count: 2341, icon: 'lamp' },
  { name: 'Signage', count: 1876, icon: 'sign' },
  { name: 'Drainage Systems', count: 445, icon: 'droplets' }
];

// Recent Activity
export const recentActivity = [
  {
    id: '1',
    type: 'inspection',
    title: 'Main Street Bridge inspection completed',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Pothole repair on Oak Avenue scheduled',
    time: '4 hours ago',
    status: 'scheduled'
  },
  {
    id: '3',
    type: 'citizen-report',
    title: 'New citizen report: Street light outage',
    time: '6 hours ago',
    status: 'pending'
  },
  {
    id: '4',
    type: 'budget',
    title: 'Budget allocation approved for Q2 projects',
    time: '1 day ago',
    status: 'approved'
  }
];

// Contractor Information
export const contractors = [
  {
    id: '1',
    name: 'ABC Paving Solutions',
    specialty: 'Road Maintenance',
    rating: 4.8,
    activeJobs: 3,
    totalJobs: 45,
    contact: 'john@abcpaving.com',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Municipal Bridge Works',
    specialty: 'Bridge Inspection',
    rating: 4.9,
    activeJobs: 1,
    totalJobs: 12,
    contact: 'sarah@bridgeworks.com',
    phone: '(555) 234-5678'
  },
  {
    id: '3',
    name: 'City Infrastructure LLC',
    specialty: 'General Infrastructure',
    rating: 4.6,
    activeJobs: 5,
    totalJobs: 78,
    contact: 'mike@cityinfra.com',
    phone: '(555) 345-6789'
  }
];

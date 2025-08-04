/**
 * Task-related types and mock data for the municipal system
 */

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskType = 'pothole_repair' | 'crack_sealing' | 'sign_maintenance' | 'street_cleaning' | 'inspection' | 'snow_removal' | 'general_maintenance';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  roadName?: string;
  segment?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  location: Location;
  assignedTo?: string;
  assignedContractor?: string;
  estimatedDuration: number; // in hours
  estimatedCost: number;
  actualCost?: number;
  scheduledDate: string;
  completedDate?: string;
  materials: string[];
  notes: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contractor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  specialties: TaskType[];
  rating: number;
  totalJobs: number;
  activeJobs: number;
  hourlyRate: number;
  isActive: boolean;
  lastActive: string;
}

// Mock data for development
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Pothole Repair on Main Street',
    description: 'Large pothole detected at intersection of Main St and 1st Ave. Requires immediate attention due to traffic safety concerns.',
    type: 'pothole_repair',
    status: 'pending',
    priority: 'high',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main Street',
      roadName: 'Main Street',
      segment: 'A-15'
    },
    assignedTo: 'contractor-1',
    assignedContractor: 'ABC Paving Solutions',
    estimatedDuration: 4,
    estimatedCost: 850,
    scheduledDate: '2024-01-20',
    materials: ['Hot mix asphalt', 'Tack coat', 'Safety cones'],
    notes: ['High traffic area - schedule during off-peak hours'],
    attachments: ['/images/pothole-main-st.jpg'],
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    title: 'Crack Sealing - Oak Avenue',
    description: 'Multiple linear cracks along Oak Avenue between 5th and 8th Streets. Preventive maintenance required.',
    type: 'crack_sealing',
    status: 'in_progress',
    priority: 'medium',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Oak Avenue',
      roadName: 'Oak Avenue',
      segment: 'B-22'
    },
    assignedTo: 'contractor-1',
    assignedContractor: 'ABC Paving Solutions',
    estimatedDuration: 6,
    estimatedCost: 1200,
    scheduledDate: '2024-01-18',
    materials: ['Hot pour crack sealant', 'Sand cover aggregate'],
    notes: ['Weather dependent - requires dry conditions'],
    attachments: ['/images/cracks-oak-ave.jpg'],
    createdAt: '2024-01-14T10:15:00Z',
    updatedAt: '2024-01-18T08:00:00Z'
  },
  {
    id: '3',
    title: 'Stop Sign Replacement',
    description: 'Damaged stop sign at Pine Road and Elm Street intersection. Sign is bent and partially obscured.',
    type: 'sign_maintenance',
    status: 'completed',
    priority: 'high',
    location: {
      latitude: 40.6892,
      longitude: -74.0445,
      address: '789 Pine Road',
      roadName: 'Pine Road',
      segment: 'C-08'
    },
    assignedTo: 'internal',
    estimatedDuration: 2,
    estimatedCost: 75,
    actualCost: 65,
    scheduledDate: '2024-01-16',
    completedDate: '2024-01-16',
    materials: ['Stop sign', 'Sign post', 'Concrete mix'],
    notes: ['Replaced during morning hours', 'No traffic disruption'],
    attachments: ['/images/stop-sign-before.jpg', '/images/stop-sign-after.jpg'],
    createdAt: '2024-01-15T11:45:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '4',
    title: 'Street Sweeping - Downtown District',
    description: 'Weekly street cleaning for downtown business district. Remove debris and litter.',
    type: 'street_cleaning',
    status: 'pending',
    priority: 'low',
    location: {
      latitude: 40.7250,
      longitude: -74.0000,
      address: 'Downtown District',
      roadName: 'Various Streets'
    },
    assignedTo: 'internal',
    estimatedDuration: 8,
    estimatedCost: 320,
    scheduledDate: '2024-01-22',
    materials: ['Street sweeper fuel', 'Water for dust control'],
    notes: ['Early morning schedule to avoid business hours'],
    attachments: [],
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '5',
    title: 'Bridge Inspection - Riverside Bridge',
    description: 'Monthly safety inspection of Riverside Bridge structure and railings.',
    type: 'inspection',
    status: 'on_hold',
    priority: 'medium',
    location: {
      latitude: 40.7400,
      longitude: -74.0200,
      address: 'Riverside Bridge',
      roadName: 'Bridge Road'
    },
    assignedTo: 'contractor-2',
    assignedContractor: 'Municipal Bridge Works',
    estimatedDuration: 3,
    estimatedCost: 450,
    scheduledDate: '2024-01-25',
    materials: ['Inspection equipment', 'Safety gear'],
    notes: ['Weather hold - high winds', 'Reschedule when conditions improve'],
    attachments: [],
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-19T09:15:00Z'
  }
];

export const mockContractors: Contractor[] = [
  {
    id: 'contractor-1',
    name: 'John Smith',
    company: 'ABC Paving Solutions',
    email: 'john@abcpaving.com',
    phone: '(555) 123-4567',
    specialties: ['pothole_repair', 'crack_sealing', 'general_maintenance'],
    rating: 4.8,
    totalJobs: 45,
    activeJobs: 3,
    hourlyRate: 85,
    isActive: true,
    lastActive: '2024-01-19T10:30:00Z'
  },
  {
    id: 'contractor-2',
    name: 'Sarah Johnson',
    company: 'Municipal Bridge Works',
    email: 'sarah@bridgeworks.com',
    phone: '(555) 234-5678',
    specialties: ['inspection', 'general_maintenance'],
    rating: 4.9,
    totalJobs: 12,
    activeJobs: 1,
    hourlyRate: 95,
    isActive: true,
    lastActive: '2024-01-18T16:45:00Z'
  },
  {
    id: 'contractor-3',
    name: 'Mike Rodriguez',
    company: 'City Infrastructure LLC',
    email: 'mike@cityinfra.com',
    phone: '(555) 345-6789',
    specialties: ['sign_maintenance', 'street_cleaning', 'snow_removal', 'general_maintenance'],
    rating: 4.6,
    totalJobs: 78,
    activeJobs: 5,
    hourlyRate: 75,
    isActive: true,
    lastActive: '2024-01-19T14:20:00Z'
  }
];

// Helper functions
export function getTaskById(id: string): Task | undefined {
  return mockTasks.find(task => task.id === id);
}

export function getContractorById(id: string): Contractor | undefined {
  return mockContractors.find(contractor => contractor.id === id);
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  return mockTasks.filter(task => task.status === status);
}

export function getTasksByContractor(contractorId: string): Task[] {
  return mockTasks.filter(task => task.assignedTo === contractorId);
}

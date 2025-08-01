/**
 * Shared code between client and server
 * Types for Road Inspection App
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Road defect types identified by AI
 */
export type DefectType = 'pothole' | 'crack' | 'low_pci' | 'surface_deterioration' | 'edge_cracking' | 'alligator_cracking';

/**
 * Severity levels for road defects
 */
export type SeverityLevel = 'low' | 'medium' | 'high';

/**
 * Repair suggestions from AI
 */
export type RepairSuggestion = 'overlay' | 'seal' | 'reconstruction' | 'patching' | 'crack_sealing' | 'none';

/**
 * Status of inspector review
 */
export type InspectionStatus = 'pending' | 'confirmed' | 'rejected' | 'adjusted';

/**
 * Location coordinate interface
 */
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  roadName?: string;
  segment?: string;
}

/**
 * AI-detected road issue
 */
export interface ScanIssue {
  id: string;
  imageUrl: string;
  overlayImageUrl?: string;
  issueType: DefectType;
  location: Location;
  pciScore: number;
  aiSuggestion: RepairSuggestion;
  status: InspectionStatus;
  aiConfidence: number;
  detectedAt: string;
  severity: SeverityLevel;
  dimensions?: {
    length: number;
    width: number;
    depth?: number;
  };
  metadata?: {
    weather?: string;
    temperature?: number;
    scanVehicleSpeed?: number;
  };
}

/**
 * Inspector notes and adjustments
 */
export interface InspectorNote {
  id: string;
  issueId: string;
  inspectorId: string;
  inspectorName: string;
  comments: string;
  photoUploads: string[];
  voiceNoteUrl?: string;
  adjustmentDetails?: {
    newIssueType?: DefectType;
    newSeverity?: SeverityLevel;
    newRepairSuggestion?: RepairSuggestion;
    locationCorrection?: Location;
  };
  gpsCheckIn?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    accuracy: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Repair task auto-generated after confirmation
 */
export interface RepairTask {
  id: string;
  issueId: string;
  title: string;
  description: string;
  repairType: RepairSuggestion;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  estimatedDuration: number; // in hours
  assignedTo?: 'internal' | 'contractor';
  assignedTeam?: string;
  scheduledDate?: string;
  completedDate?: string;
  materials: string[];
  location: Location;
  attachments: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

/**
 * Filtering options for the dashboard
 */
export interface FilterOptions {
  pciRange?: {
    min: number;
    max: number;
  };
  issueTypes?: DefectType[];
  severities?: SeverityLevel[];
  statuses?: InspectionStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  location?: {
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
}

/**
 * API response for fetching issues
 */
export interface GetIssuesResponse {
  issues: ScanIssue[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * API request for updating issue status
 */
export interface UpdateIssueRequest {
  status: InspectionStatus;
  note?: Omit<InspectorNote, 'id' | 'createdAt' | 'updatedAt'>;
}

/**
 * Statistics for the dashboard
 */
export interface DashboardStats {
  totalIssues: number;
  pendingReview: number;
  confirmedIssues: number;
  rejectedIssues: number;
  avgPciScore: number;
  issuesByType: Record<DefectType, number>;
  issuesBySeverity: Record<SeverityLevel, number>;
  recentActivity: {
    issuesReviewed: number;
    tasksCreated: number;
    period: string;
  };
}

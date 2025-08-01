import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  Users, 
  Clock, 
  DollarSign, 
  MapPin, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  User
} from 'lucide-react';
import { Task, Contractor, TaskStatus, mockContractors } from '../../shared/types';
import { cn } from '../lib/utils';

interface AdminTaskAssignmentProps {
  task: Task;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onAssign?: (taskId: string, contractorId: string) => void;
}

export function AdminTaskAssignment({ task, onUpdate, onAssign }: AdminTaskAssignmentProps) {
  const [selectedContractor, setSelectedContractor] = useState<string>(task.assignedTo || '');
  const [newStatus, setNewStatus] = useState<TaskStatus>(task.status);
  const [adminNotes, setAdminNotes] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const availableContractors = mockContractors.filter(contractor => 
    contractor.isActive && contractor.specialties.includes(task.type)
  );

  const handleAssignment = async () => {
    if (!selectedContractor) return;
    
    setIsAssigning(true);
    try {
      if (onAssign) {
        await onAssign(task.id, selectedContractor);
      }
      if (onUpdate) {
        await onUpdate(task.id, {
          assignedTo: selectedContractor,
          assignedContractor: mockContractors.find(c => c.id === selectedContractor)?.company,
          status: 'pending',
          ...(adminNotes && { notes: [...task.notes, `Admin: ${adminNotes}`] })
        });
      }
    } finally {
      setIsAssigning(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (onUpdate) {
      await onUpdate(task.id, {
        status: newStatus,
        ...(adminNotes && { notes: [...task.notes, `Admin: ${adminNotes}`] })
      });
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'on_hold':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Task Assignment & Management
        </CardTitle>
        <CardDescription>
          Assign contractors and manage task status for: {task.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Task Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <Badge variant="outline" className={cn("text-xs", getStatusColor(task.status))}>
              {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-gray-500" />
            <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
              {task.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">${task.estimatedCost}</span>
          </div>
        </div>

        {/* Location & Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{task.location.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Contractor Assignment */}
        <div className="space-y-4">
          <Label htmlFor="contractor-select">Assign Contractor</Label>
          <Select value={selectedContractor} onValueChange={setSelectedContractor}>
            <SelectTrigger id="contractor-select">
              <SelectValue placeholder="Select a contractor..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Internal Team
                </div>
              </SelectItem>
              {availableContractors.map((contractor) => (
                <SelectItem key={contractor.id} value={contractor.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{contractor.company}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="outline" className="text-xs">
                        ★ {contractor.rating}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        ${contractor.hourlyRate}/hr
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedContractor && selectedContractor !== 'internal' && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              {(() => {
                const contractor = mockContractors.find(c => c.id === selectedContractor);
                return contractor ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{contractor.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {contractor.activeJobs} active jobs
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Specialties: {contractor.specialties.join(', ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      Contact: {contractor.phone} | {contractor.email}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Status Update */}
        <div className="space-y-4">
          <Label htmlFor="status-select">Update Status</Label>
          <Select value={newStatus} onValueChange={(value: TaskStatus) => setNewStatus(value)}>
            <SelectTrigger id="status-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Admin Notes */}
        <div className="space-y-2">
          <Label htmlFor="admin-notes">Admin Notes</Label>
          <Textarea
            id="admin-notes"
            placeholder="Add administrative notes about this task..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleAssignment}
            disabled={!selectedContractor || isAssigning}
            className="flex-1"
          >
            {isAssigning ? 'Assigning...' : 'Assign Task'}
          </Button>
          <Button 
            onClick={handleStatusUpdate}
            variant="outline"
            disabled={newStatus === task.status && !adminNotes}
            className="flex-1"
          >
            Update Status
          </Button>
        </div>

        {/* Task History */}
        {task.notes.length > 0 && (
          <div className="space-y-2">
            <Label>Task History</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {task.notes.map((note, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded border">
                  {note}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

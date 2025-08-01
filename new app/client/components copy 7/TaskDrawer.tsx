import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, MapPin, Clock, Users, Settings2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

type TaskStatus = 'scheduled' | 'in-progress' | 'done' | 'emergency';
type Priority = 'high' | 'medium' | 'low';

interface RepairTask {
  id: string;
  roadName: string;
  segment: string;
  type: string;
  status: TaskStatus;
  priority: Priority;
  contractor: string;
  date: string;
  time: string;
  estimatedHours: number;
  notes?: string;
  photos?: string[];
}

interface TaskDrawerProps {
  task: RepairTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: RepairTask) => void;
  onDelete?: (taskId: string) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high': return 'bg-status-emergency text-white';
    case 'medium': return 'bg-status-progress text-black';
    case 'low': return 'bg-status-scheduled text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'done': return 'bg-status-done text-white';
    case 'in-progress': return 'bg-status-progress text-black';
    case 'emergency': return 'bg-status-emergency text-white';
    case 'scheduled': return 'bg-status-scheduled text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function TaskDrawer({ task, isOpen, onClose, onSave, onDelete }: TaskDrawerProps) {
  const [formData, setFormData] = useState<RepairTask>(
    task || {
      id: '',
      roadName: '',
      segment: '',
      type: '',
      status: 'scheduled',
      priority: 'medium',
      contractor: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '08:00',
      estimatedHours: 4,
      notes: '',
      photos: []
    }
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    task ? new Date(task.date) : new Date()
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const handleInputChange = (field: keyof RepairTask, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      handleInputChange('date', format(date, 'yyyy-MM-dd'));
      setShowCalendar(false);
    }
  };

  const handleSave = () => {
    if (!formData.roadName || !formData.segment || !formData.type || !formData.contractor) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    if (task) {
      setFormData(task);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            {task ? 'Edit Repair Task' : 'Create New Repair Task'}
          </SheetTitle>
          <SheetDescription>
            Manage road repair and maintenance tasks for your public works department.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value: TaskStatus) => handleInputChange('status', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-status-scheduled"></div>
                      Scheduled
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-status-progress"></div>
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="done">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-status-done"></div>
                      Completed
                    </div>
                  </SelectItem>
                  <SelectItem value="emergency">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-status-emergency"></div>
                      Emergency
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value: Priority) => handleInputChange('priority', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-status-emergency" />
                      High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-status-progress"></div>
                      Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-status-scheduled"></div>
                      Low Priority
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Road Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="roadName">Road Name *</Label>
              <Input
                id="roadName"
                value={formData.roadName}
                onChange={(e) => handleInputChange('roadName', e.target.value)}
                placeholder="e.g., Main Street"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="segment">Road Segment *</Label>
              <Input
                id="segment"
                value={formData.segment}
                onChange={(e) => handleInputChange('segment', e.target.value)}
                placeholder="e.g., Block 200-300"
                className="mt-1"
              />
            </div>
          </div>

          {/* Repair Type */}
          <div>
            <Label>Repair Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select repair type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pothole Repair">Pothole Repair</SelectItem>
                <SelectItem value="Crack Seal">Crack Seal</SelectItem>
                <SelectItem value="Overlay">Overlay</SelectItem>
                <SelectItem value="Striping">Striping</SelectItem>
                <SelectItem value="Patching">Patching</SelectItem>
                <SelectItem value="Resurfacing">Resurfacing</SelectItem>
                <SelectItem value="Drainage">Drainage Repair</SelectItem>
                <SelectItem value="Signage">Signage Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Scheduled Date</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Time Estimate */}
          <div>
            <Label htmlFor="estimatedHours">Time Estimate (hours)</Label>
            <Input
              id="estimatedHours"
              type="number"
              min="0.5"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>

          {/* Assigned Contractor */}
          <div>
            <Label>Assigned Contractor/Crew *</Label>
            <Select value={formData.contractor} onValueChange={(value) => handleInputChange('contractor', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select contractor or crew" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="City Crew A">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    City Crew A
                  </div>
                </SelectItem>
                <SelectItem value="City Crew B">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    City Crew B
                  </div>
                </SelectItem>
                <SelectItem value="ABC Paving Co.">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    ABC Paving Co.
                  </div>
                </SelectItem>
                <SelectItem value="XYZ Construction">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    XYZ Construction
                  </div>
                </SelectItem>
                <SelectItem value="Metro Road Services">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Metro Road Services
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes, special instructions, or observations..."
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <Label>Photos</Label>
            <div className="mt-1">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Upload before/after photos, damage documentation, or progress images
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button onClick={handleSave} className="flex-1">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            {task && onDelete && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

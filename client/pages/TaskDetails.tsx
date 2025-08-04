import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  MessageSquare,
  Phone,
  Mail,
  Star,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { mockTasks, mockContractors, TaskStatus } from '../../shared/types';
import { cn } from '../lib/utils';
import { AdminTaskAssignment } from '../components/AdminTaskAssignment';

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contractorNotes, setContractorNotes] = useState('');
  const [newStatus, setNewStatus] = useState<TaskStatus | ''>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = mockTasks.find(t => t.id === id);
  
  if (!task) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const contractor = task.assignedTo ? mockContractors.find(c => c.id === task.assignedTo) : null;

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'assigned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'accepted': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'verified': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'pothole': return '🕳️';
      case 'streetlight': return '💡';
      case 'sign_repair': return '🛑';
      case 'debris_removal': return '🗑️';
      case 'crack_sealing': return '🛣️';
      case 'line_painting': return '🎨';
      case 'drain_cleaning': return '🌊';
      default: return '⚙️';
    }
  };

  const getStatusProgress = (status: TaskStatus) => {
    switch (status) {
      case 'new': return 0;
      case 'assigned': return 20;
      case 'accepted': return 40;
      case 'in_progress': return 60;
      case 'completed': return 80;
      case 'verified': return 100;
      case 'overdue': return 60; // Same as in progress but different color
      default: return 0;
    }
  };

  const statusSteps = [
    { status: 'new', label: 'New', icon: AlertTriangle },
    { status: 'assigned', label: 'Assigned', icon: User },
    { status: 'accepted', label: 'Accepted', icon: CheckCircle },
    { status: 'in_progress', label: 'In Progress', icon: Clock },
    { status: 'completed', label: 'Completed', icon: CheckCircle },
    { status: 'verified', label: 'Verified', icon: CheckCircle }
  ];

  const canUpdateStatus = user?.role === 'contractor' && task.assignedTo === user.id;
  const canAssign = user?.role === 'admin';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedFiles(prev => [...prev, ...files].slice(0, 5)); // Limit to 5 files
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitUpdate = async () => {
    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app, would upload files and update task
    console.log('Updating task:', {
      taskId: task.id,
      notes: contractorNotes,
      status: newStatus,
      files: uploadedFiles
    });
    
    setIsSubmitting(false);
    setContractorNotes('');
    setNewStatus('');
    setUploadedFiles([]);
    
    // Show success message (in real app)
    alert('Task updated successfully!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getTaskIcon(task.type)}</span>
              <h1 className="text-3xl font-bold">{task.title}</h1>
            </div>
            <p className="text-muted-foreground text-lg">{task.description}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={cn("text-sm px-3 py-1", getStatusColor(task.status))}>
              {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={cn("text-sm px-3 py-1", getPriorityColor(task.priority))}>
              {task.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
        </div>

        {/* Status Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={getStatusProgress(task.status)} 
                className="h-2"
              />
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = getStatusProgress(step.status as TaskStatus) <= getStatusProgress(task.status);
                  const isCurrent = step.status === task.status;
                  
                  return (
                    <div key={step.status} className="flex flex-col items-center text-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mb-1 border-2",
                        isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground",
                        isCurrent && "ring-2 ring-primary ring-offset-2"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Information */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{task.location.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(task.deadline).toLocaleDateString()} at{' '}
                      {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Estimated Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {task.estimatedDuration} hour{task.estimatedDuration !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          {task.photos && task.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {task.photos.map((photo) => (
                    <div key={photo.id} className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {photo.type.replace('_', ' ')}
                        </Badge>
                        {photo.caption && (
                          <p className="text-sm text-muted-foreground mt-1">{photo.caption}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {task.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{task.notes}</p>
              </CardContent>
            </Card>
          )}

          {task.contractorNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Contractor Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{task.contractorNotes}</p>
              </CardContent>
            </Card>
          )}

          {/* Contractor Update Form */}
          {canUpdateStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Update Task</CardTitle>
                <CardDescription>
                  Update the task status and add notes or photos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as TaskStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accepted">Accept Task</SelectItem>
                      <SelectItem value="in_progress">Mark In Progress</SelectItem>
                      <SelectItem value="completed">Mark Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about the task progress..."
                    value={contractorNotes}
                    onChange={(e) => setContractorNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos">Upload Photos (up to 5)</Label>
                  <div className="space-y-4">
                    <Input
                      id="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      disabled={uploadedFiles.length >= 5}
                    />
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                              <Camera className="w-4 h-4" />
                              <span className="text-sm truncate max-w-32">{file.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="h-auto p-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitUpdate}
                  disabled={isSubmitting || (!newStatus && !contractorNotes && uploadedFiles.length === 0)}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Update Task
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Assignment Controls */}
          {user?.role === 'admin' && (
            <AdminTaskAssignment
              task={task}
              onTaskUpdate={(taskId, updates) => {
                // In real app, this would update the task via API
                console.log('Task updated:', taskId, updates);
              }}
            />
          )}

          {/* Assigned Contractor */}
          {contractor && user?.role === 'contractor' && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Contractor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {contractor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{contractor.name}</p>
                    <p className="text-sm text-muted-foreground">{contractor.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{contractor.rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({contractor.completedTasks} completed)
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    {contractor.phone}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    {contractor.email}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              {user?.role === 'admin' && (
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Reassign Task
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Task Info */}
          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Task ID:</span>
                <span className="font-mono">#{task.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{task.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

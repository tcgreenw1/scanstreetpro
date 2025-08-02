import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  CalendarDays,
  Clock,
  Users,
  Wrench,
  Cloud,
  CloudRain,
  Sun,
  DollarSign,
  Camera,
  Plus,
  Edit,
  Trash2,
  Crown,
  AlertTriangle,
  CheckCircle,
  FileText,
  MapPin,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  contractor: string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  scheduledDate: string;
  estimatedDuration: number; // hours
  estimatedCost: number;
  actualCost?: number;
  progress: number; // percentage
  materials: string[];
  weatherSensitive: boolean;
  photos?: string[];
  assignedCrew: string;
  pciScore?: number;
}

const mockTasks: MaintenanceTask[] = [
  {
    id: 'TASK-001',
    title: 'Pothole Repair - Main Street',
    description: 'Fill and seal 6 potholes identified during last inspection',
    assetId: 'ROAD-001',
    assetName: 'Main Street (Block 100-200)',
    contractor: 'City Crew A',
    priority: 'high',
    status: 'scheduled',
    scheduledDate: '2023-12-18',
    estimatedDuration: 4,
    estimatedCost: 850,
    progress: 0,
    materials: ['Hot Mix Asphalt', 'Tack Coat', 'Traffic Cones'],
    weatherSensitive: true,
    assignedCrew: 'Road Maintenance Team 1',
    pciScore: 45
  },
  {
    id: 'TASK-002',
    title: 'Crack Sealing - Oak Avenue',
    description: 'Preventive crack sealing to extend pavement life',
    assetId: 'ROAD-002',
    assetName: 'Oak Avenue (Mile 1-2)',
    contractor: 'ABC Paving Co.',
    priority: 'medium',
    status: 'in-progress',
    scheduledDate: '2023-12-16',
    estimatedDuration: 8,
    estimatedCost: 1250,
    actualCost: 1180,
    progress: 65,
    materials: ['Crack Sealant', 'Sand', 'Safety Equipment'],
    weatherSensitive: true,
    assignedCrew: 'ABC Crew 2',
    pciScore: 72
  },
  {
    id: 'TASK-003',
    title: 'Sign Replacement - School Zone',
    description: 'Replace damaged speed limit signs near elementary school',
    assetId: 'SIGN-001',
    assetName: 'School Zone Signs - Elm Street',
    contractor: 'Sign Masters LLC',
    priority: 'high',
    status: 'completed',
    scheduledDate: '2023-12-14',
    estimatedDuration: 2,
    estimatedCost: 350,
    actualCost: 325,
    progress: 100,
    materials: ['Speed Limit Signs', 'Posts', 'Concrete Mix'],
    weatherSensitive: false,
    assignedCrew: 'Sign Installation Team'
  },
  {
    id: 'TASK-004',
    title: 'Drainage Cleaning - Pine Street',
    description: 'Clean storm drains and remove debris blocking water flow',
    assetId: 'DRAIN-001',
    assetName: 'Pine Street Storm Drains',
    contractor: 'City Crew B',
    priority: 'medium',
    status: 'delayed',
    scheduledDate: '2023-12-15',
    estimatedDuration: 6,
    estimatedCost: 450,
    progress: 20,
    materials: ['Vacuum Truck', 'Safety Gear', 'Disposal Bags'],
    weatherSensitive: false,
    assignedCrew: 'Drainage Maintenance Team',
    pciScore: 68
  }
];

const contractors = [
  'City Crew A',
  'City Crew B', 
  'ABC Paving Co.',
  'Sign Masters LLC',
  'XYZ Construction',
  'Elite Maintenance'
];

const weatherConditions = [
  { date: '2023-12-15', condition: 'sunny', temp: 45, suitable: true },
  { date: '2023-12-16', condition: 'cloudy', temp: 38, suitable: true },
  { date: '2023-12-17', condition: 'rainy', temp: 35, suitable: false },
  { date: '2023-12-18', condition: 'partly-cloudy', temp: 42, suitable: true },
  { date: '2023-12-19', condition: 'sunny', temp: 48, suitable: true },
  { date: '2023-12-20', condition: 'rainy', temp: 33, suitable: false },
  { date: '2023-12-21', condition: 'sunny', temp: 50, suitable: true }
];

export default function MaintenanceScheduler() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2023-12-15');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const { currentPlan } = usePricing();

  const getDaysInWeek = (startDate: string) => {
    const start = new Date(startDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day.toISOString().split('T')[0]);
    }
    return days;
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.scheduledDate === date);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return Sun;
      case 'cloudy': return Cloud;
      case 'rainy': return CloudRain;
      case 'partly-cloudy': return Cloud;
      default: return Cloud;
    }
  };

  const getWeatherForDate = (date: string) => {
    return weatherConditions.find(w => w.date === date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<MaintenanceTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const weekDays = getDaysInWeek('2023-12-15');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Maintenance Scheduler</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Schedule, track, and assign maintenance tasks with weather-aware planning
          </p>
          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
            {tasks.length} Active Tasks
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={viewMode} onValueChange={(value: 'calendar' | 'list') => setViewMode(value)}>
            <SelectTrigger className="w-[120px] glass-card border-white/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl glass-card border-white/20">
              <DialogHeader>
                <DialogTitle>Create New Maintenance Task</DialogTitle>
                <DialogDescription>
                  Schedule a new maintenance task with automated asset condition integration
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Task Title</Label>
                  <Input placeholder="e.g., Pothole Repair" className="glass-card border-white/30" />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger className="glass-card border-white/30">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Contractor</Label>
                  <Select>
                    <SelectTrigger className="glass-card border-white/30">
                      <SelectValue placeholder="Select contractor" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractors.map(contractor => (
                        <SelectItem key={contractor} value={contractor}>{contractor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <Input type="date" className="glass-card border-white/30" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                <Button onClick={() => setIsAddingTask(false)}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800 dark:text-white">
              <CalendarDays className="w-5 h-5 mr-2" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Drag and drop tasks to reschedule. Weather icons indicate suitability for outdoor work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((date, index) => {
                const dayTasks = getTasksForDate(date);
                const weather = getWeatherForDate(date);
                const WeatherIcon = weather ? getWeatherIcon(weather.condition) : Cloud;
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                const dayNumber = new Date(date).getDate();
                
                return (
                  <div key={date} className="min-h-[300px]">
                    {/* Day Header */}
                    <div className="p-3 bg-white/40 dark:bg-white/10 rounded-t-lg border border-white/30">
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{dayName}</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">{dayNumber}</p>
                        {weather && (
                          <div className="flex items-center justify-center mt-1">
                            <WeatherIcon className={cn(
                              "w-4 h-4 mr-1",
                              weather.suitable ? "text-green-500" : "text-red-500"
                            )} />
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {weather.temp}°F
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tasks for this day */}
                    <div className="p-2 bg-white/20 dark:bg-white/5 rounded-b-lg border-l border-r border-b border-white/30 min-h-[250px] space-y-2">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-2 glass-card border-white/20 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200"
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-xs font-medium text-slate-800 dark:text-white line-clamp-2">
                              {task.title}
                            </h4>
                            {task.weatherSensitive && weather && !weather.suitable && (
                              <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{task.estimatedDuration}h</span>
                          </div>
                          <div className="mt-1">
                            <Badge variant="outline" className={cn("text-xs", getStatusColor(task.status))}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add task dropzone */}
                      <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center opacity-50 hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 mx-auto text-slate-400 dark:text-slate-500" />
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Drop task here</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-4xl glass-card border-white/20">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTask.title}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={cn("text-xs", getPriorityColor(selectedTask.priority))}>
                    {selectedTask.priority} priority
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(selectedTask.status))}>
                    {selectedTask.status}
                  </Badge>
                </div>
              </DialogTitle>
              <DialogDescription>Task ID: {selectedTask.id}</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              {/* Task Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Task Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Asset:</span>
                      <span className="font-medium text-slate-800 dark:text-white">{selectedTask.assetName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Contractor:</span>
                      <span className="font-medium text-slate-800 dark:text-white">{selectedTask.contractor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Crew:</span>
                      <span className="font-medium text-slate-800 dark:text-white">{selectedTask.assignedCrew}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                      <span className="font-medium text-slate-800 dark:text-white">{selectedTask.estimatedDuration} hours</span>
                    </div>
                    {selectedTask.pciScore && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Current PCI:</span>
                        <span className="font-medium text-slate-800 dark:text-white">{selectedTask.pciScore}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Description</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedTask.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Required Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.materials.map((material, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Package className="w-3 h-3 mr-1" />
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Progress and Cost Tracking */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Progress Tracking</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Completion</span>
                        <span className="font-medium text-slate-800 dark:text-white">{selectedTask.progress}%</span>
                      </div>
                      <Progress value={selectedTask.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-blue-600 dark:text-blue-400 text-xs">Estimated Cost</p>
                        <p className="font-bold text-blue-800 dark:text-blue-300">
                          ${selectedTask.estimatedCost.toLocaleString()}
                        </p>
                      </div>
                      {selectedTask.actualCost && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-green-600 dark:text-green-400 text-xs">Actual Cost</p>
                          <p className="font-bold text-green-800 dark:text-green-300">
                            ${selectedTask.actualCost.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Weather Sensitivity</h4>
                  <div className="flex items-center space-x-2">
                    {selectedTask.weatherSensitive ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <CloudRain className="w-3 h-3 mr-1" />
                        Weather Sensitive
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        All Weather
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Add Photos
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Update Progress
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Location
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>Close</Button>
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Scheduled Tasks</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {tasks.filter(t => t.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  ${tasks.reduce((sum, task) => sum + task.estimatedCost, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features Notice */}
      {currentPlan === 'free' && (
        <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Unlock Advanced Scheduling Features
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                Upgrade to access drag-and-drop scheduling, automated task generation from PCI scores, 
                advanced weather integration, and unlimited contractor management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <CalendarDays className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Drag & Drop Calendar</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Visual scheduling interface</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Cloud className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Weather Integration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automatic weather conflict detection</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/30">
                  <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-800 dark:text-white">Unlimited Contractors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manage any number of crews</p>
                </div>
              </div>
              
              <Button 
                onClick={handleUpgrade}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade for Advanced Scheduling
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

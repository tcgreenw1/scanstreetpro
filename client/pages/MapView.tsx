import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  MapPin, 
  Search, 
  Filter, 
  List,
  Navigation,
  Phone,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { mockTasks, TaskStatus } from '../../shared/types';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function MapView() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Filter tasks based on user role
  const userTasks = user?.role === 'contractor' 
    ? mockTasks.filter(task => task.assignedTo === user.id)
    : mockTasks;

  // Apply filters
  const filteredTasks = userTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      case 'urgent': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
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

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Map View</h1>
          <p className="text-muted-foreground">
            View all tasks on an interactive map
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <List className="w-4 h-4 mr-2" />
              List View
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Task List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Task List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Tasks ({filteredTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0 max-h-96 overflow-y-auto">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedTask === task.id && "bg-primary/5 border-primary"
                    )}
                    onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm">{getTaskIcon(task.type)}</span>
                          <h4 className="font-medium text-sm truncate">{task.title}</h4>
                        </div>
                        <Badge className={cn("text-xs flex-shrink-0", getStatusColor(task.status))}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{task.location.address}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className={cn("flex items-center gap-1", getPriorityColor(task.priority))}>
                          <AlertTriangle className="w-3 h-3" />
                          <span className="capitalize">{task.priority}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="p-6 text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No tasks found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Task Locations</CardTitle>
              <CardDescription>
                Interactive map showing all task locations. Click on a task in the list to highlight it on the map.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              {/* Placeholder for map */}
              <div className="w-full h-full bg-muted rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                {/* Mock map background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 h-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-gray-300 dark:border-gray-700" />
                    ))}
                  </div>
                </div>

                {/* Mock task pins */}
                <div className="absolute inset-0">
                  {filteredTasks.slice(0, 5).map((task, index) => (
                    <div 
                      key={task.id}
                      className={cn(
                        "absolute flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-all",
                        selectedTask === task.id 
                          ? "bg-primary border-primary-foreground scale-125 z-10" 
                          : "bg-background border-primary hover:scale-110",
                        task.priority === 'urgent' && "ring-2 ring-red-400",
                        task.priority === 'high' && "ring-2 ring-orange-400"
                      )}
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${30 + (index * 10)}%`
                      }}
                      onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                    >
                      <span className="text-xs">{getTaskIcon(task.type)}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center z-20 bg-background/80 backdrop-blur-sm rounded-lg p-6">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    This would display a real map (Google Maps, Mapbox, etc.) showing task locations with interactive pins.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Navigation className="w-4 h-4" />
                    <span>Click tasks in the sidebar to highlight them on the map</span>
                  </div>
                </div>

                {/* Selected task popup */}
                {selectedTask && (
                  <div className="absolute bottom-4 left-4 right-4 z-30">
                    {(() => {
                      const task = filteredTasks.find(t => t.id === selectedTask);
                      if (!task) return null;
                      
                      return (
                        <Card className="shadow-lg">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span>{getTaskIcon(task.type)}</span>
                                  <h4 className="font-semibold truncate">{task.title}</h4>
                                  <Badge className={cn("text-xs", getStatusColor(task.status))}>
                                    {task.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {task.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{task.location.address}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button size="sm" asChild>
                                  <Link to={`/task/${task.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Navigation className="w-4 h-4 mr-2" />
                                  Directions
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

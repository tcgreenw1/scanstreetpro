import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CalendarDays,
  List,
  Map,
  Search,
  Filter,
  Plus,
  FileDown,
  Crown,
  ChevronLeft,
  ChevronRight,
  Settings2,
  MapPin,
  Clock,
  Users
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CalendarView from '@/components/CalendarView';
import TaskDrawer from '@/components/TaskDrawer';

type ViewType = 'calendar' | 'list' | 'map';
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
  location: { lat: number; lng: number };
}

const mockTasks: RepairTask[] = [
  {
    id: '1',
    roadName: 'Main Street',
    segment: 'Block 200-300',
    type: 'Pothole Repair',
    status: 'scheduled',
    priority: 'high',
    contractor: 'ABC Paving Co.',
    date: '2024-01-15',
    time: '08:00',
    estimatedHours: 4,
    location: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: '2',
    roadName: 'Oak Avenue',
    segment: 'Block 100-150',
    type: 'Crack Seal',
    status: 'in-progress',
    priority: 'medium',
    contractor: 'City Crew A',
    date: '2024-01-15',
    time: '09:30',
    estimatedHours: 6,
    location: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: '3',
    roadName: 'Elm Street',
    segment: 'Block 50-100',
    type: 'Overlay',
    status: 'done',
    priority: 'low',
    contractor: 'XYZ Construction',
    date: '2024-01-14',
    time: '07:00',
    estimatedHours: 8,
    location: { lat: 40.7505, lng: -73.9934 }
  }
];

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'done': return 'bg-status-done text-white';
    case 'in-progress': return 'bg-status-progress text-black';
    case 'emergency': return 'bg-status-emergency text-white';
    case 'scheduled': return 'bg-status-scheduled text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high': return 'border-l-status-emergency';
    case 'medium': return 'border-l-status-progress';
    case 'low': return 'border-l-status-scheduled';
    default: return 'border-l-muted';
  }
};

export default function Index() {
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedContractor, setSelectedContractor] = useState('all');
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(true);
  const [selectedTask, setSelectedTask] = useState<RepairTask | null>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [tasks, setTasks] = useState<RepairTask[]>(mockTasks);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.segment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAsset = selectedAssetType === 'all' || task.type === selectedAssetType;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesContractor = selectedContractor === 'all' || task.contractor === selectedContractor;

    return matchesSearch && matchesAsset && matchesStatus && matchesPriority && matchesContractor;
  });

  const handleTaskClick = (task: RepairTask) => {
    setSelectedTask(task);
    setIsTaskDrawerOpen(true);
  };

  const handleTaskSave = (task: RepairTask) => {
    if (task.id) {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    } else {
      const newTask = { ...task, id: Date.now().toString() };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const handleTaskMove = (taskId: string, newDate: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, date: newDate } : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsTaskDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-[Segoe_UI,_ui-sans-serif,_system-ui]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Maintenance Scheduler</h1>
              <p className="text-sm text-muted-foreground">Public Works Department Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddNewTask}>
              <Plus className="w-4 h-4 mr-2" />
              Add Repair
            </Button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search roads or segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-input bg-background"
              />
            </div>

            <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Pothole Repair">Pothole</SelectItem>
                <SelectItem value="Crack Seal">Crack Seal</SelectItem>
                <SelectItem value="Overlay">Overlay</SelectItem>
                <SelectItem value="Striping">Striping</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedContractor} onValueChange={setSelectedContractor}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Contractor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contractors</SelectItem>
                <SelectItem value="ABC Paving Co.">ABC Paving Co.</SelectItem>
                <SelectItem value="City Crew A">City Crew A</SelectItem>
                <SelectItem value="XYZ Construction">XYZ Construction</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* View Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={currentView === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('calendar')}
                className="h-8"
              >
                <CalendarDays className="w-4 h-4 mr-1" />
                Calendar
              </Button>
              <Button
                variant={currentView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('list')}
                className="h-8"
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
              <Button
                variant={currentView === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('map')}
                className="h-8"
              >
                <Map className="w-4 h-4 mr-1" />
                Map
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Task List Panel - Collapsible Sidebar */}
        <div className={`${isTaskPanelOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-border bg-background overflow-hidden`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">Repair Tasks</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTaskPanelOpen(!isTaskPanelOpen)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{filteredTasks.length} tasks found</p>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            <div className="p-4 space-y-3">
              {filteredTasks.map((task) => (
                <Card key={task.id} className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(task.priority)}`} onClick={() => handleTaskClick(task)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm text-foreground">{task.roadName}</h4>
                        <p className="text-xs text-muted-foreground">{task.segment}</p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                        {task.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Settings2 className="w-3 h-3 mr-1" />
                        {task.type}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        {task.contractor}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.date} at {task.time}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Button for Collapsed Panel */}
        {!isTaskPanelOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTaskPanelOpen(true)}
            className="absolute left-2 top-32 z-40 h-8 w-8 p-0 bg-background shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {/* Main View Area */}
        <div className="flex-1 p-6 overflow-hidden">
          {currentView === 'calendar' && (
            <div className="h-full">
              <CalendarView
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                onTaskMove={handleTaskMove}
              />
            </div>
          )}

          {currentView === 'list' && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>List View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="font-medium">{task.roadName} - {task.segment}</h3>
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                              <Badge variant="outline">{task.priority} priority</Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Settings2 className="w-4 h-4" />
                                {task.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {task.contractor}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {task.date} at {task.time} ({task.estimatedHours}h)
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleTaskClick(task)}>
                            Edit Task
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {currentView === 'map' && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Map View</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive map with task locations</p>
                    <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Limit 5 tasks/month on free plan
            </div>
            <Button size="sm" className="bg-emerald hover:bg-emerald/90 text-white">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={handleAddNewTask}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Task Drawer */}
      <TaskDrawer
        task={selectedTask}
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
      />
    </div>
  );
}

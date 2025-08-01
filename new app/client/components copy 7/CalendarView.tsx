import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Users, MapPin } from 'lucide-react';

type CalendarViewType = 'week' | 'month';
type TaskStatus = 'scheduled' | 'in-progress' | 'done' | 'emergency';

interface RepairTask {
  id: string;
  roadName: string;
  segment: string;
  type: string;
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  contractor: string;
  date: string;
  time: string;
  estimatedHours: number;
}

interface CalendarViewProps {
  tasks: RepairTask[];
  onTaskClick?: (task: RepairTask) => void;
  onTaskMove?: (taskId: string, newDate: string) => void;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'done': return 'bg-status-done border-status-done text-white';
    case 'in-progress': return 'bg-status-progress border-status-progress text-black';
    case 'emergency': return 'bg-status-emergency border-status-emergency text-white';
    case 'scheduled': return 'bg-status-scheduled border-status-scheduled text-white';
    default: return 'bg-muted border-muted text-muted-foreground';
  }
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  
  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  
  return days;
};

const getWeekDays = (date: Date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  
  return days;
};

export default function CalendarView({ tasks, onTaskClick, onTaskMove }: CalendarViewProps) {
  const [viewType, setViewType] = useState<CalendarViewType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedTask, setDraggedTask] = useState<RepairTask | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const handleDragStart = (e: React.DragEvent, task: RepairTask) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, date: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, date: string) => {
    e.preventDefault();
    if (draggedTask && onTaskMove) {
      onTaskMove(draggedTask.id, date);
    }
    setDraggedTask(null);
    setDragOverDate(null);
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.date === date);
  };

  const renderTaskCard = (task: RepairTask, isCompact = false) => (
    <div
      key={task.id}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onClick={() => onTaskClick?.(task)}
      className={`${getStatusColor(task.status)} rounded-md p-2 mb-1 cursor-pointer hover:shadow-md transition-all border text-xs ${
        isCompact ? 'h-auto' : 'min-h-[60px]'
      } group relative`}
    >
      <div className="font-medium truncate">{task.roadName}</div>
      {!isCompact && (
        <>
          <div className="text-[10px] opacity-80 truncate">{task.segment}</div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] opacity-80">{task.time}</span>
            <span className="text-[10px] opacity-80">{task.estimatedHours}h</span>
          </div>
        </>
      )}
      
      {/* Tooltip */}
      <div className="absolute z-50 bottom-full left-0 mb-2 p-3 bg-popover border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-[200px]">
        <div className="font-medium">{task.roadName} - {task.segment}</div>
        <div className="text-xs text-muted-foreground mt-1 space-y-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {task.type}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {task.contractor}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {task.time} ({task.estimatedHours} hours)
          </div>
        </div>
      </div>
    </div>
  );

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className={`bg-muted/50 p-2 text-center text-sm font-medium ${
            index === 0 || index === 6 ? 'text-muted-foreground' : 'text-foreground'
          }`}>
            {day}
          </div>
        ))}
        
        {weekDays.map((day) => {
          const dateStr = formatDate(day);
          const dayTasks = getTasksForDate(dateStr);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const isToday = formatDate(day) === formatDate(new Date());
          
          return (
            <div
              key={dateStr}
              className={`bg-background min-h-[200px] p-2 ${
                isWeekend ? 'bg-muted/30' : ''
              } ${
                dragOverDate === dateStr ? 'bg-accent/50' : ''
              } ${
                isToday ? 'ring-2 ring-primary' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              <div className={`text-sm font-medium mb-2 ${
                isToday ? 'text-primary' : isWeekend ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayTasks.map(task => renderTaskCard(task))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDays = getDaysInMonth(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className={`bg-muted/50 p-2 text-center text-sm font-medium ${
            index === 0 || index === 6 ? 'text-muted-foreground' : 'text-foreground'
          }`}>
            {day}
          </div>
        ))}
        
        {monthDays.map((day) => {
          const dateStr = formatDate(day);
          const dayTasks = getTasksForDate(dateStr);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const isToday = formatDate(day) === formatDate(new Date());
          
          return (
            <div
              key={dateStr}
              className={`bg-background min-h-[120px] p-1 ${
                !isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''
              } ${
                isWeekend && isCurrentMonth ? 'bg-muted/30' : ''
              } ${
                dragOverDate === dateStr ? 'bg-accent/50' : ''
              } ${
                isToday ? 'ring-2 ring-primary' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-primary' : ''
              }`}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map(task => renderTaskCard(task, true))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getDateRangeText = () => {
    if (viewType === 'week') {
      const weekDays = getWeekDays(currentDate);
      return `${weekDays[0].toLocaleDateString()} - ${weekDays[6].toLocaleDateString()}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{getDateRangeText()}</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewType === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('week')}
          >
            Week
          </Button>
          <Button
            variant={viewType === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('month')}
          >
            Month
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {viewType === 'week' ? renderWeekView() : renderMonthView()}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs">
        <span className="text-muted-foreground">Status:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-status-scheduled"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-status-progress"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-status-done"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-status-emergency"></div>
          <span>Emergency</span>
        </div>
      </div>
    </div>
  );
}

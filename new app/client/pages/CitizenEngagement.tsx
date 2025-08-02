import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  MessageSquare,
  Camera,
  MapPin,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Mail,
  Smartphone,
  Crown,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Copy,
  Star,
  Flag,
  Wrench,
  Zap,
  Droplets,
  Construction
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePricing } from "@/contexts/PricingContext";

// Sample data
const recentSubmissions = [
  {
    id: 'RPT-001',
    title: 'Large pothole on Main Street',
    category: 'pothole',
    location: '123 Main St, Downtown',
    status: 'resolved',
    priority: 'high',
    submitted: '2023-12-15',
    assignedTo: 'Road Crew A',
    estimatedCompletion: '2023-12-20',
    description: 'Deep pothole causing vehicle damage near the school zone.'
  },
  {
    id: 'RPT-002', 
    title: 'Stop sign damaged by storm',
    category: 'signage',
    location: '456 Oak Ave, Residential',
    status: 'scheduled',
    priority: 'medium',
    submitted: '2023-12-14',
    assignedTo: 'Sign Maintenance',
    estimatedCompletion: '2023-12-22',
    description: 'Stop sign bent at intersection after recent windstorm.'
  },
  {
    id: 'RPT-003',
    title: 'Street flooding during rain',
    category: 'flooding',
    location: '789 Pine St, Commercial',
    status: 'in-progress',
    priority: 'high',
    submitted: '2023-12-13',
    assignedTo: 'Drainage Team',
    estimatedCompletion: '2023-12-25',
    description: 'Water pools across entire street width during moderate rainfall.'
  },
  {
    id: 'RPT-004',
    title: 'Crack in sidewalk',
    category: 'sidewalk',
    location: '321 Elm St, School Zone',
    status: 'queued',
    priority: 'low',
    submitted: '2023-12-12',
    assignedTo: 'Unassigned',
    estimatedCompletion: 'TBD',
    description: 'Trip hazard developing in front of elementary school.'
  }
];

const categoryTrends = [
  { category: 'Potholes', count: 45, trend: 12, color: '#EF4444' },
  { category: 'Signs Down', count: 23, trend: -3, color: '#F59E0B' },
  { category: 'Flooding', count: 18, trend: 8, color: '#3B82F6' },
  { category: 'Sidewalk Issues', count: 31, trend: 5, color: '#10B981' },
  { category: 'Streetlight Out', count: 15, trend: -2, color: '#8B5CF6' },
  { category: 'Other', count: 12, trend: 1, color: '#6B7280' }
];

const monthlySubmissions = [
  { month: 'Jul', count: 28 },
  { month: 'Aug', count: 35 },
  { month: 'Sep', count: 42 },
  { month: 'Oct', count: 38 },
  { month: 'Nov', count: 51 },
  { month: 'Dec', count: 47 }
];

const statusColors = {
  'queued': 'bg-gray-100 text-gray-800 border-gray-200',
  'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'resolved': 'bg-green-100 text-green-800 border-green-200'
};

const priorityColors = {
  'low': 'bg-green-100 text-green-800 border-green-200',
  'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'high': 'bg-red-100 text-red-800 border-red-200'
};

const categoryIcons = {
  'pothole': Wrench,
  'signage': Flag,
  'flooding': Droplets,
  'sidewalk': Construction,
  'streetlight': Zap,
  'other': AlertTriangle
};

export default function CitizenEngagement() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    email: '',
    phone: '',
    photo: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(3); // Current month submissions
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentPlan } = usePricing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPlan === 'free' && submissionCount >= 5) {
      alert('Free plan limit reached! Upgrade to submit unlimited reports.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmissionCount(prev => prev + 1);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      title: '',
      category: '',
      location: '',
      description: '',
      email: '',
      phone: '',
      photo: null
    });
    
    alert('Thank you! Your report has been submitted. You will receive updates via email and SMS.');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, this would reverse geocode to get address
          setFormData(prev => ({ 
            ...prev, 
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)} (GPS Captured)` 
          }));
        },
        (error) => {
          alert('Unable to capture location. Please enter address manually.');
        }
      );
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued': return Clock;
      case 'scheduled': return Calendar;
      case 'in-progress': return Construction;
      case 'resolved': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Citizen Engagement Portal
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Report road issues, track progress, and stay informed about infrastructure improvements in your community.
        </p>
        <Badge variant="outline" className="mt-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
          {submissionCount}/5 reports this month {currentPlan === 'free' ? '(Free Plan)' : '(Unlimited)'}
        </Badge>
      </div>

      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-card border-white/20">
          <TabsTrigger value="submit">Submit Report</TabsTrigger>
          <TabsTrigger value="track">Track Issues</TabsTrigger>
          <TabsTrigger value="analytics">Community Analytics</TabsTrigger>
        </TabsList>

        {/* Submit Report Tab */}
        <TabsContent value="submit" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <MessageSquare className="w-5 h-5 mr-2" />
                Report an Issue
              </CardTitle>
              <CardDescription>
                Help us maintain your roads by reporting issues you encounter. Include photos when possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="glass-card border-white/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      required
                    >
                      <SelectTrigger className="glass-card border-white/30">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/20">
                        <SelectItem value="pothole">Pothole</SelectItem>
                        <SelectItem value="signage">Sign Down/Damaged</SelectItem>
                        <SelectItem value="flooding">Street Flooding</SelectItem>
                        <SelectItem value="sidewalk">Sidewalk Issue</SelectItem>
                        <SelectItem value="streetlight">Streetlight Out</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Street address or intersection"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                      className="glass-card border-white/30 flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleLocationCapture}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      GPS
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click GPS to automatically capture your current location
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide details about the issue, including severity and any safety concerns"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    className="glass-card border-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/20"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {formData.photo && (
                      <span className="text-sm text-green-600 dark:text-green-400">
                        ✓ {formData.photo.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Photos help our crews understand and prioritize issues more effectively
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email for Updates</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="glass-card border-white/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">SMS Updates (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="glass-card border-white/30"
                    />
                  </div>
                </div>

                {currentPlan === 'free' && submissionCount >= 5 && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start space-x-3">
                      <Crown className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200">Monthly Limit Reached</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          You've reached the 5 report limit for free accounts this month. Upgrade for unlimited submissions.
                        </p>
                        <Button 
                          type="button"
                          size="sm" 
                          className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                          onClick={handleUpgrade}
                        >
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting || (currentPlan === 'free' && submissionCount >= 5)}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Construction className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Track Issues Tab */}
        <TabsContent value="track" className="space-y-6">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-800 dark:text-white">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Issue Tracking
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Track the status of reported issues and view estimated completion times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission) => {
                  const StatusIcon = getStatusIcon(submission.status);
                  const CategoryIcon = categoryIcons[submission.category as keyof typeof categoryIcons] || AlertTriangle;
                  
                  return (
                    <div key={submission.id} className="p-4 glass-card border-white/20 rounded-lg hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <CategoryIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 dark:text-white">{submission.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{submission.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className={cn("text-xs", statusColors[submission.status as keyof typeof statusColors])}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </Badge>
                              <Badge variant="outline" className={cn("text-xs", priorityColors[submission.priority as keyof typeof priorityColors])}>
                                {submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{submission.id}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800">
                              <Copy className="w-3 h-3 mr-1" />
                              Copy ID
                            </Button>
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Submitted:</p>
                          <p className="font-medium text-slate-800 dark:text-white">{submission.submitted}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Assigned To:</p>
                          <p className="font-medium text-slate-800 dark:text-white">{submission.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Est. Completion:</p>
                          <p className="font-medium text-slate-800 dark:text-white">{submission.estimatedCompletion}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{submission.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issue Categories */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Issue Categories
                </CardTitle>
                <CardDescription>
                  Most reported issues in your community this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryTrends.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/30 dark:bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-slate-800 dark:text-white">{category.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 dark:text-white">{category.count}</span>
                        <div className={cn(
                          "flex items-center text-xs px-2 py-1 rounded-full",
                          category.trend > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        )}>
                          {category.trend > 0 ? '+' : ''}{category.trend}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Submissions Chart */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <BarChart className="w-5 h-5 mr-2" />
                  Monthly Submission Trends
                </CardTitle>
                <CardDescription>
                  Community engagement over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySubmissions}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                      />
                      <Tooltip />
                      <Bar 
                        dataKey="count" 
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Impact Stats */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800 dark:text-white">
                <Star className="w-5 h-5 mr-2" />
                Community Impact
              </CardTitle>
              <CardDescription>
                How citizen reports are making a difference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">87%</div>
                  <div className="text-sm text-green-700 dark:text-green-300 font-medium">Issues Resolved</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">This year</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5.2</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Avg Response Days</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">From report to action</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">342</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Total Reports</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Last 6 months</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">4.8</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Satisfaction Rating</div>
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Out of 5 stars</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

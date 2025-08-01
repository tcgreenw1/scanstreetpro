import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Eye, 
  MapPin, 
  Camera,
  AlertTriangle,
  Clock,
  Wrench,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";
import { ScanIssue, InspectionStatus } from "@shared/api";

interface IssuesTableProps {
  issues: ScanIssue[];
  viewMode: 'table' | 'grid';
  selectedIssues: string[];
  onSelectionChange: (selected: string[]) => void;
  onIssueUpdate: (issueId: string, updates: Partial<ScanIssue>) => void;
}

export function IssuesTable({ 
  issues, 
  viewMode, 
  selectedIssues, 
  onSelectionChange, 
  onIssueUpdate 
}: IssuesTableProps) {
  const [sortBy, setSortBy] = useState<keyof ScanIssue>('detectedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? issues.map(issue => issue.id) : []);
  };

  const handleSelectIssue = (issueId: string, checked: boolean) => {
    onSelectionChange(
      checked 
        ? [...selectedIssues, issueId]
        : selectedIssues.filter(id => id !== issueId)
    );
  };

  const handleStatusUpdate = (issueId: string, status: InspectionStatus) => {
    onIssueUpdate(issueId, { status });
  };

  const getStatusColor = (status: InspectionStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'adjusted': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPciColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 55) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatIssueType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (viewMode === 'grid') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Issues ({issues.length})</h3>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedIssues.length === issues.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <Card key={issue.id} className="glass-card hover:shadow-lg transition-all duration-200 animate-fade-up">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedIssues.includes(issue.id)}
                      onCheckedChange={(checked) => handleSelectIssue(issue.id, !!checked)}
                    />
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>
                  <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                    {issue.severity}
                  </Badge>
                </div>
                <CardTitle className="text-sm">{formatIssueType(issue.issueType)}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Image Preview */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={issue.imageUrl} 
                    alt="Road defect"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {issue.location.roadName} • {issue.location.segment}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">PCI:</span>
                      <span className={`font-medium ${getPciColor(issue.pciScore)}`}>
                        {issue.pciScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatIssueType(issue.aiSuggestion)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatDate(issue.detectedAt)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>AI Confidence</span>
                      <span>{Math.round(issue.aiConfidence * 100)}%</span>
                    </div>
                    <Progress value={Math.min(Math.max((issue.aiConfidence || 0) * 100, 0), 100)} className="h-1" />
                  </div>
                </div>

                {/* Actions - Enhanced for touch */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="default"
                    variant="outline"
                    className="flex-1 h-12 text-sm"
                    onClick={() => handleStatusUpdate(issue.id, 'confirmed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="flex-1 h-12 text-sm"
                    onClick={() => handleStatusUpdate(issue.id, 'rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="default" variant="outline" className="h-12 w-12 p-0">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button size="default" variant="outline" className="h-12 w-12 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Issues ({issues.length})
          </CardTitle>
          <Button size="sm" variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Verify in Person
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIssues.length === issues.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>PCI</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>AI Suggestion</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedIssues.includes(issue.id)}
                      onCheckedChange={(checked) => handleSelectIssue(issue.id, !!checked)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="relative w-16 h-12 bg-muted rounded overflow-hidden">
                      <img 
                        src={issue.imageUrl} 
                        alt="Road defect"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${getSeverityColor(issue.severity)}`} />
                      <span className="font-medium text-sm">
                        {formatIssueType(issue.issueType)}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{issue.location.roadName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {issue.location.segment}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className={`font-medium ${getPciColor(issue.pciScore)}`}>
                      {issue.pciScore}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-sm">
                    {formatIssueType(issue.aiSuggestion)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{Math.round(issue.aiConfidence * 100)}%</div>
                      <Progress value={Math.min(Math.max((issue.aiConfidence || 0) * 100, 0), 100)} className="h-1 w-16" />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(issue.detectedAt)}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleStatusUpdate(issue.id, 'confirmed')}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleStatusUpdate(issue.id, 'rejected')}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  MapPin
} from "lucide-react";
import { DashboardStats } from "@shared/api";

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const totalReviewed = stats.confirmedIssues + stats.rejectedIssues;
  const reviewRate = totalReviewed > 0 ? (totalReviewed / stats.totalIssues) * 100 : 0;
  
  const getPciColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 55) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getPciLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 55) return "Fair";
    if (score >= 40) return "Poor";
    return "Failed";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Issues */}
      <Card className="glass-card animate-fade-up">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Issues Detected</CardTitle>
          <MapPin className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalIssues}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span>+12% from last week</span>
          </div>
          <Progress value={100} className="mt-2 h-1" />
        </CardContent>
      </Card>

      {/* Pending Review */}
      <Card className="glass-card animate-fade-up [animation-delay:100ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <Badge variant="outline" className="text-xs">
              Urgent: {Math.floor(stats.pendingReview * 0.3)}
            </Badge>
          </div>
          <Progress
            value={stats.totalIssues > 0 ? (stats.pendingReview / stats.totalIssues) * 100 : 0}
            className="mt-2 h-1"
          />
        </CardContent>
      </Card>

      {/* Review Progress */}
      <Card className="glass-card animate-fade-up [animation-delay:200ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Review Progress</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(reviewRate)}%</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <span>{totalReviewed} of {stats.totalIssues} reviewed</span>
          </div>
          <Progress value={isNaN(reviewRate) ? 0 : Math.min(reviewRate, 100)} className="mt-2 h-1" />
        </CardContent>
      </Card>

      {/* Average PCI Score */}
      <Card className="glass-card animate-fade-up [animation-delay:300ms]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average PCI Score</CardTitle>
          <AlertTriangle className={`h-4 w-4 ${getPciColor(stats.avgPciScore)}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getPciColor(stats.avgPciScore)}`}>
            {stats.avgPciScore}
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getPciColor(stats.avgPciScore)}`}
            >
              {getPciLabel(stats.avgPciScore)}
            </Badge>
          </div>
          <Progress
            value={isNaN(stats.avgPciScore) ? 0 : Math.min(Math.max(stats.avgPciScore, 0), 100)}
            className="mt-2 h-1"
          />
        </CardContent>
      </Card>

      {/* Issue Types Distribution */}
      <Card className="glass-card md:col-span-2 animate-fade-up [animation-delay:400ms]">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Issues by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(stats.issuesByType).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="text-lg font-semibold">{count}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {type.replace('_', ' ')}
                </div>
                <Progress
                  value={stats.totalIssues > 0 ? (count / stats.totalIssues) * 100 : 0}
                  className="mt-1 h-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Severity Distribution */}
      <Card className="glass-card md:col-span-2 animate-fade-up [animation-delay:500ms]">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Issues by Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(stats.issuesBySeverity).map(([severity, count]) => {
              const color = severity === 'high' ? 'text-red-600' :
                           severity === 'medium' ? 'text-yellow-600' : 'text-green-600';
              return (
                <div key={severity} className="text-center">
                  <div className={`text-lg font-semibold ${color}`}>{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {severity}
                  </div>
                  <Progress
                    value={stats.totalIssues > 0 ? (count / stats.totalIssues) * 100 : 0}
                    className="mt-1 h-1"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

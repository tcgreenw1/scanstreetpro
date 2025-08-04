'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  RefreshCw
} from "lucide-react";

interface AnalyticsChartProps {
  chartType?: string;
  title: string;
  height?: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

export const AnalyticsChart = ({ 
  chartType = 'line',
  title,
  height = 300 
}: AnalyticsChartProps) => {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('neon_auth_token');
  };

  // Load chart data
  const loadChartData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      // Mock data generation based on chart type
      // In a real implementation, this would fetch from your analytics API
      let mockData: ChartData;
      
      switch (chartType) {
        case 'revenue':
          mockData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue',
              data: [1200, 1900, 3000, 5000, 4200, 6800],
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgb(59, 130, 246)'
            }],
            trend: { direction: 'up', percentage: 15.3 }
          };
          break;
        case 'users':
          mockData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'New Users',
              data: [45, 52, 38, 67],
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgb(16, 185, 129)'
            }],
            trend: { direction: 'up', percentage: 8.7 }
          };
          break;
        case 'plans':
          mockData = {
            labels: ['Free', 'Basic', 'Pro', 'Premium'],
            datasets: [{
              label: 'Plan Distribution',
              data: [65, 25, 8, 2],
              backgroundColor: [
                'rgba(156, 163, 175, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(147, 51, 234, 0.8)',
                'rgba(245, 158, 11, 0.8)'
              ]
            }],
            trend: { direction: 'stable', percentage: 0 }
          };
          break;
        default:
          mockData = {
            labels: ['Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5'],
            datasets: [{
              label: 'Data Series',
              data: [12, 19, 3, 5, 2],
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgb(59, 130, 246)'
            }],
            trend: { direction: 'stable', percentage: 0 }
          };
      }
      
      setData(mockData);
    } catch (error: any) {
      console.error('Failed to load chart data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [chartType]);

  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart3 className="h-4 w-4" />;
      case 'pie':
        return <PieChart className="h-4 w-4" />;
      default:
        return <LineChart className="h-4 w-4" />;
    }
  };

  const getTrendIcon = () => {
    if (!data) return null;
    
    switch (data.trend.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    if (!data) return 'text-gray-600';
    
    switch (data.trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Simple chart visualization (replace with actual chart library in production)
  const renderChart = () => {
    if (!data) return null;

    if (chartType === 'pie') {
      return (
        <div className="flex flex-wrap justify-center items-center space-x-4">
          {data.labels.map((label, index) => (
            <div key={label} className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-2"
                style={{ 
                  backgroundColor: data.datasets[0].backgroundColor?.[index] || 'rgba(59, 130, 246, 0.8)' 
                }}
              ></div>
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">{data.datasets[0].data[index]}%</div>
            </div>
          ))}
        </div>
      );
    }

    // Bar/Line chart visualization
    const maxValue = Math.max(...data.datasets[0].data);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-end h-48 px-4">
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const heightPercentage = (value / maxValue) * 100;
            
            return (
              <div key={label} className="flex flex-col items-center space-y-2">
                <div className="text-xs font-medium">{value}</div>
                <div 
                  className="w-8 bg-blue-500 rounded-t transition-all duration-500"
                  style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                ></div>
                <div className="text-xs text-muted-foreground transform -rotate-45 origin-left">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              {getChartIcon()}
              <span>{title}</span>
            </CardTitle>
            <CardDescription>
              Analytics visualization with real-time data
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {data && (
              <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium">
                  {data.trend.percentage > 0 ? '+' : ''}{data.trend.percentage}%
                </span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={loadChartData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-600">
            Error loading chart: {error}
          </div>
        ) : (
          <div style={{ height: `${height}px` }} className="w-full">
            {renderChart()}
          </div>
        )}
        
        {data && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Data Points:</span>
              <Badge variant="outline">{data.labels.length} items</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

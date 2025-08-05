import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Database, TrendingUp, BarChart3, Users, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface PaywallCardProps {
  title: string;
  description: string;
  requiredPlan: string;
  className?: string;
  children?: ReactNode;
}

export function PaywallCard({ title, description, requiredPlan, className, children }: PaywallCardProps) {
  return (
    <Card className={cn("border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Crown className="w-8 h-8 text-amber-500" />
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
            {requiredPlan}+ Required
          </Badge>
        </div>
        <CardTitle className="text-xl text-slate-800 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5" />
          {title}
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-300">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children}
          <div className="flex gap-2">
            <Link to="/pricing" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Access
              </Button>
            </Link>
            <Button variant="outline" className="text-slate-600">
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SampleDataBadgeProps {
  className?: string;
}

export function SampleDataBadge({ className }: SampleDataBadgeProps) {
  return (
    <Badge variant="outline" className={cn("bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300", className)}>
      <Database className="w-3 h-3 mr-1" />
      Sample Data
    </Badge>
  );
}

interface SummaryVisualizationProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}

export function SummaryVisualization({ title, subtitle, children, className }: SummaryVisualizationProps) {
  return (
    <Card className={cn("bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-700 dark:text-slate-300">{title}</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          <BarChart3 className="w-6 h-6 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

interface FeaturePreviewProps {
  title: string;
  description: string;
  features: string[];
  requiredPlan: string;
  comingSoonBadge?: boolean;
  className?: string;
}

export function FeaturePreview({ title, description, features, requiredPlan, comingSoonBadge, className }: FeaturePreviewProps) {
  return (
    <Card className={cn("border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              {title}
              {comingSoonBadge && (
                <Badge className="bg-green-100 text-green-800 text-xs">Coming Soon</Badge>
              )}
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
          </div>
          <Crown className="w-6 h-6 text-amber-500 flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Preview Features:</p>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {requiredPlan}+ Feature
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface NavItemWrapperProps {
  children: ReactNode;
  state: 'shown' | 'sample_data' | 'paywall' | 'not_shown';
  href?: string;
  className?: string;
}

export function NavItemWrapper({ children, state, href, className }: NavItemWrapperProps) {
  const baseClasses = "group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";

  if (state === 'not_shown') {
    return null; // Don't render at all
  }

  // For paywall items, make them clickable but with visual indicators
  if (state === 'paywall') {
    const paywallClasses = cn(
      baseClasses,
      "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-700 dark:text-slate-300",
      className
    );

    if (href) {
      return (
        <Link to={href} className={paywallClasses}>
          {children}
          <div className="ml-auto flex items-center gap-1">
            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
              <Crown className="w-2.5 h-2.5 mr-1" />
              Preview
            </Badge>
          </div>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-amber-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      );
    }

    return (
      <div className={paywallClasses}>
        {children}
        <Crown className="w-4 h-4 text-amber-500 ml-auto" />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-amber-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  }

  const linkClasses = cn(
    baseClasses,
    "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
    state === 'sample_data' && "border-l-2 border-blue-400",
    className
  );

  if (href) {
    return (
      <Link to={href} className={linkClasses}>
        {children}
        {state === 'sample_data' && (
          <Badge variant="outline" className="ml-auto text-xs bg-blue-100 text-blue-700 border-blue-300">
            <Database className="w-2.5 h-2.5 mr-1" />
            Sample
          </Badge>
        )}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-slate-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
    );
  }

  return (
    <div className={linkClasses}>
      {children}
      {state === 'sample_data' && (
        <Badge variant="outline" className="ml-auto text-xs bg-blue-100 text-blue-700 border-blue-300">
          <Database className="w-2.5 h-2.5 mr-1" />
          Sample
        </Badge>
      )}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-slate-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

interface ConditionalFeatureProps {
  state: 'shown' | 'sample_data' | 'paywall' | 'not_shown';
  children: ReactNode;
  fallback?: ReactNode;
  paywallFallback?: ReactNode;
}

export function ConditionalFeature({ state, children, fallback, paywallFallback }: ConditionalFeatureProps) {
  switch (state) {
    case 'shown':
    case 'sample_data':
      return <>{children}</>;
    case 'paywall':
      return paywallFallback ? <>{paywallFallback}</> : null;
    case 'not_shown':
      return fallback ? <>{fallback}</> : null;
    default:
      return null;
  }
}

// Mini chart components for summary visualizations
export function MiniBarChart({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  
  return (
    <div className={cn("flex items-end gap-1 h-8", className)}>
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-blue-400 rounded-sm min-w-[3px] transition-all duration-300 hover:bg-blue-500"
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function MiniLineChart({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className={cn("w-full h-8", className)} viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-green-500"
      />
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,100 ${points} 100,100`}
        fill="url(#lineGradient)"
        className="text-green-500"
      />
    </svg>
  );
}

export function MiniDonutChart({ value, max, className }: { value: number; max: number; className?: string }) {
  const percentage = (value / max) * 100;
  const strokeDasharray = `${percentage} ${100 - percentage}`;
  
  return (
    <div className={cn("relative w-8 h-8", className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="25"
          className="text-blue-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

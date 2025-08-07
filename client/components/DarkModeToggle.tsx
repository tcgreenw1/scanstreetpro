import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  variant?: 'default' | 'floating' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DarkModeToggle({ 
  variant = 'default', 
  size = 'md',
  className 
}: DarkModeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'floating') {
    return (
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="sm"
        className={cn(
          "fixed top-4 right-4 z-50 rounded-full glass-card border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 transition-all duration-300 backdrop-blur-xl",
          sizeClasses[size],
          className
        )}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? (
          <Sun className={cn(iconSizes[size], "text-yellow-500")} />
        ) : (
          <Moon className={cn(iconSizes[size], "text-slate-600")} />
        )}
      </Button>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        <div className="flex items-center space-x-2">
          {isDarkMode ? (
            <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          ) : (
            <Sun className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          )}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isDarkMode ? 'Dark' : 'Light'} Mode
          </span>
        </div>
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className="rounded-full w-12 h-6 p-0 relative bg-slate-300 dark:bg-slate-600 transition-all duration-300 hover:bg-slate-400 dark:hover:bg-slate-500"
        >
          <div className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 flex items-center justify-center",
            isDarkMode ? "left-6" : "left-0.5"
          )}>
            {isDarkMode ? (
              <Moon className="w-3 h-3 text-slate-700" />
            ) : (
              <Sun className="w-3 h-3 text-yellow-500" />
            )}
          </div>
        </Button>
      </div>
    );
  }

  // Default variant
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className={cn(
        "rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors",
        sizeClasses[size],
        className
      )}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <Sun className={cn(iconSizes[size], "text-yellow-500")} />
      ) : (
        <Moon className={cn(iconSizes[size], "text-slate-600 dark:text-slate-300")} />
      )}
    </Button>
  );
}

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Dark Mode Test Component
 * This component can be used to verify dark mode is working correctly
 * across different parts of the application
 */
export function DarkModeTest() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <h2 className="text-2xl font-bold">Dark Mode Test</h2>
      
      <div className="flex items-center space-x-4">
        <span>Current mode: {isDarkMode ? 'Dark' : 'Light'}</span>
        <button 
          onClick={toggleTheme}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
        >
          Toggle Mode
        </button>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-semibold text-card-foreground">Card Component</h3>
          <p className="text-muted-foreground">This should adapt to dark/light mode</p>
        </div>

        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Glass Card</h3>
          <p className="text-slate-600 dark:text-slate-300">Glass morphism effect</p>
        </div>
      </div>

      {/* Test Form Elements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Form Elements</h3>
        
        <input 
          type="text" 
          placeholder="Test input field"
          className="w-full p-2 border border-input bg-background text-foreground rounded-md"
        />
        
        <textarea 
          placeholder="Test textarea"
          className="w-full p-2 border border-input bg-background text-foreground rounded-md"
          rows={3}
        />
        
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
          Secondary Button
        </button>
      </div>

      {/* Test Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Table Elements</h3>
        
        <table className="w-full border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border border-border text-left">Header 1</th>
              <th className="p-2 border border-border text-left">Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-muted/50">
              <td className="p-2 border border-border">Cell 1</td>
              <td className="p-2 border border-border">Cell 2</td>
            </tr>
            <tr className="hover:bg-muted/50">
              <td className="p-2 border border-border">Cell 3</td>
              <td className="p-2 border border-border">Cell 4</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Test Badges */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Badges and Status</h3>
        
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
            Blue Badge
          </span>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
            Green Badge
          </span>
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
            Red Badge
          </span>
        </div>
      </div>

      {/* Test Alerts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Alert Components</h3>
        
        <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded">
          Info Alert - Should adapt to dark mode
        </div>
        
        <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded">
          Error Alert - Should adapt to dark mode
        </div>
      </div>
    </div>
  );
}

/**
 * Quick verification function to check if dark mode is properly configured
 */
export function verifyDarkMode(): boolean {
  const root = document.documentElement;
  const hasDarkClass = root.classList.contains('dark');
  const hasThemeInStorage = localStorage.getItem('theme') !== null;
  
  console.log('Dark Mode Verification:', {
    hasDarkClass,
    hasThemeInStorage,
    currentTheme: localStorage.getItem('theme'),
    documentClass: root.className
  });
  
  return hasDarkClass || hasThemeInStorage;
}

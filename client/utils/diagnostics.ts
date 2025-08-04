export interface DiagnosticResult {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string[];
}

export class SystemDiagnostics {
  static async runFullDiagnostics(): Promise<DiagnosticResult[]> {
    const results: DiagnosticResult[] = [];

    // Check environment variables
    results.push(this.checkEnvironmentVariables());

    // Check network connectivity
    results.push(await this.checkNetworkConnectivity());

    // Check database connection
    const dbTest = await this.testDatabaseService();
    results.push(dbTest);

    return results;
  }

  static checkEnvironmentVariables(): DiagnosticResult {
    const databaseUrl = import.meta.env.VITE_DATABASE_URL;
    const builderApiKey = import.meta.env.VITE_BUILDER_API_KEY;

    const issues: string[] = [];
    
    if (!databaseUrl) {
      issues.push('DATABASE_URL not configured');
    }

    if (!builderApiKey) {
      issues.push('Builder.io API key not configured');
    }

    return {
      name: 'Environment Variables',
      status: issues.length === 0 ? 'success' : 'warning',
      message: issues.length === 0 
        ? 'All environment variables configured' 
        : `${issues.length} configuration issue(s) found`,
      details: issues
    };
  }

  static async checkNetworkConnectivity(): Promise<DiagnosticResult> {
    try {
      const response = await fetch('/api/ping', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        return {
          name: 'Network Connectivity',
          status: 'success',
          message: 'Server connectivity confirmed'
        };
      } else {
        return {
          name: 'Network Connectivity',
          status: 'error',
          message: `Server returned ${response.status}: ${response.statusText}`
        };
      }
    } catch (error: any) {
      return {
        name: 'Network Connectivity',
        status: 'error',
        message: `Network error: ${error.message}`
      };
    }
  }

  static async testDatabaseService(): Promise<DiagnosticResult> {
    try {
      const response = await fetch('/api/db/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          name: 'Database Service',
          status: 'success',
          message: 'Database connection successful'
        };
      } else {
        return {
          name: 'Database Service',
          status: 'error',
          message: data.message || 'Database connection failed'
        };
      }
    } catch (error: any) {
      return {
        name: 'Database Service',
        status: 'error',
        message: `Database service error: ${error.message}`
      };
    }
  }

  static checkLocalStorage(): DiagnosticResult {
    try {
      const testKey = 'diagnostic-test';
      const testValue = 'test-value';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === testValue) {
        return {
          name: 'Local Storage',
          status: 'success',
          message: 'Local storage working correctly'
        };
      } else {
        return {
          name: 'Local Storage',
          status: 'error',
          message: 'Local storage test failed'
        };
      }
    } catch (error: any) {
      return {
        name: 'Local Storage',
        status: 'error',
        message: `Local storage error: ${error.message}`
      };
    }
  }

  static checkSessionStorage(): DiagnosticResult {
    try {
      const testKey = 'diagnostic-session-test';
      const testValue = 'session-test-value';
      
      sessionStorage.setItem(testKey, testValue);
      const retrieved = sessionStorage.getItem(testKey);
      sessionStorage.removeItem(testKey);
      
      if (retrieved === testValue) {
        return {
          name: 'Session Storage',
          status: 'success',
          message: 'Session storage working correctly'
        };
      } else {
        return {
          name: 'Session Storage',
          status: 'error',
          message: 'Session storage test failed'
        };
      }
    } catch (error: any) {
      return {
        name: 'Session Storage',
        status: 'error',
        message: `Session storage error: ${error.message}`
      };
    }
  }

  static getSystemInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
}

// Utility functions for status display
export function getStatusIcon(status: DiagnosticResult['status']) {
  switch (status) {
    case 'success': return 'CheckCircle';
    case 'warning': return 'AlertCircle';
    case 'error': return 'XCircle';
    default: return 'AlertCircle';
  }
}

export function getStatusColor(status: DiagnosticResult['status']) {
  switch (status) {
    case 'success': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

// Backward compatibility export
export const runDiagnostics = SystemDiagnostics.runFullDiagnostics;

export default SystemDiagnostics;

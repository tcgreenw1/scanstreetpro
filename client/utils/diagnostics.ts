// Diagnostic utilities for debugging connection and auth issues

import { supabase } from '@/lib/supabase';

export interface DiagnosticResult {
  component: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class Diagnostics {
  static async runFullDiagnostic(): Promise<DiagnosticResult[]> {
    const results: DiagnosticResult[] = [];

    // Check environment variables
    results.push(this.checkEnvironmentVariables());

    // Check Supabase configuration
    results.push(this.checkSupabaseConfig());

    // Test network connectivity
    const networkTest = await this.testNetworkConnectivity();
    results.push(networkTest);

    // Test Supabase auth service
    const authTest = await this.testAuthService();
    results.push(authTest);

    // Test Supabase database service
    const dbTest = await this.testDatabaseService();
    results.push(dbTest);

    return results;
  }

  static checkEnvironmentVariables(): DiagnosticResult {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return {
        component: 'Environment Variables',
        status: 'fail',
        message: 'Missing required environment variables',
        details: {
          VITE_SUPABASE_URL: url ? 'Set' : 'Missing',
          VITE_SUPABASE_ANON_KEY: key ? 'Set' : 'Missing'
        }
      };
    }

    return {
      component: 'Environment Variables',
      status: 'pass',
      message: 'All required environment variables are set'
    };
  }

  static checkSupabaseConfig(): DiagnosticResult {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const issues: string[] = [];

    if (url && !url.includes('supabase.co')) {
      issues.push('Invalid URL format');
    }

    if (key && !key.startsWith('eyJ')) {
      issues.push('Invalid key format (should be JWT)');
    }

    if (issues.length > 0) {
      return {
        component: 'Supabase Configuration',
        status: 'fail',
        message: `Configuration issues: ${issues.join(', ')}`,
        details: { url, keyLength: key?.length || 0 }
      };
    }

    return {
      component: 'Supabase Configuration',
      status: 'pass',
      message: 'Supabase configuration appears valid'
    };
  }

  static async testNetworkConnectivity(): Promise<DiagnosticResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://api.github.com/zen', {
        signal: controller.signal,
        method: 'GET'
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return {
          component: 'Network Connectivity',
          status: 'pass',
          message: 'Internet connection is working'
        };
      } else {
        return {
          component: 'Network Connectivity',
          status: 'warning',
          message: `Network request returned ${response.status}`
        };
      }
    } catch (error: any) {
      return {
        component: 'Network Connectivity',
        status: 'fail',
        message: 'Network connectivity test failed',
        details: error.message || 'Unknown network error'
      };
    }
  }

  static async testAuthService(): Promise<DiagnosticResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const { error } = await supabase.auth.getSession();

      clearTimeout(timeoutId);

      if (error) {
        return {
          component: 'Supabase Auth Service',
          status: 'fail',
          message: 'Auth service error',
          details: error.message || 'Unknown auth error'
        };
      }

      return {
        component: 'Supabase Auth Service',
        status: 'pass',
        message: 'Auth service is responding'
      };
    } catch (error: any) {
      return {
        component: 'Supabase Auth Service',
        status: 'fail',
        message: 'Auth service test failed',
        details: error.message || 'Unknown error'
      };
    }
  }

  static async testDatabaseService(): Promise<DiagnosticResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Try a simple count query that should work even without tables
      const { error } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);

      clearTimeout(timeoutId);

      if (error) {
        if (error.message?.includes('relation "organizations" does not exist')) {
          return {
            component: 'Supabase Database Service',
            status: 'warning',
            message: 'Database connected but tables not found',
            details: 'Run database setup to create required tables'
          };
        }

        return {
          component: 'Supabase Database Service',
          status: 'fail',
          message: 'Database service error',
          details: error.message || 'Unknown database error'
        };
      }

      return {
        component: 'Supabase Database Service',
        status: 'pass',
        message: 'Database service is working'
      };
    } catch (error: any) {
      return {
        component: 'Supabase Database Service',
        status: 'fail',
        message: 'Database service test failed',
        details: error.message || 'Unknown error'
      };
    }
  }

  static getStatusIcon(status: string): string {
    switch (status) {
      case 'pass': return '✅';
      case 'warning': return '⚠️';
      case 'fail': return '❌';
      default: return '❓';
    }
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'pass': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'fail': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }
}

export const runDiagnostics = Diagnostics.runFullDiagnostic.bind(Diagnostics);
export const getStatusIcon = Diagnostics.getStatusIcon.bind(Diagnostics);
export const getStatusColor = Diagnostics.getStatusColor.bind(Diagnostics);

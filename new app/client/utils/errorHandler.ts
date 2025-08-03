// Error monitoring and debugging utility

interface ErrorInfo {
  message: string;
  stack?: string;
  component?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
}

export class ErrorHandler {
  private static errors: ErrorInfo[] = [];
  private static maxErrors = 50;

  static logError(error: any, component?: string): string {
    const errorInfo: ErrorInfo = {
      message: this.extractErrorMessage(error),
      stack: error?.stack,
      component,
      timestamp: new Date(),
      userAgent: navigator?.userAgent,
      url: window?.location?.href
    };

    this.errors.unshift(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console with better formatting
    console.group(`🚨 Error in ${component || 'Unknown Component'}`);
    console.error('Message:', errorInfo.message);
    console.error('Time:', errorInfo.timestamp.toISOString());
    if (errorInfo.stack) {
      console.error('Stack:', errorInfo.stack);
    }
    console.groupEnd();

    return errorInfo.message;
  }

  static extractErrorMessage(error: any): string {
    // Add debug logging for [object Object] detection
    const originalToString = error?.toString?.();
    if (originalToString === '[object Object]') {
      console.warn('🚨 Extracting message from [object Object] error:', error);
      console.warn('Error type:', typeof error);
      console.warn('Error keys:', error ? Object.keys(error) : 'no keys');
      console.warn('Stack trace for [object Object] error:', new Error().stack);
    }

    // Handle null, undefined, or empty values
    if (!error) return 'Unknown error occurred';

    // Handle string errors
    if (typeof error === 'string') return error;

    // Handle Error objects and similar
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;

    // Handle various error properties
    if (error?.details) return error.details;
    if (error?.hint) return error.hint;
    if (error?.code) return `Error code: ${error.code}`;

    // Handle nested error structures
    if (error?.data?.error?.message) return error.data.error.message;
    if (error?.response?.data?.message) return error.response.data.message;

    // Try to find any message-like property
    const messageKeys = ['msg', 'description', 'reason', 'statusText', 'detail'];
    for (const key of messageKeys) {
      if (error[key] && typeof error[key] === 'string') {
        return error[key];
      }
    }

    // Try toString if it returns something meaningful
    if (error?.toString && typeof error.toString === 'function') {
      const str = error.toString();
      if (str && str !== '[object Object]' && str !== 'Error') {
        return str;
      }
    }

    // Try to extract from object properties
    try {
      if (error && typeof error === 'object') {
        const keys = Object.keys(error);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const firstValue = error[firstKey];

          if (typeof firstValue === 'string' && firstValue.length > 0) {
            return `${firstKey}: ${firstValue}`;
          }
        }
      }
    } catch (e) {
      // Ignore extraction errors
    }

    // Final fallback with debug info
    if (error && typeof error === 'object') {
      console.warn('🚨 Could not extract meaningful error message from object:', error);
      try {
        const jsonStr = JSON.stringify(error, null, 2);
        if (jsonStr && jsonStr !== '{}') {
          return `Error object: ${jsonStr.substring(0, 200)}${jsonStr.length > 200 ? '...' : ''}`;
        }
      } catch (e) {
        return `Non-serializable error object (type: ${typeof error})`;
      }
    }

    return 'Unknown error occurred';
  }

  static getRecentErrors(count = 10): ErrorInfo[] {
    return this.errors.slice(0, count);
  }

  static clearErrors(): void {
    this.errors = [];
  }

  static exportErrorLog(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  static setupGlobalErrorHandler(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason, 'Global Promise Rejection');
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      }, 'Global Error');
    });
  }
}

// Setup global error handling
if (typeof window !== 'undefined') {
  ErrorHandler.setupGlobalErrorHandler();
}

// Convenience functions
export const logError = (error: any, component?: string): string => {
  return ErrorHandler.logError(error, component);
};

export const getErrorMessage = (error: any): string => {
  return ErrorHandler.extractErrorMessage(error);
};

export const clearErrors = () => ErrorHandler.clearErrors();
export const getRecentErrors = (count?: number) => ErrorHandler.getRecentErrors(count);
export const exportErrorLog = () => ErrorHandler.exportErrorLog();

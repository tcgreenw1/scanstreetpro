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
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;
    if (error?.toString && typeof error.toString === 'function') {
      const str = error.toString();
      if (str !== '[object Object]') return str;
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

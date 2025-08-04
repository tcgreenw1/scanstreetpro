// Error tracing utility to find where [object Object] errors are coming from

export class ErrorTracer {
  private static traces: Array<{
    message: string;
    stack: string;
    timestamp: Date;
    errorObject: any;
  }> = [];

  static traceError(message: string, errorObject: any): string {
    // Get stack trace
    const stack = new Error().stack || 'No stack available';
    
    // Add to traces
    this.traces.push({
      message,
      stack,
      timestamp: new Date(),
      errorObject
    });

    // Check if the error object would serialize to [object Object]
    let serializedError: string;
    try {
      if (typeof errorObject === 'object' && errorObject !== null) {
        serializedError = String(errorObject);
        if (serializedError === '[object Object]') {
          console.warn('🚨 FOUND [object Object] ERROR!');
          console.warn('Message:', message);
          console.warn('Error object:', errorObject);
          console.warn('Stack trace:', stack);
          console.warn('Object keys:', Object.keys(errorObject));
          console.warn('Object properties:', JSON.stringify(errorObject, null, 2));
        }
      }
    } catch (e) {
      console.warn('Error while tracing error:', e);
    }

    return message;
  }

  static getTraces() {
    return this.traces;
  }

  static clearTraces() {
    this.traces = [];
  }

  static findObjectObjectErrors() {
    return this.traces.filter(trace => 
      trace.message.includes('[object Object]') ||
      String(trace.errorObject) === '[object Object]'
    );
  }
}

// Enhanced console.error that traces [object Object] issues
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Check if any argument would serialize to [object Object]
  args.forEach((arg, index) => {
    if (typeof arg === 'object' && arg !== null && String(arg) === '[object Object]') {
      console.warn(`🚨 console.error argument ${index} is [object Object]:`, arg);
      console.warn('Stack trace:', new Error().stack);
    }
  });
  
  // Call original console.error
  originalConsoleError.apply(console, args);
};

export const traceError = ErrorTracer.traceError.bind(ErrorTracer);
export const getErrorTraces = ErrorTracer.getTraces.bind(ErrorTracer);
export const clearErrorTraces = ErrorTracer.clearTraces.bind(ErrorTracer);
export const findObjectObjectErrors = ErrorTracer.findObjectObjectErrors.bind(ErrorTracer);

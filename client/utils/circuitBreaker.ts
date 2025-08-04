// Circuit breaker pattern to prevent repeated failures

interface CircuitBreakerOptions {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private successCount: number = 0;
  
  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.options.recoveryTimeout) {
        throw new Error('Circuit breaker is OPEN - operation not allowed');
      } else {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
      }
    }

    try {
      const result = await operation();
      
      if (this.state === 'HALF_OPEN') {
        this.successCount++;
        if (this.successCount >= 3) { // Require 3 successes to fully close
          this.state = 'CLOSED';
          this.failures = 0;
        }
      } else {
        this.failures = Math.max(0, this.failures - 1); // Gradually reduce failure count on success
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      
      if (this.failures >= this.options.failureThreshold) {
        this.state = 'OPEN';
        console.warn(`Circuit breaker OPENED after ${this.failures} failures`);
      } else if (this.state === 'HALF_OPEN') {
        this.state = 'OPEN';
        console.warn('Circuit breaker returned to OPEN state after failure during recovery');
      }
      
      throw error;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failures;
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failures = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }
}

// Pre-configured circuit breakers for common operations
export const userDataCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,    // Open after 3 failures
  recoveryTimeout: 30000, // Wait 30 seconds before trying again
  monitoringPeriod: 60000 // Monitor for 1 minute
});

export const connectionCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,    // Open after 5 failures
  recoveryTimeout: 60000, // Wait 1 minute before trying again
  monitoringPeriod: 120000 // Monitor for 2 minutes
});

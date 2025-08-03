// Offline detection and management

export class OfflineManager {
  private static isOnline: boolean = navigator.onLine;
  private static listeners: Array<(online: boolean) => void> = [];
  private static connectionAttempts: number = 0;
  private static lastFailureTime: number = 0;
  private static readonly MAX_FAILURES_BEFORE_OFFLINE = 3;
  private static readonly OFFLINE_THRESHOLD_MS = 30000; // 30 seconds

  static {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('📶 Browser detected online');
      this.setOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      console.log('📵 Browser detected offline');
      this.setOnlineStatus(false);
    });
  }

  static getOnlineStatus(): boolean {
    return this.isOnline;
  }

  static reportConnectionFailure(): void {
    this.connectionAttempts++;
    this.lastFailureTime = Date.now();

    console.warn(`Connection failure #${this.connectionAttempts}`);

    // If we've had multiple failures recently, consider ourselves offline
    if (this.connectionAttempts >= this.MAX_FAILURES_BEFORE_OFFLINE) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure < this.OFFLINE_THRESHOLD_MS) {
        console.warn('Multiple connection failures detected - switching to offline mode');
        this.setOnlineStatus(false);
      }
    }
  }

  static reportConnectionSuccess(): void {
    if (this.connectionAttempts > 0) {
      console.log('📶 Connection recovered - switching to online mode');
    }
    
    this.connectionAttempts = 0;
    this.lastFailureTime = 0;
    this.setOnlineStatus(true);
  }

  private static setOnlineStatus(online: boolean): void {
    if (this.isOnline !== online) {
      this.isOnline = online;
      console.log(`🔄 Connection status changed: ${online ? 'ONLINE' : 'OFFLINE'}`);
      
      // Notify all listeners
      this.listeners.forEach(listener => {
        try {
          listener(online);
        } catch (error) {
          console.error('Error in offline status listener:', error);
        }
      });
    }
  }

  static addListener(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  static shouldUseOfflineMode(): boolean {
    return !this.isOnline || this.connectionAttempts >= this.MAX_FAILURES_BEFORE_OFFLINE;
  }

  static getConnectionMetrics() {
    return {
      isOnline: this.isOnline,
      connectionAttempts: this.connectionAttempts,
      lastFailureTime: this.lastFailureTime,
      shouldUseOfflineMode: this.shouldUseOfflineMode()
    };
  }

  static reset(): void {
    this.connectionAttempts = 0;
    this.lastFailureTime = 0;
    this.setOnlineStatus(navigator.onLine);
  }
}

// Export convenience functions
export const isOnline = () => OfflineManager.getOnlineStatus();
export const shouldUseOfflineMode = () => OfflineManager.shouldUseOfflineMode();
export const reportConnectionFailure = () => OfflineManager.reportConnectionFailure();
export const reportConnectionSuccess = () => OfflineManager.reportConnectionSuccess();
export const addOfflineListener = (callback: (online: boolean) => void) => OfflineManager.addListener(callback);
export const getConnectionMetrics = () => OfflineManager.getConnectionMetrics();

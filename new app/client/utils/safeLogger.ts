// Safe logging utility that never displays [object Object]

import { getErrorMessage } from './errorHandler';

export class SafeLogger {
  static error(message: string, error?: any) {
    if (error) {
      const safeErrorMessage = getErrorMessage(error);
      console.error(`${message}: ${safeErrorMessage}`);
      
      // Also log the raw object for debugging (but safely)
      if (typeof error === 'object' && error !== null) {
        try {
          console.debug('Raw error object:', JSON.stringify(error, null, 2));
        } catch (e) {
          console.debug('Raw error object (non-serializable):', error);
        }
      }
    } else {
      console.error(message);
    }
  }

  static warn(message: string, error?: any) {
    if (error) {
      const safeErrorMessage = getErrorMessage(error);
      console.warn(`${message}: ${safeErrorMessage}`);
    } else {
      console.warn(message);
    }
  }

  static info(message: string, data?: any) {
    if (data) {
      console.info(message, data);
    } else {
      console.info(message);
    }
  }

  static debug(message: string, data?: any) {
    if (data) {
      console.debug(message, data);
    } else {
      console.debug(message);
    }
  }
}

export const safeError = SafeLogger.error.bind(SafeLogger);
export const safeWarn = SafeLogger.warn.bind(SafeLogger);
export const safeInfo = SafeLogger.info.bind(SafeLogger);
export const safeDebug = SafeLogger.debug.bind(SafeLogger);

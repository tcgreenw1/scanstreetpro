import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { userDataCircuitBreaker, connectionCircuitBreaker } from '@/utils/circuitBreaker';
import { testSupabaseConnection } from '@/lib/supabase';

interface ConnectionStatusProps {
  show?: boolean;
}

export function ConnectionStatus({ show = true }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'degraded' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkConnectionStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const userDataState = userDataCircuitBreaker.getState();
      const connectionState = connectionCircuitBreaker.getState();
      
      if (userDataState === 'OPEN' || connectionState === 'OPEN') {
        setStatus('offline');
      } else if (userDataState === 'HALF_OPEN' || connectionState === 'HALF_OPEN') {
        setStatus('degraded');
      } else {
        // Test actual connection
        const connectionTest = await testSupabaseConnection();
        setStatus(connectionTest.success ? 'connected' : 'degraded');
      }
      
      setLastCheck(new Date());
    } catch (error) {
      setStatus('offline');
    }
  };

  const retryConnection = async () => {
    setRetrying(true);
    
    // Reset circuit breakers
    userDataCircuitBreaker.reset();
    connectionCircuitBreaker.reset();
    
    // Force a fresh check
    await checkConnectionStatus();
    
    setRetrying(false);
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <RefreshCw className="w-4 h-4 animate-spin" />,
          color: 'bg-blue-50 border-blue-200',
          text: 'Checking connection...',
          textColor: 'text-blue-800'
        };
      case 'connected':
        return {
          icon: <Wifi className="w-4 h-4" />,
          color: 'bg-green-50 border-green-200',
          text: 'Connected - All services operational',
          textColor: 'text-green-800'
        };
      case 'degraded':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'bg-yellow-50 border-yellow-200',
          text: 'Degraded - Some services may be slow',
          textColor: 'text-yellow-800'
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-4 h-4" />,
          color: 'bg-red-50 border-red-200',
          text: 'Offline - Using fallback mode',
          textColor: 'text-red-800'
        };
    }
  };

  // Don't show if connection is good and we don't want to always show
  if (!show && status === 'connected') {
    return null;
  }

  const statusInfo = getStatusInfo();

  return (
    <Alert className={`${statusInfo.color} mb-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {statusInfo.icon}
          <AlertDescription className={statusInfo.textColor}>
            <strong>{statusInfo.text}</strong>
            <br />
            <span className="text-xs">
              Last checked: {lastCheck.toLocaleTimeString()}
            </span>
          </AlertDescription>
        </div>
        
        {(status === 'degraded' || status === 'offline') && (
          <Button
            size="sm"
            variant="outline"
            onClick={retryConnection}
            disabled={retrying}
            className="ml-4"
          >
            {retrying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              'Retry'
            )}
          </Button>
        )}
      </div>
    </Alert>
  );
}

export default ConnectionStatus;

// Auth fallback system for when Supabase fails

interface FallbackUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
  organization: {
    id: string;
    name: string;
    plan: string;
  };
}

const fallbackUsers: FallbackUser[] = [
  {
    email: 'admin@scanstreetpro.com',
    password: 'AdminPass123!',
    name: 'System Administrator',
    role: 'admin',
    organization: {
      id: 'fallback-admin-org',
      name: 'Scan Street Pro Admin',
      plan: 'enterprise'
    }
  },
  {
    email: 'test@springfield.gov',
    password: 'TestUser123!',
    name: 'Test User',
    role: 'manager',
    organization: {
      id: 'fallback-free-org',
      name: 'City of Springfield (Free)',
      plan: 'free'
    }
  },
  {
    email: 'premium@springfield.gov',
    password: 'Premium!',
    name: 'Premium User',
    role: 'manager',
    organization: {
      id: 'fallback-premium-org',
      name: 'City of Springfield (Premium)',
      plan: 'professional'
    }
  }
];

export class AuthFallback {
  private static readonly FALLBACK_SESSION_KEY = 'fallback-auth-session';

  static async tryFallbackLogin(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      console.log('🔄 Attempting fallback authentication for:', email);
      
      const user = fallbackUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Create a mock session
      const session = {
        user: {
          id: `fallback-${user.email}`,
          email: user.email,
          user_metadata: {
            name: user.name
          }
        },
        role: user.role,
        organization: user.organization,
        isFallback: true,
        timestamp: Date.now()
      };

      // Store in localStorage
      localStorage.setItem(this.FALLBACK_SESSION_KEY, JSON.stringify(session));

      console.log('✅ Fallback authentication successful');
      return { success: true, user: session };
    } catch (error: any) {
      console.error('❌ Fallback authentication failed:', error);
      return { success: false, error: error.message || 'Fallback auth failed' };
    }
  }

  static getFallbackSession(): any {
    try {
      const stored = localStorage.getItem(this.FALLBACK_SESSION_KEY);
      if (!stored) return null;

      const session = JSON.parse(stored);
      
      // Check if session is expired (24 hours)
      if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
        this.clearFallbackSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting fallback session:', error);
      return null;
    }
  }

  static clearFallbackSession(): void {
    localStorage.removeItem(this.FALLBACK_SESSION_KEY);
  }

  static isFallbackMode(): boolean {
    const session = this.getFallbackSession();
    return !!session?.isFallback;
  }

  static getFallbackCredentials(): Array<{ email: string; password: string; name: string; role: string }> {
    return fallbackUsers.map(user => ({
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role
    }));
  }
}

export const tryFallbackLogin = AuthFallback.tryFallbackLogin.bind(AuthFallback);
export const getFallbackSession = AuthFallback.getFallbackSession.bind(AuthFallback);
export const clearFallbackSession = AuthFallback.clearFallbackSession.bind(AuthFallback);
export const isFallbackMode = AuthFallback.isFallbackMode.bind(AuthFallback);
export const getFallbackCredentials = AuthFallback.getFallbackCredentials.bind(AuthFallback);

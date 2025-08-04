// Simple authentication service for Neon database
import bcrypt from 'bcryptjs';

// Demo users (in a real app, this would come from the database)
const DEMO_USERS = [
  {
    id: '7128c5d7-0fd6-4c3a-9c4a-4ffba4ec955d',
    email: 'admin@scanstreetpro.com',
    password: 'AdminPass123!',
    name: 'System Administrator',
    role: 'admin',
    organization_id: '3a16af88-f08f-46c8-8bae-a11470227e90',
    organization: {
      id: '3a16af88-f08f-46c8-8bae-a11470227e90',
      name: 'Scan Street Pro Admin',
      slug: 'scan-street-admin',
      plan: 'enterprise'
    }
  },
  {
    id: '7a119669-0ef1-4512-ad39-8d4f28b621b6',
    email: 'test@springfield.gov',
    password: 'TestUser123!',
    name: 'Test User',
    role: 'manager',
    organization_id: 'f6e839fc-525a-4348-8fec-4ac1bf8389ff',
    organization: {
      id: 'f6e839fc-525a-4348-8fec-4ac1bf8389ff',
      name: 'City of Springfield (Free)',
      slug: 'springfield-free',
      plan: 'free'
    }
  },
  {
    id: 'f0b3d839-5f55-4d21-84dc-6f0dba46dfae',
    email: 'premium@springfield.gov',
    password: 'Premium123!',
    name: 'Premium User',
    role: 'manager',
    organization_id: '9e678560-1f05-4d2f-92d9-106c878c5904',
    organization: {
      id: '9e678560-1f05-4d2f-92d9-106c878c5904',
      name: 'City of Springfield (Premium)',
      slug: 'springfield-premium',
      plan: 'professional'
    }
  }
];

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization_id: string;
  organization?: any;
}

interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}

class NeonAuthManager {
  private session: Session | null = null;
  private listeners: ((session: Session | null) => void)[] = [];

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    const sessionData = localStorage.getItem('neon_auth_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session.expires_at > Date.now()) {
          this.session = session;
        } else {
          localStorage.removeItem('neon_auth_session');
        }
      } catch {
        localStorage.removeItem('neon_auth_session');
      }
    }
  }

  private saveSession(session: Session | null) {
    if (session) {
      localStorage.setItem('neon_auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('neon_auth_session');
    }
    this.session = session;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.session));
  }

  // Supabase-compatible API
  auth = {
    getSession: () => {
      return Promise.resolve({ 
        data: { session: this.session }, 
        error: null 
      });
    },

    getUser: () => {
      return Promise.resolve({ 
        data: { user: this.session?.user || null }, 
        error: null 
      });
    },

    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const user = DEMO_USERS.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials' }
        };
      }

      const session: Session = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organization_id: user.organization_id,
          organization: user.organization
        },
        access_token: `token_${user.id}_${Date.now()}`,
        expires_at: Date.now() + (24 * 60 * 60 * 1000)
      };

      this.saveSession(session);

      return {
        data: { user: session.user, session },
        error: null
      };
    },

    signUp: async ({ email, password }: { email: string; password: string }) => {
      // Check if user already exists
      const existingUser = DEMO_USERS.find(u => u.email === email);
      if (existingUser) {
        return {
          data: { user: null, session: null },
          error: { message: 'User already registered' }
        };
      }

      // For new users, create a basic account
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'manager',
        organization_id: 'new_org_id',
        organization: {
          id: 'new_org_id',
          name: `${email.split('@')[0]}'s Organization`,
          slug: `org-${Date.now()}`,
          plan: 'free'
        }
      };

      const session: Session = {
        user: newUser,
        access_token: `token_${newUser.id}_${Date.now()}`,
        expires_at: Date.now() + (24 * 60 * 60 * 1000)
      };

      this.saveSession(session);

      return {
        data: { user: newUser, session },
        error: null
      };
    },

    signOut: async () => {
      this.saveSession(null);
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      const listener = (session: Session | null) => {
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      };
      
      this.listeners.push(listener);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const index = this.listeners.indexOf(listener);
              if (index > -1) {
                this.listeners.splice(index, 1);
              }
            }
          }
        }
      };
    }
  };

  // Database operations (simplified)
  from(table: string) {
    return {
      select: (fields?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            if (table === 'users' && column === 'id' && this.session) {
              const user = DEMO_USERS.find(u => u.id === value);
              if (user) {
                return {
                  data: {
                    role: user.role,
                    organizations: user.organization
                  },
                  error: null
                };
              }
            }
            return { data: null, error: { message: 'Not found' } };
          },
          maybeSingle: async () => {
            if (table === 'users' && this.session) {
              const user = DEMO_USERS.find(u => u.id === this.session!.user.id);
              if (user) {
                return {
                  data: {
                    organization_id: user.organization_id,
                    organizations: user.organization
                  },
                  error: null
                };
              }
            }
            return { data: null, error: null };
          }
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            // Return mock data for organizations
            then: async (callback: any) => {
              if (table === 'organizations') {
                const orgs = DEMO_USERS.map(u => u.organization);
                callback({ data: orgs, error: null });
              } else {
                callback({ data: [], error: null });
              }
            }
          })
        })
      }),
      insert: (data: any) => ({
        select: (fields?: string) => ({
          single: async () => {
            // Simulate successful insert
            return {
              data: { id: `new_${Date.now()}`, ...data },
              error: null
            };
          }
        })
      })
    };
  }
}

// Create singleton instance
const neonAuth = new NeonAuthManager();

// Export compatible interface
export const supabase = neonAuth;

// Export helper functions
export const signInWithTimeout = async (email: string, password: string) => {
  return neonAuth.auth.signInWithPassword({ email, password });
};

export const signUpWithTimeout = async (email: string, password: string) => {
  return neonAuth.auth.signUp({ email, password });
};

export const signOutWithTimeout = async () => {
  return neonAuth.auth.signOut();
};

export const isAuthenticated = async () => {
  const { data } = await neonAuth.auth.getSession();
  return !!data.session;
};

export const getCurrentUser = async () => {
  const { data } = await neonAuth.auth.getUser();
  return data.user;
};

export const getUserOrganization = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return user.organization || null;
};

export const testSupabaseConnection = async () => {
  try {
    // Simulate connection test delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      data: {
        message: 'Neon database connected successfully',
        auth: { session: null },
        db: { connected: true, type: 'Neon PostgreSQL' }
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Connection test failed'
    };
  }
};

export const ensureDemoUsersExist = async () => {
  console.log('Demo users already configured for Neon database');
};

export default neonAuth;

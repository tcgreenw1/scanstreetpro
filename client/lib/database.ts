// Database client for Neon PostgreSQL

// Database Types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: 'free' | 'starter' | 'professional' | 'enterprise';
          settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          plan?: 'free' | 'starter' | 'professional' | 'enterprise';
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          plan?: 'free' | 'starter' | 'professional' | 'enterprise';
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          name: string | null;
          role: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          email: string;
          password?: string;
          name?: string | null;
          role?: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          email?: string;
          name?: string | null;
          role?: 'admin' | 'manager' | 'inspector' | 'contractor' | 'viewer';
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contractors: {
        Row: {
          id: string;
          organization_id: string;
          contractor_id: string;
          name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          specialties: string[];
          certifications: string[];
          rating: number;
          status: 'certified' | 'pending' | 'suspended';
          active_projects: number;
          completed_projects: number;
          total_value: number;
          hourly_rate: number | null;
          join_date: string;
          is_active: boolean;
          last_active: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          contractor_id: string;
          name: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          specialties?: string[];
          certifications?: string[];
          rating?: number;
          status?: 'certified' | 'pending' | 'suspended';
          active_projects?: number;
          completed_projects?: number;
          total_value?: number;
          hourly_rate?: number | null;
          join_date?: string;
          is_active?: boolean;
          last_active?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          contractor_id?: string;
          name?: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          specialties?: string[];
          certifications?: string[];
          rating?: number;
          status?: 'certified' | 'pending' | 'suspended';
          active_projects?: number;
          completed_projects?: number;
          total_value?: number;
          hourly_rate?: number | null;
          join_date?: string;
          is_active?: boolean;
          last_active?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          organization_id: string;
          asset_id: string;
          name: string;
          type: 'road' | 'bridge' | 'traffic_signal' | 'street_light' | 'signage' | 'sidewalk' | 'drainage';
          location_lat: number | null;
          location_lng: number | null;
          address: string | null;
          road_name: string | null;
          segment: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | null;
          status: 'active' | 'needs_repair' | 'under_maintenance' | 'decommissioned';
          install_date: string | null;
          value: number | null;
          maintenance_cost: number;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assigned_contractor_id: string | null;
          last_inspection: string | null;
          next_inspection: string | null;
          pci_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          asset_id: string;
          name: string;
          type: 'road' | 'bridge' | 'traffic_signal' | 'street_light' | 'signage' | 'sidewalk' | 'drainage';
          location_lat?: number | null;
          location_lng?: number | null;
          address?: string | null;
          road_name?: string | null;
          segment?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | null;
          status?: 'active' | 'needs_repair' | 'under_maintenance' | 'decommissioned';
          install_date?: string | null;
          value?: number | null;
          maintenance_cost?: number;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_contractor_id?: string | null;
          last_inspection?: string | null;
          next_inspection?: string | null;
          pci_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          asset_id?: string;
          name?: string;
          type?: 'road' | 'bridge' | 'traffic_signal' | 'street_light' | 'signage' | 'sidewalk' | 'drainage';
          location_lat?: number | null;
          location_lng?: number | null;
          address?: string | null;
          road_name?: string | null;
          segment?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | null;
          status?: 'active' | 'needs_repair' | 'under_maintenance' | 'decommissioned';
          install_date?: string | null;
          value?: number | null;
          maintenance_cost?: number;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_contractor_id?: string | null;
          last_inspection?: string | null;
          next_inspection?: string | null;
          pci_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Auth state management (since we don't have Supabase Auth)
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  organization_id?: string;
}

interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}

class AuthManager {
  private session: Session | null = null;
  private listeners: ((session: Session | null) => void)[] = [];

  constructor() {
    // Load session from localStorage on initialization
    this.loadSession();
  }

  private loadSession() {
    const sessionData = localStorage.getItem('neon_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session.expires_at > Date.now()) {
          this.session = session;
        } else {
          localStorage.removeItem('neon_session');
        }
      } catch (error) {
        localStorage.removeItem('neon_session');
      }
    }
  }

  private saveSession(session: Session | null) {
    if (session) {
      localStorage.setItem('neon_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('neon_session');
    }
  }

  getSession() {
    return { data: { session: this.session }, error: null };
  }

  getUser() {
    return { data: { user: this.session?.user || null }, error: null };
  }

  async signInWithPassword(credentials: { email: string; password: string }) {
    try {
      // In a real implementation, this would make an API call to verify credentials
      // For now, we'll use the Neon database directly
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: { user: null, session: null }, error };
      }

      const { user, token } = await response.json();
      const session: Session = {
        user,
        access_token: token,
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      this.session = session;
      this.saveSession(session);
      this.notifyListeners();

      return { data: { user, session }, error: null };
    } catch (error: any) {
      return { data: { user: null, session: null }, error: { message: error.message } };
    }
  }

  async signUp(credentials: { email: string; password: string }) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: { user: null, session: null }, error };
      }

      const { user, token } = await response.json();
      const session: Session = {
        user,
        access_token: token,
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      this.session = session;
      this.saveSession(session);
      this.notifyListeners();

      return { data: { user, session }, error: null };
    } catch (error: any) {
      return { data: { user: null, session: null }, error: { message: error.message } };
    }
  }

  async signOut() {
    this.session = null;
    this.saveSession(null);
    this.notifyListeners();
    return { error: null };
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    this.listeners.push(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          },
        },
      },
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.session));
  }
}

// Database query builder
class DatabaseClient {
  private projectId = 'hidden-queen-27037107';

  private async executeQuery(sql: string, params?: any[]) {
    try {
      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getSession().data.session?.access_token}`,
        },
        body: JSON.stringify({ sql, params }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Database query failed');
    }
  }

  from(table: string) {
    return new QueryBuilder(table, this.executeQuery.bind(this));
  }
}

class QueryBuilder {
  private table: string;
  private selectFields: string[] = ['*'];
  private whereConditions: string[] = [];
  private orderByClause: string = '';
  private limitValue: number | null = null;
  private executeQuery: (sql: string, params?: any[]) => Promise<any>;

  constructor(table: string, executeQuery: (sql: string, params?: any[]) => Promise<any>) {
    this.table = table;
    this.executeQuery = executeQuery;
  }

  select(fields: string = '*') {
    this.selectFields = fields === '*' ? ['*'] : fields.split(',').map(f => f.trim());
    return this;
  }

  eq(column: string, value: any) {
    this.whereConditions.push(`${column} = $${this.whereConditions.length + 1}`);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    const direction = options?.ascending === false ? 'DESC' : 'ASC';
    this.orderByClause = `ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  async single() {
    this.limitValue = 1;
    const result = await this.execute();
    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    } else {
      return { data: null, error: { code: 'PGRST116', message: 'The result contains 0 rows' } };
    }
  }

  async maybeSingle() {
    this.limitValue = 1;
    const result = await this.execute();
    return { data: result.data?.[0] || null, error: null };
  }

  private async execute() {
    let sql = `SELECT ${this.selectFields.join(', ')} FROM ${this.table}`;
    
    if (this.whereConditions.length > 0) {
      sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }
    
    if (this.orderByClause) {
      sql += ` ${this.orderByClause}`;
    }
    
    if (this.limitValue) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    try {
      const result = await this.executeQuery(sql);
      return { data: result.rows || result, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  async insert(data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const sql = `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    
    try {
      const result = await this.executeQuery(sql, values);
      return { data: result.rows || [result], error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  async update(data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    let sql = `UPDATE ${this.table} SET ${setClause}`;
    
    if (this.whereConditions.length > 0) {
      sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }
    
    sql += ' RETURNING *';
    
    try {
      const result = await this.executeQuery(sql, values);
      return { data: result.rows || [result], error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  async delete() {
    let sql = `DELETE FROM ${this.table}`;
    
    if (this.whereConditions.length > 0) {
      sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }
    
    try {
      const result = await this.executeQuery(sql);
      return { data: result.rows || result, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }
}

// Create instances
export const auth = new AuthManager();
export const db = new DatabaseClient();

// Helper functions to maintain compatibility with Supabase
export const isAuthenticated = async () => {
  const { data: { session } } = auth.getSession();
  return !!session;
};

export const getCurrentUser = async () => {
  const { data: { user } } = auth.getUser();
  return user;
};

export const getUserOrganization = async () => {
  const user = await getCurrentUser();
  if (!user || !user.organization_id) return null;

  try {
    const { data, error } = await db.from('organizations')
      .select('*')
      .eq('id', user.organization_id)
      .single();

    if (error) return null;
    return data;
  } catch (error) {
    return null;
  }
};

// Sign in/up functions with timeout support
export const signInWithTimeout = async (email: string, password: string) => {
  return auth.signInWithPassword({ email, password });
};

export const signUpWithTimeout = async (email: string, password: string) => {
  return auth.signUp({ email, password });
};

export const signOutWithTimeout = async () => {
  return auth.signOut();
};

// Test connection function
export const testDatabaseConnection = async () => {
  try {
    const response = await fetch('/api/db/test');
    if (!response.ok) {
      throw new Error('Connection test failed');
    }
    const result = await response.json();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Default export for compatibility
export default { auth, from: db.from.bind(db) };

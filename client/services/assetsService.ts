// Service for managing city assets data for Springfield, OH

export interface CityAsset {
  id: number;
  name: string;
  type: AssetType;
  lat: number;
  lng: number;
  status: 'active' | 'maintenance' | 'inactive' | 'damaged';
  installDate?: string;
  lastInspection?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  description?: string;
  cost?: number;
  address?: string;
}

export type AssetType = 
  | 'traffic_sign'
  | 'street_light'
  | 'traffic_light'
  | 'bench'
  | 'fire_hydrant'
  | 'manhole'
  | 'bus_stop'
  | 'tree'
  | 'crosswalk'
  | 'speed_bump';

export interface AssetTypeConfig {
  type: AssetType;
  label: string;
  icon: string;
  color: string;
  darkColor?: string;
}

export const ASSET_TYPES: AssetTypeConfig[] = [
  { type: 'traffic_sign', label: 'Traffic Signs', icon: '🛑', color: '#3b82f6', darkColor: '#60a5fa' },
  { type: 'street_light', label: 'Street Lights', icon: '💡', color: '#eab308', darkColor: '#facc15' },
  { type: 'traffic_light', label: 'Traffic Lights', icon: '🚦', color: '#dc2626', darkColor: '#f87171' },
  { type: 'bench', label: 'Benches', icon: '🪑', color: '#16a34a', darkColor: '#4ade80' },
  { type: 'fire_hydrant', label: 'Fire Hydrants', icon: '🚒', color: '#dc2626', darkColor: '#f87171' },
  { type: 'manhole', label: 'Manholes', icon: '⚫', color: '#6b7280', darkColor: '#9ca3af' },
  { type: 'bus_stop', label: 'Bus Stops', icon: '🚌', color: '#8b5cf6', darkColor: '#a78bfa' },
  { type: 'tree', label: 'Trees', icon: '🌳', color: '#16a34a', darkColor: '#4ade80' },
  { type: 'crosswalk', label: 'Crosswalks', icon: '🚶', color: '#0891b2', darkColor: '#06b6d4' },
  { type: 'speed_bump', label: 'Speed Bumps', icon: '⚠️', color: '#f97316', darkColor: '#fb923c' }
];

class AssetsService {
  private cache: Map<string, CityAsset[]> = new Map();
  private lastFetch: number = 0;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async fetchSpringfieldAssets(): Promise<CityAsset[]> {
    const cacheKey = 'springfield_assets';
    const now = Date.now();

    // Return cached data if recent
    if (this.cache.has(cacheKey) && (now - this.lastFetch) < this.cacheTimeout) {
      return this.cache.get(cacheKey)!;
    }

    // For now, use fallback data directly to avoid API issues
    // In production, this would try API first with proper authentication
    const fallbackAssets = this.getSpringfieldFallbackAssets();
    this.cache.set(cacheKey, fallbackAssets);
    this.lastFetch = now;
    return fallbackAssets;
  }

  private processAssetData(data: any[]): CityAsset[] {
    return data.map(item => ({
      id: item.id || Math.random(),
      name: item.name || 'Unknown Asset',
      type: this.normalizeAssetType(item.type || 'traffic_sign'),
      lat: parseFloat(item.lat || item.latitude || 0),
      lng: parseFloat(item.lng || item.longitude || 0),
      status: item.status || 'active',
      installDate: item.install_date || item.installDate,
      lastInspection: item.last_inspection || item.lastInspection,
      condition: item.condition || 'good',
      description: item.description,
      cost: item.cost ? parseFloat(item.cost) : undefined,
      address: item.address
    }));
  }

  private normalizeAssetType(type: string): AssetType {
    const typeMap: Record<string, AssetType> = {
      'sign': 'traffic_sign',
      'light': 'street_light',
      'streetlight': 'street_light',
      'trafficlight': 'traffic_light',
      'signal': 'traffic_light',
      'bench': 'bench',
      'seat': 'bench',
      'hydrant': 'fire_hydrant',
      'firehydrant': 'fire_hydrant',
      'manhole': 'manhole',
      'bus': 'bus_stop',
      'busstop': 'bus_stop',
      'tree': 'tree',
      'crosswalk': 'crosswalk',
      'crossing': 'crosswalk',
      'speedbump': 'speed_bump',
      'bump': 'speed_bump'
    };

    const normalized = typeMap[type.toLowerCase().replace(/[_\s-]/g, '')];
    return normalized || 'traffic_sign';
  }

  private getSpringfieldFallbackAssets(): CityAsset[] {
    // Realistic asset data for Springfield, OH
    return [
      // Traffic Signs
      {
        id: 1,
        name: 'Stop Sign - Main & High',
        type: 'traffic_sign',
        lat: 39.9250,
        lng: -83.8067,
        status: 'active',
        condition: 'good',
        installDate: '2022-03-15',
        lastInspection: '2024-01-15',
        address: 'Main St & High St'
      },
      {
        id: 2,
        name: 'Speed Limit 25 - Limestone St',
        type: 'traffic_sign',
        lat: 39.9230,
        lng: -83.8120,
        status: 'active',
        condition: 'fair',
        installDate: '2021-08-10',
        lastInspection: '2024-02-01',
        address: '100 Limestone St'
      },

      // Street Lights
      {
        id: 3,
        name: 'Street Light #101',
        type: 'street_light',
        lat: 39.9245,
        lng: -83.8080,
        status: 'active',
        condition: 'excellent',
        installDate: '2023-05-20',
        lastInspection: '2024-01-10',
        cost: 1200,
        address: '125 Columbia St'
      },
      {
        id: 4,
        name: 'Street Light #102',
        type: 'street_light',
        lat: 39.9260,
        lng: -83.8050,
        status: 'maintenance',
        condition: 'poor',
        installDate: '2019-09-15',
        lastInspection: '2023-12-20',
        cost: 1200,
        address: '200 Fountain Ave'
      },
      {
        id: 5,
        name: 'Street Light #103',
        type: 'street_light',
        lat: 39.9275,
        lng: -83.8100,
        status: 'active',
        condition: 'good',
        installDate: '2022-11-08',
        lastInspection: '2024-01-25',
        cost: 1200,
        address: '300 High St'
      },

      // Traffic Lights
      {
        id: 6,
        name: 'Traffic Signal - Main & Limestone',
        type: 'traffic_light',
        lat: 39.9250,
        lng: -83.8120,
        status: 'active',
        condition: 'good',
        installDate: '2020-06-12',
        lastInspection: '2024-02-05',
        cost: 15000,
        address: 'Main St & Limestone St'
      },
      {
        id: 7,
        name: 'Traffic Signal - High & Columbia',
        type: 'traffic_light',
        lat: 39.9290,
        lng: -83.8080,
        status: 'active',
        condition: 'excellent',
        installDate: '2023-04-18',
        lastInspection: '2024-01-30',
        cost: 15000,
        address: 'High St & Columbia St'
      },

      // Benches
      {
        id: 8,
        name: 'Park Bench #1',
        type: 'bench',
        lat: 39.9240,
        lng: -83.8060,
        status: 'active',
        condition: 'good',
        installDate: '2021-04-22',
        lastInspection: '2023-10-15',
        cost: 800,
        address: 'Fountain Park'
      },
      {
        id: 9,
        name: 'Bus Stop Bench #1',
        type: 'bench',
        lat: 39.9270,
        lng: -83.8090,
        status: 'active',
        condition: 'fair',
        installDate: '2020-02-14',
        lastInspection: '2023-11-20',
        cost: 600,
        address: '250 High St'
      },

      // Fire Hydrants
      {
        id: 10,
        name: 'Fire Hydrant #201',
        type: 'fire_hydrant',
        lat: 39.9235,
        lng: -83.8075,
        status: 'active',
        condition: 'excellent',
        installDate: '2022-07-30',
        lastInspection: '2024-01-08',
        cost: 2500,
        address: '150 Center St'
      },
      {
        id: 11,
        name: 'Fire Hydrant #202',
        type: 'fire_hydrant',
        lat: 39.9265,
        lng: -83.8105,
        status: 'active',
        condition: 'good',
        installDate: '2021-09-25',
        lastInspection: '2024-02-12',
        cost: 2500,
        address: '180 Clifton Ave'
      },

      // Manholes
      {
        id: 12,
        name: 'Storm Drain #501',
        type: 'manhole',
        lat: 39.9255,
        lng: -83.8085,
        status: 'active',
        condition: 'good',
        installDate: '2018-05-10',
        lastInspection: '2023-09-18',
        address: '175 Columbia St'
      },
      {
        id: 13,
        name: 'Sewer Access #502',
        type: 'manhole',
        lat: 39.9220,
        lng: -83.8095,
        status: 'active',
        condition: 'fair',
        installDate: '2017-11-05',
        lastInspection: '2023-08-22',
        address: '120 Main St'
      },

      // Bus Stops
      {
        id: 14,
        name: 'Bus Stop - Downtown',
        type: 'bus_stop',
        lat: 39.9280,
        lng: -83.8070,
        status: 'active',
        condition: 'good',
        installDate: '2021-12-03',
        lastInspection: '2023-12-10',
        cost: 3200,
        address: '220 High St'
      },

      // Trees
      {
        id: 15,
        name: 'Oak Tree #301',
        type: 'tree',
        lat: 39.9245,
        lng: -83.8055,
        status: 'active',
        condition: 'excellent',
        installDate: '2019-04-15',
        lastInspection: '2023-10-05',
        address: 'Fountain Park'
      },
      {
        id: 16,
        name: 'Maple Tree #302',
        type: 'tree',
        lat: 39.9255,
        lng: -83.8110,
        status: 'active',
        condition: 'good',
        installDate: '2020-03-20',
        lastInspection: '2023-09-28',
        address: '140 Limestone St'
      },

      // Crosswalks
      {
        id: 17,
        name: 'Crosswalk - Main & High',
        type: 'crosswalk',
        lat: 39.9252,
        lng: -83.8065,
        status: 'active',
        condition: 'fair',
        installDate: '2021-06-08',
        lastInspection: '2023-11-15',
        cost: 1800,
        address: 'Main St & High St'
      }
    ];
  }

  getAssetTypeConfig(type: AssetType): AssetTypeConfig {
    return ASSET_TYPES.find(config => config.type === type) || ASSET_TYPES[0];
  }

  filterAssetsByType(assets: CityAsset[], types: AssetType[]): CityAsset[] {
    if (types.length === 0) return assets;
    return assets.filter(asset => types.includes(asset.type));
  }

  filterAssetsByCondition(assets: CityAsset[], conditions: string[]): CityAsset[] {
    if (conditions.length === 0) return assets;
    return assets.filter(asset => conditions.includes(asset.condition));
  }

  filterAssetsByStatus(assets: CityAsset[], statuses: string[]): CityAsset[] {
    if (statuses.length === 0) return assets;
    return assets.filter(asset => statuses.includes(asset.status));
  }

  exportAssetsToCSV(assets: CityAsset[]): string {
    const headers = [
      'ID', 'Name', 'Type', 'Status', 'Condition', 'Latitude', 'Longitude', 
      'Install Date', 'Last Inspection', 'Cost', 'Address', 'Description'
    ];
    
    const rows = assets.map(asset => [
      asset.id,
      `"${asset.name}"`,
      asset.type,
      asset.status,
      asset.condition,
      asset.lat.toFixed(6),
      asset.lng.toFixed(6),
      asset.installDate || '',
      asset.lastInspection || '',
      asset.cost || '',
      `"${asset.address || ''}"`,
      `"${asset.description || ''}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  async createAsset(asset: Omit<CityAsset, 'id'>): Promise<CityAsset> {
    // In a real app, this would make an API call
    const newAsset: CityAsset = {
      ...asset,
      id: Date.now() // Simple ID generation for demo
    };

    // Update cache
    const cacheKey = 'springfield_assets';
    const currentAssets = this.cache.get(cacheKey) || [];
    this.cache.set(cacheKey, [...currentAssets, newAsset]);

    return newAsset;
  }

  async updateAsset(id: number, updates: Partial<CityAsset>): Promise<CityAsset | null> {
    // In a real app, this would make an API call
    const cacheKey = 'springfield_assets';
    const currentAssets = this.cache.get(cacheKey) || [];
    const assetIndex = currentAssets.findIndex(asset => asset.id === id);

    if (assetIndex === -1) return null;

    const updatedAsset = { ...currentAssets[assetIndex], ...updates };
    currentAssets[assetIndex] = updatedAsset;
    this.cache.set(cacheKey, currentAssets);

    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    // In a real app, this would make an API call
    const cacheKey = 'springfield_assets';
    const currentAssets = this.cache.get(cacheKey) || [];
    const filteredAssets = currentAssets.filter(asset => asset.id !== id);

    if (filteredAssets.length === currentAssets.length) return false;

    this.cache.set(cacheKey, filteredAssets);
    return true;
  }
}

export const assetsService = new AssetsService();

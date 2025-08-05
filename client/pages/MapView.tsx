import React, { useEffect, useRef, useState, useCallback } from 'react';
import L, { Map as LeafletMap, TileLayer, CircleMarker, Marker, Polyline } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Navigation,
  Satellite,
  Map as MapIcon,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureMatrix } from '@/hooks/useFeatureMatrix';

// Import our map components and services
import { MapLegend, getPCIColor, getPCILabel, PCI_LEVELS } from '@/components/map/MapLegend';
import { PCILegend } from '@/components/map/PCILegend';
import { MapToolbar } from '@/components/map/MapToolbar';
import { overpassService, RoadSegment } from '@/services/overpassService';
import { assetsService, CityAsset, ASSET_TYPES, AssetType } from '@/services/assetsService';

// Import Leaflet CSS and custom map styles
import 'leaflet/dist/leaflet.css';
import '@/styles/map-styles.css';

// Fix Leaflet default markers
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Configure default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Springfield, OH coordinates
const SPRINGFIELD_CENTER: [number, number] = [39.9250, -83.8067];
const DEFAULT_ZOOM = 14;

// Simple road segment interface for immediate use
interface SimpleRoadSegment {
  id: number;
  name: string;
  highway: string;
  coordinates: [number, number][];
  centerLat: number;
  centerLng: number;
  pci: number;
  roadType: string;
  length: number;
  surface?: string;
}

export default function MapView() {
  const { user } = useAuth();
  const { userPlan } = useFeatureMatrix();
  
  // Map state
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Data state
  const [roadSegments, setRoadSegments] = useState<SimpleRoadSegment[]>([]);
  const [cityAssets, setCityAssets] = useState<CityAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPCILayer, setShowPCILayer] = useState(true);
  const [showAssetLayer, setShowAssetLayer] = useState(true);
  const [pciFilter, setPciFilter] = useState(0);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<AssetType[]>([]);

  // Plan-based access control
  const hasPCIAccess = ['pro', 'premium', 'satellite_enterprise', 'driving_enterprise'].includes(userPlan);
  const hasExportAccess = ['basic', 'pro', 'premium', 'satellite_enterprise', 'driving_enterprise'].includes(userPlan);
  
  // Layer refs
  const roadLayersRef = useRef<Polyline[]>([]);
  const assetLayersRef = useRef<Marker[]>([]);
  const currentTileLayerRef = useRef<TileLayer | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadMapData();
  }, []);

  // Initialize map
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!mapRef.current || leafletMapRef.current) return;

      try {
        initializeMap();
        setIsMapLoaded(true);
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setError('Failed to initialize map. Please refresh the page.');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map layers when data changes
  useEffect(() => {
    if (isMapLoaded && leafletMapRef.current) {
      updateRoadLayers();
    }
  }, [roadSegments, showPCILayer, pciFilter, isDarkMode, isMapLoaded]);

  useEffect(() => {
    if (isMapLoaded && leafletMapRef.current) {
      updateAssetLayers();
    }
  }, [cityAssets, showAssetLayer, selectedAssetTypes, isDarkMode, isMapLoaded]);

  // Update tile layer when theme changes
  useEffect(() => {
    if (isMapLoaded && leafletMapRef.current && isDarkMode !== undefined) {
      updateTileLayer();
    }
  }, [isDarkMode, isMapLoaded]);

  const loadMapData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load sample data immediately to show something
      const fallbackRoads: SimpleRoadSegment[] = [
        {
          id: 1,
          name: 'Main Street',
          highway: 'primary',
          coordinates: [
            [39.9243, -83.8090], [39.9248, -83.8075], [39.9252, -83.8060], [39.9256, -83.8045]
          ],
          centerLat: 39.9250,
          centerLng: -83.8067,
          pci: 78,
          roadType: 'Arterial',
          length: 0.8,
          surface: 'asphalt'
        },
        {
          id: 2,
          name: 'High Street',
          highway: 'secondary',
          coordinates: [
            [39.9290, -83.8100], [39.9285, -83.8080], [39.9280, -83.8060], [39.9275, -83.8040], [39.9270, -83.8030]
          ],
          centerLat: 39.9280,
          centerLng: -83.8065,
          pci: 65,
          roadType: 'Collector',
          length: 1.2,
          surface: 'asphalt'
        },
        {
          id: 3,
          name: 'Limestone Street',
          highway: 'secondary',
          coordinates: [
            [39.9200, -83.8120], [39.9220, -83.8118], [39.9240, -83.8116], [39.9260, -83.8114], [39.9280, -83.8112], [39.9300, -83.8110]
          ],
          centerLat: 39.9250,
          centerLng: -83.8115,
          pci: 42,
          roadType: 'Collector',
          length: 1.8,
          surface: 'asphalt'
        },
        {
          id: 4,
          name: 'Columbia Street',
          highway: 'residential',
          coordinates: [
            [39.9220, -83.8080], [39.9230, -83.8082], [39.9250, -83.8084], [39.9270, -83.8086], [39.9280, -83.8088]
          ],
          centerLat: 39.9250,
          centerLng: -83.8084,
          pci: 85,
          roadType: 'Local',
          length: 0.9,
          surface: 'asphalt'
        },
        {
          id: 5,
          name: 'Fountain Avenue',
          highway: 'residential',
          coordinates: [
            [39.9210, -83.8050], [39.9225, -83.8052], [39.9240, -83.8054], [39.9255, -83.8056], [39.9270, -83.8058]
          ],
          centerLat: 39.9240,
          centerLng: -83.8054,
          pci: 32,
          roadType: 'Local',
          length: 0.7,
          surface: 'asphalt'
        },
        {
          id: 6,
          name: 'Yellow Springs Street',
          highway: 'tertiary',
          coordinates: [
            [39.9200, -83.8000], [39.9220, -83.7990], [39.9240, -83.7980], [39.9260, -83.7970], [39.9280, -83.7960], [39.9300, -83.7950]
          ],
          centerLat: 39.9250,
          centerLng: -83.7975,
          pci: 91,
          roadType: 'Collector',
          length: 1.5,
          surface: 'asphalt'
        },
        {
          id: 7,
          name: 'Center Street',
          highway: 'residential',
          coordinates: [
            [39.9230, -83.8110], [39.9235, -83.8095], [39.9240, -83.8080], [39.9245, -83.8065], [39.9250, -83.8050], [39.9255, -83.8040]
          ],
          centerLat: 39.9240,
          centerLng: -83.8075,
          pci: 18,
          roadType: 'Local',
          length: 0.8,
          surface: 'asphalt'
        },
        {
          id: 8,
          name: 'Clifton Avenue',
          highway: 'residential',
          coordinates: [
            [39.9260, -83.8130], [39.9262, -83.8110], [39.9264, -83.8090], [39.9266, -83.8070], [39.9268, -83.8050], [39.9270, -83.8030], [39.9272, -83.8020]
          ],
          centerLat: 39.9266,
          centerLng: -83.8075,
          pci: 7,
          roadType: 'Local',
          length: 1.1,
          surface: 'concrete'
        }
      ];

      setRoadSegments(fallbackRoads);

      // Load assets
      const assets = await assetsService.fetchSpringfieldAssets();
      setCityAssets(assets);

      // Try to load real road data in background
      try {
        const roads = await overpassService.fetchSpringfieldRoads();
        if (roads.length > 0) {
          setRoadSegments(roads);
        }
      } catch (roadError) {
        console.warn('Failed to load real road data, using fallback:', roadError);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current) {
      console.error('Map container not found');
      return;
    }

    console.log('Initializing map...');

    try {
      const map = L.map(mapRef.current, {
        center: SPRINGFIELD_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: true
      });

      leafletMapRef.current = map;

      // Add zoom controls to top-right
      L.control.zoom({
        position: 'topright'
      }).addTo(map);

      // Add initial tile layer
      const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

      L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 19
      }).addTo(map);

      // Add scale control
      L.control.scale({
        position: 'bottomleft'
      }).addTo(map);

      // Add some immediate sample data to show the map is working
      const sampleRoad = L.circleMarker([39.9250, -83.8067], {
        radius: 8,
        fillColor: '#16a34a',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      });

      sampleRoad.bindPopup('<div class="p-2"><strong>Main Street</strong><br/>PCI: 78 (Good)<br/>Sample data loading...</div>');
      sampleRoad.addTo(map);

      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      throw error;
    }
  };

  const updateTileLayer = () => {
    if (!leafletMapRef.current) return;

    try {
      // Remove existing tile layer
      if (currentTileLayerRef.current) {
        leafletMapRef.current.removeLayer(currentTileLayerRef.current);
      }

      // Add appropriate tile layer based on theme
      const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 19
      });

      tileLayer.addTo(leafletMapRef.current);
      currentTileLayerRef.current = tileLayer;
    } catch (error) {
      console.error('Error updating tile layer:', error);
    }
  };

  const updateRoadLayers = () => {
    if (!leafletMapRef.current) return;

    // Remove existing road layers
    roadLayersRef.current.forEach(layer => {
      leafletMapRef.current!.removeLayer(layer);
    });
    roadLayersRef.current = [];

    if (!showPCILayer) return;

    // Filter roads based on PCI threshold
    const filteredRoads = roadSegments.filter(road => road.pci >= pciFilter);

    // Add road segments as polylines with PCI color coding
    filteredRoads.forEach((road, index) => {
      const color = getPCIColor(road.pci, isDarkMode);
      const label = getPCILabel(road.pci);

      // Create polyline with enhanced styling
      const polyline = L.polyline(road.coordinates, {
        color: color,
        weight: 4,
        opacity: 0.9,
        smoothFactor: 1,
        className: 'road-segment'
      });

      // Add subtle glow effect for better visibility
      const glowPolyline = L.polyline(road.coordinates, {
        color: color,
        weight: 8,
        opacity: 0.3,
        smoothFactor: 1
      });

      // Create enhanced popup content
      const popupContent = `
        <div class="p-4 min-w-[280px] ${isDarkMode ? 'dark' : ''}" style="font-family: inherit;">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-4 h-4 rounded-full border-2 border-white" style="background-color: ${color}"></div>
            <h4 class="font-bold text-lg text-slate-800 dark:text-white">${road.name}</h4>
          </div>
          <div class="space-y-3 text-sm">
            <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-slate-600 dark:text-slate-400 font-medium">PCI Score:</span>
                <span class="font-bold px-3 py-1 rounded-full text-white text-sm" style="background-color: ${color}">
                  ${road.pci} - ${label}
                </span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div class="h-2 rounded-full transition-all duration-300" style="width: ${road.pci}%; background-color: ${color}"></div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-slate-500 dark:text-slate-400 block">Road Type</span>
                <span class="font-semibold text-slate-800 dark:text-white">${road.roadType}</span>
              </div>
              <div>
                <span class="text-slate-500 dark:text-slate-400 block">Length</span>
                <span class="font-semibold text-slate-800 dark:text-white">${road.length} mi</span>
              </div>
              ${road.surface ? `
              <div>
                <span class="text-slate-500 dark:text-slate-400 block">Surface</span>
                <span class="font-semibold text-slate-800 dark:text-white capitalize">${road.surface}</span>
              </div>` : ''}
              <div>
                <span class="text-slate-500 dark:text-slate-400 block">Highway</span>
                <span class="font-semibold text-slate-800 dark:text-white capitalize">${road.highway}</span>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add glow layer first (behind main polyline)
      glowPolyline.addTo(leafletMapRef.current!);

      // Add main polyline
      polyline.addTo(leafletMapRef.current!);

      // Bind popup to main polyline
      polyline.bindPopup(popupContent, {
        className: isDarkMode ? 'dark-popup' : 'light-popup',
        maxWidth: 320,
        offset: [0, -10]
      });

      // Add hover effects
      polyline.on('mouseover', function() {
        this.setStyle({
          weight: 6,
          opacity: 1
        });
      });

      polyline.on('mouseout', function() {
        this.setStyle({
          weight: 4,
          opacity: 0.9
        });
      });

      // Store both polylines for cleanup
      roadLayersRef.current.push(glowPolyline);
      roadLayersRef.current.push(polyline);

      // Add fade-in animation
      setTimeout(() => {
        if (polyline._path) {
          polyline._path.style.transition = 'opacity 0.5s ease-in-out';
          polyline._path.style.opacity = '0.9';
        }
        if (glowPolyline._path) {
          glowPolyline._path.style.transition = 'opacity 0.5s ease-in-out';
          glowPolyline._path.style.opacity = '0.3';
        }
      }, index * 100); // Stagger animations
    });
  };

  const updateAssetLayers = () => {
    if (!leafletMapRef.current) return;

    // Remove existing asset layers
    assetLayersRef.current.forEach(layer => {
      leafletMapRef.current!.removeLayer(layer);
    });
    assetLayersRef.current = [];

    if (!showAssetLayer) return;

    // Filter assets by selected types
    const filteredAssets = selectedAssetTypes.length > 0 
      ? cityAssets.filter(asset => selectedAssetTypes.includes(asset.type))
      : cityAssets;

    // Add city assets as markers
    filteredAssets.forEach(asset => {
      const assetConfig = ASSET_TYPES.find(config => config.type === asset.type);
      if (!assetConfig) return;

      const color = isDarkMode ? (assetConfig.darkColor || assetConfig.color) : assetConfig.color;

      // Create custom icon
      const icon = L.divIcon({
        html: `
          <div class="asset-marker" style="background-color: ${color};">
            <span style="font-size: 12px;">${assetConfig.icon}</span>
          </div>
        `,
        className: 'custom-asset-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([asset.lat, asset.lng], { icon });

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-[250px] ${isDarkMode ? 'dark' : ''}">
          <h4 class="font-semibold text-slate-800 dark:text-white mb-2">${asset.name}</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-slate-600 dark:text-slate-400">Type:</span>
              <span class="font-medium text-slate-800 dark:text-white">${assetConfig.label}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-600 dark:text-slate-400">Status:</span>
              <span class="px-2 py-1 rounded text-xs font-medium ${
                asset.status === 'active' ? 'bg-green-100 text-green-800' :
                asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                asset.status === 'damaged' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }">${asset.status}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-600 dark:text-slate-400">Condition:</span>
              <span class="px-2 py-1 rounded text-xs font-medium ${
                asset.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                asset.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                asset.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                asset.condition === 'poor' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }">${asset.condition}</span>
            </div>
            ${asset.address ? `
            <div class="flex justify-between items-center">
              <span class="text-slate-600 dark:text-slate-400">Address:</span>
              <span class="font-medium text-slate-800 dark:text-white text-right">${asset.address}</span>
            </div>` : ''}
            ${asset.installDate ? `
            <div class="flex justify-between items-center">
              <span class="text-slate-600 dark:text-slate-400">Installed:</span>
              <span class="font-medium text-slate-800 dark:text-white">${new Date(asset.installDate).toLocaleDateString()}</span>
            </div>` : ''}
            ${asset.cost ? `
            <div class="flex justify-between items-center">
              <span class="text-slate-600 dark:text-slate-400">Cost:</span>
              <span class="font-medium text-slate-800 dark:text-white">$${asset.cost.toLocaleString()}</span>
            </div>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: isDarkMode ? 'dark-popup' : 'light-popup',
        maxWidth: 300
      });

      marker.addTo(leafletMapRef.current!);
      assetLayersRef.current.push(marker);
    });
  };

  const handleExportCSV = useCallback((type: 'roads' | 'assets') => {
    try {
      let csvContent: string;
      let filename: string;

      if (type === 'roads') {
        const filteredRoads = roadSegments.filter(road => road.pci >= pciFilter);
        csvContent = overpassService.exportRoadsToCSV(filteredRoads);
        filename = `springfield-roads-pci-${pciFilter}plus-${new Date().toISOString().split('T')[0]}.csv`;
      } else {
        const filteredAssets = selectedAssetTypes.length > 0 
          ? cityAssets.filter(asset => selectedAssetTypes.includes(asset.type))
          : cityAssets;
        csvContent = assetsService.exportAssetsToCSV(filteredAssets);
        filename = `springfield-assets-${new Date().toISOString().split('T')[0]}.csv`;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [roadSegments, cityAssets, pciFilter, selectedAssetTypes]);

  const handleExportScreenshot = useCallback(() => {
    if (!leafletMapRef.current) return;

    // Use leaflet-image or html2canvas for screenshot
    // For now, we'll use the browser's built-in screenshot capability
    try {
      // This is a simplified implementation
      // In production, you'd want to use a proper screenshot library
      window.print();
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  }, []);

  const handleResetView = useCallback(() => {
    if (!leafletMapRef.current) return;
    leafletMapRef.current.setView(SPRINGFIELD_CENTER, DEFAULT_ZOOM);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      leafletMapRef.current?.invalidateSize();
    }, 100);
  }, [isFullscreen]);

  // Calculate statistics
  const stats = {
    totalRoads: roadSegments.length,
    filteredRoads: roadSegments.filter(road => road.pci >= pciFilter).length,
    totalAssets: cityAssets.length,
    filteredAssets: selectedAssetTypes.length > 0 
      ? cityAssets.filter(asset => selectedAssetTypes.includes(asset.type)).length
      : cityAssets.length,
    avgPCI: roadSegments.length > 0 
      ? Math.round(roadSegments.reduce((sum, road) => sum + road.pci, 0) / roadSegments.length)
      : 0,
    pciDistribution: PCI_LEVELS.map(level => ({
      ...level,
      count: roadSegments.filter(road => road.pci >= level.min && road.pci <= level.max).length
    }))
  };

  // Show loading overlay instead of blocking entire page
  const showLoadingOverlay = loading && !isMapLoaded;

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
      isFullscreen && "fixed inset-0 z-50",
      isDarkMode && "dark"
    )}>
      <style>{`
        .asset-marker {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .custom-asset-icon {
          background: none !important;
          border: none !important;
        }
        .dark-popup .leaflet-popup-content-wrapper {
          background: #1e293b;
          color: white;
        }
        .dark-popup .leaflet-popup-tip {
          background: #1e293b;
        }
        .light-popup .leaflet-popup-content-wrapper {
          background: white;
          color: #1e293b;
        }
      `}</style>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">
                Springfield, Ohio - Infrastructure Map
              </h1>
              <p className="text-muted-foreground">
                Interactive map showing road conditions and city assets
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Navigation className="w-4 h-4 mr-2" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={loadMapData} className="ml-auto">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalRoads}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Roads</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.avgPCI}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg PCI</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.pciDistribution.slice(0, 2).reduce((sum, level) => sum + level.count, 0)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Good+</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pciDistribution[2]?.count || 0}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Satisfactory</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pciDistribution.slice(3, 5).reduce((sum, level) => sum + level.count, 0)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Fair/Poor</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.pciDistribution.slice(5).reduce((sum, level) => sum + level.count, 0)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Critical</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalAssets}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">City Assets</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="space-y-4">
            {/* Map Toolbar */}
            <MapToolbar
              isDarkMode={isDarkMode}
              isFullscreen={isFullscreen}
              showPCILayer={showPCILayer}
              showAssetLayer={showAssetLayer}
              pciFilter={pciFilter}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onToggleFullscreen={handleToggleFullscreen}
              onTogglePCILayer={() => setShowPCILayer(!showPCILayer)}
              onToggleAssetLayer={() => setShowAssetLayer(!showAssetLayer)}
              onPCIFilterChange={setPciFilter}
              onExportCSV={handleExportCSV}
              onExportScreenshot={handleExportScreenshot}
              onResetView={handleResetView}
            />

            {/* Map Legend */}
            <MapLegend
              showPCILegend={showPCILayer}
              showAssetLegend={showAssetLayer}
              onTogglePCI={() => setShowPCILayer(!showPCILayer)}
              onToggleAssets={() => setShowAssetLayer(!showAssetLayer)}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Main Map */}
          <div className="lg:col-span-3">
            <Card className="glass-card border-white/20 h-[600px] lg:h-[700px]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-slate-800 dark:text-white">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Springfield, Ohio Infrastructure Map
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Live Data
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)] relative">
                <div
                  id="map"
                  ref={mapRef}
                  className="w-full h-full rounded-b-lg"
                  style={{ height: '600px', minHeight: '500px', width: '100%' }}
                />
                {showLoadingOverlay && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center rounded-b-lg">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">Loading Springfield, OH map data...</p>
                    </div>
                  </div>
                )}

                {!hasPCIAccess && showPCILayer && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-b-lg">
                    <div className="text-center p-8 max-w-md">
                      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-9a2 2 0 00-2-2M6 7V5a6 6 0 1112 0v2M6 7h12l-1 5H7l-1-5z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        Upgrade to Unlock Full Road Condition Data
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Access detailed PCI scores, road condition analysis, and asset management with Pro, Premium, or Enterprise plans.
                      </p>
                      <Button
                        onClick={() => window.location.href = '/pricing'}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        View Upgrade Options
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced PCI Legend with glass morphism */}
      <PCILegend
        showPCILayer={showPCILayer}
        onTogglePCI={() => setShowPCILayer(!showPCILayer)}
        isDarkMode={isDarkMode}
        position="bottom-right"
      />
    </div>
  );
}

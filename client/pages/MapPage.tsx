import { useEffect, useRef, useState } from 'react';
import L, { Map as LeafletMap } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  ArrowLeft, 
  RotateCcw, 
  Edit3, 
  Maximize, 
  ZoomIn, 
  ZoomOut, 
  Layers,
  Crown,
  Satellite,
  Car,
  Map as MapIcon,
  Info,
  BarChart3,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModifySampleDataModal } from "@/components/ModifySampleDataModal";
import { usePricing } from "@/contexts/PricingContext";
import { cn } from "@/lib/utils";

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Sample PCI data for demonstration
const samplePCIData = [
  { id: 1, name: 'Main Street', lat: 40.7589, lng: -73.9851, pci: 75, roadType: 'Arterial', length: 0.8 },
  { id: 2, name: 'Oak Avenue', lat: 40.7614, lng: -73.9776, pci: 45, roadType: 'Local', length: 0.5 },
  { id: 3, name: 'Broadway', lat: 40.7505, lng: -73.9934, pci: 85, roadType: 'Arterial', length: 1.2 },
  { id: 4, name: 'Pine Street', lat: 40.7580, lng: -73.9855, pci: 32, roadType: 'Local', length: 0.3 },
  { id: 5, name: 'Central Park West', lat: 40.7829, lng: -73.9654, pci: 68, roadType: 'Collector', length: 2.1 },
  { id: 6, name: 'Madison Avenue', lat: 40.7549, lng: -73.9840, pci: 52, roadType: 'Collector', length: 0.7 },
  { id: 7, name: 'Wall Street', lat: 40.7074, lng: -74.0113, pci: 78, roadType: 'Local', length: 0.4 },
  { id: 8, name: 'Park Avenue', lat: 40.7484, lng: -73.9857, pci: 91, roadType: 'Arterial', length: 1.5 },
  { id: 9, name: 'Lexington Avenue', lat: 40.7527, lng: -73.9772, pci: 39, roadType: 'Collector', length: 0.9 },
  { id: 10, name: 'Queens Boulevard', lat: 40.7282, lng: -73.8370, pci: 61, roadType: 'Arterial', length: 1.8 },
  { id: 11, name: 'Brooklyn Bridge', lat: 40.7061, lng: -73.9969, pci: 88, roadType: 'Bridge', length: 0.6 },
  { id: 12, name: 'FDR Drive', lat: 40.7589, lng: -73.9708, pci: 73, roadType: 'Highway', length: 3.2 }
];

const getPCIColor = (pci: number): string => {
  if (pci >= 80) return '#10B981'; // Green - Good
  if (pci >= 60) return '#F59E0B'; // Yellow - Fair  
  if (pci >= 40) return '#F97316'; // Orange - Poor
  return '#EF4444'; // Red - Failed
};

const getPCILabel = (pci: number): string => {
  if (pci >= 80) return 'Good';
  if (pci >= 60) return 'Fair';
  if (pci >= 40) return 'Poor';
  return 'Failed';
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletMap | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSatelliteLayer, setShowSatelliteLayer] = useState(false);
  const [showDrivingLayer, setShowDrivingLayer] = useState(false);
  const [pciFilter, setPciFilter] = useState<number>(0);
  const { currentPlan } = usePricing();

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current, {
      center: [40.7589, -73.9851], // New York City
      zoom: 13,
      zoomControl: false // We'll add custom controls
    });

    leafletMapRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add custom zoom controls
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Add PCI data points
    samplePCIData.forEach(road => {
      const color = getPCIColor(road.pci);
      const label = getPCILabel(road.pci);
      
      // Create a circle marker for each road segment
      const marker = L.circleMarker([road.lat, road.lng], {
        radius: Math.max(8, road.length * 5),
        fillColor: color,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      });

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h4 class="font-semibold text-slate-800 mb-2">${road.name}</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-slate-600">PCI Score:</span>
              <span class="font-semibold" style="color: ${color}">${road.pci} (${label})</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-600">Road Type:</span>
              <span class="font-medium">${road.roadType}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-600">Length:</span>
              <span class="font-medium">${road.length} miles</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'glass-card-popup'
      });

      marker.addTo(map);
    });

    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'glass-card p-4');
      div.innerHTML = `
        <h4 class="font-semibold text-slate-800 mb-3 flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
          PCI Color Scale
        </h4>
        <div class="space-y-2 text-sm">
          <div class="flex items-center">
            <div class="w-4 h-4 rounded-full mr-2" style="background-color: #10B981"></div>
            <span>80-100: Good</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded-full mr-2" style="background-color: #F59E0B"></div>
            <span>60-79: Fair</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded-full mr-2" style="background-color: #F97316"></div>
            <span>40-59: Poor</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 rounded-full mr-2" style="background-color: #EF4444"></div>
            <span>0-39: Failed</span>
          </div>
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Filter data based on PCI threshold
  const filteredData = samplePCIData.filter(road => road.pci >= pciFilter);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // In a real app, this would handle fullscreen API
    setTimeout(() => {
      leafletMapRef.current?.invalidateSize();
    }, 100);
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const stats = {
    total: samplePCIData.length,
    good: samplePCIData.filter(r => r.pci >= 80).length,
    fair: samplePCIData.filter(r => r.pci >= 60 && r.pci < 80).length,
    poor: samplePCIData.filter(r => r.pci >= 40 && r.pci < 60).length,
    failed: samplePCIData.filter(r => r.pci < 40).length,
    avgPCI: Math.round(samplePCIData.reduce((acc, r) => acc + r.pci, 0) / samplePCIData.length)
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold mt-2">PCI Map Visualization</h1>
              <p className="text-muted-foreground">Interactive map showing pavement condition intelligence data</p>
            </div>
            <div className="flex items-center space-x-3">
              <ModifySampleDataModal 
                trigger={
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modify Sample Data
                  </Button>
                }
              />
              <Button variant="outline" onClick={handleFullscreen}>
                <Maximize className="w-4 h-4 mr-2" />
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Segments</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.good}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Good (80+)</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.fair}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Fair (60-79)</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.poor}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Poor (40-59)</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Failed (&lt;40)</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.avgPCI}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg PCI</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <div className="space-y-4">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <Layers className="w-5 h-5 mr-2" />
                  Map Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="satellite-layer" className="text-sm text-slate-700 dark:text-slate-300">
                    Satellite Scan Layer
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="satellite-layer"
                      checked={showSatelliteLayer}
                      onCheckedChange={setShowSatelliteLayer}
                      disabled={currentPlan === 'free'}
                    />
                    {currentPlan === 'free' && <Crown className="w-4 h-4 text-amber-500" />}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="driving-layer" className="text-sm text-slate-700 dark:text-slate-300">
                    Driving Scan Layer
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="driving-layer"
                      checked={showDrivingLayer}
                      onCheckedChange={setShowDrivingLayer}
                      disabled={currentPlan !== 'enterprise'}
                    />
                    {currentPlan !== 'enterprise' && <Crown className="w-4 h-4 text-amber-500" />}
                  </div>
                </div>

                {(currentPlan === 'free') && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start space-x-2">
                      <Crown className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div className="text-xs text-amber-700 dark:text-amber-300">
                        <p className="font-medium">Premium Layers</p>
                        <p>Satellite and driving scan layers require a premium subscription.</p>
                        <Button 
                          size="sm" 
                          className="mt-2 bg-amber-600 hover:bg-amber-700 text-white text-xs"
                          onClick={handleUpgrade}
                          title="See pricing and included features"
                        >
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pci-filter" className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                    Minimum PCI Score: {pciFilter}
                  </Label>
                  <input
                    id="pci-filter"
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={pciFilter}
                    onChange={(e) => setPciFilter(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
                
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Showing {filteredData.length} of {samplePCIData.length} segments
                </div>
              </CardContent>
            </Card>

            {/* Premium Layer Previews */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 dark:text-white">
                  <Info className="w-5 h-5 mr-2" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Satellite className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Satellite Imagery</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">High-resolution overlay</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Pro+</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Car className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Driving Survey Data</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ground truth validation</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Enterprise</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Map */}
          <div className="lg:col-span-3">
            <Card className="glass-card border-white/20 h-[600px] lg:h-[700px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-slate-800 dark:text-white">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    OpenStreetMap PCI Visualization
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <MapIcon className="w-3 h-3 mr-1" />
                      Free Sample Data
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <div 
                  ref={mapRef} 
                  className="w-full h-full rounded-b-lg"
                  style={{ minHeight: '400px' }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

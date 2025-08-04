import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Search,
  Filter,
  Download,
  Share,
  Layers,
  Target,
  Navigation,
  Info,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadSegment {
  id: string;
  name: string;
  pciScore: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  length: number; // miles
  lastInspection: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  coordinates: { lat: number; lng: number };
  type: 'arterial' | 'collector' | 'local' | 'residential';
}

interface Asset {
  id: string;
  name: string;
  type: 'bridge' | 'signal' | 'sign' | 'drain' | 'light';
  coordinates: { lat: number; lng: number };
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  status: 'active' | 'maintenance' | 'needs_repair';
}

// Helena, Montana area road segments with PCI scores
const roadSegments: RoadSegment[] = [
  {
    id: 'R001',
    name: 'Last Chance Gulch',
    pciScore: 78,
    condition: 'good',
    length: 1.2,
    lastInspection: '2024-03-15',
    priority: 'medium',
    coordinates: { lat: 46.5956, lng: -112.0362 },
    type: 'arterial'
  },
  {
    id: 'R002',
    name: 'North Montana Avenue',
    pciScore: 65,
    condition: 'fair',
    length: 2.8,
    lastInspection: '2024-02-20',
    priority: 'high',
    coordinates: { lat: 46.6108, lng: -112.0422 },
    type: 'arterial'
  },
  {
    id: 'R003',
    name: 'Prospect Avenue',
    pciScore: 82,
    condition: 'good',
    length: 1.5,
    lastInspection: '2024-04-01',
    priority: 'low',
    coordinates: { lat: 46.5889, lng: -112.0275 },
    type: 'collector'
  },
  {
    id: 'R004',
    name: 'Capitol Avenue',
    pciScore: 45,
    condition: 'poor',
    length: 0.8,
    lastInspection: '2024-01-10',
    priority: 'urgent',
    coordinates: { lat: 46.5744, lng: -112.0186 },
    type: 'local'
  },
  {
    id: 'R005',
    name: 'Helena Avenue',
    pciScore: 71,
    condition: 'good',
    length: 3.2,
    lastInspection: '2024-03-28',
    priority: 'medium',
    coordinates: { lat: 46.5978, lng: -112.0561 },
    type: 'arterial'
  },
  {
    id: 'R006',
    name: 'Cedar Street',
    pciScore: 58,
    condition: 'fair',
    length: 1.1,
    lastInspection: '2024-02-15',
    priority: 'high',
    coordinates: { lat: 46.5823, lng: -112.0441 },
    type: 'residential'
  },
  {
    id: 'R007',
    name: 'Lyndale Avenue',
    pciScore: 89,
    condition: 'excellent',
    length: 2.1,
    lastInspection: '2024-04-10',
    priority: 'low',
    coordinates: { lat: 46.6034, lng: -112.0198 },
    type: 'collector'
  },
  {
    id: 'R008',
    name: 'York Road',
    pciScore: 38,
    condition: 'poor',
    length: 1.9,
    lastInspection: '2024-01-25',
    priority: 'urgent',
    coordinates: { lat: 46.6156, lng: -112.0623 },
    type: 'local'
  }
];

// Helena area assets
const assets: Asset[] = [
  {
    id: 'A001',
    name: 'Memorial Bridge',
    type: 'bridge',
    coordinates: { lat: 46.5890, lng: -112.0325 },
    condition: 'good',
    status: 'active'
  },
  {
    id: 'A002',
    name: 'Main & Montana Signal',
    type: 'signal',
    coordinates: { lat: 46.5945, lng: -112.0378 },
    condition: 'excellent',
    status: 'active'
  },
  {
    id: 'A003',
    name: 'Capitol Complex Lighting',
    type: 'light',
    coordinates: { lat: 46.5744, lng: -112.0186 },
    condition: 'fair',
    status: 'maintenance'
  },
  {
    id: 'A004',
    name: 'Prospect Ave Drainage',
    type: 'drain',
    coordinates: { lat: 46.5889, lng: -112.0275 },
    condition: 'good',
    status: 'active'
  },
  {
    id: 'A005',
    name: 'North Helena Storm Drain',
    type: 'drain',
    coordinates: { lat: 46.6108, lng: -112.0422 },
    condition: 'poor',
    status: 'needs_repair'
  },
  {
    id: 'A006',
    name: 'School Zone Signs',
    type: 'sign',
    coordinates: { lat: 46.6034, lng: -112.0198 },
    condition: 'excellent',
    status: 'active'
  }
];

export default function Map() {
  const [selectedRoad, setSelectedRoad] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [showPCI, setShowPCI] = useState(true);
  const [showAssets, setShowAssets] = useState(true);

  const filteredRoads = roadSegments.filter(road => {
    const matchesSearch = road.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition = conditionFilter === 'all' || road.condition === conditionFilter;
    return matchesSearch && matchesCondition;
  });

  const getPCIColor = (pci: number) => {
    if (pci >= 85) return 'bg-green-500';
    if (pci >= 70) return 'bg-blue-500';
    if (pci >= 55) return 'bg-yellow-500';
    if (pci >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConditionBadge = (condition: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800 border-green-200',
      good: 'bg-blue-100 text-blue-800 border-blue-200',
      fair: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      poor: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'bridge': return '🌉';
      case 'signal': return '🚦';
      case 'sign': return '🛑';
      case 'drain': return '🌊';
      case 'light': return '💡';
      default: return '📍';
    }
  };

  const calculateNetworkPCI = () => {
    const totalMiles = filteredRoads.reduce((sum, road) => sum + road.length, 0);
    const weightedPCI = filteredRoads.reduce((sum, road) => sum + (road.pciScore * road.length), 0);
    return totalMiles > 0 ? Math.round(weightedPCI / totalMiles) : 0;
  };

  const exportData = () => {
    alert('Exporting map data as PDF...');
  };

  const shareMap = () => {
    alert('Sharing map view...');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Infrastructure Map</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Helena, Montana - Interactive map with PCI scores and asset locations
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Network PCI: {calculateNetworkPCI()}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {filteredRoads.length} Road Segments
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {assets.length} Assets
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button onClick={shareMap} variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Sidebar */}
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search roads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-white/30"
                />
              </div>
              
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="glass-card border-white/30">
                  <SelectValue placeholder="Filter by condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Show PCI Scores</label>
                  <Button
                    variant={showPCI ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPCI(!showPCI)}
                  >
                    {showPCI ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Assets</label>
                  <Button
                    variant={showAssets ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowAssets(!showAssets)}
                  >
                    {showAssets ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">PCI Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm">Excellent (85-100)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-sm">Good (70-84)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span className="text-sm">Fair (55-69)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded bg-orange-500"></div>
                <span className="text-sm">Poor (40-54)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm">Critical (0-39)</span>
              </div>
            </CardContent>
          </Card>

          {/* Road List */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white">Road Segments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRoads.map((road) => (
                <div
                  key={road.id}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                    selectedRoad === road.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-white/30"
                  )}
                  onClick={() => setSelectedRoad(selectedRoad === road.id ? null : road.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 dark:text-white truncate">{road.name}</h4>
                      <p className="text-sm text-slate-500 capitalize">{road.type} • {road.length} mi</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={cn("text-xs", getConditionBadge(road.condition))}>
                        PCI {road.pciScore}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3">
          <Card className="glass-card border-white/20 h-[700px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-800 dark:text-white">Helena, Montana Infrastructure Map</CardTitle>
                  <CardDescription>
                    Interactive map showing road conditions and municipal assets
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Layers className="w-4 h-4 mr-2" />
                    Layers
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Center
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full p-6">
              {/* Map Container */}
              <div className="relative w-full h-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                {/* Mock Helena street grid */}
                <div className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 800 600">
                    {/* Street grid representing Helena */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Helena geographical features */}
                    <circle cx="400" cy="300" r="200" fill="#E0F2FE" opacity="0.3" />
                    <text x="400" y="305" textAnchor="middle" className="text-xs fill-slate-500">Helena Valley</text>
                    
                    {/* Road segments with PCI scores */}
                    {showPCI && filteredRoads.map((road, index) => {
                      const x = 200 + (index % 4) * 150;
                      const y = 150 + Math.floor(index / 4) * 100;
                      const width = road.length * 30;
                      
                      return (
                        <g key={road.id}>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height="8"
                            className={cn("cursor-pointer transition-all hover:opacity-80", getPCIColor(road.pciScore))}
                            onClick={() => setSelectedRoad(road.id)}
                          />
                          <text
                            x={x + width / 2}
                            y={y - 5}
                            textAnchor="middle"
                            className="text-xs fill-slate-700 font-medium"
                          >
                            {road.name.split(' ')[0]} ({road.pciScore})
                          </text>
                          {selectedRoad === road.id && (
                            <rect
                              x={x - 2}
                              y={y - 2}
                              width={width + 4}
                              height="12"
                              fill="none"
                              stroke="#3B82F6"
                              strokeWidth="2"
                              className="animate-pulse"
                            />
                          )}
                        </g>
                      );
                    })}
                    
                    {/* Assets as dots */}
                    {showAssets && assets.map((asset, index) => {
                      const x = 250 + (index % 3) * 120;
                      const y = 200 + Math.floor(index / 3) * 80;
                      
                      return (
                        <g key={asset.id}>
                          <circle
                            cx={x}
                            cy={y}
                            r="8"
                            className={cn(
                              "cursor-pointer transition-all hover:scale-110",
                              asset.condition === 'excellent' ? 'fill-green-500' :
                              asset.condition === 'good' ? 'fill-blue-500' :
                              asset.condition === 'fair' ? 'fill-yellow-500' :
                              asset.condition === 'poor' ? 'fill-orange-500' : 'fill-red-500'
                            )}
                            onClick={() => setSelectedAsset(asset.id)}
                          />
                          <text
                            x={x}
                            y={y + 20}
                            textAnchor="middle"
                            className="text-xs fill-slate-600"
                          >
                            {getAssetIcon(asset.type)}
                          </text>
                          {selectedAsset === asset.id && (
                            <circle
                              cx={x}
                              cy={y}
                              r="12"
                              fill="none"
                              stroke="#3B82F6"
                              strokeWidth="2"
                              className="animate-pulse"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Selected Road Info Panel */}
                {selectedRoad && (
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    {(() => {
                      const road = filteredRoads.find(r => r.id === selectedRoad);
                      if (!road) return null;
                      
                      return (
                        <Card className="glass-card border-white/20 shadow-lg">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-slate-800 dark:text-white">{road.name}</h4>
                                  <Badge variant="outline" className={cn("text-xs", getConditionBadge(road.condition))}>
                                    PCI {road.pciScore}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-slate-500">Type:</span>
                                    <span className="ml-1 capitalize">{road.type}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Length:</span>
                                    <span className="ml-1">{road.length} miles</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Last Inspection:</span>
                                    <span className="ml-1">{new Date(road.lastInspection).toLocaleDateString()}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Priority:</span>
                                    <span className={cn(
                                      "ml-1 capitalize",
                                      road.priority === 'urgent' ? 'text-red-600' :
                                      road.priority === 'high' ? 'text-orange-600' :
                                      road.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                    )}>
                                      {road.priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Navigation className="w-4 h-4 mr-2" />
                                  Directions
                                </Button>
                                <Button size="sm">
                                  <Info className="w-4 h-4 mr-2" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </div>
                )}

                {/* Selected Asset Info Panel */}
                {selectedAsset && (
                  <div className="absolute top-4 right-4 z-10">
                    {(() => {
                      const asset = assets.find(a => a.id === selectedAsset);
                      if (!asset) return null;
                      
                      return (
                        <Card className="glass-card border-white/20 shadow-lg w-64">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{getAssetIcon(asset.type)}</span>
                                <h4 className="font-semibold text-slate-800 dark:text-white">{asset.name}</h4>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Type:</span>
                                <span className="capitalize">{asset.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Condition:</span>
                                <Badge variant="outline" className={cn("text-xs", getConditionBadge(asset.condition))}>
                                  {asset.condition}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Status:</span>
                                <span className={cn(
                                  "capitalize",
                                  asset.status === 'active' ? 'text-green-600' :
                                  asset.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                                )}>
                                  {asset.status.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </div>
                )}
                
                {/* Map center indicator */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="outline" className="bg-white/90 text-slate-700 border-slate-300">
                    <MapPin className="w-3 h-3 mr-1" />
                    Helena, MT
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

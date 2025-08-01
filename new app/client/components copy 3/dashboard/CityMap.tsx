import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Map,
  Layers,
  Download,
  Filter,
  MapPin,
  AlertTriangle,
  Wrench,
  MessageSquare,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MapLayer {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  enabled: boolean;
  count: number;
}

interface CityMapProps {
  className?: string;
}

export function CityMap({ className }: CityMapProps) {
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    {
      id: "pci",
      name: "PCI Conditions",
      icon: MapPin,
      color: "bg-blue-500",
      enabled: true,
      count: 245,
    },
    {
      id: "signs",
      name: "Traffic Signs",
      icon: ShieldCheck,
      color: "bg-green-500",
      enabled: true,
      count: 1284,
    },
    {
      id: "lights",
      name: "Street Lights",
      icon: Zap,
      color: "bg-yellow-500",
      enabled: false,
      count: 892,
    },
    {
      id: "repairs",
      name: "Scheduled Repairs",
      icon: Wrench,
      color: "bg-orange-500",
      enabled: true,
      count: 23,
    },
    {
      id: "tickets",
      name: "Inspection Tickets",
      icon: AlertTriangle,
      color: "bg-red-500",
      enabled: true,
      count: 18,
    },
    {
      id: "submissions",
      name: "Citizen Reports",
      icon: MessageSquare,
      color: "bg-purple-500",
      enabled: false,
      count: 45,
    },
  ]);

  const toggleLayer = (layerId: string) => {
    setMapLayers(layers =>
      layers.map(layer =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  const enabledLayers = mapLayers.filter(layer => layer.enabled);

  return (
    <Card className={cn("city-map glass border-civic-200/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-civic-600" />
            <CardTitle>Interactive City Map</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Layers ({enabledLayers.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Map Layers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mapLayers.map((layer) => (
                  <DropdownMenuCheckboxItem
                    key={layer.id}
                    checked={layer.enabled}
                    onCheckedChange={() => toggleLayer(layer.id)}
                    className="flex items-center gap-2"
                  >
                    <div className={cn("w-3 h-3 rounded-full", layer.color)} />
                    <layer.icon className="w-4 h-4" />
                    <span className="flex-1">{layer.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {layer.count}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export to Council Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mock Map Container */}
        <div className="relative h-96 bg-gradient-to-br from-civic-50 to-civic-100 rounded-lg border-2 border-dashed border-civic-200 overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-civic-300" />
              ))}
            </div>
          </div>

          {/* Mock City Elements */}
          <div className="absolute inset-0 p-4">
            {/* Roads */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400 transform -translate-y-1/2" />
            <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-400 transform -translate-x-1/2" />
            
            {/* Mock Data Points */}
            {enabledLayers.map((layer) => (
              <div key={layer.id} className="absolute">
                {Array.from({ length: Math.min(layer.count, 8) }).map((_, i) => {
                  const positions = [
                    { top: '20%', left: '15%' },
                    { top: '30%', left: '75%' },
                    { top: '60%', left: '25%' },
                    { top: '70%', left: '80%' },
                    { top: '40%', left: '60%' },
                    { top: '80%', left: '40%' },
                    { top: '15%', left: '90%' },
                    { top: '85%', left: '10%' },
                  ];
                  const pos = positions[i % positions.length];
                  
                  return (
                    <div
                      key={i}
                      className="absolute w-3 h-3 rounded-full animate-pulse-soft cursor-pointer"
                      style={{ 
                        top: pos.top, 
                        left: pos.left,
                        animationDelay: `${i * 200}ms`
                      }}
                    >
                      <div className={cn("w-full h-full rounded-full", layer.color, "opacity-80")} />
                      <div className={cn("absolute inset-0 rounded-full animate-ping", layer.color, "opacity-30")} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Map Center Indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-civic-600 rounded-full animate-pulse">
              <div className="absolute inset-0 bg-civic-600 rounded-full animate-ping opacity-30" />
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-civic-200">
            <h4 className="text-sm font-medium mb-2">Active Layers</h4>
            <div className="space-y-1">
              {enabledLayers.slice(0, 4).map((layer) => (
                <div key={layer.id} className="flex items-center gap-2 text-xs">
                  <div className={cn("w-2 h-2 rounded-full", layer.color)} />
                  <span>{layer.name}</span>
                  <Badge variant="outline" className="text-xs py-0 px-1">
                    {layer.count}
                  </Badge>
                </div>
              ))}
              {enabledLayers.length > 4 && (
                <div className="text-xs text-muted-foreground">
                  +{enabledLayers.length - 4} more layers
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-civic-600">245</div>
            <div className="text-xs text-muted-foreground">Road Segments</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-civic-600">23</div>
            <div className="text-xs text-muted-foreground">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-civic-600">1,284</div>
            <div className="text-xs text-muted-foreground">Managed Assets</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-civic-600">7.8</div>
            <div className="text-xs text-muted-foreground">Avg PCI Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

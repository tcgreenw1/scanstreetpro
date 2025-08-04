import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Eye, 
  EyeOff,
  Download,
  Maximize2,
  SlidersHorizontal,
  TrendingUp,
  MapPin,
  X
} from "lucide-react";
import { ScanIssue } from "@shared/api";

interface ImageOverlayViewerProps {
  issue: ScanIssue;
  onClose?: () => void;
  className?: string;
}

export function ImageOverlayViewer({ issue, onClose, className }: ImageOverlayViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(70);
  const [comparison, setComparison] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [showPciChart, setShowPciChart] = useState(false);
  
  const imageRef = useRef<HTMLDivElement>(null);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleReset = () => {
    setZoom(100);
    setBrightness(100);
    setContrast(100);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 100) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const imageStyle = {
    transform: `scale(${zoom / 100}) translate(${panPosition.x}px, ${panPosition.y}px)`,
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
    cursor: zoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default'
  };

  const getPciColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 55) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Mock PCI data over time for chart
  const pciHistory = [
    { date: '2023-01', score: 85 },
    { date: '2023-07', score: 78 },
    { date: '2024-01', score: issue.pciScore },
  ];

  return (
    <div className={`${className} glass-card`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              AI Overlay Viewer
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {issue.location.roadName} • {issue.location.segment}
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Issue Details */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getPciColor(issue.pciScore)}>
            PCI: {issue.pciScore}
          </Badge>
          <Badge variant="outline">
            {issue.issueType.replace('_', ' ')}
          </Badge>
          <Badge variant="outline">
            AI: {Math.round(issue.aiConfidence * 100)}%
          </Badge>
          <Badge variant="outline">
            {issue.severity}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={comparison === 'side-by-side' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setComparison('side-by-side')}
            >
              Side by Side
            </Button>
            <Button
              variant={comparison === 'overlay' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setComparison('overlay')}
            >
              Overlay
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={showPciChart ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPciChart(!showPciChart)}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              PCI Trend
            </Button>
          </div>
        </div>

        {/* Image Viewer */}
        <div className="relative">
          {comparison === 'side-by-side' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Original Image */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Original Scan</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div 
                    ref={imageRef}
                    className="relative aspect-video bg-muted overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img 
                      src={issue.imageUrl} 
                      alt="Original road scan"
                      className="w-full h-full object-cover transition-transform"
                      style={imageStyle}
                      draggable={false}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* AI Overlay */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">AI Analysis</CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={showOverlay}
                        onCheckedChange={setShowOverlay}
                        id="overlay-toggle"
                      />
                      <Label htmlFor="overlay-toggle" className="text-xs">
                        Show Overlay
                      </Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <img 
                      src={issue.imageUrl} 
                      alt="AI analyzed road scan"
                      className="w-full h-full object-cover transition-transform"
                      style={imageStyle}
                      draggable={false}
                    />
                    {showOverlay && issue.overlayImageUrl && (
                      <img 
                        src={issue.overlayImageUrl} 
                        alt="AI overlay"
                        className="absolute inset-0 w-full h-full object-cover transition-all"
                        style={{
                          ...imageStyle,
                          opacity: overlayOpacity / 100,
                          mixBlendMode: 'multiply'
                        }}
                        draggable={false}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Overlay Mode */
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Combined View</CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={showOverlay}
                      onCheckedChange={setShowOverlay}
                      id="overlay-toggle-combined"
                    />
                    <Label htmlFor="overlay-toggle-combined" className="text-xs">
                      AI Overlay
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  className="relative aspect-video bg-muted overflow-hidden"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img 
                    src={issue.imageUrl} 
                    alt="Road scan"
                    className="w-full h-full object-cover transition-transform"
                    style={imageStyle}
                    draggable={false}
                  />
                  {showOverlay && issue.overlayImageUrl && (
                    <img 
                      src={issue.overlayImageUrl} 
                      alt="AI overlay"
                      className="absolute inset-0 w-full h-full object-cover transition-all"
                      style={{
                        ...imageStyle,
                        opacity: overlayOpacity / 100,
                        mixBlendMode: 'multiply'
                      }}
                      draggable={false}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* PCI Trend Chart */}
        {showPciChart && (
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">PCI Score Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 h-24">
                {pciHistory.map((point, index) => (
                  <div key={point.date} className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-8 rounded-t ${getPciColor(point.score).replace('text', 'bg')} opacity-80`}
                      style={{ height: `${(point.score / 100) * 80}px` }}
                    />
                    <div className="text-xs text-muted-foreground">{point.date}</div>
                    <div className={`text-xs font-medium ${getPciColor(point.score)}`}>
                      {point.score}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zoom & Pan Controls */}
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                Zoom & Pan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={50}
                    max={400}
                    step={25}
                    className="w-full"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <span className="text-xs w-12 text-center">{zoom}%</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset View
              </Button>
            </CardContent>
          </Card>

          {/* Image Adjustments */}
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Image Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Brightness</Label>
                  <span>{brightness}%</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={([value]) => setBrightness(value)}
                  min={50}
                  max={200}
                  step={10}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Label>Contrast</Label>
                  <span>{contrast}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  onValueChange={([value]) => setContrast(value)}
                  min={50}
                  max={200}
                  step={10}
                />
              </div>

              {showOverlay && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>Overlay Opacity</Label>
                    <span>{overlayOpacity}%</span>
                  </div>
                  <Slider
                    value={[overlayOpacity]}
                    onValueChange={([value]) => setOverlayOpacity(value)}
                    min={0}
                    max={100}
                    step={10}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Download Original
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Download Analysis
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-4 h-4 mr-1" />
            Fullscreen
          </Button>
        </div>
      </CardContent>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Camera, 
  Mic, 
  MicOff,
  CheckCircle, 
  XCircle,
  Upload,
  Navigation,
  Clock,
  User,
  FileImage,
  Volume2,
  Play,
  Pause,
  Save,
  X
} from "lucide-react";
import { ScanIssue, InspectorNote } from "@shared/api";

interface VerifyInPersonModeProps {
  issue: ScanIssue;
  onSave: (note: Partial<InspectorNote>) => void;
  onClose?: () => void;
  className?: string;
}

export function VerifyInPersonMode({ issue, onSave, onClose, className }: VerifyInPersonModeProps) {
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [adjustments, setAdjustments] = useState({
    issueType: issue.issueType,
    severity: issue.severity,
    repairSuggestion: issue.aiSuggestion,
    locationCorrect: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-get GPS location when component mounts
    handleGetGpsLocation();
  }, []);

  const handleGetGpsLocation = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setGpsLoading(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPhotoUrls(prev => [...prev, url]);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGpsAccuracy = (accuracy: number) => {
    if (accuracy <= 5) return { label: "Excellent", color: "text-green-600" };
    if (accuracy <= 10) return { label: "Good", color: "text-lime-600" };
    if (accuracy <= 20) return { label: "Fair", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  };

  const handleSave = () => {
    const note: Partial<InspectorNote> = {
      issueId: issue.id,
      inspectorId: "current-inspector", // Would come from auth
      inspectorName: "Inspector Johnson", // Would come from auth
      comments,
      photoUploads: photoUrls, // In real app, would upload files and get URLs
      voiceNoteUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
      adjustmentDetails: {
        newIssueType: adjustments.issueType !== issue.issueType ? adjustments.issueType : undefined,
        newSeverity: adjustments.severity !== issue.severity ? adjustments.severity : undefined,
        newRepairSuggestion: adjustments.repairSuggestion !== issue.aiSuggestion ? adjustments.repairSuggestion : undefined,
      },
      gpsCheckIn: gpsLocation ? {
        latitude: gpsLocation.lat,
        longitude: gpsLocation.lng,
        timestamp: new Date().toISOString(),
        accuracy: gpsLocation.accuracy
      } : undefined
    };
    
    onSave(note);
  };

  const distanceFromAI = gpsLocation ? 
    Math.sqrt(
      Math.pow(gpsLocation.lat - issue.location.latitude, 2) + 
      Math.pow(gpsLocation.lng - issue.location.longitude, 2)
    ) * 111000 : null; // Rough conversion to meters

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Field Verification
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
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {issue.issueType.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">
              {issue.severity} severity
            </Badge>
            <Badge variant="outline">
              PCI: {issue.pciScore}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPS Check-in */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              GPS Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleGetGpsLocation} 
                disabled={gpsLoading}
                className="flex-1"
              >
                {gpsLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Update Location
                  </>
                )}
              </Button>
            </div>
            
            {gpsLocation && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">Latitude</Label>
                    <div className="font-mono">{gpsLocation.lat.toFixed(6)}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Longitude</Label>
                    <div className="font-mono">{gpsLocation.lng.toFixed(6)}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy:</span>
                  <Badge className={getGpsAccuracy(gpsLocation.accuracy).color}>
                    ±{gpsLocation.accuracy.toFixed(1)}m • {getGpsAccuracy(gpsLocation.accuracy).label}
                  </Badge>
                </div>
                
                {distanceFromAI && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Distance from AI location:</span>
                    <Badge variant={distanceFromAI < 10 ? "default" : "destructive"}>
                      {distanceFromAI.toFixed(1)}m
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              Field Photos ({photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photos
            </Button>
            
            {photoUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Field photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => {
                        setPhotos(prev => prev.filter((_, i) => i !== index));
                        setPhotoUrls(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Note */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Voice Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <Button 
                  variant="outline" 
                  onClick={startRecording}
                  className="flex-1"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={stopRecording}
                  className="flex-1"
                >
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Recording ({formatTime(recordingTime)})
                </Button>
              )}
            </div>
            
            {audioBlob && (
              <div className="space-y-2">
                <audio controls className="w-full">
                  <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                </audio>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAudioBlob(null)}
                  className="w-full"
                >
                  <X className="w-3 h-3 mr-1" />
                  Delete Recording
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Written Comments */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Inspector Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add your field observations, corrections, or additional notes..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-24"
            />
          </CardContent>
        </Card>
      </div>

      {/* Adjustments */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Field Adjustments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Issue Type</Label>
              <select 
                value={adjustments.issueType}
                onChange={(e) => setAdjustments(prev => ({ ...prev, issueType: e.target.value as any }))}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="pothole">Pothole</option>
                <option value="crack">Crack</option>
                <option value="low_pci">Low PCI</option>
                <option value="surface_deterioration">Surface Deterioration</option>
                <option value="edge_cracking">Edge Cracking</option>
                <option value="alligator_cracking">Alligator Cracking</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Severity</Label>
              <select 
                value={adjustments.severity}
                onChange={(e) => setAdjustments(prev => ({ ...prev, severity: e.target.value as any }))}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Repair Suggestion</Label>
              <select 
                value={adjustments.repairSuggestion}
                onChange={(e) => setAdjustments(prev => ({ ...prev, repairSuggestion: e.target.value as any }))}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="overlay">Overlay</option>
                <option value="seal">Seal</option>
                <option value="reconstruction">Reconstruction</option>
                <option value="patching">Patching</option>
                <option value="crack_sealing">Crack Sealing</option>
                <option value="none">None Required</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Verification
        </Button>
      </div>
    </div>
  );
}

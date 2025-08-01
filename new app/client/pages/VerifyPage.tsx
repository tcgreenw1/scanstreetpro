import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerifyInPersonMode } from "@/components/verification/VerifyInPersonMode";
import { ImageOverlayViewer } from "@/components/viewer/ImageOverlayViewer";
import { ScanIssue } from "@shared/api";
import { Camera, Eye, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Mock issues for verification
const mockIssuesForVerification: ScanIssue[] = [
  {
    id: "1",
    imageUrl: "/placeholder.svg",
    overlayImageUrl: "/placeholder.svg",
    issueType: "pothole",
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: "123 Main St",
      roadName: "Main Street",
      segment: "A-15"
    },
    pciScore: 45,
    aiSuggestion: "patching",
    status: "pending",
    aiConfidence: 0.89,
    detectedAt: "2024-01-15T09:30:00Z",
    severity: "high"
  }
];

export default function VerifyPage() {
  const [selectedIssue, setSelectedIssue] = useState<ScanIssue | null>(null);
  const [mode, setMode] = useState<'list' | 'verify' | 'viewer'>('list');

  const handleSaveVerification = (note: any) => {
    console.log("Saved verification:", note);
    // In real app, would save to backend
    setMode('list');
    setSelectedIssue(null);
  };

  if (mode === 'verify' && selectedIssue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
        <VerifyInPersonMode
          issue={selectedIssue}
          onSave={handleSaveVerification}
          onClose={() => {
            setMode('list');
            setSelectedIssue(null);
          }}
        />
      </div>
    );
  }

  if (mode === 'viewer' && selectedIssue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
        <ImageOverlayViewer
          issue={selectedIssue}
          onClose={() => {
            setMode('list');
            setSelectedIssue(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold mt-2">Field Verification</h1>
          <p className="text-muted-foreground">Review and verify AI-detected road issues in the field</p>
        </div>

        <div className="grid gap-4">
          {mockIssuesForVerification.map((issue) => (
            <Card key={issue.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {issue.issueType.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {issue.location.roadName} • {issue.location.segment}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={
                      issue.severity === 'high' ? 'text-red-600' :
                      issue.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }>
                      {issue.severity}
                    </Badge>
                    <Badge variant="outline">
                      PCI: {issue.pciScore}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setSelectedIssue(issue);
                      setMode('verify');
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Verify in Field
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedIssue(issue);
                      setMode('viewer');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View AI Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

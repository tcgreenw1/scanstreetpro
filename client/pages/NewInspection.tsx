import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  ClipboardCheck,
  Upload,
  Save,
  Crown
} from 'lucide-react';

export default function NewInspection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    assetId: '',
    assetType: '',
    location: '',
    inspectionType: '',
    priority: '',
    scheduledDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Submitting inspection:', formData);
    navigate('/inspections');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/inspections')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inspections
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">New Inspection</h1>
          <p className="text-slate-600 dark:text-slate-300">Create a new asset inspection</p>
        </div>
      </div>

      {/* Premium Notice */}
      <Card className="glass-card border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-amber-500" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Premium Feature</h3>
                <p className="text-amber-700 dark:text-amber-300">Full inspection management requires a premium subscription</p>
              </div>
            </div>
            <Link to="/pricing">
              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                title="See pricing and included features"
              >
                Upgrade Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              Inspection Details
            </CardTitle>
            <CardDescription>Basic information about the inspection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetId">Asset ID</Label>
                <Input
                  id="assetId"
                  placeholder="Enter asset ID"
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Select value={formData.assetType} onValueChange={(value) => setFormData({ ...formData, assetType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bridge">Bridge</SelectItem>
                    <SelectItem value="traffic-signal">Traffic Signal</SelectItem>
                    <SelectItem value="street-light">Street Light</SelectItem>
                    <SelectItem value="drainage">Drainage System</SelectItem>
                    <SelectItem value="pavement">Pavement</SelectItem>
                    <SelectItem value="signage">Signage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="location"
                  placeholder="Enter location or address"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inspectionType">Inspection Type</Label>
                <Select value={formData.inspectionType} onValueChange={(value) => setFormData({ ...formData, inspectionType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inspection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine Inspection</SelectItem>
                    <SelectItem value="emergency">Emergency Inspection</SelectItem>
                    <SelectItem value="maintenance">Maintenance Follow-up</SelectItem>
                    <SelectItem value="compliance">Compliance Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or observations"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Premium Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-white/20 opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-600">
                <Camera className="w-5 h-5" />
                Photo Documentation
              </CardTitle>
              <CardDescription>Capture and attach photos during inspection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Photo upload available in Premium
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-600">
                <Upload className="w-5 h-5" />
                Document Attachments
              </CardTitle>
              <CardDescription>Attach inspection forms and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  File attachments available in Premium
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/inspections')}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Inspection
          </Button>
        </div>
      </form>
    </div>
  );
}

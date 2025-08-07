import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plus,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { neonService } from '@/services/neonService';
import { useOrganization } from '@/contexts/OrganizationContext';

interface AddAssetFormProps {
  onAssetAdded?: () => void;
  trigger?: React.ReactNode;
}

const assetTypes = [
  { value: 'road', label: 'Road', icon: '🛣️' },
  { value: 'bridge', label: 'Bridge', icon: '🌉' },
  { value: 'sidewalk', label: 'Sidewalk', icon: '🚶' },
  { value: 'drainage', label: 'Drainage', icon: '🚰' },
  { value: 'lighting', label: 'Lighting', icon: '💡' },
  { value: 'signage', label: 'Signage', icon: '🪧' },
  { value: 'traffic_signal', label: 'Traffic Signal', icon: '🚦' },
  { value: 'parking', label: 'Parking', icon: '🅿️' },
  { value: 'landscaping', label: 'Landscaping', icon: '🌳' },
  { value: 'building', label: 'Building', icon: '🏢' }
];

const conditionOptions = [
  { value: 'excellent', label: 'Excellent', color: 'text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-900/20 dark:border-green-700' },
  { value: 'good', label: 'Good', color: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-700' },
  { value: 'fair', label: 'Fair', color: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700' },
  { value: 'poor', label: 'Poor', color: 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-900/20 dark:border-orange-700' },
  { value: 'critical', label: 'Critical', color: 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/20 dark:border-red-700' }
];

export function AddAssetForm({ onAssetAdded, trigger }: AddAssetFormProps) {
  const { organization } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    condition: '',
    pci: '',
    installDate: '',
    lastInspected: '',
    nextInspection: '',
    cost: '',
    maintenanceCost: '',
    warrantyExpiry: '',
    contractor: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Asset name is required';
    if (!formData.type) return 'Asset type is required';
    if (!formData.condition) return 'Condition is required';
    if (!formData.pci || isNaN(Number(formData.pci)) || Number(formData.pci) < 0 || Number(formData.pci) > 100) {
      return 'PCI score must be a number between 0 and 100';
    }
    if (formData.latitude && (isNaN(Number(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      return 'Latitude must be a number between -90 and 90';
    }
    if (formData.longitude && (isNaN(Number(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      return 'Longitude must be a number between -180 and 180';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const assetData = {
        name: formData.name.trim(),
        type: formData.type as any, // Type assertion for compatibility
        location: {
          address: formData.address.trim() || undefined,
          lat: formData.latitude ? parseFloat(formData.latitude) : 0,
          lng: formData.longitude ? parseFloat(formData.longitude) : 0
        },
        condition: {
          status: formData.condition as any, // Type assertion for compatibility
          pci: parseInt(formData.pci),
          lastInspected: formData.lastInspected ? new Date(formData.lastInspected) : new Date(),
          nextInspection: formData.nextInspection ? new Date(formData.nextInspection) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        metadata: {
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
          yearBuilt: formData.installDate ? new Date(formData.installDate).getFullYear() : undefined,
          material: formData.notes.trim() || undefined,
          length: undefined,
          width: undefined
        },
        organizationId: organization?.id || 'demo-org',
        isSampleData: false
      };

      console.log('Creating asset:', assetData);

      await neonService.createAsset(assetData);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
        onAssetAdded?.();
        // Reset form
        setFormData({
          name: '',
          type: '',
          description: '',
          address: '',
          latitude: '',
          longitude: '',
          condition: '',
          pci: '',
          installDate: '',
          lastInspected: '',
          nextInspection: '',
          cost: '',
          maintenanceCost: '',
          warrantyExpiry: '',
          contractor: '',
          notes: ''
        });
      }, 1500);

    } catch (err) {
      console.error('Failed to create asset:', err);
      setError(err instanceof Error ? err.message : 'Failed to create asset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      setError(null);
      setSuccess(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
      <Plus className="w-4 h-4 mr-2" />
      Add Asset
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Add New Asset
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Create a new infrastructure asset record. This will be saved to your organization's database.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Asset Created Successfully!</h3>
            <p className="text-slate-600 dark:text-slate-400 text-center">
              Your new asset has been added to the database and will appear in the asset inventory.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="border-white/20 bg-slate-50/50 dark:bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">
                      Asset Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Main Street Bridge"
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-slate-700 dark:text-slate-300 font-medium">
                      Asset Type *
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the asset..."
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="border-white/20 bg-slate-50/50 dark:bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-700 dark:text-slate-300 font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street, Springfield, OH"
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-slate-700 dark:text-slate-300 font-medium">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      placeholder="39.9242"
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-slate-700 dark:text-slate-300 font-medium">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      placeholder="-83.8088"
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Condition Information */}
            <Card className="border-white/20 bg-slate-50/50 dark:bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-white">Condition & Inspection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition" className="text-slate-700 dark:text-slate-300 font-medium">
                      Current Condition *
                    </Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionOptions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            <Badge variant="outline" className={condition.color}>
                              {condition.label}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pci" className="text-slate-700 dark:text-slate-300 font-medium">
                      PCI Score (0-100) *
                    </Label>
                    <Input
                      id="pci"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.pci}
                      onChange={(e) => handleInputChange('pci', e.target.value)}
                      placeholder="85"
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastInspected" className="text-slate-700 dark:text-slate-300 font-medium">
                      Last Inspected
                    </Label>
                    <Input
                      id="lastInspected"
                      type="date"
                      value={formData.lastInspected}
                      onChange={(e) => handleInputChange('lastInspected', e.target.value)}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextInspection" className="text-slate-700 dark:text-slate-300 font-medium">
                      Next Inspection Due
                    </Label>
                    <Input
                      id="nextInspection"
                      type="date"
                      value={formData.nextInspection}
                      onChange={(e) => handleInputChange('nextInspection', e.target.value)}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="border-white/20 bg-slate-50/50 dark:bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost" className="text-slate-700 dark:text-slate-300 font-medium">
                      Initial Cost ($)
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => handleInputChange('cost', e.target.value)}
                      placeholder="50000"
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceCost" className="text-slate-700 dark:text-slate-300 font-medium">
                      Annual Maintenance Cost ($)
                    </Label>
                    <Input
                      id="maintenanceCost"
                      type="number"
                      step="0.01"
                      value={formData.maintenanceCost}
                      onChange={(e) => handleInputChange('maintenanceCost', e.target.value)}
                      placeholder="5000"
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="border-white/20 bg-slate-50/50 dark:bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="installDate" className="text-slate-700 dark:text-slate-300 font-medium">
                      Install Date
                    </Label>
                    <Input
                      id="installDate"
                      type="date"
                      value={formData.installDate}
                      onChange={(e) => handleInputChange('installDate', e.target.value)}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiry" className="text-slate-700 dark:text-slate-300 font-medium">
                      Warranty Expiry
                    </Label>
                    <Input
                      id="warrantyExpiry"
                      type="date"
                      value={formData.warrantyExpiry}
                      onChange={(e) => handleInputChange('warrantyExpiry', e.target.value)}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractor" className="text-slate-700 dark:text-slate-300 font-medium">
                    Contractor/Vendor
                  </Label>
                  <Input
                    id="contractor"
                    value={formData.contractor}
                    onChange={(e) => handleInputChange('contractor', e.target.value)}
                    placeholder="ABC Construction Company"
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-slate-700 dark:text-slate-300 font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes or observations..."
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
              </div>
            )}
          </form>
        )}

        {!success && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-slate-200 dark:border-slate-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Asset...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Asset
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

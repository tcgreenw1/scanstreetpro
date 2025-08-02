import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Save, RotateCcw, MapPin, BarChart3, Route } from 'lucide-react';

interface SampleDataConfig {
  pciRange: {
    min: number;
    max: number;
  };
  roadTypes: string[];
  assetCount: number;
  cityName: string;
  notes: string;
}

interface ModifySampleDataModalProps {
  trigger?: React.ReactNode;
  onDataUpdate?: (data: SampleDataConfig) => void;
}

export function ModifySampleDataModal({ trigger, onDataUpdate }: ModifySampleDataModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sampleData, setSampleData] = useState<SampleDataConfig>({
    pciRange: { min: 45, max: 85 },
    roadTypes: ['Arterial', 'Local', 'Collector'],
    assetCount: 12,
    cityName: 'Sample City',
    notes: 'Mixed condition roads with typical municipal infrastructure'
  });

  const [tempData, setTempData] = useState<SampleDataConfig>(sampleData);

  const roadTypeOptions = [
    'Arterial', 'Local', 'Collector', 'Highway', 'Residential', 
    'Commercial', 'Industrial', 'Bridge', 'Tunnel'
  ];

  const presetScenarios = [
    {
      name: 'Poor Condition City',
      data: {
        pciRange: { min: 25, max: 55 },
        roadTypes: ['Local', 'Residential'],
        assetCount: 8,
        cityName: 'Deteriorated City',
        notes: 'High maintenance needs, aging infrastructure'
      }
    },
    {
      name: 'Well-Maintained City',
      data: {
        pciRange: { min: 70, max: 95 },
        roadTypes: ['Arterial', 'Collector', 'Local'],
        assetCount: 20,
        cityName: 'Premium City',
        notes: 'Excellent infrastructure condition'
      }
    },
    {
      name: 'Mixed Infrastructure',
      data: {
        pciRange: { min: 35, max: 80 },
        roadTypes: ['Arterial', 'Local', 'Collector', 'Bridge'],
        assetCount: 15,
        cityName: 'Diverse City',
        notes: 'Varied road conditions requiring strategic planning'
      }
    }
  ];

  const handleSave = () => {
    setSampleData(tempData);
    if (onDataUpdate) {
      onDataUpdate(tempData);
    }
    setIsOpen(false);
    // In a real app, this would save to localStorage or API
    console.log('Sample data updated:', tempData);
  };

  const handleReset = () => {
    setTempData(sampleData);
  };

  const handlePresetLoad = (preset: typeof presetScenarios[0]) => {
    setTempData(preset.data);
  };

  const handleRoadTypeToggle = (roadType: string) => {
    const newRoadTypes = tempData.roadTypes.includes(roadType)
      ? tempData.roadTypes.filter(type => type !== roadType)
      : [...tempData.roadTypes, roadType];
    
    setTempData({ ...tempData, roadTypes: newRoadTypes });
  };

  const defaultTrigger = (
    <Button 
      variant="outline" 
      className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20 animate-scale-up"
    >
      <Edit3 className="w-4 h-4 mr-2" />
      Modify Sample Data
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-white/20 animate-scale-up">
        <DialogHeader>
          <DialogTitle className="flex items-center text-slate-800 dark:text-white">
            <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
            Modify Sample Data Configuration
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-300">
            Customize the sample PCI data to preview different scenarios. Changes are for demonstration only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset Scenarios */}
          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
              Quick Presets
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presetScenarios.map((preset) => (
                <Card key={preset.name} className="cursor-pointer hover:shadow-md transition-all duration-200 glass-card border-white/20" onClick={() => handlePresetLoad(preset)}>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm text-slate-800 dark:text-white mb-1">{preset.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{preset.data.notes}</p>
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      PCI: {preset.data.pciRange.min}-{preset.data.pciRange.max}
                      <span className="mx-2">•</span>
                      <MapPin className="w-3 h-3 mr-1" />
                      {preset.data.assetCount} assets
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* City Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cityName" className="text-slate-700 dark:text-slate-300">City Name</Label>
              <Input
                id="cityName"
                value={tempData.cityName}
                onChange={(e) => setTempData({ ...tempData, cityName: e.target.value })}
                className="glass-card border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetCount" className="text-slate-700 dark:text-slate-300">Number of Road Segments</Label>
              <Input
                id="assetCount"
                type="number"
                min="1"
                max="50"
                value={tempData.assetCount}
                onChange={(e) => setTempData({ ...tempData, assetCount: parseInt(e.target.value) || 0 })}
                className="glass-card border-white/30"
              />
            </div>
          </div>

          {/* PCI Range */}
          <div>
            <Label className="text-slate-700 dark:text-slate-300 mb-3 block">PCI Score Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pciMin" className="text-sm text-slate-600 dark:text-slate-400">Minimum PCI</Label>
                <Input
                  id="pciMin"
                  type="number"
                  min="0"
                  max="100"
                  value={tempData.pciRange.min}
                  onChange={(e) => setTempData({ 
                    ...tempData, 
                    pciRange: { ...tempData.pciRange, min: parseInt(e.target.value) || 0 }
                  })}
                  className="glass-card border-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pciMax" className="text-sm text-slate-600 dark:text-slate-400">Maximum PCI</Label>
                <Input
                  id="pciMax"
                  type="number"
                  min="0"
                  max="100"
                  value={tempData.pciRange.max}
                  onChange={(e) => setTempData({ 
                    ...tempData, 
                    pciRange: { ...tempData.pciRange, max: parseInt(e.target.value) || 0 }
                  })}
                  className="glass-card border-white/30"
                />
              </div>
            </div>
            <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Current range: <span className="font-medium">{tempData.pciRange.min} - {tempData.pciRange.max}</span>
                {' '}({tempData.pciRange.min < 50 ? 'Poor' : tempData.pciRange.min < 70 ? 'Fair' : 'Good'} to {tempData.pciRange.max < 50 ? 'Poor' : tempData.pciRange.max < 70 ? 'Fair' : 'Good'})
              </p>
            </div>
          </div>

          {/* Road Types */}
          <div>
            <Label className="text-slate-700 dark:text-slate-300 mb-3 block">Road Types to Include</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roadTypeOptions.map((roadType) => (
                <Badge
                  key={roadType}
                  variant={tempData.roadTypes.includes(roadType) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 justify-center py-2 ${
                    tempData.roadTypes.includes(roadType) 
                      ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => handleRoadTypeToggle(roadType)}
                >
                  <Route className="w-3 h-3 mr-1" />
                  {roadType}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Selected: {tempData.roadTypes.join(', ') || 'None'}
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-700 dark:text-slate-300">Scenario Notes</Label>
            <Textarea
              id="notes"
              value={tempData.notes}
              onChange={(e) => setTempData({ ...tempData, notes: e.target.value })}
              rows={3}
              className="glass-card border-white/30"
              placeholder="Add notes about this sample data configuration..."
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={handleReset} className="animate-pulse-glow">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 animate-pulse-glow">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

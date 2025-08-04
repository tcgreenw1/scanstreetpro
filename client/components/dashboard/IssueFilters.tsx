import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  X, 
  MapPin, 
  Calendar,
  RotateCcw 
} from "lucide-react";
import { FilterOptions, DefectType, SeverityLevel, InspectionStatus } from "@shared/api";

interface IssueFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const defectTypes: DefectType[] = [
  'pothole', 'crack', 'low_pci', 'surface_deterioration', 'edge_cracking', 'alligator_cracking'
];

const severityLevels: SeverityLevel[] = ['low', 'medium', 'high'];

const statusOptions: InspectionStatus[] = ['pending', 'confirmed', 'rejected', 'adjusted'];

export function IssueFilters({ filters = {}, onFiltersChange }: IssueFiltersProps) {
  const [pciRange, setPciRange] = useState(filters.pciRange || { min: 0, max: 100 });
  const [selectedTypes, setSelectedTypes] = useState<DefectType[]>(filters.issueTypes || []);
  const [selectedSeverities, setSelectedSeverities] = useState<SeverityLevel[]>(filters.severities || []);
  const [selectedStatuses, setSelectedStatuses] = useState<InspectionStatus[]>(filters.statuses || []);

  const applyFilters = () => {
    const newFilters: FilterOptions = {
      ...filters,
      pciRange: pciRange.min === 0 && pciRange.max === 100 ? undefined : pciRange,
      issueTypes: selectedTypes.length === 0 ? undefined : selectedTypes,
      severities: selectedSeverities.length === 0 ? undefined : selectedSeverities,
      statuses: selectedStatuses.length === 0 ? undefined : selectedStatuses,
    };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setPciRange({ min: 0, max: 100 });
    setSelectedTypes([]);
    setSelectedSeverities([]);
    setSelectedStatuses([]);
    onFiltersChange({});
  };

  const activeFilterCount = [
    filters.pciRange && (filters.pciRange.min > 0 || filters.pciRange.max < 100) ? 1 : 0,
    filters.issueTypes?.length || 0,
    filters.severities?.length || 0,
    filters.statuses?.length || 0,
  ].reduce((a, b) => a + b, 0);

  const handleTypeChange = (type: DefectType, checked: boolean) => {
    setSelectedTypes(prev => 
      checked ? [...prev, type] : prev.filter(t => t !== type)
    );
  };

  const handleSeverityChange = (severity: SeverityLevel, checked: boolean) => {
    setSelectedSeverities(prev => 
      checked ? [...prev, severity] : prev.filter(s => s !== severity)
    );
  };

  const handleStatusChange = (status: InspectionStatus, checked: boolean) => {
    setSelectedStatuses(prev => 
      checked ? [...prev, status] : prev.filter(s => s !== status)
    );
  };

  return (
    <Card className="glass-card sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* PCI Score Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">PCI Score Range</Label>
          <div className="px-2">
            <Slider
              value={[pciRange.min, pciRange.max]}
              onValueChange={([min, max]) => setPciRange({ min, max })}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{pciRange.min}</span>
            <span>{pciRange.max}</span>
          </div>
        </div>

        <Separator />

        {/* Issue Types */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Issue Types</Label>
          <div className="space-y-2">
            {defectTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked) => handleTypeChange(type, !!checked)}
                />
                <Label
                  htmlFor={type}
                  className="text-sm font-normal capitalize cursor-pointer"
                >
                  {type.replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Severity Levels */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Severity</Label>
          <div className="space-y-2">
            {severityLevels.map((severity) => (
              <div key={severity} className="flex items-center space-x-2">
                <Checkbox
                  id={severity}
                  checked={selectedSeverities.includes(severity)}
                  onCheckedChange={(checked) => handleSeverityChange(severity, !!checked)}
                />
                <Label
                  htmlFor={severity}
                  className={`text-sm font-normal capitalize cursor-pointer ${
                    severity === 'high' ? 'text-red-600' :
                    severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}
                >
                  {severity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Status</Label>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => handleStatusChange(status, !!checked)}
                />
                <Label
                  htmlFor={status}
                  className="text-sm font-normal capitalize cursor-pointer"
                >
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Location Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apply Filters Button */}
        <Button 
          onClick={applyFilters} 
          className="w-full"
          size="sm"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}

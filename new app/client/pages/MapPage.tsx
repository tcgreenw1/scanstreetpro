import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, RotateCcw, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { ModifySampleDataModal } from "@/components/ModifySampleDataModal";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold mt-2">Interactive Map View</h1>
              <p className="text-muted-foreground">Visualize road issues on an interactive map</p>
            </div>
            <ModifySampleDataModal
              trigger={
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modify Sample Data
                </Button>
              }
            />
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Road Issues Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Interactive Map Coming Soon</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will show all road issues plotted on an interactive map with filtering options
                  </p>
                </div>
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Load Map Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

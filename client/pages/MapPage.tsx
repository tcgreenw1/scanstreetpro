import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Navigation } from "lucide-react";

export default function MapPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to new comprehensive map view
    navigate('/map-view', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="glass-card border-white/20 p-8">
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  Redirecting to Enhanced Map View
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  You're being redirected to our new comprehensive Springfield, Ohio infrastructure map with enhanced features.
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>Real Springfield, OH road data</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>City assets overlay with details</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>7-level PCI color coding</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/map-view')}
                className="w-full"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Enhanced Map View
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

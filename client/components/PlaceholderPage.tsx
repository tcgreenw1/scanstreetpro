import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowRight, MessageSquare } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  features?: string[];
  comingSoonFeatures?: string[];
  icon?: React.ReactNode;
}

export function PlaceholderPage({ 
  title, 
  description, 
  features = [], 
  comingSoonFeatures = [], 
  icon 
}: PlaceholderPageProps) {
  // Combine features from both prop names for compatibility
  const allFeatures = [...features, ...comingSoonFeatures];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            {icon ? (
              <div className="text-white text-2xl">{icon}</div>
            ) : (
              <Construction className="w-10 h-10 text-white" />
            )}
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">{title}</h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">{description}</p>
      </div>

      <Card className="glass-card border-white/20 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Module Under Development
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            This municipal system module is being built with comprehensive features for infrastructure management.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {allFeatures.length > 0 && (
            <>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Planned Features:</h3>
                <div className="grid gap-3">
                  {allFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20">
                      <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Construction className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Ready for Implementation
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  This module is ready to be built with full functionality, real data integration, and all the features listed above.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Request Implementation
                  </Button>
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20">
                    View Demo Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

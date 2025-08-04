import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft, Download, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold mt-2">Inspection Reports</h1>
          <p className="text-muted-foreground">Generate and download inspection reports with signatures</p>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Report Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col">
                    <Calendar className="w-6 h-6 mb-2" />
                    <span className="text-sm">Daily Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-sm">Weekly Summary</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col">
                    <Download className="w-6 h-6 mb-2" />
                    <span className="text-sm">Export Data</span>
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Recent Reports</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Daily Inspection - January 15, 2024</span>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Weekly Summary - Week 2, 2024</span>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

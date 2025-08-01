import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  HelpCircle,
  Shield,
  FileText,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardFooterProps {
  className?: string;
}

export function DashboardFooter({ className }: DashboardFooterProps) {
  const currentYear = new Date().getFullYear();
  const version = "v2.4.1";

  return (
    <footer className={cn("mt-12", className)}>
      {/* AI Assistant Card */}
      <Card className="glass border-civic-200/50 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-civic-500 to-civic-600 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Municipal Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant answers about city operations, policies, and procedures
                </p>
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              Ask a Question
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="border-t border-civic-200 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Municipal Dashboard</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Unified city management platform for modern municipal operations.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Version {version}</span>
              <span>•</span>
              <span>© {currentYear} Municipal Systems</span>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help Center
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <FileText className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <FileText className="w-4 h-4 mr-2" />
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <FileText className="w-4 h-4 mr-2" />
                Security & Compliance
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

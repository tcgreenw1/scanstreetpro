import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Construction, MessageCircle } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  backTo?: string;
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon = Construction,
  backTo = "/",
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-50 to-civic-100">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link to={backTo}>
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Placeholder Content */}
          <Card className="glass border-civic-200/50">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-civic-500 flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {description}
              </p>
              
              <div className="bg-civic-50 rounded-lg p-6 border border-civic-200">
                <h3 className="font-semibold text-foreground mb-2">
                  Ready to build this module?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Continue the conversation to implement the full functionality for this section.
                </p>
                <Button className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Continue Building
                </Button>
              </div>

              <div className="flex gap-3 justify-center">
                <Link to={backTo}>
                  <Button variant="outline">Return to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ title, description, features, icon }: PlaceholderPageProps) {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {icon && <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">{icon}</div>}
          </div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>
              This page is under development. Here's what we're planning to include:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Need this page implemented?</strong> Continue the conversation in the chat to have me build out this functionality with all the features listed above.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

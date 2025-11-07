import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-12 text-center border-border/50 backdrop-blur-sm bg-card/80">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <Loader2 className="w-20 h-20 text-primary animate-spin" />
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Processing Your PDF
        </h3>
        
        <p className="text-muted-foreground mb-4">
          ⏳ Loading your data... This may take a few moments.
        </p>
        
        <p className="text-sm text-muted-foreground">
          We're analyzing your document and generating an intelligent summary
        </p>
      </Card>
    </div>
  );
};
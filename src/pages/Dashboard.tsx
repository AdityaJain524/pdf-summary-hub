import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, ArrowLeft, Calendar, Globe, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Summary {
  id: string;
  original_filename: string;
  summary_text: string;
  word_count: number;
  language: string;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchSummaries();
    }
  }, [user]);

  const fetchSummaries = async () => {
    try {
      const { data, error } = await supabase
        .from("summaries")
        .select("*")
        .eq("user_email", user?.primaryEmailAddress?.emailAddress)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSummaries(data || []);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      toast({
        title: "Error",
        description: "Failed to load your summaries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PDF Summarizer
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Your Summary History</h2>
            <p className="text-muted-foreground">
              View and manage all your generated summaries
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-muted-foreground">Loading your summaries...</p>
            </div>
          ) : summaries.length === 0 ? (
            <Card className="p-12 text-center border-border/50 bg-card/80 backdrop-blur-sm">
              <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No summaries yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first PDF to get started
              </p>
              <Button onClick={() => navigate("/")}>
                Upload PDF
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {summaries.map((summary) => (
                <Card
                  key={summary.id}
                  className="p-6 border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">
                          {summary.original_filename}
                        </h3>
                      </div>
                      
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {summary.summary_text}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(summary.created_at), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {summary.language}
                        </div>
                        <div className="flex items-center gap-1">
                          <Type className="w-4 h-4" />
                          {summary.word_count} words
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
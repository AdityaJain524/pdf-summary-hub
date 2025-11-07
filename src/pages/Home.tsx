import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PDFUploader } from "@/components/PDFUploader";
import { SummaryDisplay } from "@/components/SummaryDisplay";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatBot } from "@/components/ChatBot";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FileText, History, LogOut, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    text: string;
    filename: string;
    language: string;
    wordCount: number;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFeedback(true)}
              className="rounded-full"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Feedback Form Modal */}
      <FeedbackForm open={showFeedback} onOpenChange={setShowFeedback} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <LoadingScreen />
        ) : summaryData ? (
          <SummaryDisplay
            summaryText={summaryData.text}
            filename={summaryData.filename}
            language={summaryData.language}
            wordCount={summaryData.wordCount}
            onReset={() => setSummaryData(null)}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Transform Your PDFs Into Summaries
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload any PDF document and get an intelligent summary in your preferred language and length
              </p>
            </div>

            <Card className="p-8 shadow-lg border-border/50 backdrop-blur-sm bg-card/80">
              <PDFUploader
                userEmail={userEmail}
                onSuccess={(data) => setSummaryData(data)}
                onLoadingChange={setIsLoading}
              />
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 text-center border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Smart Summarization</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered summaries that capture key points
                </p>
              </Card>

              <Card className="p-6 text-center border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Multi-Language</h3>
                <p className="text-sm text-muted-foreground">
                  Support for all major Indian regional languages
                </p>
              </Card>

              <Card className="p-6 text-center border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <History className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">History Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Access all your summaries anytime, anywhere
                </p>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Floating Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Home;
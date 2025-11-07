import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Download, RotateCcw } from "lucide-react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface SummaryDisplayProps {
  summaryText: string;
  filename: string;
  language: string;
  wordCount: number;
  onReset: () => void;
}

export const SummaryDisplay = ({
  summaryText,
  filename,
  language,
  wordCount,
  onReset,
}: SummaryDisplayProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayPause = () => {
    if (!window.speechSynthesis) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const newUtterance = new SpeechSynthesisUtterance(summaryText);
      newUtterance.lang = language === "Hindi" ? "hi-IN" : "en-US";
      newUtterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(newUtterance);
      setUtterance(newUtterance);
      setIsPlaying(true);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    
    doc.setFontSize(16);
    doc.text("PDF Summary", margin, margin);
    
    doc.setFontSize(10);
    doc.text(`File: ${filename}`, margin, margin + 10);
    doc.text(`Language: ${language}`, margin, margin + 15);
    doc.text(`Word Count: ${wordCount}`, margin, margin + 20);
    
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(summaryText, pageWidth);
    doc.text(splitText, margin, margin + 30);
    
    doc.save(`${filename}-summary.pdf`);
    
    toast({
      title: "Downloaded!",
      description: "Your summary has been downloaded as PDF",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 shadow-lg border-border/50 backdrop-blur-sm bg-card/80">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Summary Generated
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>File: {filename}</span>
            <span>•</span>
            <span>Language: {language}</span>
            <span>•</span>
            <span>Words: {wordCount}</span>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mb-6">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {summaryText}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handlePlayPause}
            variant="outline"
            className="gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </Button>

          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            className="gap-2 ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            New Summary
          </Button>
        </div>
      </Card>
    </div>
  );
};
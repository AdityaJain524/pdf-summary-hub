import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSelector } from "./LanguageSelector";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PDFUploaderProps {
  userEmail: string;
  onSuccess: (data: {
    text: string;
    filename: string;
    language: string;
    wordCount: number;
  }) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const PDFUploader = ({ userEmail, onSuccess, onLoadingChange }: PDFUploaderProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [wordCount, setWordCount] = useState(200);
  const [language, setLanguage] = useState("English");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid File",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    onLoadingChange(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Call n8n webhook (you'll need to replace with actual webhook URL)
        const webhookUrl = "YOUR_N8N_WEBHOOK_URL";
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pdfFile: base64,
            wordCount,
            language,
            userEmail,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to process PDF");
        }

        const result = await response.json();
        
        // Save to database
        const { error: dbError } = await supabase.from("summaries").insert({
          user_email: userEmail,
          original_filename: file.name,
          summary_text: result.summary,
          word_count: wordCount,
          language: language,
        });

        if (dbError) throw dbError;

        onSuccess({
          text: result.summary,
          filename: file.name,
          language,
          wordCount,
        });

        toast({
          title: "Success!",
          description: "Your PDF has been summarized",
        });
      };
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="pdf-upload" className="text-base mb-3 block">
          Upload PDF Document
        </Label>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">PDF (MAX. 10MB)</p>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="word-count" className="text-base mb-3 block">
            Summary Length (words)
          </Label>
          <Input
            id="word-count"
            type="number"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            min={50}
            max={500}
            className="text-base"
          />
        </div>

        <div>
          <Label className="text-base mb-3 block">Summary Language</Label>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
        disabled={!file}
      >
        Generate Summary
      </Button>
    </div>
  );
};
import { useState } from "react";
import { FileText, Brain, Zap, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PDFUpload } from "@/components/PDFUpload";
import { QuestionInput } from "@/components/QuestionInput";
import { AnswerDisplay } from "@/components/AnswerDisplay";
import { RunwaiWordmark } from "@/components/RunwaiWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";

export default function Index() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<{
    question: string;
    answer: string;
    chunks: any[];
  } | null>(null);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setCurrentAnswer(null);
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handleQuestionSubmit = async (question: string) => {
    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Please upload a PDF file first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnswering(true);
    setCurrentAnswer(null);

    const formData = new FormData();
    formData.append("pdf_file", uploadedFile);
    formData.append("query", question);

    try {
      const response = await fetch("http://localhost:8000/invoke", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get answer from the backend.");
      }

      const result = await response.json();

      setCurrentAnswer({
        question,
        answer: result.answer,
        chunks: result.retrieved_docs || [], // Assuming the backend returns retrieved_docs
      });

      toast({
        title: "Answer Generated",
        description: "Your question has been processed successfully.",
      });
    } catch (error) {
      console.error("Error fetching answer:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching the answer.",
        variant: "destructive",
      });
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-document">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-4">
                <RunwaiWordmark />
                <div>
                  <h1 className="text-2xl font-bold">— Document Q&A</h1>
                  <p className="text-muted-foreground">
                    Multi-Agent RAG Onboarding Platform
                  </p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Question */}
          <div className="lg:col-span-2 space-y-6">
            <PDFUpload
              onFileUploaded={handleFileUploaded}
              isProcessing={false}
              processingProgress={0}
            />

            <QuestionInput
              onSubmit={handleQuestionSubmit}
              isLoading={isAnswering}
              disabled={!uploadedFile}
            />

            {/* Answer Section */}
            {isAnswering && (
              <AnswerDisplay
                question="Loading..."
                answer=""
                isLoading={true}
              />
            )}

            {currentAnswer && (
              <AnswerDisplay
                question={currentAnswer.question}
                answer={currentAnswer.answer}
                retrievedChunks={currentAnswer.chunks}
              />
            )}
          </div>

          {/* Right Column - Status & Features */}
          <div className="space-y-6">
            {/* Features Card */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Runwai System Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">PDF Processing</p>
                    <p className="text-xs text-muted-foreground">Advanced text extraction & chunking</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Vector Search</p>
                    <p className="text-xs text-muted-foreground">Semantic similarity matching</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Multi-Agent Pipeline</p>
                    <p className="text-xs text-muted-foreground">Advanced RAG architecture</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Secure Processing</p>
                    <p className="text-xs text-muted-foreground">Privacy-focused analysis</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technical Note */}
            <Card className="p-6 bg-warning-subtle border-warning">
              <h4 className="font-medium text-warning-foreground mb-2">
                Live Backend
              </h4>
              <p className="text-sm text-muted-foreground">
                This frontend is now connected to a live backend running the multi-agent pipeline.
              </p>
              <p className="text-xs text-muted-foreground mt-2">© Runwai</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
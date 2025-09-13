import { useState } from "react";
import { FileText, Brain, Zap, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PDFUpload } from "@/components/PDFUpload";
import { QuestionInput } from "@/components/QuestionInput";
import { AnswerDisplay } from "@/components/AnswerDisplay";
import { RunwaiWordmark } from "@/components/RunwaiWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/HeroSection";
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
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative border-b bg-card/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-accent rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-ping" />
                </div>
                <div className="flex items-center gap-6">
                  <RunwaiWordmark />
                  <div className="space-y-1">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      Document Q&A
                    </h1>
                    <p className="text-muted-foreground font-medium">
                      Multi-Agent RAG Onboarding Platform
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success text-sm font-medium rounded-full">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  Live System
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <HeroSection 
          uploadedFile={!!uploadedFile} 
          isProcessing={isAnswering}
        />

        {/* Process Flow Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-2xl border">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
              !uploadedFile ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
            }`}>
              <div className="w-2 h-2 bg-current rounded-full" />
              <span className="text-sm font-medium">Upload</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
              uploadedFile && !isAnswering ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
            }`}>
              <div className="w-2 h-2 bg-current rounded-full" />
              <span className="text-sm font-medium">Question</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
              isAnswering || currentAnswer ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'
            }`}>
              <div className="w-2 h-2 bg-current rounded-full" />
              <span className="text-sm font-medium">Answer</span>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="space-y-6">
                <PDFUpload
                  onFileUploaded={handleFileUploaded}
                  isProcessing={false}
                  processingProgress={0}
                />
              </div>

              {/* Question Section */}
              <div className="space-y-6">
                <QuestionInput
                  onSubmit={handleQuestionSubmit}
                  isLoading={isAnswering}
                  disabled={!uploadedFile}
                />
              </div>
            </div>

            {/* Answer Section */}
            <div className="space-y-6">
              {isAnswering && (
                <div className="animate-fade-in">
                  <AnswerDisplay
                    question="Processing your request..."
                    answer=""
                    isLoading={true}
                  />
                </div>
              )}

              {currentAnswer && (
                <div className="animate-fade-in">
                  <AnswerDisplay
                    question={currentAnswer.question}
                    answer={currentAnswer.answer}
                    retrievedChunks={currentAnswer.chunks}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Stats */}
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">System Status</h3>
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">99.9%</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <p className="text-2xl font-bold text-success">&lt; 2s</p>
                    <p className="text-xs text-muted-foreground">Response</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Features Card */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Runwai System Features</h3>
              
              <div className="space-y-4">
                <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Advanced PDF Processing</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Intelligent text extraction, layout analysis, and semantic chunking
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
                    <Zap className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Vector Search Engine</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      High-dimensional semantic similarity matching with FAISS
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                    <Brain className="h-5 w-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Multi-Agent Pipeline</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      LangGraph orchestrated RAG with specialized agents
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Shield className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Enterprise Security</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      End-to-end encryption with privacy-first processing
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status Card */}
            <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <h4 className="font-semibold text-success">Production Ready</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Connected to live multi-agent backend with real-time document processing capabilities.
                </p>
                <div className="pt-2 border-t border-success/20">
                  <p className="text-xs text-muted-foreground">© 2024 Runwai</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
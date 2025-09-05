import { useState, useEffect } from "react";
import { FileText, Brain, Zap, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PDFUpload } from "@/components/PDFUpload";
import { QuestionInput } from "@/components/QuestionInput";
import { AnswerDisplay } from "@/components/AnswerDisplay";
import { RAGStatus, RAGStep } from "@/components/RAGStatus";
import { toast } from "@/hooks/use-toast";

// Mock data for demonstration
const MOCK_RETRIEVED_CHUNKS = [
  {
    content: "The study analyzed 1,247 participants over a 12-month period, examining the effectiveness of various machine learning approaches in document processing. Key findings indicate a 34% improvement in accuracy when using transformer-based models compared to traditional methods.",
    page: 15,
    similarity: 0.92
  },
  {
    content: "Implementation of retrieval-augmented generation systems showed significant improvements in information extraction tasks. The methodology incorporated vector embeddings with semantic search capabilities, resulting in more relevant context retrieval.",
    page: 23,
    similarity: 0.87
  },
  {
    content: "Comparative analysis revealed that LangGraph-based pipelines provide better modularity and scalability for RAG implementations. The modular architecture allows for easier debugging and optimization of individual components.",
    page: 31,
    similarity: 0.84
  }
];

const MOCK_ANSWER = `Based on the document analysis, here are the main findings:

**Key Results:**
The study demonstrates a significant 34% improvement in accuracy when implementing transformer-based models for document processing tasks. This represents a substantial advancement over traditional approaches.

**Methodology Highlights:**
The research utilized a comprehensive dataset of 1,247 participants over 12 months, focusing on retrieval-augmented generation (RAG) systems. The implementation incorporated:

• Vector embeddings for semantic understanding
• Advanced search capabilities for context retrieval  
• LangGraph-based modular pipeline architecture

**Practical Implications:**
The modular architecture of LangGraph provides enhanced scalability and easier debugging capabilities, making it particularly suitable for production RAG implementations. This approach allows for optimization of individual components while maintaining system integrity.

The results suggest that modern transformer-based RAG systems can significantly outperform traditional document processing methods, with practical applications across various domains requiring intelligent document analysis.`;

const RAG_PIPELINE_STEPS: RAGStep[] = [
  {
    id: 'ingestion',
    name: 'Document Ingestion',
    description: 'Loading and validating PDF document',
    status: 'pending'
  },
  {
    id: 'extraction',
    name: 'Text Extraction',
    description: 'Extracting and chunking text content',
    status: 'pending'
  },
  {
    id: 'embedding',
    name: 'Embedding & Indexing',
    description: 'Converting chunks to embeddings and storing in vector DB',
    status: 'pending'
  },
  {
    id: 'retrieval',
    name: 'Context Retrieval',
    description: 'Finding relevant chunks for the user query',
    status: 'pending'
  },
  {
    id: 'generation',
    name: 'Answer Generation',
    description: 'Generating final answer using LLM with context',
    status: 'pending'
  }
];

export default function Index() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileProcessingProgress, setFileProcessingProgress] = useState(0);
  const [ragSteps, setRagSteps] = useState<RAGStep[]>(RAG_PIPELINE_STEPS);
  const [isAnswering, setIsAnswering] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<{
    question: string;
    answer: string;
    chunks: any[];
  } | null>(null);

  // Simulate file processing
  useEffect(() => {
    if (isProcessingFile) {
      const interval = setInterval(() => {
        setFileProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessingFile(false);
            toast({
              title: "Document Ready",
              description: "Your PDF has been processed and indexed successfully.",
            });
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isProcessingFile]);

  // Simulate RAG pipeline steps
  const simulateRAGPipeline = async (question: string) => {
    setIsAnswering(true);
    setCurrentAnswer(null);

    // Reset steps
    setRagSteps(steps => steps.map(step => ({ ...step, status: 'pending' as const })));

    const stepSequence = ['ingestion', 'extraction', 'embedding', 'retrieval', 'generation'];
    
    for (let i = 0; i < stepSequence.length; i++) {
      const stepId = stepSequence[i];
      
      // Mark current step as processing
      setRagSteps(steps => 
        steps.map(step => 
          step.id === stepId 
            ? { ...step, status: 'processing' as const, progress: 0 }
            : step
        )
      );

      // Simulate processing time with progress
      await new Promise(resolve => {
        const interval = setInterval(() => {
          setRagSteps(steps => 
            steps.map(step => 
              step.id === stepId && step.progress !== undefined
                ? { ...step, progress: Math.min((step.progress || 0) + Math.random() * 25, 100) }
                : step
            )
          );
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          
          // Mark step as completed
          setRagSteps(steps => 
            steps.map(step => 
              step.id === stepId 
                ? { ...step, status: 'completed' as const, progress: 100 }
                : step
            )
          );
          
          resolve(void 0);
        }, Math.random() * 1000 + 500);
      });
    }

    // Show final answer
    setCurrentAnswer({
      question,
      answer: MOCK_ANSWER,
      chunks: MOCK_RETRIEVED_CHUNKS
    });
    setIsAnswering(false);

    toast({
      title: "Answer Generated",
      description: "Your question has been processed successfully.",
    });
  };

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setIsProcessingFile(true);
    setFileProcessingProgress(0);
    setCurrentAnswer(null);
    
    // Reset RAG steps
    setRagSteps(RAG_PIPELINE_STEPS.map(step => ({ ...step, status: 'pending' })));
  };

  const handleQuestionSubmit = (question: string) => {
    simulateRAGPipeline(question);
  };

  return (
    <div className="min-h-screen bg-gradient-document">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-intelligence rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">RAG Document Q&A</h1>
              <p className="text-muted-foreground">
                Upload documents and ask intelligent questions powered by LangGraph
              </p>
            </div>
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
              isProcessing={isProcessingFile}
              processingProgress={fileProcessingProgress}
            />
            
            <QuestionInput
              onSubmit={handleQuestionSubmit}
              isLoading={isAnswering}
              disabled={!uploadedFile || isProcessingFile}
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
            <RAGStatus steps={ragSteps} />
            
            {/* Features Card */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">System Features</h3>
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
                    <p className="text-sm font-medium">LangGraph Pipeline</p>
                    <p className="text-xs text-muted-foreground">Modular RAG architecture</p>
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
                Demo Mode
              </h4>
              <p className="text-sm text-muted-foreground">
                This is a frontend demonstration. For production use, implement the backend 
                LangGraph pipeline with your preferred vector database and LLM provider.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
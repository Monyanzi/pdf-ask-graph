import { useState, useRef, DragEvent } from "react";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PDFUploadProps {
  onFileUploaded: (file: File) => void;
  isProcessing: boolean;
  processingProgress?: number;
}

export function PDFUpload({ onFileUploaded, isProcessing, processingProgress = 0 }: PDFUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === "application/pdf");
    
    if (pdfFile) {
      handleFileSelect(pdfFile);
    } else {
      setUploadStatus('error');
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setUploadStatus('success');
    onFileUploaded(file);
  };

  const handleInputChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file && file.type === "application/pdf") {
      handleFileSelect(file);
    } else {
      setUploadStatus('error');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-8 intelligence-glow transition-all duration-300">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-intelligence rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Upload Your Document</h2>
        <p className="text-muted-foreground">
          Upload a PDF document to start asking questions about its content
        </p>
      </div>

      <div
        className={cn(
          "upload-area p-8 text-center transition-all duration-300",
          dragOver && "dragover",
          uploadStatus === 'success' && "border-success bg-success-subtle",
          uploadStatus === 'error' && "border-destructive bg-red-50 dark:bg-red-950/10"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          className="hidden"
        />

        {uploadedFile && uploadStatus === 'success' ? (
          <div className="space-y-4">
            <CheckCircle className="h-12 w-12 text-success mx-auto" />
            <div>
              <p className="font-medium text-foreground">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            
            {isProcessing && (
              <div className="space-y-3">
                <div className="processing-indicator">
                  <Progress value={processingProgress} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Processing document... {processingProgress}%
                </p>
              </div>
            )}
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <p className="font-medium text-destructive">Upload Failed</p>
              <p className="text-sm text-muted-foreground">
                Please upload a valid PDF file
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setUploadStatus('idle')}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium text-foreground">
                Drop your PDF here or{" "}
                <button
                  onClick={handleBrowseClick}
                  className="text-primary hover:text-primary-dark underline"
                >
                  browse files
                </button>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports PDF files up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
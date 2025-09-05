import { Bot, FileText, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RetrievedChunk {
  content: string;
  page: number;
  similarity: number;
}

interface AnswerDisplayProps {
  question: string;
  answer: string;
  retrievedChunks?: RetrievedChunk[];
  isLoading?: boolean;
}

export function AnswerDisplay({ question, answer, retrievedChunks, isLoading }: AnswerDisplayProps) {
  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(answer);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-intelligence rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Analyzing your question...</p>
              <p className="text-sm text-muted-foreground">
                Retrieving relevant information from your document
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Question Display */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-secondary-foreground">Q</span>
          </div>
          <div className="flex-1">
            <p className="font-medium mb-1">Your Question</p>
            <p className="text-muted-foreground">{question}</p>
          </div>
        </div>
      </Card>

      {/* Answer Display */}
      <Card className="p-6 intelligence-glow">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-intelligence rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">AI Answer</p>
                <p className="text-xs text-muted-foreground">
                  Based on your document analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopyAnswer}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {answer}
            </p>
          </div>
        </div>
      </Card>

      {/* Retrieved Chunks */}
      {retrievedChunks && retrievedChunks.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-medium">Source References</h4>
              <Badge variant="secondary" className="text-xs">
                {retrievedChunks.length} chunks found
              </Badge>
            </div>
            
            <Separator />
            
            <ScrollArea className="max-h-64">
              <div className="space-y-3">
                {retrievedChunks.map((chunk, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Page {chunk.page}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {(chunk.similarity * 100).toFixed(1)}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {chunk.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>
      )}
    </div>
  );
}
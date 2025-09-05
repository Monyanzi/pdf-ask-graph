import { useState } from "react";
import { Send, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What are the main findings in this document?",
  "Can you summarize the key points?",
  "What methodology was used?",
  "What are the conclusions and recommendations?",
];

export function QuestionInput({ onSubmit, isLoading, disabled = false }: QuestionInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
      setQuestion("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-intelligence rounded-full flex items-center justify-center mx-auto mb-3">
          <Brain className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Ask Your Question</h3>
        <p className="text-muted-foreground text-sm">
          Ask anything about your uploaded document and get intelligent answers
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to know about this document?"
            className="min-h-[100px] pr-12 resize-none"
            disabled={disabled || isLoading}
          />
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading || disabled}
            className="absolute bottom-3 right-3 h-8 w-8 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Suggested questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((suggestion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary-hover transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        {disabled && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Please upload a PDF document first to start asking questions
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
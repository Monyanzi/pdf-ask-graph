import { CheckCircle, Clock, AlertCircle, Brain, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface RAGStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

interface RAGStatusProps {
  steps: RAGStep[];
  currentStep?: string;
}

export function RAGStatus({ steps, currentStep }: RAGStatusProps) {
  const getStepIcon = (status: RAGStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'processing':
        return <Brain className="h-4 w-4 text-primary animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStepBadgeVariant = (status: RAGStep['status']) => {
    switch (status) {
      case 'completed':
        return 'default' as const;
      case 'processing':
        return 'default' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Runwai Pipeline Status</h3>
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                step.status === 'processing' && "bg-primary-subtle",
                step.status === 'completed' && "bg-success-subtle",
                step.status === 'error' && "bg-red-50 dark:bg-red-950/10"
              )}
            >
              <div className="flex-shrink-0">
                {getStepIcon(step.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{step.name}</p>
                  <Badge
                    variant={getStepBadgeVariant(step.status)}
                    className="text-xs"
                  >
                    {step.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
                
                {step.status === 'processing' && step.progress !== undefined && (
                  <div className="mt-2">
                    <Progress value={step.progress} className="h-1" />
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
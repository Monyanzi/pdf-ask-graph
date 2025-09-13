import { Brain, Sparkles, Zap } from "lucide-react";

interface HeroSectionProps {
  uploadedFile: boolean;
  isProcessing: boolean;
}

export function HeroSection({ uploadedFile, isProcessing }: HeroSectionProps) {
  return (
    <div className="relative py-12 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-success/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-accent rounded-3xl flex items-center justify-center shadow-accent hover:scale-105 transition-transform duration-300">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-3 w-3 text-success-foreground" />
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Intelligent Document
              </span>
              <br />
              <span className="text-muted-foreground">Analysis Platform</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your documents into interactive knowledge bases with our
              advanced multi-agent RAG system powered by LangGraph.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              uploadedFile ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
            }`}>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                {uploadedFile ? 'Document Ready' : 'Upload to Start'}
              </span>
            </div>
            
            {isProcessing && (
              <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning rounded-full animate-fade-in">
                <Zap className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Processing...</span>
              </div>
            )}
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {[
              { label: 'PDF Processing', icon: '📄' },
              { label: 'Vector Search', icon: '🔍' },
              { label: 'AI Answers', icon: '🤖' },
              { label: 'Real-time', icon: '⚡' }
            ].map((feature, index) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-3 py-1.5 bg-card/50 backdrop-blur-sm border rounded-full hover:bg-accent/10 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-sm">{feature.icon}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
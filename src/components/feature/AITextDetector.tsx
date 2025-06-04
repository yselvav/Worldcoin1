'use client';

import React, { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AITextAnalysisResult, AnalyzeTextFunction } from '@/types';
import { TextClassification } from '@/types';
import { Terminal, FileText, Brain, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AITextDetectorProps {
  analyzeText: AnalyzeTextFunction;
}

const AITextDetector: React.FC<AITextDetectorProps> = ({ analyzeText }) => {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<AITextAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
    } catch (e: any) {
      console.error("Analysis error:", e);
      setError(e.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [text, analyzeText]);

  const getBadgeVariant = (classification: TextClassification): string => {
    switch (classification) {
      case TextClassification.AI_GENERATED:
        return "bg-violet-600 hover:bg-violet-700 text-primary-foreground"; // Using theme accent color (violet)
      case TextClassification.HUMAN_WRITTEN:
        return "bg-emerald-500 hover:bg-emerald-600 text-primary-foreground";
      case TextClassification.UNCERTAIN:
      default:
        return "bg-yellow-500 hover:bg-yellow-600 text-primary-foreground";
    }
  };
  
  const getIconForClassification = (classification: TextClassification) => {
    switch (classification) {
      case TextClassification.AI_GENERATED:
        return <Brain className="w-4 h-4 mr-1.5" />;
      case TextClassification.HUMAN_WRITTEN:
        return <User className="w-4 h-4 mr-1.5" />;
      case TextClassification.UNCERTAIN:
      default:
        return <FileText className="w-4 h-4 mr-1.5" />;
    }
  };


  return (
    <section aria-labelledby="ai-text-detector-heading" className="w-full mb-12 p-6 bg-card/70 rounded-lg shadow-xl backdrop-blur">
      <h2 id="ai-text-detector-heading" className="text-2xl font-semibold mb-6 text-center text-primary">
        AI Text Detector
      </h2>
      
      <div className="mb-4">
        <label htmlFor="text-to-analyze" className="block text-sm font-medium text-muted-foreground mb-1">
          Enter text to analyze:
        </label>
        <Textarea
          id="text-to-analyze"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={8}
          className="bg-background border-border focus:ring-primary"
          disabled={isLoading}
          aria-label="Text to analyze"
        />
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={isLoading || !text.trim()}
        className="w-full"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? <LoadingSpinner text="Analyzing..." /> : "Analyze Text"}
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-6 text-left">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="mt-6 p-4 border border-border rounded-md bg-background/50">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Analysis Result:</h3>
          <div className="flex items-center mb-2">
            <Badge className={cn("text-sm py-1 px-3", getBadgeVariant(result.classification))}>
               {getIconForClassification(result.classification)}
              {result.classification}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">Explanation:</strong> {result.explanation}
          </p>
        </div>
      )}
    </section>
  );
};

export default AITextDetector;

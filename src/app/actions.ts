'use server';

import { analyzeText as analyzeTextFlow, AnalyzeTextInput, AnalyzeTextOutput } from '@/ai/flows/analyze-text';
import { AITextAnalysisResult, TextClassification } from '@/types';

export async function analyzeTextAction(textToAnalyze: string): Promise<AITextAnalysisResult> {
  if (!textToAnalyze || textToAnalyze.trim() === "") {
    return {
      classification: TextClassification.UNCERTAIN,
      explanation: "Input text cannot be empty.",
    };
  }

  try {
    const input: AnalyzeTextInput = { textToAnalyze };
    const result: AnalyzeTextOutput = await analyzeTextFlow(input);
    
    // Map Genkit flow output to AITextAnalysisResult, ensuring enum consistency
    let classificationEnum: TextClassification;
    switch (result.classification) {
      case 'AI_GENERATED':
        classificationEnum = TextClassification.AI_GENERATED;
        break;
      case 'HUMAN_WRITTEN':
        classificationEnum = TextClassification.HUMAN_WRITTEN;
        break;
      default:
        classificationEnum = TextClassification.UNCERTAIN;
    }

    return {
      classification: classificationEnum,
      explanation: result.explanation,
    };
  } catch (error) {
    console.error("Error in analyzeTextAction:", error);
    return {
      classification: TextClassification.UNCERTAIN,
      explanation: "Failed to analyze text due to a server error. Please try again later.",
    };
  }
}

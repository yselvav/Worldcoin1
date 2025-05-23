'use server';

/**
 * @fileOverview Analyzes text using the Gemini API to determine if it's AI-generated or human-written.
 *
 * - analyzeText - A function that handles the text analysis process.
 * - AnalyzeTextOutput - The output type for the analyzeText function.
 * - AnalyzeTextInput - The input type for the analyzeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextInputSchema = z.object({
  textToAnalyze: z.string().describe('The text to analyze.'),
});
export type AnalyzeTextInput = z.infer<typeof AnalyzeTextInputSchema>;

const TextClassificationSchema = z.enum(['AI_GENERATED', 'HUMAN_WRITTEN', 'UNCERTAIN']);

const AnalyzeTextOutputSchema = z.object({
  classification: TextClassificationSchema.describe('The classification of the text.'),
  explanation: z.string().describe('The explanation of the classification.'),
});
export type AnalyzeTextOutput = z.infer<typeof AnalyzeTextOutputSchema>;

export async function analyzeText(input: AnalyzeTextInput): Promise<AnalyzeTextOutput> {
  return analyzeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextPrompt',
  input: {schema: AnalyzeTextInputSchema},
  output: {schema: AnalyzeTextOutputSchema},
  prompt: `You are an expert in distinguishing between AI-generated and human-written text.\n\nAnalyze the following text and classify it as either 'AI-Generated' or 'Human-Written'. Provide a brief explanation for your classification (1-2 sentences).\n\nText to analyze: {{{textToAnalyze}}}\n\nRespond STRICTLY in JSON format:\n\n{
  "classification": "AI-Generated" | "Human-Written" | "Uncertain",
  "explanation": "..."
}\n\nExample:\n{
  "classification": "AI-Generated",
  "explanation": "The text exhibits patterns and phrasing commonly found in AI-generated content, such as a lack of personal anecdotes and a formal tone." 
}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const analyzeTextFlow = ai.defineFlow(
  {
    name: 'analyzeTextFlow',
    inputSchema: AnalyzeTextInputSchema,
    outputSchema: AnalyzeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

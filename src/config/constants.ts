import type { TextSnippet } from '@/types';

export const APP_TITLE = "AI Text Verifier & Voter";

// Ensure NEXT_PUBLIC_WLD_APP_ID and NEXT_PUBLIC_WLD_ACTION_ID are set in your environment
// Replace with your actual App ID and Action ID from the Worldcoin Developer Portal
export const WORLDCOIN_APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID || "app_YOUR_APP_ID_HERE";
export const WORLDCOIN_ACTION_ID = process.env.NEXT_PUBLIC_WLD_ACTION_ID || "action_YOUR_ACTION_ID_HERE";

export const SAMPLE_TEXTS_FOR_VOTING: TextSnippet[] = [
  {
    id: "sample1",
    text: "The quick brown fox jumps over the lazy dog. This sentence is a classic pangram, containing all letters of the English alphabet. It's often used for testing typefaces and keyboard layouts.",
  },
  {
    id: "sample2",
    text: "Recent advancements in neural networks have led to breakthroughs in natural language processing. Models can now generate remarkably coherent and contextually relevant text, blurring the lines between human and machine-authored content.",
  },
  {
    id: "sample3",
    text: "I went to the store this morning to buy some milk and eggs. The weather was surprisingly pleasant for this time of year, a bit chilly but sunny. The cashier was friendly and wished me a good day.",
  },
  {
    id: "sample4",
    text: "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
  },
  {
    id: "sample5",
    text: "Our quarterly earnings report indicates a significant upswing in market penetration, primarily driven by strategic anaphora deployment and leveraging synergistic paradigm shifts. We anticipate continued growth trajectory optimization through Q4.",
  },
];

// GEMINI_MODEL_TEXT is handled by the pre-existing Genkit flow `src/ai/flows/analyze-text.ts`
// but we can keep a reference if needed elsewhere, though the server action will use the flow's config.
export const GEMINI_MODEL_FOR_REFERENCE = 'gemini-2.0-flash'; // As used in src/ai/genkit.ts default

export const MINIKIT_SUCCESS_STATUS = 'success';

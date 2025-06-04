
export enum TextClassification {
  AI_GENERATED = 'AI-Generated',
  HUMAN_WRITTEN = 'Human-Written',
  UNCERTAIN = 'Uncertain',
}

export interface AITextAnalysisResult {
  classification: TextClassification;
  explanation: string;
}

export interface TextSnippet {
  id: string;
  text: string;
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFYING = 'VERIFYING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
}

// This type will be used for the server action
export type AnalyzeTextFunction = (textToAnalyze: string) => Promise<AITextAnalysisResult>;

// For MiniKit.commandsAsync.verify response
export interface VerifyResponse {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  credential_type: string;
  [key: string]: unknown; // Allow other properties
}

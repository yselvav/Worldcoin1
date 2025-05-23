'use client';

import React, { useState, useEffect, useCallback, useContext } from 'react';
import type { VerificationStatus, AITextAnalysisResult, VerifyResponse as WorldIDVerifyResponse } from '@/types';
import { VerificationStatus as VerificationStatusEnum, TextClassification } from '@/types';
import { WORLDCOIN_ACTION_ID, APP_TITLE, MINIKIT_SUCCESS_STATUS } from '@/config/constants';
import { analyzeTextAction } from '@/app/actions';

import Header from '@/components/feature/Header';
import WorldIDVerification from '@/components/feature/WorldIDVerification';
import AITextDetector from '@/components/feature/AITextDetector';
import TextVoting from '@/components/feature/TextVoting';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { MiniKitContext }from '@/components/providers/WorldcoinProvider';
import { useToast } from "@/hooks/use-toast";

// Helper to check if API_KEY might be missing for Gemini (conceptual, as Genkit hides this)
// In a real scenario with client-side Gemini, you'd check process.env.NEXT_PUBLIC_GEMINI_API_KEY
const isGeminiConfigured = true; // Assume Genkit handles its config, so always true from client's PoV

export default function AppLayout() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatusEnum.UNVERIFIED);
  const [isWorldAppInstalled, setIsWorldAppInstalled] = useState<boolean | null>(null);
  const [worldIdError, setWorldIdError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { isReady: isMiniKitReady, miniKit } = useContext(MiniKitContext);
  const [isLoadingInstallationStatus, setIsLoadingInstallationStatus] = useState(true);


  useEffect(() => {
    if (isMiniKitReady && miniKit) {
      setIsLoadingInstallationStatus(true);
      miniKit.isInstalled()
        .then((installed: boolean) => {
          setIsWorldAppInstalled(installed);
          if (!installed) {
            console.info("World App not detected. Please open this in the World App for verification.");
          }
        })
        .catch((error: any) => {
          console.error("Error checking World App installation status:", error);
          setIsWorldAppInstalled(false); // Assume not installed on error
          setWorldIdError("Could not check World App status. Please ensure you are in a compatible environment.");
        })
        .finally(() => {
          setIsLoadingInstallationStatus(false);
        });
    } else if (!isMiniKitReady && !miniKit){
      // MiniKit might still be loading or failed to load
      // We can set a timeout to give it a chance, or handle this state appropriately
      const timer = setTimeout(() => {
        if (!miniKit) { // Check again after a delay
            setIsLoadingInstallationStatus(false);
            setIsWorldAppInstalled(false); // Assume not installed if MiniKit failed
            setWorldIdError("Worldcoin integration failed to load. Verification may not be available.");
        }
      }, 3000); // Wait 3 seconds for MiniKit to potentially load
      return () => clearTimeout(timer);
    }
  }, [isMiniKitReady, miniKit]);

  const handleVerify = useCallback(async () => {
    if (!miniKit) {
      setWorldIdError("Worldcoin integration is not ready. Please try again in a moment.");
      toast({ title: "Error", description: "Worldcoin integration is not ready.", variant: "destructive" });
      return;
    }
    if (isWorldAppInstalled === false) {
      setWorldIdError("Please open this application within the World App to verify.");
      toast({ title: "Verification Failed", description: "Please open this application within the World App to verify.", variant: "destructive" });
      return;
    }

    setVerificationStatus(VerificationStatusEnum.VERIFYING);
    setWorldIdError(null);

    try {
      // The signal should ideally be a unique, user-specific, and session-specific value.
      // For this example, using a timestamp or a random string.
      // In a real app, this might be tied to the user's session or a specific action.
      const signal = `user_signal_${Date.now()}`; // Example signal
      console.log("Requesting verification with action ID:", WORLDCOIN_ACTION_ID, "and signal:", signal);

      const result = await miniKit.verifyAsync({
        action: WORLDCOIN_ACTION_ID,
        signal: signal, // An arbitrary string to associate with the proof, helps prevent replay attacks if verified server-side
      });
      
      console.log("World ID verification attempt result:", result);

      if (result && result.status === MINIKIT_SUCCESS_STATUS && result.finalPayload && result.finalPayload.proof) {
        const { merkle_root, nullifier_hash, proof } = result.finalPayload as WorldIDVerifyResponse;
        console.log("World ID Verification Successful (frontend simulation).");
        console.log("Merkle Root:", merkle_root);
        console.log("Nullifier Hash:", nullifier_hash);
        console.log("Proof:", proof);
        // IMPORTANT: In a real application, you MUST send the `result.finalPayload`
        // (merkle_root, nullifier_hash, proof) to your backend server.
        // Your backend server then verifies this proof with Worldcoin's servers
        // using your Developer Portal App ID and Action ID.
        // Only after successful backend verification should you trust the user's claim.
        // For this frontend-only example, we simulate success.
        setVerificationStatus(VerificationStatusEnum.VERIFIED);
        toast({ title: "Success", description: "World ID Verified!" });
      } else {
        const errorDetail = result?.detail || "Unknown verification error.";
        console.error("World ID Verification Failed:", errorDetail);
        setWorldIdError(`Verification failed: ${errorDetail}`);
        setVerificationStatus(VerificationStatusEnum.FAILED);
        toast({ title: "Verification Failed", description: errorDetail, variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Exception during World ID verification:", error);
      const errorMessage = error.message || "An unexpected error occurred during verification.";
      setWorldIdError(`Verification error: ${errorMessage}`);
      setVerificationStatus(VerificationStatusEnum.FAILED);
      toast({ title: "Verification Error", description: errorMessage, variant: "destructive" });
    }
  }, [miniKit, isWorldAppInstalled, toast]);


  if (!isMiniKitReady && isLoadingInstallationStatus) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
        <LoadingSpinner text="Initializing Worldcoin..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8">
      <Header
        verificationStatus={verificationStatus}
        isWorldAppInstalled={isWorldAppInstalled}
      />

      <main className="w-full max-w-3xl mt-8 flex-grow">
        {verificationStatus !== VerificationStatusEnum.VERIFIED ? (
          <WorldIDVerification
            onVerify={handleVerify}
            isVerifying={verificationStatus === VerificationStatusEnum.VERIFYING}
            isWorldAppInstalled={isWorldAppInstalled}
            verificationError={worldIdError}
            isLoadingInstallationStatus={isLoadingInstallationStatus}
          />
        ) : (
          <>
            {!isGeminiConfigured ? (
              <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded-md shadow-md mb-6" role="alert">
                <strong className="font-bold">AI Features Unavailable:</strong>
                <span className="block sm:inline"> The Gemini API key is not configured. AI text analysis features are disabled.</span>
              </div>
            ) : (
              <AITextDetector analyzeText={analyzeTextAction} />
            )}
            <TextVoting />
          </>
        )}
      </main>

      <footer className="w-full max-w-3xl mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
        <p>Powered by Worldcoin & Google Gemini</p>
      </footer>
    </div>
  );
}

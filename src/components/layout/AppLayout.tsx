
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { VerificationStatus, VerifyResponse as WorldIDVerifyResponse } from '@/types';
import { VerificationStatus as VerificationStatusEnum } from '@/types';
import { WORLDCOIN_ACTION_ID, APP_TITLE, MINIKIT_SUCCESS_STATUS } from '@/config/constants';
import { analyzeTextAction } from '@/app/actions';

import Header from '@/components/feature/Header';
import WorldIDVerification from '@/components/feature/WorldIDVerification';
import AITextDetector from '@/components/feature/AITextDetector';
import TextVoting from '@/components/feature/TextVoting';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useToast } from "@/hooks/use-toast";

// Assume Genkit handles its config, so always true from client's PoV for Gemini availability
const isGeminiConfigured = true; 

export default function AppLayout() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatusEnum.UNVERIFIED);
  const [isWorldAppInstalled, setIsWorldAppInstalled] = useState<boolean | null>(null);
  const [worldIdError, setWorldIdError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { isInstalled: isMiniKitReady } = useMiniKit();
  const [isLoadingInstallationStatus, setIsLoadingInstallationStatus] = useState(true);


  useEffect(() => {
    if (isMiniKitReady) {
      setIsLoadingInstallationStatus(true);
      try {
        const installed: boolean = MiniKit.isInstalled();
        setIsWorldAppInstalled(installed);
        if (!installed) {
          console.info("World App not detected. Please open this in the WorldApp for verification.");
        }
      } catch (error: any) {
        console.error("Error checking World App installation status:", error);
        setIsWorldAppInstalled(false);
        setWorldIdError("Could not check World App status. Please ensure you are in a compatible environment.");
      } finally {
        setIsLoadingInstallationStatus(false);
      }
    } else { // MiniKit is not ready yet
      // Keep loading status true while waiting for readiness or timeout
      setIsLoadingInstallationStatus(true); 
      const timer = setTimeout(() => {
        // After 3 seconds, re-check isMiniKitReady.
        // If still not ready, then consider it failed.
        if (!isMiniKitReady) { // Check the current value of isMiniKitReady
            setIsLoadingInstallationStatus(false);
            setIsWorldAppInstalled(false); 
            setWorldIdError("Worldcoin integration failed to load or is not available after timeout. Verification may not work.");
            console.warn("MiniKit still not available after 3s timeout via useMiniKit hook.");
        }
        // If it became true in these 3s, the other branch of useEffect will handle it on next render.
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [isMiniKitReady]); // Depend only on isMiniKitReady

  const handleVerify = useCallback(async () => {
    if (!isMiniKitReady || !MiniKit?.commandsAsync?.verify) {
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
      const signal = `user_signal_${Date.now()}`; 
      console.log("Requesting verification with action ID:", WORLDCOIN_ACTION_ID, "and signal:", signal);

      const result = await MiniKit.commandsAsync.verify({
        action: WORLDCOIN_ACTION_ID,
        signal: signal,
        verification_level: VerificationLevel.Orb,
      });

      console.log("World ID verification attempt result:", result);

      const payload = result.finalPayload as any;

      if (payload && payload.status === MINIKIT_SUCCESS_STATUS && payload.proof) {
        const { merkle_root, nullifier_hash, proof } = payload as WorldIDVerifyResponse;
        console.log("World ID Verification Successful (frontend simulation).");
        console.log("Merkle Root:", merkle_root);
        console.log("Nullifier Hash:", nullifier_hash);
        console.log("Proof:", proof);
        setVerificationStatus(VerificationStatusEnum.VERIFIED);
        toast({ title: "Success", description: "World ID Verified!" });
      } else {
        const errorDetail = payload?.error_code || "Unknown verification error.";
        console.error("World ID Verification Failed:", errorDetail);
        setWorldIdError(`Verification failed: ${errorDetail}`);
        setVerificationStatus(VerificationStatusEnum.FAILED);
        toast({ title: "Verification Failed", description: String(errorDetail), variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Exception during World ID verification:", error);
      const errorMessage = error.message || error.detail || error.error_code || "An unexpected error occurred during verification.";
      setWorldIdError(`Verification error: ${errorMessage}`);
      setVerificationStatus(VerificationStatusEnum.FAILED);
      toast({ title: "Verification Error", description: String(errorMessage), variant: "destructive" });
    }
  }, [isMiniKitReady, isWorldAppInstalled, toast]); // WORLDCOIN_ACTION_ID should be stable


  if (!isMiniKitReady && isLoadingInstallationStatus) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 bg-[radial-gradient(circle_at_top_right,_hsl(var(--accent)_/_20%),_transparent_70%)]">
        <LoadingSpinner text="Initializing Worldcoin..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 bg-[radial-gradient(circle_at_bottom_left,_hsl(var(--accent)_/_15%),_transparent_70%)]">
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
        <p>Powered by Worldcoin</p>
      </footer>
    </div>
  );
}

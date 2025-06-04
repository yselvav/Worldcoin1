'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

interface WorldIDVerificationProps {
  onVerify: () => void;
  isVerifying: boolean;
  isWorldAppInstalled: boolean | null;
  verificationError: string | null;
  isLoadingInstallationStatus: boolean;
}

const WorldIDVerification: React.FC<WorldIDVerificationProps> = ({
  onVerify,
  isVerifying,
  isWorldAppInstalled,
  verificationError,
  isLoadingInstallationStatus,
}) => {
  const showLoadingState = isVerifying || isLoadingInstallationStatus;

  return (
    <section aria-labelledby="world-id-verification-heading" className="w-full flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-xl">
       <Image 
        src="https://placehold.co/100x100.png" // Placeholder for Worldcoin Orb
        alt="Worldcoin Orb" 
        width={80} 
        height={80} 
        className="mb-6 rounded-full"
        data-ai-hint="orb sphere"
      />
      <h2 id="world-id-verification-heading" className="text-2xl font-semibold mb-4 text-primary">
        Verify Your Humanity
      </h2>
      <p className="mb-6 text-muted-foreground">
        This application uses World ID to ensure users are unique, real humans.
        Verify with World ID to access text analysis and voting features.
      </p>

      {showLoadingState ? (
        <LoadingSpinner text={isVerifying ? "Verifying with World ID..." : "Checking World App status..."} className="w-10 h-10" />
      ) : (
        <Button
          onClick={onVerify}
          disabled={showLoadingState || isWorldAppInstalled === false}
          className="w-full max-w-xs"
          aria-label="Verify with World ID"
        >
          Verify with World ID
        </Button>
      )}

      {!showLoadingState && verificationError && (
         <Alert variant="destructive" className="mt-6 text-left">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Verification Error</AlertTitle>
          <AlertDescription>
            {verificationError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mt-6 text-sm text-muted-foreground">
        {isLoadingInstallationStatus && !isVerifying && (
            <p>Please wait while we check if World App is installed...</p>
        )}
        {!isLoadingInstallationStatus && isWorldAppInstalled === false && (
          <p className="font-semibold text-yellow-400">
            Please open this application within the World App to enable verification. If you don't have World App, you can download it from the app store.
          </p>
        )}
        {!isLoadingInstallationStatus && isWorldAppInstalled === true && !isVerifying && (
          <p>Ready to verify. Click the button above.</p>
        )}
      </div>
    </section>
  );
};

export default WorldIDVerification;

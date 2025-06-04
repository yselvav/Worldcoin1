'use client';

import React from 'react';
import Image from 'next/image';
import { APP_TITLE } from '@/config/constants';
import type { VerificationStatus as VerificationStatusType } from '@/types';
import { VerificationStatus } from '@/types'; // Enum
import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion, Hourglass } from 'lucide-react';

interface HeaderProps {
  verificationStatus: VerificationStatusType;
  isWorldAppInstalled: boolean | null;
}

const Header: React.FC<HeaderProps> = ({ verificationStatus, isWorldAppInstalled }) => {
  let statusText: string;
  let StatusIcon: React.ElementType;
  let statusColorClass: string;

  switch (verificationStatus) {
    case VerificationStatus.VERIFIED:
      statusText = "Verified Human";
      StatusIcon = ShieldCheck;
      statusColorClass = "text-green-400";
      break;
    case VerificationStatus.VERIFYING:
      statusText = "Verifying...";
      StatusIcon = Hourglass;
      statusColorClass = "text-yellow-400";
      break;
    case VerificationStatus.FAILED:
      statusText = "Verification Failed";
      StatusIcon = ShieldX;
      statusColorClass = "text-red-400";
      break;
    case VerificationStatus.UNVERIFIED:
    default:
      statusText = "Not Verified";
      StatusIcon = ShieldAlert;
      statusColorClass = "text-red-400";
  }

  let worldAppStatusText: string | null = null;
  if (isWorldAppInstalled === true && verificationStatus !== VerificationStatus.VERIFIED) {
    worldAppStatusText = "World App Connected";
  } else if (isWorldAppInstalled === false && verificationStatus !== VerificationStatus.VERIFIED) {
    worldAppStatusText = "Open in World App for verification";
  }


  return (
    <header className="w-full max-w-3xl text-center p-4 rounded-lg shadow-xl bg-card/70 backdrop-blur border border-border">
      <div className="flex items-center justify-center mb-4">
        <Image 
            src="https://worldcoin.org/favicon.ico" 
            alt="Worldcoin Logo" 
            width={40} 
            height={40} 
            className="mr-3 rounded-full"
            data-ai-hint="logo crypto" 
        />
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">{APP_TITLE}</h1>
      </div>
      
      <div className={`flex items-center justify-center text-lg ${statusColorClass} mb-2`}>
        <StatusIcon className="w-6 h-6 mr-2" />
        <span>{statusText}</span>
      </div>

      {worldAppStatusText && (
        <p className="text-sm text-muted-foreground">{worldAppStatusText}</p>
      )}
       {isWorldAppInstalled === null && verificationStatus === VerificationStatus.UNVERIFIED && (
        <p className="text-sm text-muted-foreground">Checking World App status...</p>
      )}
    </header>
  );
};

export default Header;

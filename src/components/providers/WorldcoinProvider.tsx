// src/components/providers/WorldcoinProvider.tsx
'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { WORLDCOIN_APP_ID, WORLDCOIN_ACTION_ID } from '@/config/constants';

// Placeholder for MiniKit types if you have them or can define basic ones
interface MiniKitInstance {
  init: (options: MiniKitOptions) => void;
  isInstalled: () => Promise<boolean>;
  verifyAsync: (options: VerifyAsyncOptions) => Promise<any>; // Replace 'any' with actual response type
}

interface MiniKitOptions {
  app_id: string;
  action: string;
  signal?: string;
  wallet_connect_project_id?: string;
}

interface VerifyAsyncOptions {
  action: string;
  signal?: string;
}

// This global variable will hold the MiniKit instance once loaded.
declare global {
  interface Window {
    MiniKit?: MiniKitInstance;
  }
}

interface WorldcoinProviderProps {
  children: ReactNode;
}

// A context to provide MiniKit readiness status and the instance itself.
export const MiniKitContext = React.createContext<{ isReady: boolean; miniKit: MiniKitInstance | null }>({
  isReady: false,
  miniKit: null,
});


const WorldcoinProvider: React.FC<WorldcoinProviderProps> = ({ children }) => {
  const [isMiniKitReady, setIsMiniKitReady] = useState(false);
  const [miniKitInstance, setMiniKitInstance] = useState<MiniKitInstance | null>(null);

  useEffect(() => {
    // Dynamically import MiniKit to ensure it's client-side only
    import('@worldcoin/minikit-js')
      .then(importedModule => { // This is the Module Namespace Object
        // The actual MiniKit instance could be the default export,
        // or the module itself if it's structured that way.
        let minikitToUse: MiniKitInstance | null = null;

        // Check if importedModule.default has .init (common for ESM default exports or CJS interop)
        if (importedModule && (importedModule as any).default && typeof (importedModule as any).default.init === 'function') {
          minikitToUse = (importedModule as any).default as MiniKitInstance;
          console.log("Using importedModule.default as MiniKit instance.");
        }
        // Else, check if importedModule itself has .init (common for UMD or some ESM structures)
        else if (importedModule && typeof (importedModule as any).init === 'function') {
          minikitToUse = importedModule as unknown as MiniKitInstance;
          console.log("Using imported module directly as MiniKit instance.");
        }

        if (minikitToUse) {
          minikitToUse.init({
            app_id: WORLDCOIN_APP_ID,
            action: WORLDCOIN_ACTION_ID,
            // signal: "", // Optional: An arbitrary string to associate with the proof
            // wallet_connect_project_id: "YOUR_WALLET_CONNECT_PROJECT_ID" // Optional: Project ID for WalletConnect
          });
          window.MiniKit = minikitToUse; // Make it globally accessible if needed, or pass via context
          setMiniKitInstance(minikitToUse);
          setIsMiniKitReady(true);
          console.log("Worldcoin MiniKit initialized successfully.");
        } else {
          console.error("Imported module is not a valid MiniKit instance or init function not found. Module content:", importedModule);
        }
      })
      .catch(error => {
        console.error("Failed to load or initialize Worldcoin MiniKit:", error);
      });
  }, []);

  // The prompt mentions <MiniKitProvider> from '@worldcoin/minikit-js/minikit-provider'.
  // As this path and component are not standard for 'minikit-js', we are initializing MiniKit directly.
  // This component effectively acts as the "provider" by ensuring MiniKit is loaded and initialized.
  // If a real MiniKitProvider component existed at that path, its usage would look like:
  //
  // import { MiniKitProvider as ActualProvider } from '@worldcoin/minikit-js/minikit-provider';
  // return (
  //   <ActualProvider app_id={WORLDCOIN_APP_ID} action={WORLDCOIN_ACTION_ID}>
  //     {children}
  //   </ActualProvider>
  // );
  //
  // Since it doesn't, we simply return children after attempting initialization.
  // The AppLayout will use the MiniKitContext to access the instance.

  return (
    <MiniKitContext.Provider value={{ isReady: isMiniKitReady, miniKit: miniKitInstance }}>
      {children}
    </MiniKitContext.Provider>
  );
};

export default WorldcoinProvider;

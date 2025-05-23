// src/components/providers/WorldcoinProvider.tsx
'use client';

import React, { type ReactNode } from 'react';
import { MiniKitProvider as OfficialMiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { WORLDCOIN_APP_ID, WORLDCOIN_ACTION_ID } from '@/config/constants';

interface WorldcoinProviderProps {
  children: ReactNode;
}

const WorldcoinProvider: React.FC<WorldcoinProviderProps> = ({ children }) => {
  const miniKitOptions = {
    app_id: WORLDCOIN_APP_ID,
    action: WORLDCOIN_ACTION_ID,
    // signal: "", // Optional: An arbitrary string to associate with the proof, usually set per-action
    // wallet_connect_project_id: "YOUR_WALLET_CONNECT_PROJECT_ID" // Optional: Project ID for WalletConnect
  };

  return (
    <OfficialMiniKitProvider options={miniKitOptions}>
      {children}
    </OfficialMiniKitProvider>
  );
};

export default WorldcoinProvider;

// src/components/providers/WorldcoinProvider.tsx
'use client';

import React, { type ReactNode } from 'react';
import { MiniKitProvider as OfficialMiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { WORLDCOIN_APP_ID, WORLDCOIN_ACTION_ID } from '@/config/constants';

interface WorldcoinProviderProps {
  children: ReactNode;
}

const WorldcoinProvider: React.FC<WorldcoinProviderProps> = ({ children }) => {
  const miniKitProps = {
    appId: WORLDCOIN_APP_ID,
  };

  return (
    <OfficialMiniKitProvider props={miniKitProps}>
      {children}
    </OfficialMiniKitProvider>
  );
};

export default WorldcoinProvider;

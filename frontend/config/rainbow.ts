"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'viem';

const somniaTestnet: Chain = {
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    public: { http: ['https://dream-rpc.somnia.network/'] },
    default: { http: ['https://dream-rpc.somnia.network/'] },
  },
  blockExplorers: {
    default: { name: 'Somnia Testnet Explorer', url: 'https://somnia-testnet.socialscan.io' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'TypeFi - Blockchain Typing Game',
  projectId: 'YOUR_PROJECT_ID', // Get this from https://cloud.walletconnect.com/
  chains: [somniaTestnet],
});
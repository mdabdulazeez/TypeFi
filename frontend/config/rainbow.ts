"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'viem';

const somniaTestnet: Chain = {
  id: 2002,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SOMI',
    symbol: 'SOMI',
  },
  rpcUrls: {
    public: { http: ['https://testnet-rpc.somnia.network/'] },
    default: { http: ['https://testnet-rpc.somnia.network/'] },
  },
  blockExplorers: {
    default: { name: 'SomniaScan', url: 'https://testnet.somniascan.io' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'TypeFi - Blockchain Typing Game',
  projectId: 'YOUR_PROJECT_ID', // Get this from https://cloud.walletconnect.com/
  chains: [somniaTestnet],
});
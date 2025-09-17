"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { http } from 'viem';

// Define Somnia testnet using defineChain for better compatibility
const somniaTestnet = defineChain({
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
    default: { name: 'Dreamscout Explorer', url: 'https://dreamscout.somnia.network' },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'TypeFi - Blockchain Typing Game',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2f05a7cae2c1bc96b5ab21f67dc21e11',
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http('https://dream-rpc.somnia.network/'),
  },
  ssr: false,
});

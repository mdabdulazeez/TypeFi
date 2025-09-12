import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'viem/chains';

export const config = getDefaultConfig({
  appName: 'TypeFi - Blockchain Typing Game',
  projectId: '', // TODO: Add your WalletConnect project ID
  chains: [sepolia], // Using Sepolia testnet
  ssr: true,
});
"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { TypingGame } from './TypingGame';
import { Leaderboard } from './Leaderboard';
import { AutoFaucet } from './AutoFaucet';
import { useState, useEffect } from 'react';

export function GameContainer() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state until component is mounted on client
  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 p-8">
        <h1 className="text-4xl font-bold">TypeFi</h1>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 p-8">
        <h1 className="text-4xl font-bold">TypeFi</h1>
        <p className="text-lg text-gray-600">Connect your wallet to start playing</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-end py-4">
        <ConnectButton />
      </div>
      <AutoFaucet />
      <TypingGame />
      <Leaderboard />
    </div>
  );
}

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
        <div className="glass glow-hover glow-primary rounded-2xl p-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            TypeFi
          </h1>
          <p className="text-lg text-gray-300 mt-4">Loading...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
        <div className="glass glow-hover glow-primary rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
            TypeFi
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Connect your wallet to start playing
          </p>
          <div className="flex justify-center items-center">
            <div className="glow-hover glow-secondary transform hover:scale-105 transition-transform duration-200">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header with connect button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            TypeFi
          </h1>
          <div className="glass rounded-xl p-1 border border-gray-700/50">
            <ConnectButton />
          </div>
        </div>
        
        {/* Main content grid */}
        <div className="space-y-8">
          <div className="glass rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all">
            <AutoFaucet />
          </div>
          
          <div className="glass glow-hover glow-secondary rounded-2xl p-6 border border-gray-800/50 hover:border-purple-500/30 transition-all">
            <TypingGame />
          </div>
          
          <div className="glass rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}

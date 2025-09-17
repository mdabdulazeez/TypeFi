"use client";

import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';

interface AutoFaucetProps {
  onTokensReceived?: () => void;
}

export function AutoFaucet({ onTokensReceived }: AutoFaucetProps) {
  const { address, isConnected } = useAccount();
  const [isRequestingTokens, setIsRequestingTokens] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read user's native STT balance
  const { data: balanceData, refetch } = useBalance({
    address: address,
  });
  
  const balance = balanceData?.value;
  const balanceNum = balance ? Number(formatEther(balance)) : 0;

  // Auto-request tokens when wallet connects and has less than 0.5 tokens
  // (Players need some STT for gas fees and to receive rewards)
  useEffect(() => {
    if (isConnected && address && balance !== undefined && balanceNum < 0.5) {
      console.log(`Player balance: ${balanceNum} STT - requesting faucet tokens`);
      requestTokensFromFaucet();
    }
  }, [isConnected, address, balance, balanceNum]);


  const requestTokensFromFaucet = async () => {
    if (!address || isRequestingTokens) return;

    setIsRequestingTokens(true);
    setError(null);

    try {
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: address
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.success) {
          setTimeout(() => {
            refetch();
            onTokensReceived?.();
          }, 3000);
        }
      } else {
        setError(responseData.error || 'Failed to request tokens');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsRequestingTokens(false);
    }
  };

  // Show loading state if requesting tokens
  if (isRequestingTokens) {
    return (
      <div className="glass rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
          <p className="text-sm text-indigo-300">Getting you 1 STT token...</p>
        </div>
      </div>
    );
  }


  // Show success message if balance >= 0.5
  if (balance && balanceNum >= 0.5) {
    return (
      <div className="glass rounded-xl p-4 border border-gray-700/50">
        <p className="text-sm text-emerald-300">
          ✅ You have {formatEther(balance)} STT tokens - ready to play!
        </p>
      </div>
    );
  }
  
  // Show info if balance is between 0 and 0.5
  if (balance && balanceNum > 0 && balanceNum < 0.5) {
    return (
      <div className="glass rounded-xl p-4 border border-gray-700/50">
        <p className="text-sm text-amber-300">
          ⚠️ Low balance: {formatEther(balance)} STT. Getting more tokens...
        </p>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="glass rounded-xl p-4 border border-red-500/30">
        <p className="text-sm text-red-300 mb-3">❌ {error}</p>
        <button
          onClick={() => {
            setError(null);
            requestTokensFromFaucet();
          }}
          className="px-4 py-2 glass rounded-lg text-sm font-medium text-gray-200 border border-gray-700/50 hover:border-red-400/50 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show manual faucet button if player has 0 balance
  if (balance !== undefined && balanceNum === 0 && !isRequestingTokens) {
    return (
      <div className="glass rounded-xl p-4 border border-blue-400/30">
        <p className="text-sm text-blue-300 mb-3">
          🪙 You need STT tokens to play and pay gas fees
        </p>
        <button
          onClick={requestTokensFromFaucet}
          className="w-full px-4 py-2 glass rounded-lg font-medium text-gray-200 border border-blue-400/50 hover:border-blue-400 transition-all"
        >
          Get 1 STT Token (Free)
        </button>
      </div>
    );
  }

  return null;
}
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
  const [hasRequested, setHasRequested] = useState(false);

  // Read user's native STT balance
  const { data: balanceData, refetch } = useBalance({
    address: address,
  });
  
  const balance = balanceData?.value;

  // Auto-request tokens when wallet connects and has less than 0.5 tokens
  useEffect(() => {
    if (isConnected && address && balance !== undefined && !hasRequested) {
      const balanceNum = Number(formatEther(balance));
      
      if (balanceNum < 0.5) {
        requestTokensFromFaucet();
      }
    }
  }, [isConnected, address, balance, hasRequested]);

  const requestTokensFromFaucet = async () => {
    if (!address || hasRequested || isRequestingTokens) return;

    console.log('🔄 Requesting tokens for address:', address);
    setIsRequestingTokens(true);
    setHasRequested(true);

    try {
      console.log('📡 Calling faucet API...');
      // Call your backend API to send tokens from your wallet
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: address,
          amount: '1.0' // 1.0 STT tokens
        }),
      });

      const responseData = await response.json();
      console.log('📥 Faucet API response:', responseData);

      if (response.ok) {
        console.log('✅ Tokens sent successfully:', responseData);
        
        // Refetch balance after a delay
        setTimeout(() => {
          console.log('🔄 Refetching balance...');
          refetch();
          onTokensReceived?.();
        }, 5000); // Increased delay to 5 seconds
      } else {
        console.error('❌ Failed to request tokens from faucet:', responseData);
        setHasRequested(false); // Allow retry
      }
    } catch (error) {
      console.error('💥 Error requesting tokens:', error);
      setHasRequested(false); // Allow retry
    } finally {
      setIsRequestingTokens(false);
    }
  };

  // Show loading state if requesting tokens
  if (isRequestingTokens) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-sm text-blue-600">Getting you 1 STT token to play...</p>
        </div>
      </div>
    );
  }

  // Debug: Log current STT balance
  console.log('💰 Current STT balance:', balance ? formatEther(balance) : 'undefined');

  // Show success message if balance >= 0.5
  const balanceNum = balance ? Number(formatEther(balance)) : 0;
  if (balance && balanceNum >= 0.5) {
    return (
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-green-600">
          ✅ You have {formatEther(balance)} STT tokens ready to play!
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Raw balance: {balance?.toString()}
        </p>
      </div>
    );
  }
  
  // Show info if balance is between 0 and 0.5
  if (balance && balanceNum > 0 && balanceNum < 0.5) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-yellow-600">
          ⚠️ You have {formatEther(balance)} STT tokens (less than 0.5). You can request more tokens!
        </p>
      </div>
    );
  }

  return null;
}
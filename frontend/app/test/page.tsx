"use client";

import { useAccount, useBalance, useWriteContract, useChainId, useSwitchChain } from 'wagmi';
import { TYPING_GAME_ABI, TYPING_GAME_ADDRESS } from '@/config/contracts';
import { formatEther } from 'viem';
import { useState } from 'react';

export default function TestPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();
  const { writeContract, error, isPending, data: txHash } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const [testError, setTestError] = useState<string | null>(null);
  
  const switchToSomnia = async () => {
    try {
      await switchChain({ chainId: 50312 });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setTestError(`Failed to switch network: ${message}`);
    }
  };

  const testEnter = async () => {
    if (!address) return;
    
    setTestError(null);
    console.log('🧪 Testing enter function...');
    console.log('📍 Address:', address);
    console.log('💰 Balance:', balance ? formatEther(balance.value) : '0');
    console.log('🎯 Contract:', TYPING_GAME_ADDRESS);
    console.log('🔗 Chain ID:', chainId);

    try {
      const result = await writeContract({
        address: TYPING_GAME_ADDRESS,
        abi: TYPING_GAME_ABI,
        functionName: 'enter',
      });
      console.log('✅ Transaction initiated:', result);
    } catch (err: unknown) {
      console.error('❌ Enter failed:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setTestError(message);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Contract Test Page</h1>
        
        <div className="glass rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Wallet Info</h2>
          <div className="space-y-2 text-gray-300">
            <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
            <p><strong>Address:</strong> {address || 'Not connected'}</p>
            <p><strong>Balance:</strong> {balance ? `${formatEther(balance.value)} STT` : '0 STT'}</p>
            <p><strong>Chain ID:</strong> {chainId}</p>
            <p><strong>Expected Chain:</strong> 50312 (Somnia)</p>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Contract Test</h2>
          
          <div className="flex gap-3">
            {chainId !== 50312 && (
              <button
                onClick={switchToSomnia}
                className="px-4 py-2 glass rounded-lg text-gray-200 border border-yellow-400/50 hover:border-yellow-400 transition-all"
              >
                Switch to Somnia
              </button>
            )}
            
            <button
              onClick={testEnter}
              disabled={!isConnected || isPending || chainId !== 50312}
              className="px-6 py-3 glass rounded-lg text-gray-200 border border-purple-400/50 hover:border-purple-400 transition-all disabled:opacity-50"
            >
              {isPending ? 'Testing...' : chainId !== 50312 ? 'Wrong Network' : 'Test Enter Function'}
            </button>
          </div>

          {(error || testError) && (
            <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
              <p className="text-red-300 text-sm font-medium">Error:</p>
              <pre className="text-red-200 text-xs mt-2 overflow-auto">
                {error?.message || testError}
              </pre>
            </div>
          )}

          {txHash && (
            <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-500/30">
              <p className="text-green-300 text-sm">✅ Transaction sent!</p>
              <p className="text-green-200 text-xs mt-1 font-mono">{txHash}</p>
            </div>
          )}
        </div>

        <div className="glass rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          <div className="text-gray-300 text-sm space-y-2">
            <p>1. Make sure your wallet is connected</p>
            <p>2. Ensure you have some STT for gas</p>
            <p>3. Click &quot;Test Enter Function&quot;</p>
            <p>4. Check browser console for detailed logs</p>
            <p>5. If you get &quot;Already entered&quot; - that&apos;s normal, means it worked before</p>
          </div>
        </div>
      </div>
    </div>
  );
}
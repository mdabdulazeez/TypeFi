"use client";

import { useTypingGame } from '@/hooks/useTypingGame';
import { usePlayerNames } from '@/hooks/usePlayerNames';
import { formatDistanceToNow } from 'date-fns';

export function Leaderboard() {
  const { scores } = useTypingGame();
  const { getPlayerName } = usePlayerNames();

  if (!scores || scores.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-gray-800/50">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Leaderboard
        </h2>
        <div className="text-center py-8">
          <div className="glass rounded-xl p-6 inline-block border border-gray-700/50">
            <p className="text-gray-400">No scores yet. Be the first to play!</p>
          </div>
        </div>
      </div>
    );
  }

  // Sort scores by WPM and accuracy
  const sortedScores = [...scores].sort((a, b) => {
    const wpmDiff = Number(b.wpm) - Number(a.wpm);
    if (wpmDiff !== 0) return wpmDiff;
    return Number(b.accuracy) - Number(a.accuracy);
  });

  return (
    <div className="glass rounded-2xl p-8 border border-gray-800/50">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        Leaderboard
      </h2>
      <div className="space-y-3">
        {sortedScores.slice(0, 5).map((score, index) => {
          const rankColors = {
            0: 'from-yellow-400 to-orange-400', // Gold
            1: 'from-gray-300 to-gray-500',     // Silver
            2: 'from-amber-600 to-amber-800',   // Bronze
          };
          const isTopThree = index < 3;
          
          return (
            <div
              key={`${score.player}-${score.timestamp}`}
              className={`glass rounded-xl p-4 border transition-all hover:border-gray-600/50 ${
                isTopThree 
                  ? 'border-gray-700/50' 
                  : 'border-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isTopThree 
                      ? `bg-gradient-to-r ${rankColors[index]} text-white` 
                      : 'glass text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-200">
                      {getPlayerName(score.player)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(Number(score.timestamp) * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg text-pink-300 font-bold">
                    {Number(score.wpm)} WPM
                  </div>
                  <div className="text-sm text-gray-400">
                    {Number(score.accuracy)}% accuracy
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
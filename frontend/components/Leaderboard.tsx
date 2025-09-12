"use client";

import { useTypingGame } from '@/hooks/useTypingGame';
import { formatDistanceToNow } from 'date-fns';

export function Leaderboard() {
  const { scores } = useTypingGame();

  if (!scores || scores.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <p className="text-gray-500">No scores yet. Be the first to play!</p>
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
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <div className="space-y-4">
        {sortedScores.slice(0, 5).map((score, index) => (
          <div
            key={`${score.player}-${score.timestamp}`}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-lg">{index + 1}.</span>
              <div>
                <div className="font-mono text-sm">{`${score.player.slice(0, 6)}...${score.player.slice(-4)}`}</div>
                <div className="text-sm text-gray-600">
                  {new Date(Number(score.timestamp) * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg">{Number(score.wpm)} WPM</div>
              <div className="text-sm text-gray-600">{Number(score.accuracy)}% accuracy</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
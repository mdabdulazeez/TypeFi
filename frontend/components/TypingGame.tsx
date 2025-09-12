"use client";

import { useCallback, useEffect, useState } from 'react';
import { GameState, GameStats } from '@/types/game';
import { useTypingGame } from '@/hooks/useTypingGame';
import { generate } from 'random-words';
import { InstructionsModal } from './InstructionsModal';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const GAME_DURATION = 60; // 60 seconds

export function TypingGame() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    text: '',
    input: '',
    startTime: null,
    endTime: null,
    stats: {
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      timeElapsed: 0,
    },
  });

  const { enterGame, submitScore } = useTypingGame();

  const generateText = useCallback(() => {
    const words = generate({ exactly: 50, join: ' ' });
    return words;
  }, []);

  const startGame = useCallback(async () => {
    try {
      await enterGame();
      setGameState({
        ...gameState,
        status: 'playing',
        text: generateText(),
        input: '',
        startTime: Date.now(),
        endTime: null,
        stats: {
          wpm: 0,
          accuracy: 0,
          correctChars: 0,
          incorrectChars: 0,
          totalChars: 0,
          timeElapsed: 0,
        },
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }, [enterGame, gameState, generateText]);

  const calculateStats = useCallback((): GameStats => {
    const { text, input, startTime } = gameState;
    if (!startTime) return gameState.stats;

    const timeElapsed = (Date.now() - startTime) / 1000;
    const words = input.trim().split(' ').length;
    const wpm = Math.round((words / timeElapsed) * 60);

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const totalChars = correctChars + incorrectChars;
    const accuracy = totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);

    return {
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      timeElapsed,
    };
  }, [gameState]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (gameState.status !== 'playing') return;

    const newInput = e.target.value;
    const newStats = calculateStats();

    setGameState(prev => ({
      ...prev,
      input: newInput,
      stats: newStats,
    }));

    // Check if game should end
    if (newInput === gameState.text || newStats.timeElapsed >= GAME_DURATION) {
      const endTime = Date.now();
      setGameState(prev => ({ ...prev, status: 'finished', endTime }));
      submitScore(newStats.wpm, newStats.accuracy);
    }
  }, [gameState, calculateStats, submitScore]);

  useEffect(() => {
    if (gameState.status === 'playing') {
      const timer = setInterval(() => {
        const newStats = calculateStats();
        setGameState(prev => ({ ...prev, stats: newStats }));

        if (newStats.timeElapsed >= GAME_DURATION) {
          setGameState(prev => ({ ...prev, status: 'finished', endTime: Date.now() }));
          submitScore(newStats.wpm, newStats.accuracy);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.status, calculateStats, submitScore]);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">TypeFi</h1>
            <button
              onClick={() => setShowInstructions(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
          </div>
          {gameState.status === 'playing' && (
            <div className="stats grid grid-cols-2 gap-4">
              <div className="stat">
                <div className="text-sm text-gray-600">WPM</div>
                <div className="text-2xl font-mono">{gameState.stats.wpm}</div>
              </div>
              <div className="stat">
                <div className="text-sm text-gray-600">Accuracy</div>
                <div className="text-2xl font-mono">{gameState.stats.accuracy}%</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          {gameState.status === 'waiting' ? (
            <button
              onClick={startGame}
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Staking Tokens...' : 'Start Game'}
            </button>
          ) : (
            <div className="space-y-4">
              <p className="font-mono text-lg leading-relaxed">
                {gameState.text}
              </p>
              <textarea
                value={gameState.input}
                onChange={handleInput}
                disabled={gameState.status === 'finished'}
                className="w-full h-32 p-4 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start typing..."
              />
            </div>
          )}
        </div>

        {gameState.status === 'finished' && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Game Over!</h2>
            <p>Final WPM: {gameState.stats.wpm}</p>
            <p>Accuracy: {gameState.stats.accuracy}%</p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export interface PlayerScore {
  player: `0x${string}`;
  wpm: bigint;
  accuracy: bigint;
  timestamp: bigint;
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
}

export interface GameState {
  status: 'waiting' | 'playing' | 'finished';
  text: string;
  input: string;
  startTime: number | null;
  endTime: number | null;
  stats: GameStats;
}
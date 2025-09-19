"use client";

import { useState, useEffect } from 'react';

type PlayerName = {
  name: string;
  address: string;
};

export function usePlayerNames() {
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});

  // We'll keep the names in localStorage to persist them
  useEffect(() => {
    const storedNames = localStorage.getItem('playerNames');
    if (storedNames) {
      setPlayerNames(JSON.parse(storedNames));
    }
  }, []);

  const setPlayerName = (address: string, name: string) => {
    const newPlayerNames = { ...playerNames, [address.toLowerCase()]: name };
    setPlayerNames(newPlayerNames);
    localStorage.setItem('playerNames', JSON.stringify(newPlayerNames));
  };

  const getPlayerName = (address: string): string => {
    const storedName = playerNames[address.toLowerCase()];
    if (storedName) return storedName;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isNameTaken = (name: string): boolean => {
    return Object.values(playerNames).some(
      existingName => existingName.toLowerCase() === name.toLowerCase()
    );
  };

  return {
    playerNames,
    setPlayerName,
    getPlayerName,
    isNameTaken
  };
}
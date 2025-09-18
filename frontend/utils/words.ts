const wordLists = [
  // Basic words
  ["the", "and", "but", "for", "not", "all", "any", "out", "now", "who", "with", "can", "has", "was", "are"],
  // Action words
  ["type", "code", "read", "work", "play", "make", "take", "find", "give", "know", "want", "help", "show", "see", "try"],
  // Tech words
  ["code", "type", "data", "file", "test", "user", "web", "app", "site", "game", "text", "page", "task", "tool"],
  // Medium words
  ["place", "world", "water", "write", "build", "learn", "about", "think", "great", "other", "first", "after", "right"],
  // Long words
  ["program", "computer", "software", "practice", "learning", "building", "creating", "amazing", "document", "generate"]
];

export const generateText = () => {
  // Select words from each category
  const selectedWords = wordLists.flatMap(list => {
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2); // Get 2 words from each category
  });

  // Shuffle all selected words together and join with spaces
  return selectedWords
    .sort(() => Math.random() - 0.5)
    .join(" ");
};

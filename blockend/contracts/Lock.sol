// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TypingGame {
    address public owner;

    struct PlayerScore {
        address player;
        uint256 wpm;
        uint256 accuracy; // Percentage (0-100)
        uint256 timestamp;
    }

    PlayerScore[] public scores; // Array of submitted scores
    mapping(address => bool) public hasEntered; // Track if player has entered

    event Entered(address indexed player, uint256 amount);
    event ScoreSubmitted(address indexed player, uint256 wpm, uint256 accuracy);
    event RewardClaimed(address indexed player, uint256 amount);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        // Token address parameter kept for compatibility but not used
    }

    // Enter the game (no tokens required)
    function enter() external {
        require(!hasEntered[msg.sender], "Already entered");
        hasEntered[msg.sender] = true;
        emit Entered(msg.sender, 0);
    }

    // Submit typing score (frontend calls this after game completion)
    function submitScore(uint256 _wpm, uint256 _accuracy) external {
        require(hasEntered[msg.sender], "Must enter first");
        require(_accuracy <= 100, "Invalid accuracy");
        scores.push(PlayerScore(msg.sender, _wpm, _accuracy, block.timestamp));
        emit ScoreSubmitted(msg.sender, _wpm, _accuracy);
    }

    // Function removed - no token rewards in this version

    // Get all scores (for frontend display)
    function getScores() external view returns (PlayerScore[] memory) {
        return scores;
    }

    // Reset player entry status (for testing purposes)
    function resetPlayer(address _player) external {
        require(msg.sender == owner, "Only owner");
        hasEntered[_player] = false;
    }
}
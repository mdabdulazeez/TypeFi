// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // For handling SOMI or other ERC20 tokens

contract TypingGame {
    address public owner;
    IERC20 public token; // SOMI or your custom token
    uint256 public entryStake = 10 * 10**18; // Example: 10 tokens to enter (adjust decimals)
    uint256 public prizePool;

    struct PlayerScore {
        address player;
        uint256 wpm;
        uint256 accuracy; // Percentage (0-100)
        uint256 timestamp;
    }

    PlayerScore[] public scores; // Array of submitted scores
    mapping(address => bool) public hasEntered; // Track if player has staked

    event Entered(address indexed player, uint256 amount);
    event ScoreSubmitted(address indexed player, uint256 wpm, uint256 accuracy);
    event RewardClaimed(address indexed player, uint256 amount);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = IERC20(_tokenAddress); // Set to SOMI token address on Somnia
<<<<<<< HEAD
=======
    }

    // Stake tokens to enter the game
    function enter() external {
        require(!hasEntered[msg.sender], "Already entered");
        require(token.transferFrom(msg.sender, address(this), entryStake), "Stake failed");
        hasEntered[msg.sender] = true;
        prizePool += entryStake;
        emit Entered(msg.sender, entryStake);
    }

    // Submit typing score (frontend calls this after game completion)
    function submitScore(uint256 _wpm, uint256 _accuracy) external {
        require(hasEntered[msg.sender], "Must enter first");
        require(_accuracy <= 100, "Invalid accuracy");
        scores.push(PlayerScore(msg.sender, _wpm, _accuracy, block.timestamp));
        emit ScoreSubmitted(msg.sender, _wpm, _accuracy);
    }

    // Owner distributes rewards (or automate with a scoring formula)
    function distributeRewards(address _winner, uint256 _amount) external {
        require(msg.sender == owner, "Only owner");
        require(prizePool >= _amount, "Insufficient pool");
        prizePool -= _amount;
        token.transfer(_winner, _amount);
        emit RewardClaimed(_winner, _amount);
    }

    // Get all scores (for frontend display)
    function getScores() external view returns (PlayerScore[] memory) {
        return scores;
    }

    // Owner can adjust stake amount
    function setEntryStake(uint256 _newStake) external {
        require(msg.sender == owner, "Only owner");
        entryStake = _newStake;
>>>>>>> 04da8c6f7c4914f98eb49dc3539c0e07ce1086d7
    }

    // Stake tokens to enter the game
    function enter() external {
        require(!hasEntered[msg.sender], "Already entered");
        require(token.transferFrom(msg.sender, address(this), entryStake), "Stake failed");
        hasEntered[msg.sender] = true;
        prizePool += entryStake;
        emit Entered(msg.sender, entryStake);
    }

    // Submit typing score (frontend calls this after game completion)
    function submitScore(uint256 _wpm, uint256 _accuracy) external {
        require(hasEntered[msg.sender], "Must enter first");
        require(_accuracy <= 100, "Invalid accuracy");
        scores.push(PlayerScore(msg.sender, _wpm, _accuracy, block.timestamp));
        emit ScoreSubmitted(msg.sender, _wpm, _accuracy);
    }

    // Owner distributes rewards (or automate with a scoring formula)
    function distributeRewards(address _winner, uint256 _amount) external {
        require(msg.sender == owner, "Only owner");
        require(prizePool >= _amount, "Insufficient pool");
        prizePool -= _amount;
        token.transfer(_winner, _amount);
        emit RewardClaimed(_winner, _amount);
    }

    // Get all scores (for frontend display)
    function getScores() external view returns (PlayerScore[] memory) {
        return scores;
    }

    // Owner can adjust stake amount
    function setEntryStake(uint256 _newStake) external {
        require(msg.sender == owner, "Only owner");
        entryStake = _newStake;
    }
}
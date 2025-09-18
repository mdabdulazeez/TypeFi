// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TypingGame is Ownable {
    IERC20 public gameToken;
    uint256 public entryFee = 10 * 10**18; // 10 tokens to enter
    uint256 public constant MIN_REWARD = 5 * 10**18; // 5 tokens minimum reward
    uint256 public prizePool;

    struct PlayerScore {
        address player;
        uint256 wpm;
        uint256 accuracy; // Percentage (0-100)
        uint256 timestamp;
    }

    PlayerScore[] public scores;
    mapping(address => bool) public hasEntered;
    mapping(address => uint256) public playerRewards;

    event Entered(address indexed player, uint256 amount);
    event ScoreSubmitted(address indexed player, uint256 wpm, uint256 accuracy);
    event RewardClaimed(address indexed player, uint256 amount);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        gameToken = IERC20(_tokenAddress);
    }

    // Enter the game by staking tokens
    function enter() external {
        require(!hasEntered[msg.sender], "Already entered");
        require(gameToken.transferFrom(msg.sender, address(this), entryFee), "Transfer failed");
        
        hasEntered[msg.sender] = true;
        prizePool += entryFee;
        emit Entered(msg.sender, entryFee);
    }

    // Submit typing score and calculate reward
    function submitScore(uint256 _wpm, uint256 _accuracy) external {
        require(hasEntered[msg.sender], "Must enter first");
        require(_accuracy <= 100, "Invalid accuracy");
        
        scores.push(PlayerScore(msg.sender, _wpm, _accuracy, block.timestamp));
        
        // Calculate reward based on WPM and accuracy
        uint256 reward = calculateReward(_wpm, _accuracy);
        playerRewards[msg.sender] += reward;
        prizePool -= reward;
        
        emit ScoreSubmitted(msg.sender, _wpm, _accuracy);
    }

    // Calculate reward based on performance
    function calculateReward(uint256 _wpm, uint256 _accuracy) public pure returns (uint256) {
        if (_wpm < 30 || _accuracy < 70) return 0;
        
        // Base reward is MIN_REWARD
        uint256 reward = MIN_REWARD;
        
        // Bonus for high WPM (up to 2x)
        if (_wpm >= 60) reward *= 2;
        else if (_wpm >= 45) reward = reward * 3 / 2;
        
        // Bonus for high accuracy (up to 2x)
        if (_accuracy >= 95) reward *= 2;
        else if (_accuracy >= 85) reward = reward * 3 / 2;
        
        return reward;
    }

    // Claim accumulated rewards
    function claimRewards() external {
        uint256 reward = playerRewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        
        playerRewards[msg.sender] = 0;
        require(gameToken.transfer(msg.sender, reward), "Transfer failed");
        
        emit RewardClaimed(msg.sender, reward);
    }

    // Get all scores for leaderboard
    function getScores() external view returns (PlayerScore[] memory) {
        return scores;
    }

    // Admin functions
    function setEntryFee(uint256 _newFee) external onlyOwner {
        entryFee = _newFee;
    }

    function withdrawExcessTokens(uint256 _amount) external onlyOwner {
        require(_amount <= gameToken.balanceOf(address(this)) - prizePool, "Cannot withdraw from prize pool");
        require(gameToken.transfer(owner(), _amount), "Transfer failed");
    }

    // Reset player for testing
    function resetPlayer(address _player) external onlyOwner {
        hasEntered[_player] = false;
    }
}
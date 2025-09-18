// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18; // 100 tokens per mint
    uint256 public constant MINT_COOLDOWN = 1 hours;
    mapping(address => uint256) public lastMintTime;

    constructor() ERC20("TypeFi Game Token", "TFT") Ownable(msg.sender) {
        // Mint initial supply to the deployer for game rewards
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }

    // Faucet function with rate limiting
    function faucet() external {
        require(
            block.timestamp >= lastMintTime[msg.sender] + MINT_COOLDOWN,
            "Please wait for cooldown period"
        );
        
        lastMintTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    // Admin function to mint tokens for game rewards
    function mintGameRewards(uint256 amount) external onlyOwner {
        _mint(msg.sender, amount);
    }

    // Allow users to check their cooldown status
    function canMint(address user) external view returns (bool, uint256) {
        uint256 nextMintTime = lastMintTime[user] + MINT_COOLDOWN;
        if (block.timestamp >= nextMintTime) {
            return (true, 0);
        }
        return (false, nextMintTime - block.timestamp);
    }
}
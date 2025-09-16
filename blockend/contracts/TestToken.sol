// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    constructor() ERC20("Test Token", "TEST") Ownable(msg.sender) {
        // Mint 1 million tokens to the deployer
        _mint(msg.sender, 1000000 * 10**18);
    }

    // Allow anyone to mint tokens for testing
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // Faucet function - allows users to get free tokens
    function faucet(uint256 amount) public {
        require(amount <= 1000 * 10**18, "Cannot mint more than 1000 tokens at once");
        _mint(msg.sender, amount);
    }
}
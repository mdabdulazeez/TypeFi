# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

TypeFi is a blockchain-based typing game built on the Somnia Testnet. Players stake tokens to enter the game, compete in 60-second typing challenges, and earn rewards based on their Words Per Minute (WPM) and accuracy. The project consists of two main components:

- **Frontend**: Next.js application with TypeScript, Tailwind CSS, and Web3 integration via Wagmi/RainbowKit
- **Blockend**: Hardhat-based smart contract development environment with Solidity contracts

## Architecture

### Frontend (`/frontend`)
- **Framework**: Next.js 15 with App Router architecture
- **Entry Point**: `app/page.tsx` renders the main `GameContainer` component
- **Web3 Integration**: Uses Wagmi + RainbowKit for wallet connections and contract interactions
- **Game Logic**: Core typing game mechanics in `hooks/useTypingGame.ts` and `components/TypingGame.tsx`
- **Key Components**:
  - `GameContainer.tsx`: Main wrapper handling wallet connection state
  - `TypingGame.tsx`: Core game mechanics, timer, and scoring logic
  - `Leaderboard.tsx`: Displays player scores from blockchain
  - `Providers.tsx`: Web3 and React Query providers setup
- **Configuration**:
  - `config/rainbow.ts`: Wallet and chain configuration (Somnia Testnet)
  - `config/contracts.ts`: Smart contract ABI and address definitions
  - `types/game.ts`: TypeScript interfaces for game state and player scores

### Blockend (`/blockend`)
- **Framework**: Hardhat for smart contract development
- **Main Contract**: `contracts/Lock.sol` - TypingGame contract with staking mechanism
- **Contract Features**:
  - Entry staking (players stake tokens to participate)
  - Score submission and tracking
  - Prize pool management
  - Owner-controlled reward distribution
- **Deployment**: Uses Hardhat Ignition modules (`ignition/modules/Lock.js`)
- **Testing**: Comprehensive test suite in `test/Lock.js`

### Game Flow Architecture
1. Player connects wallet via RainbowKit
2. Player stakes tokens by calling `enter()` on smart contract
3. Frontend generates random words for typing challenge
4. Game runs for 60 seconds, tracking WPM and accuracy in real-time
5. Upon completion, frontend submits score to blockchain via `submitScore()`
6. Scores are displayed on leaderboard from blockchain data
7. Owner can distribute rewards from prize pool to winners

## Development Commands

### Frontend Development
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start development server (with Turbopack)
npm run build                  # Build for production (with Turbopack)
npm start                      # Start production server
npm run lint                   # Run ESLint
```

### Smart Contract Development
```bash
cd blockend
npm install                    # Install dependencies
npx hardhat help              # Show available Hardhat commands
npx hardhat compile            # Compile smart contracts
npx hardhat test              # Run test suite
npx hardhat node              # Start local Hardhat network
npx hardhat ignition deploy ./ignition/modules/Lock.js  # Deploy contracts
REPORT_GAS=true npx hardhat test  # Run tests with gas reporting
```

### Testing
```bash
# Run smart contract tests
cd blockend && npx hardhat test

# Run single test file
cd blockend && npx hardhat test test/Lock.js

# Run tests with gas reporting
cd blockend && REPORT_GAS=true npx hardhat test
```

## Key Configuration Notes

### Contract Integration
- Contract address must be set in `frontend/config/contracts.ts` after deployment
- The contract ABI is already configured and matches the TypingGame contract
- Frontend expects the contract to be deployed on Somnia Testnet (Chain ID: 50312)

### Web3 Configuration
- Wallet integration configured for Somnia Testnet in `frontend/config/rainbow.ts`
- Project ID for WalletConnect needs to be updated in rainbow config
- Game requires users to stake tokens before playing (configurable in smart contract)

### Game Configuration
- Game duration: 60 seconds (configurable in `TypingGame.tsx`)
- Word generation: Uses 'random-words' package for consistent 50-word challenges
- Scoring: Real-time WPM and accuracy calculation
- Entry stake: 10 tokens (configurable in smart contract)

## Important Development Notes

### Smart Contract Issues
- The `Lock.sol` file contains merge conflict markers that need to be resolved
- Contract has duplicate function definitions that must be cleaned up before deployment
- Owner-only functions require proper access control validation

### Frontend Dependencies
- Uses latest React 19 and Next.js 15 (cutting edge versions)
- RainbowKit and Wagmi for Web3 integration
- Tailwind CSS 4.0 for styling
- HeadlessUI for modal components

### Blockchain Specifics
- Designed for Somnia Testnet (EVM-compatible)
- Uses ERC20 token standard for staking mechanism
- Supports custom token deployment or existing STT tokens
- Prize pool accumulates from entry stakes, distributed by contract owner
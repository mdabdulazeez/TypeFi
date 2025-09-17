# 🎯 TypeFi - Gamified Typing Competition on Somnia

> **A fully decentralized, real-time typing competition game built on Somnia Testnet**

[![Somnia Testnet](https://img.shields.io/badge/Deployed%20on-Somnia%20Testnet-blue)](https://somnia.network)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Overview

TypeFi revolutionizes competitive typing by bringing speed typing competitions fully on-chain. Built for Somnia's high-performance infrastructure, TypeFi enables real-time competitive typing with sub-second transaction finality, making it the first truly responsive on-chain typing game.

### 🎮 What makes TypeFi special?

- **Fully On-Chain**: All game logic, scores, and competitions run entirely on Somnia blockchain
- **Real-Time Competition**: Leverages Somnia's 1M+ TPS for instant game interactions
- **Zero Entry Barriers**: No token staking required - just connect and play
- **Live Leaderboards**: Real-time scoring with transparent, immutable results
- **Web3 Native**: Complete wallet integration with Somnia Testnet

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   Next.js App   │    │  Smart Contract │    │  Somnia Testnet  │
│                 │    │                 │    │                  │
│ • React UI      │◄──►│ • TypingGame    │◄──►│ • 1M+ TPS        │
│ • Wallet Connect│    │ • Score Storage │    │ • Sub-sec finale │
│ • Real-time UI  │    │ • Leaderboard   │    │ • Low Gas Fees   │
└─────────────────┘    └─────────────────┘    └──────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   STT Faucet    │
                    │                 │
                    │ • Free testnet  │
                    │   tokens        │
                    │ • Gas fees      │
                    └─────────────────┘
```

## 🚀 Features

### Core Gameplay
- **60-Second Challenges**: Timed typing tests with random word generation
- **Real-Time Metrics**: Live WPM and accuracy tracking
- **Instant Results**: Immediate score submission to blockchain
- **Global Leaderboard**: Compare scores with players worldwide

### Blockchain Integration
- **Gas-Efficient**: Optimized smart contracts for Somnia's efficiency
- **Transparent Scoring**: All scores permanently recorded on-chain  
- **Fraud-Proof**: Immutable game results and leaderboard
- **Zero Downtime**: Leverages Somnia's high availability

### User Experience
- **One-Click Start**: Connect wallet and start playing immediately
- **Mobile Responsive**: Works on all devices and screen sizes
- **Smooth Animations**: Polished UI with glass-morphism design
- **Built-in Faucet**: Get testnet tokens without leaving the app

## 🛠️ Technical Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Wagmi v2** - Ethereum React hooks
- **Viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI

### Smart Contracts
- **Solidity 0.8.28** - Smart contract language
- **Hardhat** - Development and deployment framework
- **OpenZeppelin** - Security-audited contract libraries

### Blockchain
- **Somnia Testnet** - High-performance EVM-compatible L1
- **Chain ID**: 50312
- **RPC**: https://dream-rpc.somnia.network/

## 📋 Contract Addresses

### Somnia Testnet Deployments

| Contract | Address | Purpose |
|----------|---------|---------|
| **TypingGame** | [`0x6C00b6b037c988A93132C1106bDaa3B663A8F536`](https://dreamscout.somnia.network/address/0x6C00b6b037c988A93132C1106bDaa3B663A8F536) | Main game logic and scoring |
| **TestToken** | [`0x84FEA364EE5c4cc4dF14BD2AcD439251c0c4eaEa`](https://dreamscout.somnia.network/address/0x84FEA364EE5c4cc4dF14BD2AcD439251c0c4eaEa) | Test token for development |

### Key Functions

#### TypingGame Contract
- `enter()` - Join the typing competition (no fees required)
- `submitScore(uint256 wpm, uint256 accuracy)` - Submit typing results
- `getScores()` - Retrieve global leaderboard
- `resetPlayer(address player)` - Reset player status (owner only)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Ethereum wallet (MetaMask recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/typefi.git
cd typefi
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install blockchain dependencies  
cd ../blockend
npm install
```

### 3. Environment Setup

Create `.env` files:

**frontend/.env.local**
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SOMNIA_RPC=https://dream-rpc.somnia.network/
# CRITICAL: Add your faucet private key (testnet only!)
FAUCET_PRIVATE_KEY=your_private_key_without_0x_prefix
```

⚠️ **SECURITY WARNING**: Never commit private keys to version control! Use only testnet keys with limited funds.

**blockend/.env**
```env
MNEMONIC="your twelve word mnemonic phrase here"
PRIVATE_KEY=your_private_key_here
```

### 4. Add Somnia Testnet to Wallet

**Network Configuration:**
- Network Name: `Somnia Testnet`
- RPC URL: `https://dream-rpc.somnia.network/`
- Chain ID: `50312`
- Currency Symbol: `STT`
- Block Explorer: `https://dreamscout.somnia.network/`

### 5. Get Test Tokens

Use the built-in faucet at `http://localhost:3000` or request STT tokens from Somnia faucet.

### 6. Run the Application
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to start playing!

## 🎮 How to Play

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Get Test Tokens**: Use the faucet to get STT for gas fees
3. **Start Game**: Click "Start Typing Challenge" to begin
4. **Type Fast**: Type the displayed text as quickly and accurately as possible
5. **Submit Score**: Your score automatically submits to the blockchain
6. **Check Leaderboard**: View your ranking among all players

## 🧪 Development

### Running Tests
```bash
cd blockend
npx hardhat test
```

### Deploying Contracts
```bash
cd blockend
npx hardhat ignition deploy ./ignition/modules/TypingGameDeploy.js --network somniaTestnet
```

### Code Structure

```
typefi/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── config/             # Contract addresses and ABIs
│   └── types/              # TypeScript definitions
├── blockend/               # Blockchain development
│   ├── contracts/          # Solidity smart contracts
│   ├── ignition/          # Deployment scripts
│   └── test/              # Contract tests
└── docs/                  # Documentation and diagrams
```

## 🏆 Hackathon Criteria Fulfillment

### ✅ Creativity & Originality
- **First of its kind**: Real-time typing competition fully on-chain
- **Innovative UX**: Seamless Web2-like experience with Web3 benefits
- **Gamification**: Competitive elements with transparent leaderboards

### ✅ Technical Excellence  
- **Fully deployed on Somnia**: Contracts verified on Somnia Testnet
- **Optimized for performance**: Leverages Somnia's high TPS
- **Production ready**: Comprehensive error handling and edge cases

### ✅ User Experience
- **Intuitive interface**: Clean, modern UI with smooth animations
- **Mobile responsive**: Works perfectly on all devices
- **One-click onboarding**: Built-in faucet eliminates friction

### ✅ On-chain Impact
- **100% on-chain**: All game logic and scores stored on blockchain
- **Immutable records**: Transparent, tamper-proof competition results
- **Real-time updates**: Leverages Somnia's sub-second finality

### ✅ Community Fit
- **Accessible**: No technical knowledge required to play
- **Competitive**: Global leaderboard drives engagement
- **Extensible**: Framework for other skill-based competitions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Somnia Network** for providing high-performance blockchain infrastructure
- **OpenZeppelin** for security-audited smart contracts
- **RainbowKit & Wagmi** for excellent Web3 developer experience
- **Hardhat** for robust smart contract development tools

---

**Built with ❤️ for the Somnia DeFi Mini Hackathon**

*Experience the future of on-chain gaming where every keystroke matters and every competition is permanently recorded on the blockchain.*

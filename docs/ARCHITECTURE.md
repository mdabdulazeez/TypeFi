# 🏗️ TypeFi Architecture

## System Overview

TypeFi is a fully decentralized typing competition platform built on Somnia's high-performance blockchain infrastructure.

## Architecture Diagram

```
                                TypeFi Architecture
                                ==================

┌───────────────────────────────────────────────────────────────────────────────┐
│                                FRONTEND LAYER                                 │
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   Next.js App   │    │ React Components│    │   TypeScript    │            │
│  │                 │    │                 │    │                 │            │
│  │ • App Router    │    │ • TypingGame    │    │ • Type Safety   │            │
│  │ • SSR/CSR       │    │ • Leaderboard   │    │ • Interfaces    │            │
│  │ • API Routes    │    │ • Faucet        │    │ • Validation    │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                     │                                         │
└─────────────────────────────────────┼─────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                              WEB3 INTEGRATION                                 │
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │   RainbowKit    │    │      Wagmi      │    │      Viem       │            │
│  │                 │    │                 │    │                 │            │
│  │ • Wallet UI     │    │ • React Hooks   │    │ • Ethereum Lib  │            │
│  │ • Connection    │    │ • Contract Calls│    │ • Transactions  │            │
│  │ • Network Mgmt  │    │ • State Mgmt    │    │ • Type Safety   │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                     │                                         │
└─────────────────────────────────────┼─────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                              SOMNIA TESTNET                                   │
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │ Network Layer   │    │  Consensus      │    │   Performance   │            │
│  │                 │    │                 │    │                 │            │
│  │ • Chain ID:50312│    │ • Sub-secFinal  │    │ • 1M+ TPS       │            │
│  │ • RPC Endpoint  │    │ • HighThroughput│    │ • Low Gas Fees  │            │
│  │ • Block Explorer│    │ • EVM Compatible│    │ • Real-time     │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
│                                     │                                         │
└─────────────────────────────────────┼─────────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                             SMART CONTRACTS                                    │
│                                                                                │
│  ┌─────────────────┐                      ┌─────────────────┐                  │
│  │  TypingGame     │                      │   TestToken     │                  │
│  │  Contract       │                      │   Contract      │                  │
│  │                 │                      │                 │                  │
│  │ Address:        │                      │ Address:        │                  │
│  │ 0x6C00b6b0...   │                      │ 0x84FEA364...   │                  │
│  │                 │                      │                 │                  │
│  │ Functions:      │                      │ Functions:      │                  │
│  │ • enter()       │                      │ • faucet()      │                  │
│  │ • submitScore() │                      │ • mint()        │                  │
│  │ • getScores()   │                      │ • balanceOf()   │                  │
│  │ • resetPlayer() │                      │ • approve()     │                  │
│  └─────────────────┘                      └─────────────────┘                  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

## Component Interactions

### 1. User Flow
```
User Opens App → Connect Wallet → Get STT Tokens → Enter Game → 
Type Challenge → Submit Score → View Leaderboard
```

### 2. Data Flow
```
Frontend UI ↔ Wagmi Hooks ↔ Somnia RPC ↔ Smart Contracts ↔ Blockchain State
```

### 3. Transaction Flow
```
User Action → Transaction Creation → Wallet Signing → 
Somnia Network → Contract Execution → State Update → UI Refresh
```

## Key Components

### Frontend (Next.js)
- **TypingGame Component**: Main game interface with typing challenge
- **Leaderboard Component**: Display global scores from blockchain
- **Faucet Component**: STT token distribution for gas fees
- **Wallet Connection**: RainbowKit integration for seamless connection

### Web3 Integration
- **Wagmi Hooks**: `useWriteContract`, `useReadContract`, `useAccount`
- **Contract Interactions**: Type-safe contract calls with proper error handling
- **Network Management**: Automatic Somnia Testnet configuration

### Smart Contracts
- **TypingGame**: Core game logic, no token staking required
- **TestToken**: Development utility for testing (not used in main game)

### STT Faucet API
- **Endpoint**: `/api/faucet`
- **Purpose**: Provide free STT tokens for gas fees
- **Rate Limiting**: Balance-based checks to prevent abuse

## Security Architecture

### Contract Security
```
┌───────────────────┐
│ Input Validation  │ → Prevents invalid score submissions
└───────────────────┘

┌───────────────────┐
│ Access Control    │ → Owner-only functions for admin operations
└───────────────────┘

┌───────────────────┐
│ Simple Logic      │ → Minimal attack surface, no external calls
└───────────────────┘
```

### Frontend Security
```
┌───────────────────┐
│ Type Safety       │ → TypeScript prevents common errors
└───────────────────┘

┌───────────────────┐
│ Input Sanitization│ → Validate all user inputs
└───────────────────┘

┌───────────────────┐
│ Error Handling    │ → Graceful failure modes
└───────────────────┘
```

## Performance Optimizations

### Somnia Integration
- **High TPS**: Leverages 1M+ transactions per second capability
- **Sub-second Finality**: Enables real-time gaming experience
- **Low Gas Costs**: Makes frequent transactions economically viable

### Frontend Optimizations
- **React Optimization**: `useCallback`, `useMemo` for performance
- **Efficient Re-renders**: Minimal state updates during typing
- **Progressive Loading**: Smart component loading strategies

### Contract Optimizations
- **Gas Efficiency**: Optimized data structures and minimal storage
- **Batch Operations**: Where possible, combine related operations
- **Simple Logic**: Straightforward implementations reduce gas costs

## Scalability Considerations

### Current Architecture
- Supports unlimited concurrent players
- Global leaderboard with all historical scores
- Real-time score submission and retrieval

### Future Scaling
- **Tournament System**: Bracket-based competitions
- **Multi-Game Support**: Expand to other skill-based games  
- **Advanced Analytics**: Player statistics and performance tracking
- **Social Features**: Friend competitions and team challenges

## Deployment Architecture

### Development Environment
```
Local Development → Somnia Testnet → Contract Deployment → 
Frontend Deployment → Integration Testing
```

### Production Considerations
- **Frontend Hosting**: Vercel/Netlify for global CDN
- **Contract Verification**: Source code verification on block explorer
- **Monitoring**: Transaction success rates and performance metrics
- **Backup Systems**: Multiple RPC endpoints for reliability

## API Endpoints

### Frontend API Routes
```
/api/faucet          → POST: Distribute STT tokens
/api/health          → GET:  Health check (future)
/api/stats           → GET:  Game statistics (future)
```

### External APIs
```
Somnia RPC           → Blockchain interaction
Block Explorer API   → Transaction verification
WalletConnect        → Wallet connection protocol
```

---

This architecture enables TypeFi to deliver a seamless, real-time, fully decentralized typing competition experience by leveraging Somnia's high-performance blockchain infrastructure while maintaining security and user experience standards.
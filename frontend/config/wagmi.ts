import { http } from 'wagmi'
import { somniaTestnet } from './chains'
import { createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'

// Initialize wagmi config
export const config = createConfig({
  chains: [somniaTestnet],
  connectors: [
    injected()
  ],
  transports: {
    [somniaTestnet.id]: http('https://dream-rpc.somnia.network/')
  }
})
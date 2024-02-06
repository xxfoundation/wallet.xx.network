import { configureChains, mainnet } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { createConfig } from 'wagmi'

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet],
    [publicProvider()]
  )

export const config = createConfig({
    autoConnect: true,
    connectors: [
        new InjectedConnector({
            chains,
            options: {
              name: 'Injected',
              shimDisconnect: true
            }
        })
    ],
    publicClient,
    webSocketPublicClient
})
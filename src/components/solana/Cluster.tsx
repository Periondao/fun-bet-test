import { createContext, useContext } from 'react'
import { clusterApiUrl } from '@solana/web3.js'

import { WithChildren } from '@/lib/types'

export interface ClusterProviderProps {
  endpoint: string
  network?: ClusterNetwork
}

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  Custom = 'custom',
}

export interface ClusterProviderContext {
  cluster: ClusterProviderProps
}

const Context = createContext<ClusterProviderContext>(
  {} as ClusterProviderContext
)

export function ClusterProvider({ children }: WithChildren) {
  const value: ClusterProviderContext = {
    cluster: { endpoint: clusterApiUrl('mainnet-beta') },
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCluster() {
  return useContext(Context)
}

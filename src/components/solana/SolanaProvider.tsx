import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { WalletError } from '@solana/wallet-adapter-base'
import { useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'

import { WithChildren } from '@/lib/types'
import { useCluster } from './Cluster'

import '@solana/wallet-adapter-react-ui/styles.css'

export const WalletButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

export function SolanaProvider({ children }: WithChildren) {
  const { cluster } = useCluster()

  const endpoint = useMemo(() => cluster.endpoint, [cluster])

  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

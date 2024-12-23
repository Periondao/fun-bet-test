'use client'

import { SolanaProvider } from "@/components/solana/SolanaProvider"
import { ClusterProvider } from "@/components/solana/Cluster"

import { WithChildren } from "@/lib/types"

const Wrapper = ({ children }: WithChildren) => {
  return (
    <ClusterProvider>
        <SolanaProvider>
            {children}
        </SolanaProvider>
    </ClusterProvider>
  )
}

export default Wrapper

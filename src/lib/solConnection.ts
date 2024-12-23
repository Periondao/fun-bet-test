import { Connection } from "@solana/web3.js"

export const heliusStakedNode = process.env.NEXT_PUBLIC_HELIUS_NODE

if (!heliusStakedNode) alert('HELIUS_NODE env variable not set')

export const stakedConn = new Connection(heliusStakedNode!, 'confirmed')

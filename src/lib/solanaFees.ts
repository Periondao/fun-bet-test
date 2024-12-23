import { heliusStakedNode } from "./solConnection"

interface HeliusResp {
  jsonrpc: string
  id: string
  result: {
    priorityFeeEstimate: number
  }
}

export interface SolFees {
  priorityFeeEstimate: number
}

interface PayloadProps {
  txnBase58?: string
  keys?: string[]
}

const getPayload = (props: PayloadProps) => ({
  method: 'getPriorityFeeEstimate',
  id: '1',
  jsonrpc: '2.0',
  params: [
    {
      transaction: props.txnBase58 || undefined,
      accountKeys: props.keys || undefined,
      options: {
        priorityLevel: 'VeryHigh',
      },
    },
  ],
})

export const getSolPriorityFeePerCU = async (props: PayloadProps) => {
  const { error, data } = await fetch(heliusStakedNode!, {
    body: JSON.stringify(getPayload(props)),
    method: 'POST',
  })
    .then((res) => res.json() as Promise<HeliusResp>)
    .then((data) => ({ data, error: null }))
    .catch((error) => ({ error, data: null }))

  if (error) return { error }

  const priorityFeeEstimate = data?.result?.priorityFeeEstimate

  if (!priorityFeeEstimate && typeof priorityFeeEstimate !== 'number')
    return { error: new Error('No priorityFeeEstimate on Helius API response') }

  return { data: { priorityFeeEstimate } }
}

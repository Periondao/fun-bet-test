/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ComputeBudgetProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'

import { BN, Program } from '@coral-xyz/anchor'

import { stakedConn } from './solConnection'
import { Fanplay } from './FanplayType'

import idl from './fanplaySolIdl.json'

interface PickTxnProps {
  pickSpec: string
  isMagic: boolean
  amount: number
  accounts: any
  solFees?: any
}

export const getPlacePickTxn = async ({
  accounts,
  pickSpec,
  isMagic,
  solFees,
  amount,
}: PickTxnProps) => {
  const program = new Program(idl as Fanplay, { connection: stakedConn })

  const amountBN = new BN(amount)

  const computeUnitsIx = ComputeBudgetProgram.setComputeUnitLimit({
    // Also tried without any limit ix and with 25k
    // but didn't try higher than 75k, haven't seen a txn on-chain that used more than that
    units: 75000,
  })

  const instructions = [computeUnitsIx]

  if (solFees) {
    const computeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: solFees.priorityFeeEstimate,
    })

    instructions.push(computeUnitPriceIx)
  }

  const txnInstruction = await program.methods
    .placePick(pickSpec.toString(), amountBN)
    .accounts(accounts)
    .instruction()

  instructions.push(txnInstruction)

  if (isMagic) {
    // THIS WAS AN ATTEMPT TO BUILD A LIGHTHOUSE ASSERTION
    // const tokenAssertionIx = getAssertTokenAccountInstruction({
    //   targetAccount: accounts.tokenAccount,
    //   logLevel: 0,
    //   assertion: {
    //     __kind: 'Owner',
    //     value: accounts.user,
    //     operator: EquatableOperator.Equal,
    //   },
    // })
    // instructions.push(tokenAssertionIx)
  }

  const { blockhash, lastValidBlockHeight } =
    await stakedConn.getLatestBlockhash('confirmed')

  const messageV0 = new TransactionMessage({
    payerKey: accounts.user,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message()

  const txn = new VersionedTransaction(messageV0)

  return { txn, blockhash, lastValidBlockHeight }
}

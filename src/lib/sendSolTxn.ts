import { SignerWalletAdapterProps } from '@solana/wallet-adapter-base'
import { Transaction, VersionedTransaction } from '@solana/web3.js'

import { stakedConn } from './solConnection'
import { getMagic } from './magic'

export const sendSolTxn = async (
  txn: Transaction | VersionedTransaction,
  signTransaction?: SignerWalletAdapterProps['signTransaction']
) => {
  if (signTransaction) {
    console.log('ext txn', txn)
    const signedTxn = await signTransaction(txn)

    console.log('ext signedTxn', signedTxn)

    const signature = await stakedConn.sendRawTransaction(
      signedTxn.serialize(),
      { skipPreflight: true, preflightCommitment: 'confirmed' }
    )

    return { data: signature }
  } else {
    const { magic, error } = await getMagic()

    if (error) return { error }

    const lin = await magic.user.isLoggedIn()
    console.log('lin', lin)

    console.log('Magic txn before signing', txn)
    const signed = await magic?.solana.signTransaction(txn)

    const versionedTxn = VersionedTransaction.deserialize(signed.rawTransaction)
    console.log('Magic versionedTxn after signing', versionedTxn)

    const signature = await stakedConn.sendRawTransaction(
      signed.rawTransaction,
      { skipPreflight: true, preflightCommitment: 'confirmed' }
    )
    return { data: signature }
  }
}

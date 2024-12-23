/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAccount, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import bs58 from "bs58"

import { getSolPriorityFeePerCU } from "./solanaFees"
import { getPlacePickTxn } from "./getPlacePickTxn"
import { stakedConn } from "./solConnection"
import { sendSolTxn } from "./sendSolTxn"
import { getMagic } from "./magic"

const usdcTokenAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
const LAMPORTS_PER_USDC = 1000000

const poolTokenAccount = 'H4hqHUyvMVP8qxEyeuBUgHP45iFsUKe6Nw1dc7o5zYki'
const poolAccount = '2m2cHYTFBdCW25YqzWpohW5N4UKDspJwXYdJsFxLYc8P'

const useBetButtonLogic = () => {
  const { publicKey, signTransaction } = useWallet()

  const onBetButtonClick = async () => {
    const { error: mErr, magic } = await getMagic()

    if (mErr) return console.log(mErr)

    const isMagicLoggedIn = await magic.user.isLoggedIn()

    if (!isMagicLoggedIn && !publicKey) return alert('Please connect your wallet')

    let userPubKey = publicKey
    
    if (!publicKey) {
      const walletInfo: any = await magic.wallet.getInfo()
      userPubKey = walletInfo.publicAddress
    }
    if (!userPubKey) return alert('no userPubKey')

    const splTokenPubKey = new PublicKey(usdcTokenAddress)
    const userTokenAccount = await getAssociatedTokenAddress(
      splTokenPubKey,
      userPubKey,
    )

    const accountInfo = await getAccount(stakedConn, userTokenAccount)
    if (!accountInfo.isInitialized) return alert('User ATA not initialized')

    const accounts = {
      poolAccount: new PublicKey(poolAccount),
      tokenAccount: new PublicKey(poolTokenAccount),
      userAta: new PublicKey(userTokenAccount),
      user: publicKey,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    }

    const txnPayload = {
      amount: (0.01 * LAMPORTS_PER_USDC),
      solFees: undefined as any,
      isMagic: isMagicLoggedIn,
      pickSpec: '11',
      accounts,
    }

    const { txn: txnSample } = await getPlacePickTxn(txnPayload)

    const { error: feeErr, data: solFees } = await getSolPriorityFeePerCU({
      txnBase58: bs58.encode(txnSample.serialize()),
    })

    if (feeErr) throw feeErr
    if (!solFees) throw new Error('No fees returned')

    txnPayload.solFees = solFees

    const { txn, blockhash, lastValidBlockHeight } = await getPlacePickTxn(
      txnPayload
    )

    const { error, data: signature } = await sendSolTxn(
      txn,
      isMagicLoggedIn ? undefined : signTransaction
    )

    if (error) return { error }

    const strategy = {
      lastValidBlockHeight,
      signature,
      blockhash,
    }

    const confirmation = await stakedConn.confirmTransaction(
      strategy,
      'confirmed'
    )

    if (!confirmation || confirmation.value?.err) {
      const failMsg = 'Failed to confirm transaction on Solana'
      alert(failMsg)
    }

    console.log(confirmation)
  }

  return { onBetButtonClick }
}

export default useBetButtonLogic

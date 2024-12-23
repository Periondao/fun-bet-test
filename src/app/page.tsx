'use client'

import { WalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import Image from "next/image";

import useBetButtonLogic from "@/lib/useBetButtonLogic"

import styles from "./page.module.css";
import { getMagic } from "@/lib/magic"

export default function Home() {
  const { onBetButtonClick } = useBetButtonLogic()
  const { connected } = useWallet()

  if (!connected) {
    return <WalletModal />
  }

  const onMagicClick = async () => {
    const { error, magic } = await getMagic()
    if (error) return alert(error.message)

    const isLoggedIn = await magic.user.isLoggedIn()

    if (!isLoggedIn) {
      const accounts = await magic.wallet.connectWithUI()
      console.log('connected magic accounts', accounts)
    } else {
      await magic.user.logout()
      console.log('logged out from magic')
    }
  }

  const logMagicWallet = async () => {
    const { error, magic } = await getMagic()
    if (error) return alert(error.message)

    const walletInfo = await magic.wallet.getInfo()
    console.log('walletInfo', walletInfo)
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Use the Magic button to log in/out of Magic.link
          </li>
          <li>If logged in, the Send txn button will use Magic</li>
          <li>Else, it will use the wallet extension</li>
        </ol>

        <div className={styles.ctas}>
          <button className={styles.button} onClick={onBetButtonClick}>
            Send txn
          </button>
          <button className={styles.button} onClick={onMagicClick}>
            Magic log in/out
          </button>
          <button className={styles.button} onClick={logMagicWallet}>
            Log Magic wallet
          </button>
        </div>
      </main>
    </div>
  );
}

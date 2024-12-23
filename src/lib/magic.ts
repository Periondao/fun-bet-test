import type { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider'
import type { SolanaExtension } from '@magic-ext/solana'
import type { OAuthExtension } from '@magic-ext/oauth'

import { heliusStakedNode } from './solConnection'

let magic: InstanceWithExtensions<SDKBase, [OAuthExtension, SolanaExtension]>

const magicPublicApiKey = 'pk_live_37E70AFFF9DC7A13'

export const getMagic = async () => {
  if (magic) return { magic }

  try {
    const { SolanaExtension } = await import('@magic-ext/solana')
    const { OAuthExtension } = await import('@magic-ext/oauth')
    const { Magic } = await import('magic-sdk')

    const configOptions = {
      extensions: [
        new OAuthExtension(),
        new SolanaExtension({
          rpcUrl: heliusStakedNode!,
        }),
      ],
    }

    magic = new Magic(magicPublicApiKey, configOptions)

    return { magic }
  } catch (e) {
    return { error: e as Error }
  }
}

import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry'
import { type MultiAccounts } from './types/account'
import { toBuffer, toHex } from './utils'
import { Account } from './account'
import { getCoinSymbol } from './utils/coin'
import { KeystoneBitcoinSDK } from './chains/bitcoin'
import { KeystoneEthereumSDK } from './chains/ethereum'
import { KeystoneSolanaSDK } from './chains/solana'

export default class KeystoneSDK {
  private _btc!: KeystoneBitcoinSDK
  get btc (): KeystoneBitcoinSDK {
    if (this._btc === undefined) {
      this._btc = new KeystoneBitcoinSDK()
    }
    return this._btc
  }

  private _eth!: KeystoneEthereumSDK
  get eth (): KeystoneEthereumSDK {
    if (this._eth === undefined) {
      this._eth = new KeystoneEthereumSDK()
    }
    return this._eth
  }

  private _sol!: KeystoneSolanaSDK
  get sol (): KeystoneSolanaSDK {
    if (this._sol === undefined) {
      this._sol = new KeystoneSolanaSDK()
    }
    return this._sol
  }

  parseMultiAccounts (cborHex: string): MultiAccounts {
    const accounts = CryptoMultiAccounts.fromCBOR(toBuffer(cborHex))
    return {
      device: accounts.getDevice(),
      masterFingerprint: toHex(accounts.getMasterFingerprint()),
      keys: accounts.getKeys().map(key => {
        const chainCode = toHex(key.getChainCode())
        const parentFingerprint = toHex(key.getParentFingerprint())
        const origin = key.getOrigin()
        if (origin === undefined) {
          throw new Error('multi accounts is invalid')
        }
        let xpub = ''
        if (chainCode.length !== 0 && parentFingerprint.length !== 0) {
          xpub = key.getBip32Key()
        }
        return new Account(
          getCoinSymbol(origin.getComponents()[1].getIndex()),
          `m/${origin.getPath()}`,
          toHex(key.getKey()),
          key.getName() ?? '',
          chainCode,
          xpub
        )
      })
    }
  }
}

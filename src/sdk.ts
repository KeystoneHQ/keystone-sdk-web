import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry'
import { type MultiAccounts, type UR, URType } from './types'
import { toHex, getCoinSymbol } from './utils'
import { Account } from './account'
import {
  KeystoneAptosSDK,
  KeystoneArweaveSDK,
  KeystoneBitcoinCashSDK,
  KeystoneBitcoinSDK,
  KeystoneCardanoSDK,
  KeystoneCosmosSDK, KeystoneDashSDK,
  KeystoneEthereumSDK, KeystoneLitecoinSDK,
  KeystoneSolanaSDK, KeystoneTronSDK,
  KeystoneNearSDK, KeystoneSuiSDK
} from './chains'

export class KeystoneSDK {
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

  private _cosmos!: KeystoneCosmosSDK
  get cosmos (): KeystoneCosmosSDK {
    if (this._cosmos === undefined) {
      this._cosmos = new KeystoneCosmosSDK()
    }
    return this._cosmos
  }

  private _tron!: KeystoneTronSDK
  get tron (): KeystoneTronSDK {
    if (this._tron === undefined) {
      this._tron = new KeystoneTronSDK()
    }
    return this._tron
  }

  private _ltc!: KeystoneLitecoinSDK
  get ltc (): KeystoneLitecoinSDK {
    if (this._ltc === undefined) {
      this._ltc = new KeystoneLitecoinSDK()
    }
    return this._ltc
  }

  private _bch!: KeystoneBitcoinCashSDK
  get bch (): KeystoneBitcoinCashSDK {
    if (this._bch === undefined) {
      this._bch = new KeystoneBitcoinCashSDK()
    }
    return this._bch
  }

  private _dash!: KeystoneDashSDK
  get dash (): KeystoneDashSDK {
    if (this._dash === undefined) {
      this._dash = new KeystoneDashSDK()
    }
    return this._dash
  }

  private _aptos!: KeystoneAptosSDK
  get aptos (): KeystoneAptosSDK {
    if (this._aptos === undefined) {
      this._aptos = new KeystoneAptosSDK()
    }
    return this._aptos
  }

  private _near!: KeystoneNearSDK
  get near (): KeystoneNearSDK {
    if (this._near === undefined) {
      this._near = new KeystoneNearSDK()
    }
    return this._near
  }

  private _arweave!: KeystoneArweaveSDK
  get arweave (): KeystoneArweaveSDK {
    if (this._arweave === undefined) {
      this._arweave = new KeystoneArweaveSDK()
    }
    return this._arweave
  }

  private _sui!: KeystoneSuiSDK
  get sui (): KeystoneSuiSDK {
    if (this._sui === undefined) {
      this._sui = new KeystoneSuiSDK()
    }
    return this._sui
  }

  private _cardano!: KeystoneCardanoSDK
  get cardano (): KeystoneCardanoSDK {
    if (this._cardano === undefined) {
      this._cardano = new KeystoneCardanoSDK()
    }
    return this._cardano
  }

  parseMultiAccounts (ur: UR): MultiAccounts {
    if (ur.type !== URType.CryptoMultiAccounts) {
      throw new Error('type not match')
    }
    const accounts = CryptoMultiAccounts.fromCBOR(ur.cbor)
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
        let extendedPublicKey
        if (chainCode.length !== 0 && parentFingerprint.length !== 0) {
          extendedPublicKey = key.getBip32Key()
        }
        return new Account({
          chain: getCoinSymbol(origin.getComponents()[1].getIndex()),
          path: `m/${origin.getPath()}`,
          publicKey: toHex(key.getKey()),
          name: key.getName(),
          chainCode,
          extendedPublicKey
        })
      })
    }
  }
}

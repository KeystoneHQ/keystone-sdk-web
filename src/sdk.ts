import {
  KeystoneAptosSDK,
  KeystoneArweaveSDK,
  KeystoneBitcoinCashSDK,
  KeystoneBitcoinSDK,
  KeystoneCardanoSDK,
  KeystoneCosmosSDK, KeystoneDashSDK,
  KeystoneEthereumSDK, KeystoneLitecoinSDK,
  KeystoneSolanaSDK, KeystoneTronSDK,
  KeystoneNearSDK, KeystoneSuiSDK,
  KeystoneEvmSDK, KeystoneTonSDK,
  KeystoneStellarSDK
} from './chains'
import { parseMultiAccounts, parseHDKey, generateKeyDerivationCall, parseAccount, parseTonAccount } from './wallet'
import { KeystoneXrpSDK } from './chains/xrp'
import { type KeystoneSDKConfig } from './types/config'

export { KeystoneSDKConfig };
const CONFIG_URL = "https://keyst.one/statics/sdk/config.json";

export class KeystoneSDK {
  config?: KeystoneSDKConfig

  constructor (config?: KeystoneSDKConfig) {
    this.config = config
  }

  static async create (config?: KeystoneSDKConfig) {
    try {
      // fetch max message size limit from keystone server
      const res = await fetch(CONFIG_URL)
      const onlineConfig = await res.json()
      return new KeystoneSDK({ ...config, ...onlineConfig })
    } catch (err) {
      console.error("fetch config error", err)
      return new KeystoneSDK(config)
    }
  }

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
      this._eth = new KeystoneEthereumSDK(this.config)
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

  private _stellar!: KeystoneStellarSDK
  get stellar (): KeystoneStellarSDK {
    if (this._stellar === undefined) {
      this._stellar = new KeystoneStellarSDK()
    }
    return this._stellar
  }

  private _cosmos!: KeystoneCosmosSDK
  get cosmos (): KeystoneCosmosSDK {
    if (this._cosmos === undefined) {
      this._cosmos = new KeystoneCosmosSDK(this.config)
    }
    return this._cosmos
  }

  private _evm!: KeystoneEvmSDK
  get evm (): KeystoneEvmSDK {
    if (this._evm === undefined) {
      this._evm = new KeystoneEvmSDK(this.config)
    }
    return this._evm
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
      this._sui = new KeystoneSuiSDK(this.config)
    }
    return this._sui
  }

  private _cardano!: KeystoneCardanoSDK
  get cardano (): KeystoneCardanoSDK {
    if (this._cardano === undefined) {
      this._cardano = new KeystoneCardanoSDK(this.config)
    }
    return this._cardano
  }

  private _xrp!: KeystoneXrpSDK
  get xrp (): KeystoneXrpSDK {
    if (this._xrp === undefined) {
      this._xrp = new KeystoneXrpSDK()
    }
    return this._xrp
  }

  private _ton!: KeystoneTonSDK
  get ton (): KeystoneTonSDK {
    if (this._ton === undefined) {
      this._ton = new KeystoneTonSDK(this.config)
    }
    return this._ton
  }

  parseMultiAccounts = parseMultiAccounts
  parseTonAccount = parseTonAccount
  parseHDKey = parseHDKey
  parseAccount = parseAccount
  generateKeyDerivationCall = generateKeyDerivationCall

  /**
   * @deprecated since version 0.2.1.
   * @description Replaced by a instance function with same name. It will be removed since version 0.3.0.
   * @example
   * const sdk = new KeystoneSDK();
   * const multiAccounts = sdk.parseMultiAccounts(ur);
   */
  static parseMultiAccounts = parseMultiAccounts
  /**
   * @deprecated since version 0.2.1.
   * @description Replaced by a instance function with same name. It will be removed since version 0.3.0.
   * @example
   * const sdk = new KeystoneSDK();
   * const account = sdk.parseHDKey(ur);
   */
  static parseHDKey = parseHDKey
  /**
   * @deprecated since version 0.2.1.
   * @description Replaced by a instance function with same name. It will be removed since version 0.3.0.
   * @example
   * const sdk = new KeystoneSDK();
   * const ur = sdk.generateKeyDerivationCall(args);
   */
  static generateKeyDerivationCall = generateKeyDerivationCall
}

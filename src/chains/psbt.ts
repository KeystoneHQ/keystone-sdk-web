import { CoinIds, CryptoPSBTExtend } from '@keystonehq/bc-ur-registry'
import { DataType } from '@keystonehq/bc-ur-registry-btc'
import { toHex } from '../utils'
import { URType, type UR } from '../types/ur'
import { type KeystoneSDKConfig } from '../types/config'

export class KeystonePsbtSDK {
  static DataType = DataType
  config: KeystoneSDKConfig | undefined

  constructor (config?: KeystoneSDKConfig) {
    this.config = config
  }

  parsePSBT (ur: UR): string {
    if (ur.type !== URType.CryptoPSBTExtend) {
      throw new Error('type not match')
    }
    return toHex(CryptoPSBTExtend.fromCBOR(ur.cbor).getPSBT())
  }

  parseCoinId (ur: UR): CoinIds {
    if (ur.type !== URType.CryptoPSBTExtend) {
      throw new Error('type not match')
    }
    return CryptoPSBTExtend.fromCBOR(ur.cbor).getCoinId()
  }

  generatePSBT (psbt: Buffer, coinId: CoinIds): UR {
    return new CryptoPSBTExtend(psbt, coinId).toUR()
  }
}

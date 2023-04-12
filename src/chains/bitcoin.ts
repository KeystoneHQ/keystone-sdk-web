import { CryptoPSBT } from '@keystonehq/bc-ur-registry'
import { toBuffer, toHex } from '../utils'
import { type UR } from '../types/ur'

export class KeystoneBitcoinSDK {
  parseCryptoPSBT (cborHex: string): string {
    return toHex(CryptoPSBT.fromCBOR(toBuffer(cborHex)).getPSBT())
  }

  generateCryptoPSBT (psbt: Buffer): UR {
    const ur = (new CryptoPSBT(psbt)).toUR()
    return {
      type: ur.type,
      cbor: toHex(ur.cbor)
    }
  }
}

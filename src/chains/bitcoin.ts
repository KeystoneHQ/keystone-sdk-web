import { CryptoPSBT } from '@keystonehq/bc-ur-registry'
import { toBuffer, toHex } from '../utils'
import { type UR } from '../types/ur'

export class KeystoneBitcoinSDK {
  parsePSBT (cborHex: string): string {
    return toHex(CryptoPSBT.fromCBOR(toBuffer(cborHex)).getPSBT())
  }

  generatePSBT (psbt: Buffer): UR {
    const ur = (new CryptoPSBT(psbt)).toUR()
    return {
      type: ur.type,
      cbor: toHex(ur.cbor)
    }
  }
}

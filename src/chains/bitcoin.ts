import { CryptoPSBT } from '@keystonehq/bc-ur-registry'
import { toBuffer, toHex } from '../utils'
import { URType, type UR } from '../types/ur'

export class KeystoneBitcoinSDK {
  parsePSBT (type: string, cborHex: string): string {
    if (type !== URType.CryptoPSBT) {
      throw new Error('type not match')
    }
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

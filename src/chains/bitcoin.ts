import { CryptoPSBT } from '@keystonehq/bc-ur-registry'
import { toHex } from '../utils'
import { URType, type UR } from '../types/ur'

export class KeystoneBitcoinSDK {
  parsePSBT (ur: UR): string {
    if (ur.type !== URType.CryptoPSBT) {
      throw new Error('type not match')
    }
    return toHex(CryptoPSBT.fromCBOR(ur.cbor).getPSBT())
  }

  generatePSBT (psbt: Buffer): UR {
    return new CryptoPSBT(psbt).toUR()
  }
}

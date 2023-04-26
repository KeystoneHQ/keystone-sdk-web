import { CardanoSignature, CardanoSignRequest, CardanoUtxoData } from '@keystonehq/bc-ur-registry-cardano'
import { type AdaSignature } from '../types/signature'
import { toHex, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type CardanoSignRequestProps } from '../types/props'

export class KeystoneCardanoSDK {
  parseSignature (ur: UR): AdaSignature {
    if (ur.type !== URType.CardanoSignature) {
      throw new Error('type not match')
    }
    const sig = CardanoSignature.fromCBOR(ur.cbor)
    return {
      requestId: uuidStringify(sig.getWitnessSet()),
      witnessSet: toHex(sig.getWitnessSet())
    }
  }

  generateSignRequest ({
    signData,
    utxos,
    uuidString,
    origin
  }: CardanoSignRequestProps): UR {
    return CardanoSignRequest.constructCardanoSignRequest(
      signData,
      utxos,
      uuidString,
      origin
    ).toUR()
  }
}

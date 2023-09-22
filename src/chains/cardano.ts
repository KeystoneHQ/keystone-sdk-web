import { CardanoSignature as AdaSignature, CardanoSignRequest } from '@keystonehq/bc-ur-registry-cardano'
import { type CardanoSignature } from '../types/signature'
import { toHex, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type CardanoSignRequestProps } from '../types/props'

export class KeystoneCardanoSDK {
  parseSignature (ur: UR): CardanoSignature {
    if (ur.type !== URType.CardanoSignature) {
      throw new Error('type not match')
    }
    const sig = AdaSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: Buffer.isBuffer(requestId) ? uuidStringify(requestId) : '',
      witnessSet: toHex(sig.getWitnessSet())
    }
  }

  generateSignRequest ({
    signData,
    utxos,
    extraSigners,
    requestId,
    origin
  }: CardanoSignRequestProps): UR {
    return CardanoSignRequest.constructCardanoSignRequest(
      signData,
      utxos,
      extraSigners,
      requestId,
      origin
    ).toUR()
  }
}

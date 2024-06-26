import {
  CardanoSignature as AdaSignature,
  CardanoSignRequest,
  CardanoSignDataRequest,
  CardanoSignDataSignature as AdaSignDataSignature
} from '@keystonehq/bc-ur-registry-cardano'
import { type CardanoSignature, type CardanoSignDataSignature } from '../types/signature'
import { toHex, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type CardanoSignRequestProps, type CardanoSignDataRequestProps } from '../types/props'

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

  parseSignDataSignature (ur: UR): CardanoSignDataSignature {
    if (ur.type !== URType.CardanoSignDataSignature) {
      throw new Error('type not match')
    }
    const sig = AdaSignDataSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: Buffer.isBuffer(requestId) ? uuidStringify(requestId) : '',
      signature: toHex(sig.getSignature()),
      publicKey: toHex(sig.getPublicKey())
    }
  }

  generateSignDataRequest ({
    requestId,
    payload,
    path,
    xfp,
    origin
  }: CardanoSignDataRequestProps): UR {
    return CardanoSignDataRequest.constructCardanoSignDataRequest(
      payload,
      path,
      xfp,
      requestId,
      origin
    ).toUR()
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

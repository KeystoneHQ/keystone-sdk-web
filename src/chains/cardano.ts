import {
  CardanoSignature as AdaSignature,
  CardanoSignRequest,
  CardanoSignDataRequest,
  CardanoSignDataSignature as AdaSignDataSignature,
  CardanoCatalystRequest,
  CardanoCatalystSignature as AdaCatalystSignature,
  CardanoSignCip8DataRequest,
  CardanoSignCip8DataSignature as AdaSignCip8DataSignature
} from '@keystonehq/bc-ur-registry-cardano'
import { type CardanoSignature, type CardanoSignDataSignature, type CardanoSignCip8DataSignature, type CardanoCatalystSignature } from '../types/signature'
import { toHex, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import {
  type CardanoSignRequestProps,
  type CardanoSignDataRequestProps,
  type CardanoCatalystRequestProps,
  type CardanoSignCip8MessageData,
} from '../types/props'
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


  parseSignCip8DataSignature (ur: UR): CardanoSignCip8DataSignature {
    if (ur.type !== URType.CardanoSignCip8DataSignature) {
      throw new Error('type not match')
    }
    const sig = AdaSignCip8DataSignature.fromCBOR(ur.cbor)
    const signature = sig.getSignature()
    const publicKey = sig.getPublicKey()
    const addressField = sig.getAddressField()
    return {
      requestId: '',
      signature: toHex(signature),
      publicKey: toHex(publicKey),
      addressField: toHex(addressField)
    } 
  }


  parseCatalystSignature (ur: UR): CardanoCatalystSignature {
    if (ur.type !== URType.CardanoCatalystSignature) {
      throw new Error('type not match')
    }
    const sig = AdaCatalystSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()

    return {
      requestId: Buffer.isBuffer(requestId) ? uuidStringify(requestId) : '',
      signature: toHex(sig.getSignature())
    }
  }

  generateSignDataRequest ({
    requestId,
    payload,
    sigStructure,
    path,
    xpub,
    pubKey,
    xfp,
    origin
  }: CardanoSignDataRequestProps): UR {
    return CardanoSignDataRequest.constructCardanoSignDataRequest(
      sigStructure ?? payload,
      path,
      xfp,
      pubKey ?? xpub,
      requestId,
      origin
    ).toUR()
  }


  generateSignCip8DataRequest (props: CardanoSignCip8MessageData): UR {
    return CardanoSignCip8DataRequest.constructCardanoSignCip8DataRequest(
      props.messageHex,
      props.path,
      props.xfp,
      props.xpub,
      props.hashPayload,
      props.addressFieldType,
      'address' in props ? props.address : undefined,
      props.requestId,
      props.origin
    ).toUR()
  }


  generateCatalystRequest (props: CardanoCatalystRequestProps): UR {
    return CardanoCatalystRequest.constructCardanoCatalystRequest(
      props.delegations,
      props.stakePub,
      props.paymentAddress,
      props.nonce,
      props.voting_purpose,
      props.path,
      props.xfp,
      props.requestId,
      props.origin
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

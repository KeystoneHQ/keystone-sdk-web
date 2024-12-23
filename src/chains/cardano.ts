import {
  CardanoSignature as AdaSignature,
  CardanoSignRequest,
  CardanoSignDataRequest,
  CardanoSignDataSignature as AdaSignDataSignature,
  CardanoCatalystRequest,
  CardanoCatalystSignature as AdaCatalystSignature,
  CardanoSignCip8DataRequest,
  CardanoSignCip8DataSignature as AdaSignCip8DataSignature,
  CardanoSignTxHashRequest,
  CryptoKeypath,
  PathComponent,
} from '@keystonehq/bc-ur-registry-cardano'
import { type CardanoSignature, type CardanoSignDataSignature, type CardanoSignCip8DataSignature, type CardanoCatalystSignature } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import {
  type CardanoSignRequestProps,
  type CardanoSignDataRequestProps,
  type CardanoCatalystRequestProps,
  type CardanoSignCip8MessageData,
} from '../types/props'
import { KeystoneSDKConfig } from '../types'
import { blake2b } from '@noble/hashes/blake2b'
export class KeystoneCardanoSDK {

  config: KeystoneSDKConfig|undefined

  constructor (config?: KeystoneSDKConfig) {
    this.config = config
  }


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

  checkNeedSignTxHash(signData:Buffer): boolean {
    // check if signData is too long , so we convert it to sign tx hash request
    const maxTxMaxSize = this.config?.sizeLimit?.ada ?? 2048
    return signData.length >= maxTxMaxSize
  }

  generateSignTxHashRequest (txHash: string, paths: CryptoKeypath[], addressList: string[],  origin?: string, requestId?: string): UR {
    return CardanoSignTxHashRequest.constructCardanoSignTxHashRequest(
      txHash,
      paths,
      addressList,
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
    // check if signData is too long , so we convert it to sign tx hash request
    const maxTxMaxSize = this.config?.sizeLimit?.ada ?? 2048
    if (signData.length >= maxTxMaxSize) {
      const txHash = blake2b(Uint8Array.from(signData), { dkLen: 32 })
      const utxoPaths = utxos.map(utxo => new CryptoKeypath(parsePath(utxo.hdPath).map(e => new PathComponent(e)), toBuffer(utxo.xfp)))
      const extraSignerPaths = extraSigners.map(signer => new CryptoKeypath(parsePath(signer.keyPath).map(e => new PathComponent(e)), toBuffer(signer.xfp)))
      const paths = [...utxoPaths, ...extraSignerPaths]
      // add extra signers to addresses
      const addresses = utxos.map(utxo => utxo.address)
      return CardanoSignTxHashRequest.constructCardanoSignTxHashRequest(
        Buffer.from(txHash).toString('hex'),
        paths,
        addresses,
        requestId,
        origin
      ).toUR()
    }
    return CardanoSignRequest.constructCardanoSignRequest(
      signData,
      utxos,
      extraSigners,
      requestId,
      origin
    ).toUR()
  }
}

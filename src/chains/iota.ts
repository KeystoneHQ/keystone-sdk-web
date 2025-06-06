import { CryptoKeypath, PathComponent, IotaSignHashRequest, IotaSignRequest, IotaSignature } from '@keystonehq/bc-ur-registry-iota'
import { type IotaSignature as IotaSignatureType } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { IotaSignHashRequestProps, IotaSignRequestProps } from '../types/props'
import { blake2b } from '@noble/hashes/blake2b';
import { KeystoneSDKConfig } from '../types'

export class KeystoneIotaSDK {
  config: KeystoneSDKConfig | undefined

  constructor (config?: KeystoneSDKConfig) {
    this.config = config
  }
  parseSignature (ur: UR): IotaSignatureType {
    if (ur.type !== URType.IotaSignature) {
      throw new Error('type not match')
    }
    const sig = IotaSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: Buffer.isBuffer(requestId) ? uuidStringify(requestId) : '',
      signature: toHex(sig.getSignature()),
      publicKey: toHex(sig.getPublicKey())
    }
  }

  generateSignHashRequest ({
    requestId,
    messageHash,
    accounts,
    origin
  }: IotaSignHashRequestProps): UR {
    const derivationPaths: CryptoKeypath[] = []
    const addresses: Buffer[] = []
    accounts.forEach(account => {
      derivationPaths.push(
        new CryptoKeypath(parsePath(account.path).map(e => new PathComponent(e)), toBuffer(account.xfp))
      )
      account.address !== undefined && addresses.push(toBuffer(account.address.startsWith('0x') ? account.address.substring(2) : account.address))
    })
    if (addresses.length > 0 && addresses.length !== derivationPaths.length) {
      throw new Error('address and path count must match')
    }
    return new IotaSignHashRequest({
      requestId: uuidParse(requestId),
      messageHash: toBuffer(messageHash),
      derivationPaths,
      addresses,
      origin
    }).toUR()
  }

  generateIntentMessageHash (intentMessage: string): string {
    let intentMessageBuffer = toBuffer(intentMessage)
    const hash = blake2b(Uint8Array.from(intentMessageBuffer), { dkLen: 32 });
    return toHex(hash)
  }

  generateSignRequest ({
    requestId,
    intentMessage,
    accounts,
    origin
  }: IotaSignRequestProps): UR {
    const maxIntentMessageLength = this.config?.sizeLimit?.iota ?? 2048
    const derivationPaths: CryptoKeypath[] = []
    const addresses: Buffer[] = []
    accounts.forEach(account => {
      derivationPaths.push(
        new CryptoKeypath(parsePath(account.path).map(e => new PathComponent(e)), toBuffer(account.xfp))
      )
      account.address !== undefined && addresses.push(toBuffer(account.address.startsWith('0x') ? account.address.substring(2) : account.address))
    })
    if (addresses.length > 0 && addresses.length !== derivationPaths.length) {
      throw new Error('address and path count must match')
    }
    let intentMessageBuffer = toBuffer(intentMessage)
    if (intentMessageBuffer.length > maxIntentMessageLength) {
      // hash intentMessage to 32 bytes
      const hash = blake2b(Uint8Array.from(intentMessageBuffer), { dkLen: 32 });
      if (hash.length !== 32) {
        throw new Error('hash length must be 32')
      }
      intentMessage = toHex(hash)
      return new IotaSignHashRequest({
        requestId: uuidParse(requestId),
        messageHash: toBuffer(intentMessage),
        derivationPaths,
        addresses,
        origin
      }).toUR()
    }
    return new IotaSignRequest({
      requestId: uuidParse(requestId),
      intentMessage: toBuffer(intentMessage),
      derivationPaths,
      addresses,
      origin
    }).toUR()
  }
}

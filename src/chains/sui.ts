import { CryptoKeypath, PathComponent, SuiSignHashRequest, SuiSignRequest, SuiSignature } from '@keystonehq/bc-ur-registry-sui'
import { type SuiSignature as SuiSignatureType } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { SuiSignHashRequestProps, type SuiSignRequestProps } from '../types/props'
import { blake2b } from '@noble/hashes/blake2b';

const MAX_INTENT_MESSAGE_LENGTH = 2048
export class KeystoneSuiSDK {
  parseSignature (ur: UR): SuiSignatureType {
    if (ur.type !== URType.SuiSignature) {
      throw new Error('type not match')
    }
    const sig = SuiSignature.fromCBOR(ur.cbor)
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
  }: SuiSignHashRequestProps): UR {
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
    return new SuiSignHashRequest({
      requestId: uuidParse(requestId),
      messageHash,
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
  }: SuiSignRequestProps): UR {
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
    if (intentMessageBuffer.length > MAX_INTENT_MESSAGE_LENGTH) {
      // hash intentMessage to 32 bytes
      const hash = blake2b(Uint8Array.from(intentMessageBuffer), { dkLen: 32 });
      if (hash.length !== 32) {
        throw new Error('hash length must be 32')
      }
      intentMessage = toHex(hash)
      return new SuiSignHashRequest({
        requestId: uuidParse(requestId),
        messageHash: intentMessage,
        derivationPaths,
        addresses,
        origin
      }).toUR()
    }
    return new SuiSignRequest({
      requestId: uuidParse(requestId),
      intentMessage: toBuffer(intentMessage),
      derivationPaths,
      addresses,
      origin
    }).toUR()
  }
}

import { CryptoKeypath, PathComponent, SignType, SolSignRequest, SolSignature } from '@keystonehq/bc-ur-registry-sol'
import { type SolSignature as SolSignatureType } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { type UR } from '../types/ur'

export class KeystoneSolanaSDK {
  static SignType = SignType

  parseSignature (cborHex: string): SolSignatureType {
    const sig = SolSignature.fromCBOR(toBuffer(cborHex))
    const requestId = sig.getRequestId()
    return {
      requestId: requestId === undefined ? undefined : uuidStringify(requestId),
      signature: toHex(sig.getSignature())
    }
  }

  generateSignRequest (
    requestId: string,
    signData: string,
    signType: SignType,
    path: string,
    xfp: string,
    address?: string,
    origin?: string
  ): UR {
    const ur = new SolSignRequest({
      requestId: uuidParse(requestId),
      signData: toBuffer(signData),
      signType,
      derivationPath: new CryptoKeypath(parsePath(path).map(e => new PathComponent(e)), toBuffer(xfp)),
      address: address !== undefined ? toBuffer(address) : undefined,
      origin
    }).toUR()
    return {
      type: ur.type,
      cbor: toHex(ur.cbor)
    }
  }
}

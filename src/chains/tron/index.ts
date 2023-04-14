import { CryptoKeypath, PathComponent, TronSignRequest, TronSignature } from '@keystonehq/bc-ur-registry-tron'
import { type TronSignature as TronSignatureType } from '../../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../../utils'
import { type UR } from '../../types/ur'
import { type TokenInfo } from '../../types/token'
import { raw2json } from './transfer'

export class KeystoneTronSDK {
  parseSignature (cborHex: string): TronSignatureType {
    const sig = TronSignature.fromCBOR(toBuffer(cborHex))
    const requestId = sig.getRequestId()
    return {
      requestId: requestId === undefined ? undefined : uuidStringify(requestId),
      signature: toHex(sig.getSignature())
    }
  }

  generateSignRequest (
    requestId: string,
    signData: string,
    path: string,
    xfp: string,
    tokenInfo?: TokenInfo,
    address?: string,
    origin?: string
  ): UR {
    const ur = new TronSignRequest({
      requestId: uuidParse(requestId),
      signData: raw2json(toBuffer(signData), tokenInfo),
      derivationPath: new CryptoKeypath(parsePath(path).map(e => new PathComponent(e)), toBuffer(xfp)),
      address: (address !== undefined && address.length > 0) ? toBuffer(address) : undefined,
      origin
    }).toUR()
    return {
      type: ur.type,
      cbor: toHex(ur.cbor)
    }
  }
}

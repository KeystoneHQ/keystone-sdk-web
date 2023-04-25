import { CryptoKeypath, PathComponent, TronSignRequest, TronSignature } from '@keystonehq/bc-ur-registry-tron'
import { type TronSignature as TronSignatureType } from '../../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../../utils'
import { type UR, URType } from '../../types/ur'
import { raw2json } from './transfer'
import { type TronSignRequestProps } from '../../types/props'

export class KeystoneTronSDK {
  parseSignature (ur: UR): TronSignatureType {
    if (ur.type !== URType.TronSignature) {
      throw new Error('type not match')
    }
    const sig = TronSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: requestId === undefined ? undefined : uuidStringify(requestId),
      signature: toHex(sig.getSignature())
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    path,
    xfp,
    tokenInfo,
    address,
    origin
  }: TronSignRequestProps): UR {
    return new TronSignRequest({
      requestId: uuidParse(requestId),
      signData: raw2json(toBuffer(signData), tokenInfo),
      derivationPath: new CryptoKeypath(parsePath(path).map(e => new PathComponent(e)), toBuffer(xfp)),
      address: (address !== undefined && address.length > 0) ? toBuffer(address) : undefined,
      origin
    }).toUR()
  }
}
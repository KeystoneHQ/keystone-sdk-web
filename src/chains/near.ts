import { type NearSignature as NearSignatureType } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type NearSignRequestProps } from '../types/props'
import { CryptoKeypath, NearSignRequest, NearSignature, PathComponent } from '@keystonehq/bc-ur-registry-near'

export class KeystoneNearSDK {
  parseSignature (ur: UR): NearSignatureType {
    if (ur.type !== URType.NearSignature) {
      throw new Error('type not match')
    }
    const sig = NearSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: requestId === undefined ? undefined : uuidStringify(requestId),
      signature: sig.getSignature().map(e => toHex(e))
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    path,
    xfp,
    account,
    origin
  }: NearSignRequestProps): UR {
    return new NearSignRequest({
      requestId: uuidParse(requestId),
      signData: signData.map(e => toBuffer(e)),
      derivationPath: new CryptoKeypath(parsePath(path).map(e => new PathComponent(e)), toBuffer(xfp)),
      account,
      origin
    }).toUR()
  }
}

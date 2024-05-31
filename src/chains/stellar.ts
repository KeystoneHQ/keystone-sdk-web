import { type StellarSignature as StellarSignatureType } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type StellarSignRequestProps } from '../types/props'
import { CryptoKeypath, PathComponent, SignType, StellarSignRequest, StellarSignature } from '@keystonehq/bc-ur-registry-stellar'

export class KeystoneStellarSDK {
  static DataType = SignType

  parseSignature (ur: UR): StellarSignatureType {
    if (ur.type !== URType.StellarSignature) {
      throw new Error('type not match')
    }
    const sig = StellarSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: requestId === undefined ? undefined : uuidStringify(requestId),
      signature: toHex(sig.getSignature())
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    dataType,
    path,
    xfp,
    address,
    origin
  }: StellarSignRequestProps): UR {
    return new StellarSignRequest({
      requestId: uuidParse(requestId),
      signData: toBuffer(signData),
      signType: dataType,
      derivationPath: new CryptoKeypath(parsePath(path).map(e => new PathComponent(e)), toBuffer(xfp)),
      address: address !== undefined ? toBuffer(address) : undefined,
      origin
    }).toUR()
  }
}

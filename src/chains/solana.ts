import { CryptoKeypath, PathComponent, SignType, SolSignRequest, SolSignature } from '@keystonehq/bc-ur-registry-sol'
import { type SolSignature as SolSignatureType } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type SolSignRequestProps } from '../types/props'

export class KeystoneSolanaSDK {
  static DataType = SignType

  parseSignature (type: string, cborHex: string): SolSignatureType {
    if (type !== URType.SolSignature) {
      throw new Error('type not match')
    }
    const sig = SolSignature.fromCBOR(toBuffer(cborHex))
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
  }: SolSignRequestProps): UR {
    const ur = new SolSignRequest({
      requestId: uuidParse(requestId),
      signData: toBuffer(signData),
      signType: dataType,
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

import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { type UR } from '../types/ur'
import { CosmosSignRequest, CosmosSignature, CryptoKeypath, PathComponent, SignDataType as DataType } from '@keystonehq/bc-ur-registry-cosmos'
import { type CosmosSignature as CosmosSignatureType } from '../types/signature'

export class KeystoneCosmosSDK {
  static DataType = DataType

  parseSignature (cborHex: string): CosmosSignatureType {
    const sig = CosmosSignature.fromCBOR(toBuffer(cborHex))
    return {
      requestId: uuidStringify(sig.getRequestId()),
      signature: toHex(sig.getSignature()),
      publicKey: toHex(sig.getPublicKey())
    }
  }

  generateSignRequest (
    requestId: string,
    signData: string,
    dataType: DataType,
    paths: string[],
    xfp: string,
    addresses?: string[],
    origin?: string
  ): UR {
    const ur = new CosmosSignRequest({
      signData: toBuffer(signData),
      dataType,
      derivationPaths: paths.map(path => new CryptoKeypath(parsePath(path).map(e => new PathComponent(e)), toBuffer(xfp))),
      requestId: uuidParse(requestId),
      addresses,
      origin
    }).toUR()
    return {
      type: ur.type,
      cbor: toHex(ur.cbor)
    }
  }
}

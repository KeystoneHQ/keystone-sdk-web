import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { CosmosSignRequest, CosmosSignature, CryptoKeypath, PathComponent, SignDataType as DataType } from '@keystonehq/bc-ur-registry-cosmos'
import { type CosmosSignature as CosmosSignatureType } from '../types/signature'
import { type CosmosSignRequestProps } from '../types/props'

export class KeystoneCosmosSDK {
  static DataType = DataType

  parseSignature (ur: UR): CosmosSignatureType {
    if (ur.type !== URType.CosmosSignature) {
      throw new Error('type not match')
    }
    const sig = CosmosSignature.fromCBOR(ur.cbor)
    const requestId = uuidStringify(sig.getRequestId())
    return {
      requestId,
      signature: toHex(sig.getSignature()),
      publicKey: toHex(sig.getPublicKey())
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    dataType,
    accounts,
    origin
  }: CosmosSignRequestProps): UR {
    const derivationPaths: CryptoKeypath[] = []
    const addresses: string[] = []
    accounts.forEach(account => {
      derivationPaths.push(
        new CryptoKeypath(parsePath(account.path).map(e => new PathComponent(e)), toBuffer(account.xfp))
      )
      addresses.push(account.address)
    })
    return new CosmosSignRequest({
      signData: toBuffer(signData),
      dataType,
      derivationPaths,
      requestId: uuidParse(requestId),
      addresses,
      origin
    }).toUR()
  }
}

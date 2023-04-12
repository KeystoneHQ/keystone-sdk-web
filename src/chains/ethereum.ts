import { type EthSignature } from '../types/signature'
import { CryptoKeypath, DataType, ETHSignature, EthSignRequest, PathComponent } from '@keystonehq/bc-ur-registry-eth'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { type UR } from '../types/ur'

export class KeystoneEthereumSDK {
  static DataType = DataType

  parseETHSignature (cborHex: string): EthSignature {
    const sig = ETHSignature.fromCBOR(toBuffer(cborHex))
    const requestId = sig.getRequestId()
    return {
      requestId: requestId === undefined ? undefined : uuidStringify(requestId),
      signature: toHex(sig.getSignature()),
      origin: sig.getOrigin()
    }
  }

  generateETHSignRequest (
    signData: string,
    dataType: DataType,
    path: string,
    xfp: string,
    requestId?: string,
    chainId?: number,
    address?: string,
    origin?: string
  ): UR {
    const ur = new EthSignRequest({
      signData: toBuffer(signData),
      dataType,
      derivationPath: new CryptoKeypath(parsePath(path).map(e => new PathComponent(e)), toBuffer(xfp)),
      chainId,
      requestId: requestId !== undefined ? uuidParse(requestId) : undefined,
      address: address !== undefined ? toBuffer(address) : undefined,
      origin
    }).toUR()
    return {
      type: ur.type,
      cbor: toHex(ur.cbor)
    }
  }
}

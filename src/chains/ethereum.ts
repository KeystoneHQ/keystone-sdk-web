import { type EthSignature } from '../types/signature'
import { CryptoKeypath, DataType, ETHSignature, EthSignRequest, PathComponent } from '@keystonehq/bc-ur-registry-eth'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type EthSignRequestProps } from '../types/props'
import { type KeystoneSDKConfig } from '../types/config'

export class KeystoneEthereumSDK {
  static DataType = DataType
  config: KeystoneSDKConfig | undefined

  constructor (config?: KeystoneSDKConfig) {
    this.config = config
  }

  parseSignature (ur: UR): EthSignature {
    if (ur.type !== URType.EthSignature) {
      throw new Error('type not match')
    }
    const sig = ETHSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: requestId === undefined ? undefined : uuidStringify(requestId),
      signature: toHex(sig.getSignature()),
      origin: sig.getOrigin()
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    dataType,
    path,
    xfp,
    chainId,
    address,
    origin
  }: EthSignRequestProps): UR {
    return new EthSignRequest({
      requestId: uuidParse(requestId),
      signData: toBuffer(signData),
      dataType,
      derivationPath: new CryptoKeypath(parsePath(path).map(e => new PathComponent(e)), toBuffer(xfp)),
      chainId,
      address: address !== undefined ? toBuffer(address) : undefined,
      origin: origin ?? this.config?.origin
    }).toUR()
  }
}

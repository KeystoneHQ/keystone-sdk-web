import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { EvmSignRequest, EvmSignature, CryptoKeypath, PathComponent, SignDataType as DataType } from '@keystonehq/bc-ur-registry-evm'
import { type EvmSignRequestProps } from '../types/props'
import { type Signature } from '../types'
import { type KeystoneSDKConfig } from '../sdk'

export class KeystoneEvmSDK {
  static DataType = DataType
  config: KeystoneSDKConfig | undefined

  constructor (config?: KeystoneSDKConfig) {
    this.config = config
  }

  parseSignature (ur: UR): Signature {
    if (ur.type !== URType.EvmSignature) {
      throw new Error('type not match')
    }
    const sig = EvmSignature.fromCBOR(ur.cbor)
    const requestId = uuidStringify(sig.getRequestId())
    return {
      requestId,
      signature: toHex(sig.getSignature())
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    dataType,
    customChainIdentifier,
    account,
    origin
  }: EvmSignRequestProps): UR {
    const derivationPath: CryptoKeypath = new CryptoKeypath(parsePath(account.path).map(e => new PathComponent(e)), toBuffer(account.xfp))
    return new EvmSignRequest({
      signData: toBuffer(signData),
      dataType,
      customChainIdentifier,
      derivationPath,
      requestId: uuidParse(requestId),
      address: account.address !== undefined ? toBuffer(account.address.substring(account.address.startsWith('0x') ? 2 : 0)) : undefined,
      origin: origin ?? this.config?.origin
    }).toUR()
  }
}

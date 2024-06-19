import { CryptoPSBT } from '@keystonehq/bc-ur-registry'
import { BtcSignRequest, DataType, BtcSignature, CryptoKeypath, PathComponent } from '@keystonehq/bc-ur-registry-btc'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type BtcSignRequestProps, type BtcSignature as BtcSignatureType } from '../types'
import { type KeystoneSDKConfig } from '../types/config'

export class KeystoneBitcoinSDK {
  static DataType = DataType
  config: KeystoneSDKConfig | undefined

  constructor (config?: KeystoneSDKConfig) {
    this.config = config
  }

  parsePSBT (ur: UR): string {
    if (ur.type !== URType.CryptoPSBT) {
      throw new Error('type not match')
    }
    return toHex(CryptoPSBT.fromCBOR(ur.cbor).getPSBT())
  }

  generatePSBT (psbt: Buffer): UR {
    return new CryptoPSBT(psbt).toUR()
  }

  generateSignRequest ({
    requestId,
    signData,
    dataType,
    accounts,
    origin
  }: BtcSignRequestProps): UR {
    const derivationPaths: CryptoKeypath[] = []
    const addresses: string[] = []
    accounts.forEach(account => {
      derivationPaths.push(
        new CryptoKeypath(parsePath(account.path).map(e => new PathComponent(e)), toBuffer(account.xfp))
      )
      addresses.push(account.address ?? '')
    })
    return new BtcSignRequest({
      signData: toBuffer(signData),
      dataType,
      derivationPaths,
      requestId: uuidParse(requestId),
      addresses,
      origin: origin ?? this.config?.origin
    }).toUR()
  }

  parseSignature (ur: UR): BtcSignatureType {
    if (ur.type !== URType.BtcSignature) {
      throw new Error('type not match')
    }
    const sig = BtcSignature.fromCBOR(ur.cbor)
    const requestId = uuidStringify(sig.getRequestId())
    return {
      requestId,
      signature: toHex(sig.getSignature()),
      publicKey: toHex(sig.getPublicKey())
    }
  }
}

import { CryptoKeypath, PathComponent, SignType, SuiSignRequest, SuiSignature } from '@keystonehq/bc-ur-registry-sui'
import { type SuiSignature as SuiSignatureType } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type SuiSignRequestProps } from '../types/props'

export class KeystoneSuiSDK {
  static SignType = SignType

  parseSignature (ur: UR): SuiSignatureType {
    if (ur.type !== URType.SuiSignature) {
      throw new Error('type not match')
    }
    const sig = SuiSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: Buffer.isBuffer(requestId) ? uuidStringify(requestId) : '',
      signature: toHex(sig.getSignature()),
      publicKey: toHex(sig.getPublicKey())
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    signType,
    accounts,
    origin
  }: SuiSignRequestProps): UR {
    const derivationPaths: CryptoKeypath[] = []
    const addresses: Buffer[] = []
    accounts.forEach(account => {
      derivationPaths.push(
        new CryptoKeypath(parsePath(account.path).map(e => new PathComponent(e)), toBuffer(account.xfp))
      )
      account.address !== undefined && addresses.push(toBuffer(account.address.startsWith('0x') ? account.address.substring(2) : account.address))
    })
    if (addresses.length > 0 && addresses.length !== derivationPaths.length) {
      throw new Error('address and path count must match')
    }
    return new SuiSignRequest({
      requestId: uuidParse(requestId),
      signData: toBuffer(signData),
      signType,
      derivationPaths,
      addresses,
      origin
    }).toUR()
  }
}

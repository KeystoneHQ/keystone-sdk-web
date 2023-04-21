import { CryptoKeypath, PathComponent, SignType, AptosSignRequest, AptosSignature } from '@keystonehq/bc-ur-registry-aptos'
import { type AptosSignature as AptosSignatureType } from '../types/signature'
import { parsePath, toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type AptosSignRequestProps } from '../types/props'

export class KeystoneAptosSDK {
  static SignType = SignType

  parseSignature (ur: UR): AptosSignatureType {
    if (ur.type !== URType.AptosSignature) {
      throw new Error('type not match')
    }
    const sig = AptosSignature.fromCBOR(ur.cbor)
    return {
      requestId: uuidStringify(sig.getRequestId()),
      signature: toHex(sig.getSignature()),
      authenticationPublicKey: toHex(sig.getAuthenticationPublicKey())
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    signType,
    accounts,
    origin
  }: AptosSignRequestProps): UR {
    const authenticationKeyDerivationPaths: CryptoKeypath[] = []
    const keys: Buffer[] = []
    accounts.forEach(account => {
      authenticationKeyDerivationPaths.push(
        new CryptoKeypath(parsePath(account.path).map(e => new PathComponent(e)), toBuffer(account.xfp))
      )
      account.key !== undefined && keys.push(toBuffer(account.key))
    })
    if (keys.length > 0 && keys.length !== authenticationKeyDerivationPaths.length) {
      throw new Error('account and path count must match')
    }
    return new AptosSignRequest({
      requestId: uuidParse(requestId),
      signData: toBuffer(signData),
      signType,
      authenticationKeyDerivationPaths,
      accounts: keys,
      origin
    }).toUR()
  }
}

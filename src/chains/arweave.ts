import { type Signature } from '../types/signature'
import { toBuffer, toHex, uuidParse, uuidStringify } from '../utils'
import { URType, type UR } from '../types/ur'
import { type ArweaveSignRequestProps } from '../types/props'
import { type ArweaveAccount } from '../types/account'
import { ArweaveCryptoAccount, ArweaveSignRequest, ArweaveSignature, SaltLen, SignType } from '@keystonehq/bc-ur-registry-arweave'

export class KeystoneArweaveSDK {
  static SignType = SignType
  static SaltLen = SaltLen

  parseAccount (ur: UR): ArweaveAccount {
    if (ur.type !== URType.ArweaveCryptoAccount) {
      throw new Error('type not match')
    }
    const account = ArweaveCryptoAccount.fromCBOR(ur.cbor)
    return {
      masterFingerprint: toHex(account.getMasterFingerprint()),
      keyData: toHex(account.getKeyData()),
      device: account.getDevice()
    }
  }

  parseSignature (ur: UR): Signature {
    if (ur.type !== URType.ArweaveSignature) {
      throw new Error('type not match')
    }
    const sig = ArweaveSignature.fromCBOR(ur.cbor)
    const requestId = sig.getRequestId()
    return {
      requestId: uuidStringify(requestId),
      signature: toHex(sig.getSignature())
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    signType,
    saltLen,
    masterFingerprint,
    account,
    origin
  }: ArweaveSignRequestProps): UR {
    return new ArweaveSignRequest({
      requestId: uuidParse(requestId),
      signData: toBuffer(signData),
      signType,
      saltLen,
      masterFingerprint: toBuffer(masterFingerprint),
      account: account !== undefined ? toBuffer(account) : undefined,
      origin
    }).toUR()
  }
}

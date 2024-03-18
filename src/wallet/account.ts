import { type AccountDescriptor, type UR, URType, type Account } from '../types'
import { CryptoAccount, type CryptoHDKey, RegistryTypes } from '@keystonehq/bc-ur-registry'
import { getCoinSymbol, toHex } from '../utils'
import { generateExtraData } from './accountHelper'

export const parseAccount = (ur: UR): AccountDescriptor => {
  if (ur.type !== URType.CryptoAccount) {
    throw new Error('type not match')
  }
  const account = CryptoAccount.fromCBOR(ur.cbor)
  const masterFingerprint = toHex(account.getMasterFingerprint())
  const keys: Account[] = []
  account.getOutputDescriptors().forEach(desc => {
    if (desc.getRegistryType() !== RegistryTypes.CRYPTO_HDKEY) {
      const key = desc.getCryptoKey() as CryptoHDKey
      const chainCode = toHex(key.getChainCode())
      const parentFingerprint = toHex(key.getParentFingerprint())
      const origin = key.getOrigin()
      if (origin === undefined) {
        throw new Error('account is invalid')
      }
      let extendedPublicKey
      if (chainCode.length !== 0 && parentFingerprint.length !== 0) {
        extendedPublicKey = key.getBip32Key()
      }

      const coinType = origin.getComponents()[1].getIndex()
      keys.push({
        chain: getCoinSymbol(coinType),
        path: `m/${origin.getPath()}`,
        publicKey: toHex(key.getKey()),
        name: key.getName(),
        chainCode,
        extendedPublicKey,
        note: key.getNote(),
        extra: generateExtraData(coinType)
      })
    }
  })
  return {
    masterFingerprint,
    keys
  }
}

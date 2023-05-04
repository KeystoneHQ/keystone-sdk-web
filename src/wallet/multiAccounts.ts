import { MultiAccounts, UR, URType } from '../types'
import { CryptoMultiAccounts } from '@keystonehq/bc-ur-registry'
import { getCoinSymbol, toHex } from '../utils'
import { Account } from './account'

export const parseMultiAccounts = (ur: UR): MultiAccounts => {
  if (ur.type !== URType.CryptoMultiAccounts) {
    throw new Error('type not match')
  }
  const accounts = CryptoMultiAccounts.fromCBOR(ur.cbor)
  return {
    device: accounts.getDevice(),
    masterFingerprint: toHex(accounts.getMasterFingerprint()),
    keys: accounts.getKeys().map(key => {
      const chainCode = toHex(key.getChainCode())
      const parentFingerprint = toHex(key.getParentFingerprint())
      const origin = key.getOrigin()
      if (origin === undefined) {
        throw new Error('multi accounts is invalid')
      }
      let extendedPublicKey
      if (chainCode.length !== 0 && parentFingerprint.length !== 0) {
        extendedPublicKey = key.getBip32Key()
      }
      return new Account({
        chain: getCoinSymbol(origin.getComponents()[1].getIndex()),
        path: `m/${origin.getPath()}`,
        publicKey: toHex(key.getKey()),
        name: key.getName(),
        chainCode,
        extendedPublicKey
      })
    })
  }
}

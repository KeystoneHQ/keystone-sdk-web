import { type Account, type UR, URType } from '../types'
import { CryptoHDKey } from '@keystonehq/bc-ur-registry'
import { getCoinSymbol, toHex } from '../utils'
import { generateExtraData } from './accountHelper'

export const parseHDKey = (ur: UR): Account => {
  if (ur.type !== URType.CryptoHDKey) {
    throw new Error('type not match')
  }
  const hdKey = CryptoHDKey.fromCBOR(ur.cbor)
  const chainCode = toHex(hdKey.getChainCode())
  const parentFingerprint = toHex(hdKey.getParentFingerprint())
  const origin = hdKey.getOrigin()
  const xfp = hdKey.getOrigin().getSourceFingerprint()?.toString('hex')
  if (xfp === undefined) {
    throw new Error('HDKey is invalid')
  }
  let extendedPublicKey
  if (chainCode.length !== 0 && parentFingerprint.length !== 0) {
    extendedPublicKey = hdKey.getBip32Key()
  }

  const coinType = origin.getComponents()[1].getIndex()
  return {
    chain: getCoinSymbol(coinType),
    path: `m/${origin.getPath()}`,
    publicKey: toHex(hdKey.getKey()),
    name: hdKey.getName(),
    xfp: origin.getSourceFingerprint().toString('hex'),
    chainCode,
    extendedPublicKey,
    extra: generateExtraData(coinType)
  }
}

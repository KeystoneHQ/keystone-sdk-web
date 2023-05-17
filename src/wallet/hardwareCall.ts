import {
  Curve,
  DerivationAlgorithm,
  KeyDerivation,
  QRHardwareCall,
  QRHardwareCallName
} from '@keystonehq/bc-ur-registry'
import { type UR } from '@ngraveio/bc-ur'
import { pathToKeypath } from '../utils'

export { Curve, DerivationAlgorithm }

export interface KeyDerivationCallArgs {
  paths: string[]
  curve?: Curve
  algo?: DerivationAlgorithm
  origin?: string
}

export const generateKeyDerivationCall = ({
  paths,
  curve = Curve.secp256k1,
  algo = DerivationAlgorithm.slip10,
  origin
}: KeyDerivationCallArgs): UR => {
  if (curve === Curve.secp256k1 && algo === DerivationAlgorithm.bip32ed25519) {
    throw new Error('the combination of the given curve and algo not supported')
  }

  const keypaths = paths.map(path => pathToKeypath(path))
  const keyDerivation = new KeyDerivation(keypaths, curve, algo, origin)
  const hardwareCall = new QRHardwareCall(QRHardwareCallName.KeyDerivation, keyDerivation)
  return hardwareCall.toUR()
}

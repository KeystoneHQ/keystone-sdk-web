import { KeyDerivation, QRHardwareCall, QRHardwareCallName, Curve, DerivationAlgorithm } from '@keystonehq/bc-ur-registry'
import { type UR } from '@ngraveio/bc-ur'
import { pathToKeypath } from '../utils'

export { Curve, DerivationAlgorithm }

export const generateKeyDerivationCall = (
  paths: string[],
  curve = Curve.secp256k1,
  algo = DerivationAlgorithm.slip10,
  origin?: string
): UR => {
  const keypaths = paths.map(path => pathToKeypath(path))
  const keyDerivation = new KeyDerivation(keypaths, curve, algo, origin)
  const hardwareCall = new QRHardwareCall(QRHardwareCallName.KeyDerivation, keyDerivation)
  return hardwareCall.toUR()
}

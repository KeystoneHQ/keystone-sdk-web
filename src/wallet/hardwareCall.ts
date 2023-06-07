import {
  Curve,
  DerivationAlgorithm,
  KeyDerivation,
  QRHardwareCall,
  KeyDerivationSchema, QRHardwareCallType
} from '@keystonehq/bc-ur-registry'
import { type UR } from '@ngraveio/bc-ur'
import { pathToKeypath } from '../utils'

export { Curve, DerivationAlgorithm }

export interface KeySchema {
  path: string
  curve?: Curve
  algo?: DerivationAlgorithm
}

export interface KeyDerivationCallArgs {
  schemas: KeySchema[]
  origin?: string
}

export const generateKeyDerivationCall = ({
  schemas,
  origin
}: KeyDerivationCallArgs): UR => {
  const keyDerivationSchemas = schemas.map(({ path, curve = Curve.secp256k1, algo = DerivationAlgorithm.slip10 }) => {
    if (curve === Curve.secp256k1 && algo === DerivationAlgorithm.bip32ed25519) {
      throw new Error('the combination of the given curve and algo not supported')
    }
    return new KeyDerivationSchema(pathToKeypath(path), curve, algo)
  })
  const keyDerivation = new KeyDerivation(keyDerivationSchemas)
  const hardwareCall = new QRHardwareCall(QRHardwareCallType.KeyDerivation, keyDerivation, origin)
  return hardwareCall.toUR()
}

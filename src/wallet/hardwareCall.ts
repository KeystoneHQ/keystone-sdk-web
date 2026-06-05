import {
  Curve,
  DeriveContextHashCall,
  DerivationAlgorithm,
  KeyDerivation,
  QRHardwareCall,
  KeyDerivationSchema,
  QRHardwareCallType,
  QRHardwareCallVersion,
} from '@keystonehq/bc-ur-registry'
import { URDecoder, type UR } from '@ngraveio/bc-ur'
import { pathToKeypath } from '../utils'

export {
  Curve,
  DeriveContextHashCall,
  DerivationAlgorithm,
  QRHardwareCall,
  QRHardwareCallType,
  QRHardwareCallVersion,
}

export interface KeySchema {
	path: string
	curve?: Curve
	algo?: DerivationAlgorithm
	chainType?: String
}

export interface KeyDerivationCallArgs {
	schemas: KeySchema[]
	origin?: string
	version?: QRHardwareCallVersion
}

export interface DeriveContextHashCallArgs {
  appName: string
  network: string
  keyPath: string
  context: string
  origin?: string
  version?: QRHardwareCallVersion
}

export const parseURBytes = (ur: UR | string): Buffer => {
  const bytesUR = typeof ur === 'string' ? URDecoder.decode(ur) : ur
  if (bytesUR.type !== 'bytes') {
    throw new Error('ur bytes is invalid')
  }
  return bytesUR.decodeCBOR()
}

export const generateKeyDerivationCall = ({
  schemas,
  origin,
  version,
}: KeyDerivationCallArgs): UR => {
  const keyDerivationSchemas = schemas.map(
    ({
      path,
      curve = Curve.secp256k1,
      algo = DerivationAlgorithm.slip10,
      chainType,
    }) => {
      if (
        curve === Curve.secp256k1 &&
				algo === DerivationAlgorithm.bip32ed25519
      ) {
        throw new Error(
          'the combination of the given curve and algo not supported'
        )
      }
      return new KeyDerivationSchema(
        pathToKeypath(path),
        curve,
        algo,
        chainType
      )
    }
  )
  const keyDerivation = new KeyDerivation(keyDerivationSchemas)
  const hardwareCall = new QRHardwareCall(
    QRHardwareCallType.KeyDerivation,
    keyDerivation,
    origin,
    version ? QRHardwareCallVersion.V1 : QRHardwareCallVersion.V0
  )
  return hardwareCall.toUR()
}

export const generateDeriveContextHashCall = ({
  appName,
  network,
  keyPath,
  context,
  origin,
  version,
}: DeriveContextHashCallArgs): UR => {
  const deriveContextHashCall = new DeriveContextHashCall(
    appName,
    network,
    pathToKeypath(keyPath),
    context
  )
  const hardwareCall = new QRHardwareCall(
    QRHardwareCallType.DeriveContextHash,
    deriveContextHashCall,
    origin,
    version ?? QRHardwareCallVersion.V1
  )
  return hardwareCall.toUR()
}

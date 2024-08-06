import {
	Curve,
	DerivationAlgorithm,
	KeyDerivation,
	QRHardwareCall,
	KeyDerivationSchema,
	QRHardwareCallType,
	QRHardwareCallVersion,
} from '@keystonehq/bc-ur-registry'
import { type UR } from '@ngraveio/bc-ur'
import { pathToKeypath } from '../utils'

export { Curve, DerivationAlgorithm, QRHardwareCallVersion }

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

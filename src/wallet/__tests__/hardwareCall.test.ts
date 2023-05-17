import { generateKeyDerivationCall } from '../hardwareCall'
import { Curve, DerivationAlgorithm } from '@keystonehq/bc-ur-registry'

describe('hardwareCall', () => {
  describe('generateKeyDerivationCall', () => {
    it('should generate key derivation call given HD paths', () => {
      const paths = ["m/44'/0'/0'", "m/49'/0'/0'", "m/84'/0'/0'", "m/44'/60'/0'"]

      const callUR = generateKeyDerivationCall({ paths })

      expect(callUR.type).toBe('qr-hardware-call')
      expect(callUR.cbor.toString('hex')).toBe('a2016e6b65792d64657269766174696f6e02d90515a30184d90130a10186182cf500f500f5d90130a101861831f500f500f5d90130a101861854f500f500f5d90130a10186182cf5183cf500f50269736563703235366b310366736c69703130')
    })

    it('should generate key derivation call given different curve and algo', () => {
      const paths = ["m/44'/0'/0'", "m/49'/0'/0'", "m/84'/0'/0'", "m/44'/60'/0'"]

      const callUR = generateKeyDerivationCall({ paths, curve: Curve.ed25519, origin: 'dummy wallet name' })

      expect(callUR.type).toBe('qr-hardware-call')
      expect(callUR.cbor.toString('hex')).toBe('a2016e6b65792d64657269766174696f6e02d90515a40184d90130a10186182cf500f500f5d90130a101861831f500f500f5d90130a101861854f500f500f5d90130a10186182cf5183cf500f50267656432353531390366736c69703130047164756d6d792077616c6c6574206e616d65')
    })

    it('should throw error given curve is secp256k1 and algo is bip32ed25519', () => {
      const paths = ["m/44'/0'/0'", "m/49'/0'/0'", "m/84'/0'/0'", "m/44'/60'/0'"]
      const params = { paths, curve: Curve.secp256k1, algo: DerivationAlgorithm.bip32ed25519 }

      expect(() => generateKeyDerivationCall(params)).toThrow(new Error('the combination of the given curve and algo not supported'))
    })
  })
})

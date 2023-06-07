import { generateKeyDerivationCall, Curve, DerivationAlgorithm } from '../hardwareCall'

describe('hardwareCall', () => {
  describe('generateKeyDerivationCall', () => {
    it('should generate key derivation call given HD paths', () => {
      const schemas = [
        { path: "m/44'/0'/0'"},
        { path: "m/49'/0'/0'"},
        { path: "m/84'/0'/0'"},
        { path: "m/60'/0'/0'"},
      ]

      const callUR = generateKeyDerivationCall({ schemas })

      expect(callUR.type).toBe('qr-hardware-call')
      expect(callUR.cbor.toString('hex')).toBe('a2010002d90515a10184d90516a301d90130a10186182cf500f500f502000300d90516a301d90130a101861831f500f500f502000300d90516a301d90130a101861854f500f500f502000300d90516a301d90130a10186183cf500f500f502000300')
    })

    it('should generate key derivation call given different curve and algo', () => {
      const schemas = [
        { path: "m/44'/0'/0'"},
        { path: "m/44'/501'/0'/0'/0'", curve: Curve.ed25519 }
      ]

      const callUR = generateKeyDerivationCall({schemas})

      expect(callUR.type).toBe('qr-hardware-call')
      expect(callUR.cbor.toString('hex')).toBe('a2010002d90515a10182d90516a301d90130a10186182cf500f500f502000300d90516a301d90130a1018a182cf51901f5f500f500f500f502010300')
    })

    it('should throw error given curve is secp256k1 and algo is bip32ed25519', () => {
      const schemas = [
        { path: "m/44'/0'/0'", curve: Curve.secp256k1, algo: DerivationAlgorithm.bip32ed25519 }
      ]

      expect(() => generateKeyDerivationCall({ schemas })).toThrow(new Error('the combination of the given curve and algo not supported'))
    })
  })
})

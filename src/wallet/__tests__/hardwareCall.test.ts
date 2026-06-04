import {
  DeriveContextHashCall,
  generateDeriveContextHashCall,
  generateKeyDerivationCall,
  Curve,
  DerivationAlgorithm,
  QRHardwareCall,
  QRHardwareCallType,
  QRHardwareCallVersion,
} from '../hardwareCall'

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

  describe('generateDeriveContextHashCall', () => {
    it('should generate derive context hash call', () => {
      const callUR = generateDeriveContextHashCall({
        appName: 'babylon-btc-vault',
        network: 'bitcoin-mainnet',
        keyPath: "m/44'/0'/0'/0/0",
        context: 'deadbeef',
        origin: 'babylon',
        version: QRHardwareCallVersion.V1,
      })

      expect(callUR.type).toBe('qr-hardware-call')
      expect(callUR.cbor.toString('hex')).toBe('a4010102d90517a40171626162796c6f6e2d6274632d7661756c74026f626974636f696e2d6d61696e6e657403d90130a1018a182cf500f500f500f400f4046864656164626565660367626162796c6f6e0401')

      const hardwareCall = QRHardwareCall.fromCBOR(callUR.cbor)
      expect(hardwareCall.getType()).toBe(QRHardwareCallType.DeriveContextHash)
      expect(hardwareCall.getOrigin()).toBe('babylon')
      expect(hardwareCall.getVersion()).toBe(QRHardwareCallVersion.V1)

      const params = hardwareCall.getParams()
      expect(params).toBeInstanceOf(DeriveContextHashCall)
      if (params instanceof DeriveContextHashCall) {
        expect(params.getAppName()).toBe('babylon-btc-vault')
        expect(params.getNetwork()).toBe('bitcoin-mainnet')
        expect(params.getContext()).toBe('deadbeef')
      }
    })
  })
})

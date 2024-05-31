import KeystoneSDK from '../../src'
import { KeystoneStellarSDK } from '../chains'
import { type StellarSignature } from '../types'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../utils'

test('parseSignature', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'stellar-signature'
  const cborHex = 'a201d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d025840d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7'
  const expectResult: StellarSignature = {
    signature: 'd4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7',
    requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  }

  expect(keystoneSDK.stellar.parseSignature(new UR(toBuffer(cborHex), type))).toStrictEqual(expectResult)
})

test('generateSignRequest', () => {
  const keystoneSDK = new KeystoneSDK()

  const requestId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  const signData = '01000103c8d842a2f17fd7aab608ce2ea535a6e958dffa20caf669b347b911c4171965530f957620b228bae2b94c82ddd4c093983a67365555b737ec7ddc1117e61c72e0000000000000000000000000000000000000000000000000000000000000000010295cc2f1f39f3604718496ea00676d6a72ec66ad09d926e3ece34f565f18d201020200010c0200000000e1f50500000000'
  const path = "m/44'/501'/0'/0'"
  const xfp = '12121212'
  const address = ''
  const dataType = KeystoneStellarSDK.DataType.Transaction

  const type = 'stellar-sign-request'
  const cborHex = 'A501D825509B1DEB4D3B7D4BAD9BDD2B0D7B3DCB6D02589601000103C8D842A2F17FD7AAB608CE2EA535A6E958DFFA20CAF669B347B911C4171965530F957620B228BAE2B94C82DDD4C093983A67365555B737EC7DDC1117E61C72E0000000000000000000000000000000000000000000000000000000000000000010295CC2F1F39F3604718496EA00676D6A72EC66AD09D926E3ECE34F565F18D201020200010C0200000000E1F5050000000003D90130A20188182CF51901F5F500F500F5021A1212121204400601'
  const expectResult = new UR(toBuffer(cborHex), type)

  expect(keystoneSDK.stellar.generateSignRequest({ requestId, signData, dataType, path, xfp, address })).toStrictEqual(expectResult)
})

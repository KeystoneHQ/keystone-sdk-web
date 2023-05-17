import { KeystoneSDK } from '../sdk'
import { KeystoneAptosSDK } from '../chains'
import { type AptosSignature } from '../types'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../utils'

test('parseSignature', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'aptos-signature'
  const cborHex = 'a301d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d02584047e7b510784406dfa14d9fd13c3834128b49c56ddfc28edb02c5047219779adeed12017e2f9f116e83762e86f805c7311ea88fb403ff21900e069142b1fb310e0358208e53e7b10656816de70824e3016fc1a277e77825e12825dc4f239f418ab2e04e'
  const expectResult: AptosSignature = {
    signature: '47e7b510784406dfa14d9fd13c3834128b49c56ddfc28edb02c5047219779adeed12017e2f9f116e83762e86f805c7311ea88fb403ff21900e069142b1fb310e',
    requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    authenticationPublicKey: '8e53e7b10656816de70824e3016fc1a277e77825e12825dc4f239f418ab2e04e'
  }

  expect(keystoneSDK.aptos.parseSignature(new UR(toBuffer(cborHex), type))).toStrictEqual(expectResult)
})

test('generateSignRequest', () => {
  const keystoneSDK = new KeystoneSDK()

  const requestId = '7AFD5E09-9267-43FB-A02E-08C4A09417EC'
  const signData = '8e53e7b10656816de70824e3016fc1a277e77825e12825dc4f239f418ab2e04e'
  const accounts = [
    {
      path: "m/44'/637'/0'/0'/0'",
      xfp: '78230804',
      key: 'aa7420c68c16645775ecf69a5e2fdaa4f89d3293aee0dd280e2d97ad7b879650'
    },
    {
      path: "m/44'/637'/0'/0'/1'",
      xfp: '78230805',
      key: '97f95acfb04f84d228dce9bda4ad7e2a5cb324d5efdd6a7f0b959e755ebb3a70'
    }
  ]
  const origin = 'Petra'
  const signType = KeystoneAptosSDK.SignType.SingleSign

  const type = 'aptos-sign-request'
  const cborHex = 'a601d825507afd5e09926743fba02e08c4a09417ec0258208e53e7b10656816de70824e3016fc1a277e77825e12825dc4f239f418ab2e04e0382d90130a2018a182cf519027df500f500f500f5021a78230804d90130a2018a182cf519027df500f500f501f5021a7823080504825820aa7420c68c16645775ecf69a5e2fdaa4f89d3293aee0dd280e2d97ad7b879650582097f95acfb04f84d228dce9bda4ad7e2a5cb324d5efdd6a7f0b959e755ebb3a70056550657472610601'
  const expectResult = new UR(toBuffer(cborHex), type)

  expect(keystoneSDK.aptos.generateSignRequest({ requestId, signData, signType, accounts, origin })).toStrictEqual(expectResult)
})

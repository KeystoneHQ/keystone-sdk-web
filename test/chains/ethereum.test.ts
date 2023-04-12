import KeystoneSDK from '../../src'
import { type EthSignature } from '../../src/types/signature'

test('parseETHSignature', () => {
  const keystoneSDK = new KeystoneSDK()

  const cborHex = 'a301d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d025841d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f71303686b657973746f6e65'
  const expectResult: EthSignature = {
    signature: 'd4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f713',
    requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    origin: 'keystone'
  }

  expect(keystoneSDK.eth.parseETHSignature(cborHex)).toStrictEqual(expectResult)
})

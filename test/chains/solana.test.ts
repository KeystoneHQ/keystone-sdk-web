import KeystoneSDK from '../../src'
import { KeystoneSolanaSDK } from '../../src/chains/solana'
import { type SolSignature } from '../../src/types/signature'

test('parseSignature', () => {
  const keystoneSDK = new KeystoneSDK()

  const cborHex = 'a201d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d025840d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7'
  const expectResult: SolSignature = {
    signature: 'd4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f7',
    requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  }

  expect(keystoneSDK.sol.parseSignature(cborHex)).toStrictEqual(expectResult)
})

test('generateSignRequest', () => {
  const keystoneSDK = new KeystoneSDK()

  const requestId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  const signData = '01000103c8d842a2f17fd7aab608ce2ea535a6e958dffa20caf669b347b911c4171965530f957620b228bae2b94c82ddd4c093983a67365555b737ec7ddc1117e61c72e0000000000000000000000000000000000000000000000000000000000000000010295cc2f1f39f3604718496ea00676d6a72ec66ad09d926e3ece34f565f18d201020200010c0200000000e1f50500000000'
  const path = "m/44'/501'/0'/0'"
  const xfp = '12121212'
  const address = ''
  const origin = 'solflare'
  const signType = KeystoneSolanaSDK.SignType.Transaction

  const expectResult = {
    type: 'sol-sign-request',
    cbor: 'a601d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d02589601000103c8d842a2f17fd7aab608ce2ea535a6e958dffa20caf669b347b911c4171965530f957620b228bae2b94c82ddd4c093983a67365555b737ec7ddc1117e61c72e0000000000000000000000000000000000000000000000000000000000000000010295cc2f1f39f3604718496ea00676d6a72ec66ad09d926e3ece34f565f18d201020200010c0200000000e1f5050000000003d90130a20188182cf51901f5f500f500f5021a1212121204400568736f6c666c6172650601'
  }

  expect(keystoneSDK.sol.generateSignRequest(requestId, signData, signType, path, xfp, address, origin)).toStrictEqual(expectResult)
})

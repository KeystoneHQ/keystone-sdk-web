import KeystoneSDK from '../../src'
import { KeystoneEthereumSDK } from '../../src/chains/ethereum'
import { type EthSignature } from '../../src/types/signature'

test('parseSignature', () => {
  const keystoneSDK = new KeystoneSDK()

  const cborHex = 'a301d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d025841d4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f71303686b657973746f6e65'
  const expectResult: EthSignature = {
    signature: 'd4f0a7bcd95bba1fbb1051885054730e3f47064288575aacc102fbbf6a9a14daa066991e360d3e3406c20c00a40973eff37c7d641e5b351ec4a99bfe86f335f713',
    requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    origin: 'keystone'
  }

  expect(keystoneSDK.eth.parseSignature(cborHex)).toStrictEqual(expectResult)
})

test('generateSignRequest', () => {
  const keystoneSDK = new KeystoneSDK()

  const requestId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  const signData = 'f849808609184e72a00082271094000000000000000000000000000000000000000080a47f7465737432000000000000000000000000000000000000000000000000000000600057808080'
  const path = "m/44'/1'/1'/0/1"
  const xfp = '12345678'
  const chainId = 1
  const address = ''
  const origin = 'metamask'
  const dataType = KeystoneEthereumSDK.DataType.transaction

  const expectResult = {
    type: 'eth-sign-request',
    cbor: 'a701d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d02584bf849808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000578080800301040105d90130a2018a182cf501f501f500f401f4021a12345678064007686d6574616d61736b'
  }

  expect(keystoneSDK.eth.generateSignRequest(requestId, signData, dataType, path, xfp, chainId, address, origin)).toStrictEqual(expectResult)
})

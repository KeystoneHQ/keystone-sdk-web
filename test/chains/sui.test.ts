import KeystoneSDK from '../../src'
import { KeystoneSuiSDK } from '../../src/chains/sui'
import { type SuiSignature } from '../../src/types/signature'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../../src/utils'

test('parseSignature', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'sui-signature'
  const cborHex = 'A301D825509B1DEB4D3B7D4BAD9BDD2B0D7B3DCB6D025840B93921DB17F2F1D50BDA37B510F543151DF222E80946FEFBACFADFB2D4A79FDA4FACF0AE5B41D71EA3A7EBEA6AA88DE9577A788AEAB195B99B6A633C20E055030358207BAC671050FCBA0DD54F3930601C42AD36CC11BC0589ED8D3CEF3EFF1C49EF6E'
  const expectResult: SuiSignature = {
    signature: 'b93921db17f2f1d50bda37b510f543151df222e80946fefbacfadfb2d4a79fda4facf0ae5b41d71ea3a7ebea6aa88de9577a788aeab195b99b6a633c20e05503',
    requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    publicKey: '7bac671050fcba0dd54f3930601c42ad36cc11bc0589ed8d3cef3eff1c49ef6e'
  }

  expect(keystoneSDK.sui.parseSignature(new UR(toBuffer(cborHex), type))).toStrictEqual(expectResult)
})

test('generateSignRequest', () => {
  const keystoneSDK = new KeystoneSDK()

  const requestId = '7AFD5E09-9267-43FB-A02E-08C4A09417EC'
  const signData = '000002002086ac6179ca6ad9a7b1ccb47202d06ae09a131e66309944922af9c73d3c203b66000810270000000000000202000101010001010200000100000e4d9313fb5b3f166bb6f2aea587edbe21fb1c094472ccd002f34b9d0633c71901d833a8eabc697a0b2e23740aca7be9b0b9e1560a39d2f390cf2534e94429f91ced0c00000000000020190ca0d64215ac63f50dbffa47563404182304e0c10ea30b5e4d671b7173a34c0e4d9313fb5b3f166bb6f2aea587edbe21fb1c094472ccd002f34b9d0633c719e803000000000000640000000000000000'
  const accounts = [
    {
      path: "m/44'/784'/0'/0'/0'",
      xfp: '78230804',
      address: '0e4d9313fb5b3f166bb6f2aea587edbe21fb1c094472ccd002f34b9d0633c719'
    },
    {
      path: "m/44'/784'/0'/0'/1'",
      xfp: '78230805',
      address: '68a42711caf03f82e5e45452eb4f1223675aeed4a80b4465892495c48648e3c7'
    }
  ]
  const origin = 'Sui Wallet'
  const signType = KeystoneSuiSDK.SignType.Single

  const type = 'sui-sign-request'
  const cborHex = 'a601d825507afd5e09926743fba02e08c4a09417ec0258d9000002002086ac6179ca6ad9a7b1ccb47202d06ae09a131e66309944922af9c73d3c203b66000810270000000000000202000101010001010200000100000e4d9313fb5b3f166bb6f2aea587edbe21fb1c094472ccd002f34b9d0633c71901d833a8eabc697a0b2e23740aca7be9b0b9e1560a39d2f390cf2534e94429f91ced0c00000000000020190ca0d64215ac63f50dbffa47563404182304e0c10ea30b5e4d671b7173a34c0e4d9313fb5b3f166bb6f2aea587edbe21fb1c094472ccd002f34b9d0633c719e80300000000000064000000000000000003010482d90130a2018a182cf5190310f500f500f500f5021a78230804d90130a2018a182cf5190310f500f500f501f5021a78230805058258200e4d9313fb5b3f166bb6f2aea587edbe21fb1c094472ccd002f34b9d0633c719582068a42711caf03f82e5e45452eb4f1223675aeed4a80b4465892495c48648e3c7066a5375692057616c6c6574'
  const expectResult = new UR(toBuffer(cborHex), type)

  expect(keystoneSDK.sui.generateSignRequest({ requestId, signData, signType, accounts, origin })).toStrictEqual(expectResult)
})

import { KeystoneSDK } from '../../src/sdk'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../../src/utils'

test('generateSignRequest', () => {
  jest.useFakeTimers({
    now: 1681962980246
  })

  const keystoneSDK = new KeystoneSDK()

  const requestId = 'cc946be2-8e4c-42be-a321-56a53a8cf516'
  const xfp = '707EED6C'
  const origin = 'BCH Wallet'
  const inputs = [{
    hash: 'a59bcbaaae11ba5938434e2d4348243e5e392551156c4a3e88e7bdc0b2a8f663',
    index: 1,
    pubkey: '025ad49879cc8f1f91a210c6a2762fe4904ef0d4f17fd124b11b86135e4cb9143d',
    value: BigInt('18519750'),
    ownerKeyPath: "m/44'/145'/0'/0/0"
  }]
  const outputs = [
    {
      address: 'bitcoincash:qzrxqxsx0lfzyk4ht60a5hwwtr2xjvtxmu0qhkusnx',
      value: BigInt('10000'),
      isChange: false,
      changeAddressPath: ''
    },
    {
      address: 'bitcoincash:qpgw8p85ysnjutpsk6u490ytydmgdlmc6vzxu680su',
      value: BigInt('18507500'),
      isChange: true,
      changeAddressPath: "M/44'/145'/0'/0/0"
    }
  ]
  const fee = '2250'

  const type = 'keystone-sign-request'
  const cborHex = 'a20159016c1f8b08000000000000035d8e3b4a0351188549b418d298a40a5621089140c87dfcf7ce1d6d243160a36876709f796792cc4c3249e512acacc5c6ca05e8022c04b721283696764e1d381c38c5c7f9bc7cf9e066d9098dad5e2fc338d4e1e4f076cfcb973d1ff9ddee39efd47ef385bd76e7a27ca475005c59d21416741388b24d49096e322e1995423b8679f5fee9e5f30f1d7bbdd7bcf75e2a3eeed71e728533c902a59594d262acb2410550b0c4642d0850cb2c0d08631833ae41522b84f595d14811291ce7b498abbc3d7f7bb536224c1a08841f682d1c7601960423cd25f13971160204d621030efbce60022afb131c539629ab0003358dd2b405506f6160f516cad2428dd30257c35887c39996d1e064b15da68b344ad1c46d376318c41c493658afe3254947ab389d2668311827d12c2dde5d357a3bf0bcbf1673c136d16c94c4f368cc93cc6a136fccb46f2653cd57db34e1024549f1e7e3cbabe46aa5cb5da17f6c89c3b996010000026a4243482057616c6c6574'
  const expectResult = new UR(toBuffer(cborHex), type)
  const result = keystoneSDK.bch.generateSignRequest({
    requestId,
    signData: {
      inputs,
      outputs,
      fee
    },
    xfp,
    origin
  })

  expect(result).toStrictEqual(expectResult)
})

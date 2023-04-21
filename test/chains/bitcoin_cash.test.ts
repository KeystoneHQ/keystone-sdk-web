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
  const cborHex = 'a2015901671f8b08000000000000035d8ebb4a03411885c9da2c694c5205ab10844820642effccce6a2389011b45f30673cd3d9b6477934d9ec2cadaceca5a7c010bc1d71014b1b710dc3a7038708a8ff3f95ee5f076d58d8cadddaca224d2d1f4e8cff3bd8a1fa0a0d7bbe0ddfa8f573ce8742f2bc75a87c095252d6141b78028db9294e016e3925129b46398d7ee1f5f3e7ed189df7ff6fcb772fda1503c972c545a49292dc62a1f5400054b4cde8200b5ccd290308631e31a24b542d840198d1491c2714e4b85eaebd3975fef20c2a4815004a1d6c26117624930d25c928013672144601d32e070e00c26a0f23fc13165b9af0a3150d32ccfda008d3606d668a33c6dd43c2b72354a74349a6b190f4f97bb55b6cce20c4ddd6e3b8161c29164c3cd2659916cbc4eb2598a96c3491acfb3d2dd75b3bf072f061bb1106c1bcfc769b288273ccdadb6c9d6cc06663ad37cbdcb522e509c96bedf3ffd6aa15ebeda17fa07601f570f93010000026a4243482057616c6c6574'
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

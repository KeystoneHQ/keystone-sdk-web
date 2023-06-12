import { KeystoneSDK } from '../sdk'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../utils'

test('generateSignRequest', () => {
  jest.useFakeTimers({
    now: 1681962980246
  })

  const keystoneSDK = new KeystoneSDK()

  const requestId = 'cc946be2-8e4c-42be-a321-56a53a8cf516'
  const xfp = 'F23F9FD2'
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
      address: 'qzrxqxsx0lfzyk4ht60a5hwwtr2xjvtxmu0qhkusnx',
      value: BigInt('10000'),
      isChange: false,
      changeAddressPath: ''
    },
    {
      address: 'qpgw8p85ysnjutpsk6u490ytydmgdlmc6vzxu680su',
      value: BigInt('18507500'),
      isChange: true,
      changeAddressPath: "M/44'/145'/0'/0/0"
    }
  ]
  const fee = '2250'

  const type = 'keystone-sign-request'
  const cborHex = 'a2015901601f8b08000000000000035d8e3b4a03511885c96831a4314915ac4210228130f7f1df9b7b3b4964b051d41ddc6742dec9cc2493acc2ca5ad258b900376021b80037202a6ec0cea985c381537c7c270c6a4737abfedcbac6f56a9ececd7c72fc1984412d8c098d657c4e9aef41f9a0d7bfa89d1823816b473ac281e900d1aea328c11dc615a34a18cf306fdc3f3e7ffca2d3f0761f84afd5cafeb0f9502a9f2926b5d14a2987b12e061540c1115bb420401d735412c63066dc80a24e08d7d5d6204d94f09cd34aa9fef2f41d367b883065418aae344678ec25560423c315e972e21d4804ce230b1e77bdc50474e1131c53565cd61203b5edea3402684518582b424522d48ecaede56e952ff3244713bfdb8e619872a4d870b34957241fadd37c9aa1e5709c25b3bc7277d58e0b6031d8888560db6436cad24532e65961dfa65b3b1dd8c9d4f0f52ecfb8404956f979fb0aeba566f5f2bff80f26ae4ccb7e010000026a4243482057616c6c6574'
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

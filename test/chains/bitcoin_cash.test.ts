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

  const type = 'utxo-sign-request'
  const cborHex = 'a20159016b1f8b08000000000000035d8e3d4bc3501885695c4217db4ee2548aa0144aeec77b6f6e7491d6828b52fb0feea7d17ea46d9236edaf707276737216273707c1bf2128e2ee209859381c38c3c3797cafb17db1e825c636078b244b7432defdf57cafe18728ecf74f78aff5ed55b7babdd3c69ed6117065494758d01d20ca762425b8c3b864540aed18e6cddbfba7f71f74e00f1f3dffb5debaab548f258b9456524a8bb12a071540c11253b620402db334228c61ccb80649ad103654462345a4709cd35a65e7e5e1d36f751161d24024c2486be1b08bb02418692e49c889b31021b00e19703874061350e59fe098b2d2574518a869d72701c07e8081ed07a84c80da4755aeae329d5c4db54ce3c3f96651cc8bb44063b7598f20ce38922c5eadb20529ae975931c9d13c1ee5e9b4a8dd9cb787ffe0d9e54acc045ba7d3eb3c9ba5239e9756eb6c6d2697663cd17cb929722e509ad7bede3efc9d4aab7ef65fa8f93cf803977db8bf96010000026a4243482057616c6c6574'
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

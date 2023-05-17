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
  const cborHex = 'a20159016c1f8b08000000000000035d8ebb4a03411885c96ab1a471934aac42109440c85cfe99cc68232ac14651df60aeaeb96d92dd4d36a97c042b6bb1b1f201f4012c045f43506c2ceddc5a381c38c5c7f9c2a0be71313b4aac6b9ccf922c31c970eb662d0cea618fd09eec1d93e64f505d3b3c3aa96f1b23816b47dac2816903d1aead28c16dc615a34a18cf306fdc3d3e7ffca2ddf0f22508df6ad1c37af3be523d504c6aa395520e635d0e2a808223b66c41803ae6a8248c61ccb801459d10aeabad419a28e139a75165f3f5e92b6c1e22c2940529bad218e1b19758118c0c57a4cb89772011388f2c78dcf51613d0e59fe098b252594b0cd4b66aa30ec04e0703dbe9a0321dd4daaf727d9d99e47a6c541aef4d57b3625aa4051afad5720071c69162f16291cd48d19f67c52847d37890a7e322ba3d6b5dfe8327570b31116c998efb793649073c2fad96d9d28eaeec7064f87c55e45ca0348fbedf3fc3cd4ab376fa5fe80fcdc1dd0f96010000026a4243482057616c6c6574'
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

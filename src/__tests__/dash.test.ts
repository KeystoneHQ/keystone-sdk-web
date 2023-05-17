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
    pubkey: '03cf51a0e4f926e50177d3a662eb5cc38728828cec249ef42582e77e5503675314',
    value: BigInt('18519750'),
    ownerKeyPath: "m/44'/5'/0'/0/0"
  }]
  const outputs = [
    {
      address: 'XphpGezU3DUKHk87v2DoL4r7GhZUvCvvbm',
      value: BigInt('10000'),
      isChange: false,
      changeAddressPath: ''
    },
    {
      address: 'XfmecwGwcPBR7pXTqrn26jTjNe8a4fvcSL',
      value: BigInt('18507500'),
      isChange: true,
      changeAddressPath: "M/44'/5'/0'/0/0"
    }
  ]
  const fee = '2250'

  const type = 'keystone-sign-request'
  const cborHex = 'a2015901571f8b0800000000000003558dcd4a02511886717031b8717225ad64080c413cf39ddf8116a5830a99582a88bb738edf20968d0d31421711ad5ab668d3aa0be8065c042dbb85a0e806da65cbe0e185075e785ca7543c4d5bc90c2b8334b94e6c72b1fbeeb84ec96d036d87ed08fc8d53c84747c36e69cfda9009835057c86c9d81c1baa610d4b9d09c6a65631e88cafdd3cbc70fd977a7b78efbbae33de6fd875ce150f3d058a3b5c620305ba18a518630dbae024691230d81f320e0c2324d51299466668901ad6221a8972b6f9ebf5cbf49e85f4613647108023909a49c512d04a0e1d65225412950162db01063065c014a899c132a24a701ab15970dc6aa0d5e6d902d0d52ab16fcc96abeeae0cd9846e3e3eeb9921944498fa5b2339f8eb3569699a577d7af1d6c8ff112edbab3b683e6995c4d4657e92588c568d147a5599cd961cffb7efb74cb39bf78f23ff30bffa368266b010000026a4243482057616c6c6574'
  const expectResult = new UR(toBuffer(cborHex), type)
  const result = keystoneSDK.dash.generateSignRequest({
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

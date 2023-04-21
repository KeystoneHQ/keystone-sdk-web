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
  const cborHex = 'a2015901541f8b0800000000000003558dbf4ac3501c466970085d5a3b15a712844a21e4febf37e0a06d4a0bd6526d0ba5dbbd37bf50aa3535480abe828b93a3ab930fe02c38082e3e84a0f8026ec651387c70e083e33ab5ca49d64963688cb2f42ab5e9f9cebbe33a355722d9ed46a2e33d3be5ade870dcafed5a1b326180f80a98f51931e06b4ab0cf85e6542b9b702c1a770f4f1f3f68cf9ddf38eeebb6775f2a1f681e1a6bb4d680b129842a461990b8584518050e34249c63cc85659a8252204d6c91215a2542d06aa9fef2f8e57a6d44ff1a1a014b422280232c654cb510040cb7962a499422ca82252c848411ae0848099c232a24a798b52aab80b166c09b012a0850ab59f666ebc5ba07d7531a4d8ffa674ae6244a072c93bdc57c9a77f2dcacaab7c3d67e714c566037bd8d1db54fe57a36b9cc2e88584e9643509a25b91d0faadf6f9f6ebde4558eff677e01820057f868010000026a4243482057616c6c6574'
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

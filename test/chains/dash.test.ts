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
  const cborHex = 'a2015901571f8b0800000000000003558dbf4ac3501c4669e810ba34762a4e25089542c8cdfd1f70d036a5056ba9b685d2edde9b5f28d59a1a24051f429c1c1d5c9c7c005fa083e0e82b088a2fe0661c85c307073e38b655ab9e669d3486c6284baf53935eecbe5bb655b30512dd6ec43beed6aa94a3a371bfb6674c48b906ec49a0c6a35883a7080e3cc615234a9a8405bc71fff4f2f183f6edf9ad65bfee388f65f7a15439542cd4462ba52008742144524201c7c54a4c09302021662c08183754119012848e0dd258c98473e294eadbe72fdb6d23f29751086812620e0c0542c444718e4133638814584a2c0d184c43482866128310c018225c3012d05675e553daf459d347053e6a352bee6cbd58f7e0664aa2e971ff5c8a1c47e98066a2b7984ff34e9eeb9573376c1d14c7640566d3db9851fb4cac6793abec12f3e5643904a968929bf1c0f97efbb4eb25b77af23ff30bc7f22bb06b010000026a4243482057616c6c6574'
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

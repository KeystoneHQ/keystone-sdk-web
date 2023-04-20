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

  const type = 'utxo-sign-request'
  const cborHex = 'a2015901571f8b0800000000000003558dbf4ac3501c466970085d5a3b15a712844a21e4febf37e0a06d4a0bd6526d0ba5dbbd37bf50d49a1a24055fc1c5c9d1d5c9077072101c04171f42507c0137e3281c3e38f0c1719d5ae528eba4313446597a99daf46cebdd719d9a2b91ec7623d1f19e9df246b43feed7b6ad0d9930407c05ccfa8c18f03525d8e74273aa954d38168ddbfbc78f1fb4e3ceaf1df775d3bb2b95f7340f8d355a6bc0d8144215a30c485cac228c02071a12ce31e6c2324d41299026b6c810ad122168b5547f79f872bd36a27f0d8d80252111c0119632a65a0802865b4b95244a1165c1121642c2085704a404ce11159253cc5a9565c05833e0cd001504a8d52c7bb3d562d583ab298da607fd53257312a50396c9de623ecd3b796e96d59b616bb738264bb0ebdeda8edac772359b5c64e7449c4c4e86a0344b723b1e54bfdf3edd7ac9ab1cfecf349e46bf307784d86b010000026a4243482057616c6c6574'
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

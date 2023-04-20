import { KeystoneSDK } from '../../src/sdk'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../../src/utils'

test('generateSignRequest', () => {
  jest.useFakeTimers({
    now: 1681962980246
  })

  const keystoneSDK = new KeystoneSDK()

  const requestId = 'cc946be2-8e4c-42be-a321-56a53a8cf516'
  const xfp = 'F23F9FD2'
  const origin = 'LTC Wallet'
  const inputs = [{
    hash: 'a59bcbaaae11ba5938434e2d4348243e5e392551156c4a3e88e7bdc0b2a8f663',
    index: 1,
    utxo: {
      publicKey: '035684d200e10bc1a3e2bd7d59e58a07f2f19ef968725e18f1ed65e13396ab9466',
      value: BigInt('18519750'),
      script: ''
    },
    ownerKeyPath: "m/49'/2'/0'/0/0"
  }]
  const outputs = [
    {
      address: 'MUfnaSqZjggTrHA2raCJ9kxpP2hM6zezKw',
      value: BigInt('10000'),
      isChange: false,
      changeAddressPath: ''
    },
    {
      address: 'MK9aTexgpbRuMPqGpMERcjJ8hLJbAS31Nx',
      value: BigInt('18507500'),
      isChange: true,
      changeAddressPath: "M/49'/2'/0'/0/0"
    }
  ]
  const fee = '2250'

  const type = 'utxo-sign-request'
  const cborHex = 'a20159015d1f8b0800000000000003558ecd4a02511cc571da0c6e3457e24a86c01006efb7f7428bccb2524726b54dbb7beffc47e96b7428129fc255eb76ad7a8056ed0a8276d12304452fd0aed90687c339f083735ca754384adb4904d5304dae129b9c573e1cd729b91d423baab34bbc1727bfd61fb74b1bd62a260c105f02b33e23067c4d09f6b9d09c6a69638e45f5f6fef1f3176dba66e5b8afebc5f7ba7797cb6f6bae8c355a6bc0d864854a46199028734918050e5411ce31e6c2324d414a689ac82243b48c85a0c55ce530bf83281792450421c0c8589c81c444cd882be052a3664c62ac2056423609072c630c91c802a54a68939d17e5e7876fd72b5c3498aa3548ad81323550bd96f782e3f8528fe627a793c9383d689154b7bbea6c310bc934104b58f66e8aab417d2b037b4a8f61319999e17510cef767c1ded09e76e5b4df35ad11c58345f1e7edcb2de7bc42f07fa6fa14fe01c3b3f67e6f010000026a4c54432057616c6c6574'
  const expectResult = new UR(toBuffer(cborHex), type)
  const result = keystoneSDK.ltc.generateSignRequest({
    requestId,
    signData: {
      inputs,
      outputs,
      fee
    },
    xfp,
    origin
  })
  console.log(Buffer.from(result.cbor).toString('hex'))

  expect(result).toStrictEqual(expectResult)
})

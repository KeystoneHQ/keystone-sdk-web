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

  const type = 'keystone-sign-request'
  const cborHex = 'a2015901591f8b0800000000000003558ecd4a02511cc571da0cb3d15c892b19024318bcdf732fb4c82c2b75c4d436edeebdf31fc53e46a5487c0a57addbb5ea017a8182a05df40841d10bb46bb6c1e1700efce01cd729e64f16cd34864a7f915ea736bd287f38ae53745b84b6546b9ff82f8eb7d11d358b5bd62a260c904002b3012306024d090eb8d09c6a69138e45e5eee1e9f3176dbb66edb8af9b85f79a7f9ff3763557c61aad35606cb24225a30c489cb9248c0207aa08e718736199a620258426b6c8102d13216821573ef6f610e542b298200418198b339098388cb9022e350a13926005891232241cb04c30c4220b942aa14d765e949e1fbf5d3f7f5967aa5a27d53aca5447b5aae747a7c9951ececfa6e3f16871d4200bdd6cabf3e5ac4f269158c1aa735b58f76a3b19d8517a04cbf1cc0c6ea2fefc70161d0cecb42d27ddb6690c29ee2d0b3f6f5f6e29e7e7a3ff337fd1396dea6c010000026a4c54432057616c6c6574'
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

  expect(result).toStrictEqual(expectResult)
})

test('parse', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'keystone-sign-result'
  const cborHex = 'a1015901b11f8b08000000000000004d923d8e14300c85b5628b0121214db9150505cd48fe8b635351a0a9b942123b0d122376b7e12c9c8c1b50517002cca241b88822c7fe64bf97c3cdf1d5a7fcfaf078f99cafbfdcaf4be4dd8fdbc3f3e3e14c7cf6f3077af7fdf6c59bb55c74269d2c659d84669e06139e9a8ec6c3d66ea8c7f7b2713919e0748bec113ef7f018c8a2446d933832c2de9b87efb0ee0a163b8ad17af77df7f319105c030195b70e9bb46016cf8c53862e6c0da9b1b7e4241113a69014666b3e07e2c831d6ac6b2bc65f5447ad53960866065ab22f81ec93338d3036e54a27eca0dcc176eca70042a00eff05f6e128c9c164620bb7f49a0d427dda469ecdc97b20470930b7f55caa38ae735cfbfb54d6ec69211a634ccf05630cf134fcb31fc2ea5533ad03496710012290dda2d74b099292c05a45e62bb74cf766a3483a143266ae51f6706d365a69b3cb26c9f9c468e808d6c0a66bf26ab01741ccca4ccba0020e3441dccaa1adaa2672b9db5bb9d4a9142d49b8a94994538930178eb261468fe6595340dfb4d173bb5a3524962e59a84466d7da5554af6abcfdf6eb865efefb7f1fef2fbf01cb596bb490020000'
  const rawData = '0200000000010163f6a8b2c0bde7883e4a6c155125395e3e2448432d4e433859ba11aeaacb9ba50100000017160014c441eed18e39c40e7b3ee821df2ece9217063708fdffffff02102700000000000017a914e3d32848c1f470bd0d69b8f13b59297d13d8debf87ec661a010000000017a9147b636e7e8d46daab9ec0aaa49e816c1510c77b6b870247304402204f5d70c78b2e4e036c7789cef4b9958adaa6a60edbecaa323821a52d4f56a4eb02204519108508b96e3c50fc20db850b8ed2789a18411f63d658b9b13f5175da57250121035684d200e10bc1a3e2bd7d59e58a07f2f19ef968725e18f1ed65e13396ab946600000000'
  const requestId = 'cc946be2-8e4c-42be-a321-56a53a8cf516'

  expect(keystoneSDK.ltc.parseSignResult(new UR(Buffer.from(cborHex, 'hex'), type))).toStrictEqual({
    requestId,
    rawData
  })
})

import { Account } from '../src/account'
import KeystoneSDK from '../src/index'

test('parseMultiAccounts without xpub', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'crypto-multi-accounts'
  const cbor =
    'a3011ae9181cf30281d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f503686b657973746f6e65'
  const expectResult = {
    device: 'keystone',
    keys: [
      new Account('SOL', "m/44'/501'/0'/0'", '02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b', '', '', '')
    ],
    masterFingerprint: 'e9181cf3'
  }

  expect(keystoneSDK.parseMultiAccounts(type, cbor)).toStrictEqual(expectResult)
})

test('parseMultiAccounts with xpub', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'crypto-multi-accounts'
  const cbor =
    'a3011aa424853c0281d9012fa4035821034af544244d31619d773521a1a366373c485ff89de50bea543c2b14cccfbb6a500458208dc2427d8ab23caab07729f88f089a3cfa2cfffcd7d1e507f983c0d44a5dbd3506d90130a10186182cf500f500f5081a149439dc03686b657973746f6e65'
  const expectResult = {
    device: 'keystone',
    keys: [
      new Account(
        'BTC',
        "m/44'/0'/0'",
        '034af544244d31619d773521a1a366373c485ff89de50bea543c2b14cccfbb6a50',
        '',
        '8dc2427d8ab23caab07729f88f089a3cfa2cfffcd7d1e507f983c0d44a5dbd35',
        'xpub6BoYPFH1MivLdh2BWZuRu6LfuaVSkVak5wsDxjjkAWcUM2QPKyeCHXMgDfRJFvKZhqA4vM5vsgcD6C5ot9eThnFHstgPntNzBLUdLeKS7Zt'
      )
    ],
    masterFingerprint: 'a424853c'
  }

  expect(keystoneSDK.parseMultiAccounts(type, cbor)).toStrictEqual(expectResult)
})

test('parseMultiAccounts throw error', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'crypto-multi-accounts'
  const cbor = 'a3011ae9181cf30281d9012fa203582102eae4b876a8696134b868f88cc2f51f'
  const parse = (): void => {
    keystoneSDK.parseMultiAccounts(type, cbor)
  }

  expect(parse).toThrowError('multi accounts is invalid')
})

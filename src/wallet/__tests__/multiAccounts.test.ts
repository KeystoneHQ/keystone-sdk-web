import { parseMultiAccounts } from '../multiAccounts'
import { UR } from '../../types/ur'
import { toBuffer } from '../../utils'

test('parseMultiAccounts without xpub', () => {
  const type = 'crypto-multi-accounts'
  const cborHex =
    'a3011ae9181cf30281d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f503686b657973746f6e65'
  const expectResult = {
    device: 'keystone',
    keys: [
      {
        chain: 'SOL',
        path: "m/44'/501'/0'/0'",
        publicKey: '02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b'
      }
    ],
    masterFingerprint: 'e9181cf3'
  }

  const multiAccounts = parseMultiAccounts(new UR(toBuffer(cborHex), type))
  expect(multiAccounts.device).toBe(expectResult.device)
  expect(multiAccounts.keys[0]).toMatchObject(expectResult.keys[0])
  expect(multiAccounts.keys.length).toBe(expectResult.keys.length)
  expect(multiAccounts.masterFingerprint).toBe(expectResult.masterFingerprint)
})

test('parseMultiAccounts with xpub', () => {
  const type = 'crypto-multi-accounts'
  const cborHex =
    'a3011aa424853c0281d9012fa4035821034af544244d31619d773521a1a366373c485ff89de50bea543c2b14cccfbb6a500458208dc2427d8ab23caab07729f88f089a3cfa2cfffcd7d1e507f983c0d44a5dbd3506d90130a10186182cf500f500f5081a149439dc03686b657973746f6e65'
  const expectResult = {
    device: 'keystone',
    keys: [
      {
        chain: 'BTC',
        path: "m/44'/0'/0'",
        publicKey: '034af544244d31619d773521a1a366373c485ff89de50bea543c2b14cccfbb6a50',
        chainCode: '8dc2427d8ab23caab07729f88f089a3cfa2cfffcd7d1e507f983c0d44a5dbd35',
        extendedPublicKey: 'xpub6BoYPFH1MivLdh2BWZuRu6LfuaVSkVak5wsDxjjkAWcUM2QPKyeCHXMgDfRJFvKZhqA4vM5vsgcD6C5ot9eThnFHstgPntNzBLUdLeKS7Zt'
      }
    ],
    masterFingerprint: 'a424853c'
  }

  const multiAccounts = parseMultiAccounts(new UR(toBuffer(cborHex), type))
  expect(multiAccounts.device).toBe(expectResult.device)
  expect(multiAccounts.keys[0]).toMatchObject(expectResult.keys[0])
  expect(multiAccounts.keys.length).toBe(expectResult.keys.length)
  expect(multiAccounts.masterFingerprint).toBe(expectResult.masterFingerprint)
})

test('parseMultiAccounts throw error', () => {
  const type = 'crypto-multi-accounts'
  const cborHex = 'a3011ae9181cf30281d9012fa203582102eae4b876a8696134b868f88cc2f51f'
  const parse = (): void => {
    parseMultiAccounts(new UR(toBuffer(cborHex), type))
  }

  expect(parse).toThrowError('multi accounts is invalid')
})

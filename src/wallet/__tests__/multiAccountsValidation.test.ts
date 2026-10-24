import { Buffer } from 'buffer'
import { DataItem, encodeDataItem } from '@keystonehq/bc-ur-registry'
import { UR } from '../../types'
import { parseMultiAccounts } from '../multiAccounts'
import { validatedMultiAccounts, MAX_CONNECTION_CBOR_BYTES } from '../multiAccountsValidation'

type MapData = Record<number, any>
const MFP = 0x12345678
const make = (coin = 501): { root: MapData, key: MapData, origin: MapData } => {
  const origin: MapData = { 1: [44, true, coin, true, 0, true], 2: MFP, 3: 3 }
  const key: MapData = {
    2: false,
    3: coin === 501 ? Buffer.alloc(32, 1) : Buffer.from('0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 'hex'),
    6: new DataItem(origin, 304),
    9: 'Keystone'
  }
  return { root: { 1: MFP, 2: [new DataItem(key, 303)], 3: 'Keystone 3 Pro', 4: 'ab'.repeat(20), 5: '3.2.0' }, key, origin }
}
const cbor = (root: MapData): Buffer => encodeDataItem(new DataItem(root))
const parse = (root: MapData): ReturnType<typeof parseMultiAccounts> => parseMultiAccounts(new UR(cbor(root), 'crypto-multi-accounts'))

it('strips unknown fields at every protocol map without altering the input', () => {
  const { root, key, origin } = make(60)
  root[99] = 'root-extra'
  key[99] = 'key-extra'
  origin[99] = 'path-extra'
  key[5] = new DataItem({ 1: 0, 2: 0, 99: 'coin-extra' }, 305)
  key[7] = new DataItem({ 1: [0, false, [], false], 3: 0, 99: 'children-extra' }, 304)
  const original = cbor(root)
  const clean = validatedMultiAccounts(original).toDataItem().getData()
  expect(clean[99]).toBeUndefined()
  const cleanKey = clean[2][0].getData()
  expect(cleanKey[99]).toBeUndefined()
  expect(cleanKey[6].getData()[99]).toBeUndefined()
  expect(cleanKey[5].getData()[99]).toBeUndefined()
  expect(cleanKey[7].getData()[99]).toBeUndefined()
  expect(original.equals(cbor(root))).toBe(true)
  for (const extra of ['root-extra', 'key-extra', 'path-extra', 'coin-extra', 'children-extra']) {
    expect(JSON.stringify(parse(root))).not.toContain(extra)
  }
})

it.each(['account.standard', 'account.ledger_legacy', 'account.ledger_live'])('preserves ETH note %s', value => {
  const { root, key } = make(60)
  key[10] = value
  expect(parse(root).keys[0].note).toBe(value)
})

it('drops arbitrary notes and notes on the wrong chain', () => {
  for (const coin of [60, 501]) {
    const { root, key } = make(coin)
    key[10] = coin === 60 ? 'arbitrary payload' : 'account.standard'
    expect(parse(root).keys[0].note).toBeUndefined()
  }
})

it('projects ZEC note to its fingerprint only', () => {
  const { root, key } = make(133)
  key[10] = JSON.stringify({ seed_fingerprint: 'AB'.repeat(32), extra: 'must disappear' })
  expect(parse(root).keys[0].note).toBe(JSON.stringify({ seed_fingerprint: 'ab'.repeat(32) }))
})

it.each(['{}', 'null', '[]', 'not json', '{"seed_fingerprint":"ab"}'])('rejects malformed ZEC note %s', value => {
  const { root, key } = make(133)
  key[10] = value
  expect(() => parse(root)).toThrow('multi accounts is invalid')
})

it('preserves zero fingerprints including parent and origin', () => {
  const { root, key, origin } = make(60)
  root[1] = 0
  origin[2] = 0
  key[4] = Buffer.alloc(32, 2)
  key[8] = 0
  const result = validatedMultiAccounts(cbor(root))
  expect(result.getMasterFingerprint().toString('hex')).toBe('00000000')
  expect(result.getKeys()[0].getOrigin()!.getSourceFingerprint()!.toString('hex')).toBe('00000000')
  expect(result.getKeys()[0].getParentFingerprint()!.toString('hex')).toBe('00000000')
  expect(parse(root).keys[0].extendedPublicKey).toMatch(/^xpub/)
})

it('allows historical optional flags and metadata to be absent', () => {
  const { root, key, origin } = make()
  delete key[2]
  delete origin[2]
  delete root[3]
  delete root[4]
  delete root[5]
  expect(parse(root).keys[0].path).toBe("m/44'/501'/0'")
})

it.each([
  ['missing fingerprint', ({ root }: ReturnType<typeof make>) => { delete root[1] }],
  ['fractional fingerprint', ({ root }) => { root[1] = 1.5 }],
  ['negative fingerprint', ({ root }) => { root[1] = -1 }],
  ['wide fingerprint', ({ root }) => { root[1] = 0x100000000 }],
  ['text fingerprint', ({ root }) => { root[1] = '12345678' }],
  ['missing keys', ({ root }) => { delete root[2] }],
  ['empty keys', ({ root }) => { root[2] = [] }],
  ['too many keys', ({ root }) => { root[2] = Array(257).fill(root[2][0]) }],
  ['duplicate path', ({ root }) => { root[2].push(root[2][0]) }],
  ['private key', ({ key }) => { key[2] = true }],
  ['master key', ({ key }) => { key[1] = true }],
  ['nonboolean flag', ({ key }) => { key[2] = 0 }],
  ['short public key', ({ key }) => { key[3] = Buffer.from([2]) }],
  ['text public key', ({ key }) => { key[3] = 'ab'.repeat(32) }],
  ['bad public prefix', ({ key }) => { key[3] = Buffer.alloc(33, 4) }],
  ['bad chain code', ({ key }) => { key[4] = Buffer.alloc(31) }],
  ['missing origin', ({ key }) => { delete key[6] }],
  ['short origin', ({ origin }) => { origin[1] = [44, true] }],
  ['odd origin', ({ origin }) => { origin[1] = [44, true, 501] }],
  ['wildcard origin', ({ origin }) => { origin[1] = [44, true, [], true] }],
  ['fake wildcard', ({ key }) => { key[7] = new DataItem({ 1: ['*', false] }, 304) }],
  ['bad hardened', ({ origin }) => { origin[1] = [44, 1, 501, true] }],
  ['wide index', ({ origin }) => { origin[1] = [44, true, 0x80000000, true] }],
  ['negative index', ({ origin }) => { origin[1] = [44, true, -1, true] }],
  ['fingerprint mismatch', ({ origin }) => { origin[2] = 1 }],
  ['wide depth', ({ origin }) => { origin[3] = 256 }],
  ['wrong HD tag', ({ root, key }) => { root[2] = [new DataItem(key, 304)] }],
  ['wrong path tag', ({ key, origin }) => { key[6] = new DataItem(origin, 303) }],
  ['missing HD tag', ({ root, key }) => { root[2] = [key] }],
  ['bad name', ({ key }) => { key[9] = { data: 'payload' } }],
  ['bad note', ({ key }) => { key[10] = Buffer.from('payload') }],
  ['bad version', ({ root }) => { root[5] = 123 }],
  ['long device id', ({ root }) => { root[4] = 'a'.repeat(129) }],
  ['control characters', ({ root }) => { root[3] = 'device\nsecret' }],
  ['null metadata', ({ root }) => { root[3] = null }]
// eslint-disable-next-line no-unused-vars
] as Array<[string, (data: ReturnType<typeof make>) => void]>)('rejects %s', (_, mutate) => {
  const data = make()
  mutate(data)
  expect(() => parse(data.root)).toThrow('multi accounts is invalid')
})

it('rejects truncated, trailing, oversized and deeply nested messages', () => {
  const input = cbor(make().root)
  const inputs = [input.subarray(0, input.length - 1), Buffer.concat([input, Buffer.from([0])]),
    Buffer.alloc(MAX_CONNECTION_CBOR_BYTES + 1), Buffer.concat([Buffer.alloc(70, 0x81), Buffer.from([0])])]
  for (const value of inputs) {
    expect(() => parseMultiAccounts(new UR(value, 'crypto-multi-accounts'))).toThrow('multi accounts is invalid')
  }
})

it('does not disclose rejected values in exceptions', () => {
  const { root } = make()
  root[1] = 'sensitive rejected value'
  try { parse(root); throw new Error('should reject') } catch (error) {
    expect((error as Error).message).toBe('multi accounts is invalid')
  }
})

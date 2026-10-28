import KeystoneSDK, { KeystoneTronNativeSDK, TronNativeDataType, UR, URType } from '../index'
import { DataItem, encodeDataItem, decodeToDataItem } from '@keystonehq/bc-ur-registry'
import { uuidParse } from '../utils'

// Public abandon × 11 + about fixture, empty passphrase, m/44'/195'/0'/0/0.
const raw = "0a0212342208010101010101010140e0a499ffbc315a67080112630a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412320a1541c8599111f29c1e1e061265b4af93ea1f274ad78a121541b6e708a39781c96bd399c7657780ff9fe9f052a818c0843d7080d095ffbc31"
const requestCbor = "a501d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d0258850a0212342208010101010101010140e0a499ffbc315a67080112630a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412320a1541c8599111f29c1e1e061265b4af93ea1f274ad78a121541b6e708a39781c96bd399c7657780ff9fe9f052a818c0843d7080d095ffbc31030104d90130a2018a182cf518c3f500f500f400f4021a73c5da0a066b74726f6e2077616c6c6574"
const signatureCbor = "a201d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d025841825f6ce0f253580ab7c83b53a90b6b428aef5273c02f36cad48662f4ffb275431f345ad672e7857ac7b2037ba0d102d989161f51a819c8bcf6326a9957e81c6a00"

const requestId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
const props = { requestId, signData: raw, path: "m/44'/195'/0'/0/0", xfp: '73c5da0a', origin: 'tron wallet' }
const sdk = new KeystoneSDK()
const signature = Buffer.from(signatureCbor.slice(-130), 'hex')
const result = (fields: Record<number, unknown>): UR => new UR(encodeDataItem(new DataItem(fields)), URType.TronNativeSignature)
const fields = (): Record<number, unknown> => ({ 1: new DataItem(uuidParse(requestId), 37), 2: signature })

it('exports a separate cached implementation and preserves legacy UR aliases', () => {
  expect(sdk.tronNative).toBeInstanceOf(KeystoneTronNativeSDK)
  expect(sdk.tronNative).toBe(sdk.tronNative)
  expect(sdk.tronNative).not.toBe(sdk.tron)
  expect(URType.TronSignature).toBe('keystone-sign-result')
  expect(KeystoneTronNativeSDK.DataType.Transaction).toBe(1)
})
it('matches the fixture CBOR byte for byte and preserves the original raw_data', () => {
  const ur = sdk.tronNative.generateSignRequest(props)
  expect(ur.type).toBe('tron-sign-request')
  expect(ur.type).not.toBe('keystone-sign-request')
  expect(ur.cbor.toString('hex')).toBe(requestCbor)
  expect(decodeToDataItem(ur.cbor).getData()[2].toString('hex')).toBe(raw)
})
it('decodes the fixture signature without returning raw or txid', () => {
  expect(sdk.tronNative.parseSignature(new UR(Buffer.from(signatureCbor, 'hex'), 'tron-signature')))
    .toEqual({ requestId, signature: signature.toString('hex') })
})
it('encodes personal-message bytes and optional base58check address', () => {
  const ur = sdk.tronNative.generateSignRequest({ ...props, dataType: TronNativeDataType.PersonalMessage,
    signData: '48656c6c6f', address: 'TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH' })
  const map = decodeToDataItem(ur.cbor).getData()
  expect(map[2].toString()).toBe('Hello')
  expect(map[3]).toBe(2)
  expect(map[5].length).toBe(21)
  expect(map[5][0]).toBe(0x41)
})
it.each([
  { signData: '' }, { signData: 'abc' }, { signData: 'abzz' }, { xfp: '1234' },
  { requestId: 'invalid' }, { path: 'm/NaN' }, { path: 'm/2147483648' },
  { dataType: 3 }, { address: 'invalid' },
  { signData: 'ab'.repeat(32769) }, { origin: 'x'.repeat(129) },
  { path: "m/" + "0'/".repeat(130) + '0' }
])('rejects malformed requests: %j', change => {
  expect(() => sdk.tronNative.generateSignRequest({ ...props, ...change } as any))
    .toThrow('Invalid TRON native sign request')
})
it.each([
  { ...fields(), 3: Buffer.from('sample') },
  { 2: signature }, { 1: fields()[1] }, { ...fields(), 1: uuidParse(requestId) },
  { ...fields(), 1: new DataItem(uuidParse(requestId), 304) },
  { ...fields(), 1: new DataItem(Buffer.alloc(15), 37) },
  { ...fields(), 2: Buffer.alloc(64) }, { ...fields(), 2: Buffer.alloc(66) },
  { ...fields(), 2: signature.toString('hex') }
])('rejects malformed or extra response fields: %#', value => {
  expect(() => sdk.tronNative.parseSignature(result(value))).toThrow('Invalid TRON native signature')
})
it.each([
  signatureCbor + '00',
  'a3' + signatureCbor.slice(2) + '025841' + signature.toString('hex'),
  'a301d82550' + uuidParse(requestId).toString('hex') + signatureCbor.slice(2),
  'b802' + signatureCbor.slice(2),
  'a26131d82550' + uuidParse(requestId).toString('hex') + '025841' + signature.toString('hex'),
  '00'.repeat(129)
])('rejects trailing bytes, duplicate keys, wrong key type or noncanonical encoding: %#', hex => {
  expect(() => sdk.tronNative.parseSignature(new UR(Buffer.from(hex, 'hex'), 'tron-signature')))
    .toThrow('Invalid TRON native signature')
})
it('does not accept legacy responses or silently fall back', () => {
  const modern = new UR(Buffer.from(signatureCbor, 'hex'), 'tron-signature')
  expect(() => sdk.tron.parseSignature(modern)).toThrow()
  expect(() => sdk.tronNative.parseSignature(new UR(modern.cbor, 'keystone-sign-result')))
    .toThrow('Invalid TRON native signature')
})

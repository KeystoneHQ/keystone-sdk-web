import { CoinIds, KeystonePsbtSDK } from '../chains/psbt'
import { UR, URType } from '../types/ur'
import { toBuffer } from '../utils'

test('parsePSBT', () => {
  const keystoneSDK = new KeystonePsbtSDK()

  const type = URType.CryptoPSBTExtend;
  const cborHex = 'a20158a770736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f0000000000000000000203'
  const expectResult = '70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000'

  expect(keystoneSDK.parsePSBT(new UR(toBuffer(cborHex), type))).toBe(expectResult)
})

test('generatePSBT', () => {
  const keystoneSDK = new KeystonePsbtSDK()

  const psbt = toBuffer('70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000')
  const type = URType.CryptoPSBTExtend;
  const cborHex = 'a20158a770736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f0000000000000000000203'
  const expectResult = new UR(toBuffer(cborHex), type)

  expect(keystoneSDK.generatePSBT(psbt, CoinIds.Dogecoin)).toStrictEqual(expectResult)
})

test.each([
  [CoinIds.Litecoin, 'a20142aabb0202'],
  [CoinIds.Dogecoin, 'a20142aabb0203'],
  [CoinIds.Dash, 'a20142aabb0205'],
  [CoinIds.BitcoinCash, 'a20142aabb021891'],
] as const)('PSBT Extend coin %i uses the expected CBOR', (coinId, cborHex) => {
  const sdk = new KeystonePsbtSDK()
  const expected = new UR(toBuffer(cborHex), URType.CryptoPSBTExtend)
  expect(sdk.generatePSBT(toBuffer('aabb'), coinId)).toStrictEqual(expected)
  expect(sdk.parseCoinId(expected)).toBe(coinId)
  expect(sdk.parsePSBT(expected)).toBe('aabb')
})

test('Dash coin ID is 5', () => {
  expect(CoinIds.Dash).toBe(5)
  expect(KeystonePsbtSDK.CoinIds.Dash).toBe(5)
})

test.each([-1, 1, 4, 6, 2147483647])('rejects unsupported coin ID %i', (coinId) => {
  expect(() => new KeystonePsbtSDK().generatePSBT(toBuffer('aabb'), coinId as CoinIds)).toThrow('invalid coin_id')
})

test('rejects the old Dash ID when parsing', () => {
  const sdk = new KeystonePsbtSDK()
  const ur = new UR(toBuffer('a20142aabb0204'), URType.CryptoPSBTExtend)
  expect(() => sdk.parseCoinId(ur)).toThrow('invalid coin_id')
  expect(() => sdk.parsePSBT(ur)).toThrow('invalid coin_id')
})

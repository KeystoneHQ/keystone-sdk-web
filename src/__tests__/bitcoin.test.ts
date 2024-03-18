import KeystoneSDK, { KeystoneBitcoinSDK, type BtcSignature } from '../../src'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../utils'

test('parsePSBT', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'crypto-psbt'
  const cborHex = '58A770736274FF01009A020000000258E87A21B56DAF0C23BE8E7070456C336F7CBAA5C8757924F545887BB2ABDD750000000000FFFFFFFF838D0427D0EC650A68AA46BB0B098AEA4422C071B2CA78352A077959D07CEA1D0100000000FFFFFFFF0270AAF00800000000160014D85C2B71D0060B09C9886AEB815E50991DDA124D00E1F5050000000016001400AEA9A2E5F0F876A588DF5546E8742D1D87008F000000000000000000'
  const expectResult = '70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000'

  expect(keystoneSDK.btc.parsePSBT(new UR(toBuffer(cborHex), type))).toBe(expectResult)
})

test('generatePSBT', () => {
  const keystoneSDK = new KeystoneSDK()

  const psbt = toBuffer('70736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000')
  const type = 'crypto-psbt'
  const cborHex = '58a770736274ff01009a020000000258e87a21b56daf0c23be8e7070456c336f7cbaa5c8757924f545887bb2abdd750000000000ffffffff838d0427d0ec650a68aa46bb0b098aea4422c071b2ca78352a077959d07cea1d0100000000ffffffff0270aaf00800000000160014d85c2b71d0060b09c9886aeb815e50991dda124d00e1f5050000000016001400aea9a2e5f0f876a588df5546e8742d1d87008f000000000000000000'
  const expectResult = new UR(toBuffer(cborHex), type)

  expect(keystoneSDK.btc.generatePSBT(psbt)).toStrictEqual(expectResult)
})

test('parseSignature', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'btc-signature'
  const cborHex = 'a301d825507afd5e09926743fba02e08c4a09417ec02584078325c2ea8d1841dbcd962e894ca6ecd5890aa4c1aa9e1eb789cd2d0e9c22ec737c2b4fb9c2defd863cadf914f538330ec42d6c30c04857ee1f06e7f2589d7d903582103f3ded94f2969d76200c6ed5db836041cc815fa62aa791e047905186c07e00275'
  const expectResult: BtcSignature = {
    signature: '78325c2ea8d1841dbcd962e894ca6ecd5890aa4c1aa9e1eb789cd2d0e9c22ec737c2b4fb9c2defd863cadf914f538330ec42d6c30c04857ee1f06e7f2589d7d9',
    requestId: '7afd5e09-9267-43fb-a02e-08c4a09417ec',
    publicKey: '03f3ded94f2969d76200c6ed5db836041cc815fa62aa791e047905186c07e00275'
  }

  expect(keystoneSDK.btc.parseSignature(new UR(toBuffer(cborHex), type))).toStrictEqual(expectResult)
})

test('generateSignRequest', () => {
  const keystoneSDK = new KeystoneSDK({
    origin: 'BTC Wallet'
  })

  const requestId = '7AFD5E09-9267-43FB-A02E-08C4A09417EC'
  const signData = '48656c6c6f2063727970746f20776f726c6421'
  const accounts = [{
    path: "m/44'/0'/0'/0/0",
    xfp: 'f23f9fd2',
    address: '4c2a59190413dff36aba8e6ac130c7a691cfb79f'
  }]
  const dataType = KeystoneBitcoinSDK.DataType.message

  const type = 'btc-sign-request'
  const cborHex = 'a501d825507afd5e09926743fba02e08c4a09417ec025348656c6c6f2063727970746f20776f726c642103010481d90130a2018a182cf500f500f500f400f4021af23f9fd20581782834633261353931393034313364666633366162613865366163313330633761363931636662373966'
  const expectResult = new UR(toBuffer(cborHex), type)

  expect(keystoneSDK.btc.generateSignRequest({ requestId, signData, dataType, accounts })).toStrictEqual(expectResult)
})

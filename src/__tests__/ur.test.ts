import { UREncoder } from '@ngraveio/bc-ur'
import { UR } from '../types/ur'
import { parseURBytes } from '../wallet/hardwareCall'

describe('parseURBytes', () => {
  const bytes = Buffer.from('hello keystone')
  const ur = UR.fromBuffer(bytes)

  it('should parse bytes from UR', () => {
    expect(parseURBytes(ur)).toStrictEqual(bytes)
  })

  it('should parse bytes from encoded UR', () => {
    expect(parseURBytes(UREncoder.encodeSinglePart(ur))).toStrictEqual(bytes)
  })

  it('should throw when UR type is not bytes', () => {
    expect(() => parseURBytes(new UR(Buffer.from([]), 'crypto-psbt'))).toThrow('ur bytes is invalid')
  })
})

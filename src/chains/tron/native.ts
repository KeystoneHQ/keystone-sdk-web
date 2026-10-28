import { CryptoKeypath, PathComponent, DataItem, encodeDataItem, decodeToDataItem } from '@keystonehq/bc-ur-registry'
import bs58check from 'bs58check'
import { UR, URType } from '../../types/ur'
import { type TronNativeSignRequestProps } from '../../types/props'
import { type TronNativeSignature } from '../../types/signature'
import { parsePath, uuidParse, uuidStringify } from '../../utils'

export enum TronNativeDataType {
  Transaction = 1,
  PersonalMessage = 2
}

const MAX_SIGN_DATA_BYTES = 32 * 1024

/** Direct TRON UR protocol. Parsing does not verify a signature against a transaction. */
export class KeystoneTronNativeSDK {
  static DataType = TronNativeDataType

  generateSignRequest ({ requestId, signData, path, xfp, address, origin, dataType = TronNativeDataType.Transaction }: TronNativeSignRequestProps): UR {
    try {
      if (typeof signData !== 'string' || signData.length > MAX_SIGN_DATA_BYTES * 2 ||
          !/^(?:[0-9a-f]{2})+$/i.test(signData) || !/^[0-9a-f]{8}$/i.test(xfp) ||
          typeof path !== 'string' || path.length > 256 ||
          !/^(?:m\/)?[0-9]+'?(?:\/[0-9]+'?)*$/.test(path) ||
          ![TronNativeDataType.Transaction, TronNativeDataType.PersonalMessage].includes(dataType)) {
        throw new Error()
      }
      const components = parsePath(path)
      if (components.some(({ index }) => !Number.isSafeInteger(index) || index < 0 || index >= 0x80000000)) throw new Error()
      const keypath = new CryptoKeypath(components.map(component => new PathComponent(component)), Buffer.from(xfp, 'hex'))
      const fields: Record<number, unknown> = {
        1: new DataItem(uuidParse(requestId), 37),
        2: Buffer.from(signData, 'hex'),
        3: dataType,
        4: new DataItem(keypath.toDataItem().getData(), 304)
      }
      if (address !== undefined) {
        const decoded = Buffer.from(bs58check.decode(address))
        if (decoded.length !== 21 || decoded[0] !== 0x41) throw new Error()
        fields[5] = decoded
      }
      if (origin !== undefined) {
        if (typeof origin !== 'string' || Buffer.byteLength(origin, 'utf8') > 128) throw new Error()
        fields[6] = origin
      }
      return new UR(encodeDataItem(new DataItem(fields)), URType.TronNativeSignRequest)
    } catch {
      throw new Error('Invalid TRON native sign request')
    }
  }

  parseSignature (ur: UR): TronNativeSignature {
    try {
      // The canonical response contains a UUID and a 65-byte signature.
      if (ur.type !== URType.TronNativeSignature || !Buffer.isBuffer(ur.cbor) || ur.cbor.length > 128) throw new Error()
      const item = decodeToDataItem(ur.cbor)
      const fields = item.getData()
      if (item.getTag() !== undefined || fields === null || typeof fields !== 'object' ||
          Array.isArray(fields) || Buffer.isBuffer(fields) || fields instanceof DataItem ||
          Object.keys(fields).length !== 2 || !Object.prototype.hasOwnProperty.call(fields, '1') ||
          !Object.prototype.hasOwnProperty.call(fields, '2')) throw new Error()
      const id = fields[1]
      const signature = fields[2]
      if (!(id instanceof DataItem) || id.getTag() !== 37 || !Buffer.isBuffer(id.getData()) ||
          id.getData().length !== 16 || !Buffer.isBuffer(signature) || signature.length !== 65) throw new Error()
      // Unknown/duplicate fields, trailing bytes, and noncanonical encodings cannot
      // disappear in the decoder and pass unnoticed.
      if (!Buffer.from(encodeDataItem(new DataItem({ 1: new DataItem(id.getData(), 37), 2: signature }))).equals(ur.cbor)) throw new Error()
      return { requestId: uuidStringify(id.getData()), signature: signature.toString('hex') }
    } catch {
      // Never include untrusted response data in error messages.
      throw new Error('Invalid TRON native signature')
    }
  }
}

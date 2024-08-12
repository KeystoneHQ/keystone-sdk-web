import { toBuffer } from '../../utils'
import { type UR, URType } from '../../types/ur'
import { raw2tx } from './transfer'
import {
  type TronSignature,
  type TronSignRequestProps
} from '../../types'
import pako from 'pako'
import { Base } from '../../gen/protos/base_pb'
import { Payload, Payload_Type } from '../../gen/protos/payload_pb'
import { SignTransaction } from '../../gen/protos/transaction_pb'
import { KeystoneSignRequest, KeystoneSignResult } from '@keystonehq/bc-ur-registry-keystone'

export class KeystoneTronSDK {
  parseSignature (ur: UR): TronSignature {
    if (ur.type !== URType.KeystoneSignResult) {
      throw new Error('type not match')
    }
    const sig = KeystoneSignResult.fromCBOR(ur.cbor)
    const base = Base.fromBinary(pako.ungzip(sig.getSignResult()))
    if (base.data?.Content.case !== 'signTxResult') {
      throw new Error('invalid sign result')
    }
    const { signId, rawTx } = base.data?.Content?.value ?? {}

    return {
      requestId: signId,
      raw: rawTx
    }
  }

  generateSignRequest ({
    requestId,
    signData,
    path,
    xfp,
    tokenInfo,
    origin
  }: TronSignRequestProps): UR {
    const tronTx = raw2tx(toBuffer(signData), tokenInfo)

    const signDataBytes = pako.gzip(new Base({
      version: 2,
      description: 'QrCode Protocol',
      deviceType: '',
      data: new Payload({
        xfp,
        type: Payload_Type.SIGN_TX,
        Content: {
          case: 'signTx',
          value: new SignTransaction({
            coinCode: 'TRON',
            hdPath: path,
            signId: requestId,
            timestamp: BigInt(Date.now()),
            decimal: 6,
            Transaction: {
              case: 'tronTx',
              value: tronTx
            }
          })
        }
      })
    }).toBinary())

    return new KeystoneSignRequest({
      signData: Buffer.from(signDataBytes),
      origin
    }).toUR()
  }
}

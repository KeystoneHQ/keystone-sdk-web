import pako from 'pako'
import { URType, type UR } from '../../types/ur'
import { type KeystoneSignRequestProps } from '../../types/props'
import { KeystoneSignRequest, KeystoneSignResult } from '@keystonehq/bc-ur-registry-keystone'
import { Base } from '../../gen/protos/base_pb'
import { Payload, Payload_Type } from '../../gen/protos/payload_pb'
import { SignTransaction } from '../../gen/protos/transaction_pb'
import { LtcTx } from '../../gen/chains/keystone/protos/ltc_transaction_pb'
import { BchTx } from '../../gen/chains/keystone/protos/bch_transaction_pb'
import { DashTx } from '../../gen/chains/keystone/protos/dash_transaction_pb'
import { type KeystoneSignResult as KeystoneSignResultType } from '../../types/signature'

export enum Chain {
  LTC = 'LTC',
  BCH = 'BCH',
  DASH = 'DASH'
}

export enum TXCase {
  LTC = 'ltcTx',
  BCH = 'bchTx',
  DASH = 'dashTx'
}

export class Keystone {
  protected generateSignData ({
    chain,
    requestId,
    signData,
    xfp
  }: KeystoneSignRequestProps): Uint8Array {
    let tx
    let txCase: TXCase
    let coinCode
    switch (chain) {
      case Chain.LTC:
        tx = new LtcTx({
          ...signData,
          fee: BigInt(signData.fee),
          dustThreshold: 5460
        })
        coinCode = Chain.LTC
        txCase = TXCase.LTC
        break
      case Chain.BCH:
        tx = new BchTx({
          ...signData,
          fee: BigInt(signData.fee)
        })
        coinCode = Chain.BCH
        txCase = TXCase.BCH
        break
      case Chain.DASH:
        tx = new DashTx({
          ...signData,
          fee: BigInt(signData.fee)
        })
        coinCode = Chain.DASH
        txCase = TXCase.DASH
        break
      default:
        throw new Error('chain not support')
    }
    return pako.gzip(new Base({
      version: 2,
      description: 'QrCode Protocol',
      deviceType: '',
      data: new Payload({
        xfp,
        type: Payload_Type.SIGN_TX,
        Content: {
          case: 'signTx',
          value: new SignTransaction({
            coinCode,
            hdPath: '',
            signId: requestId,
            timestamp: BigInt(Date.now()),
            decimal: 8,
            Transaction: {
              case: txCase,
              value: tx
            }
          })
        }
      })
    }).toBinary())
  }

  generateSignRequest (props: KeystoneSignRequestProps): UR {
    const signDataBytes = Buffer.from(this.generateSignData(props))
    return new KeystoneSignRequest({
      signData: signDataBytes,
      origin: props.origin
    }).toUR()
  }

  parseSignResult (ur: UR): KeystoneSignResultType {
    if (ur.type !== URType.KeystoneSignResult) {
      throw new Error('type not match')
    }
    const sig = KeystoneSignResult.fromCBOR(ur.cbor)
    console.log(sig.getSignResult())
    const base = Base.fromBinary(pako.ungzip(sig.getSignResult()))
    if (base.data?.Content.case !== 'signTxResult') {
      throw new Error('invalid data type')
    }
    const value = base.data?.Content.value
    const requestId = value.signId
    return {
      requestId,
      rawData: value.rawTx
    }
  }
}

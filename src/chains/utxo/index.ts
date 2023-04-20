import pako from 'pako'
import { URType, type UR } from '../../types/ur'
import { type UTXOSignRequestProps } from '../../types/props'
import { UTXOSignRequest, UTXOSignResult } from '@keystonehq/bc-ur-registry-utxo'
import { toHex } from '../../utils'
import { Base } from '../../gen/protos/base_pb'
import { Payload, Payload_Type } from '../../gen/protos/payload_pb'
import { SignTransaction } from '../../gen/protos/transaction_pb'
import { LtcTx } from '../../gen/chains/utxo/protos/ltc_transaction_pb'
import { BchTx } from '../../gen/chains/utxo/protos/bch_transaction_pb'
import { DashTx } from '../../gen/chains/utxo/protos/dash_transaction_pb'
import { type UTXOSignResult as UTXOSignResultType } from '../../types'

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

export class UTXO {
  protected generateSignData ({
    chain,
    requestId,
    signData,
    xfp
  }: UTXOSignRequestProps): Uint8Array {
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
            timestamp: BigInt(0),
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

  generateSignRequest (props: UTXOSignRequestProps): UR {
    const signDataBytes = Buffer.from(this.generateSignData(props))

    const expect = Base.fromBinary(
      Buffer.from('0802120f5172436f64652050726f746f636f6c1ade0208021208373037454544364322cf020a034c5443122463633934366265322d386534632d343262652d613332312d3536613533613863663531361a0020afeee0baf930280862960208ca1110d42a1a0022a0010a406135396263626161616531316261353933383433346532643433343832343365356533393235353131353663346133653838653762646330623261386636363310011a490a4230323739373934613138316366373165613932653162333736323561333532653836373663383031306631613363366565313230313335626464303535333363313218c6adea08220f6d2f3439272f32272f30272f302f302a2b0a224d4736375741575a366a456d4139374c577545524a546b42423770484d6f5666676a10904e180022002a3c0a224d5741565975777a7833626b71484e4b42517459447853767a7a773644516e4a776f10eccde9081801220f4d2f3439272f32272f30272f302f3020bf50', 'hex')
    ).toJsonString()
    const receive = Base.fromBinary(pako.ungzip(signDataBytes)).toJsonString()
    console.log('expect ', expect)
    console.log('receive', receive)
    console.log('receive gzip bytes', signDataBytes.toString('hex'))
    return new UTXOSignRequest({
      signData: signDataBytes,
      origin: props.origin
    }).toUR()
  }

  parseSignResult (ur: UR): UTXOSignResultType {
    if (ur.type !== URType.UTXOSignResult) {
      throw new Error('type not match')
    }
    const sig = UTXOSignResult.fromCBOR(ur.cbor)
    const data = Base.fromBinary(pako.ungzip(sig.getSignResult()))
    if (data.data?.Content.case !== 'signTxResult') {
      throw new Error('invalid data type')
    }
    const requestId = data.data?.Content.value.signId
    return {
      requestId,
      rawData: toHex(sig.getSignResult())
    }
  }
}

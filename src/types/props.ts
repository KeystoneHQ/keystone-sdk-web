import { type SignDataType as CosmosDataType } from '@keystonehq/bc-ur-registry-cosmos'
import { type DataType as EthDataType } from '@keystonehq/bc-ur-registry-eth'
import { type SignType as SolDataType } from '@keystonehq/bc-ur-registry-sol'
import { type TokenInfo } from './token'
import { type BchTx_Input } from '../gen/chains/utxo/protos/bch_transaction_pb'
import { type Input, type Output } from '../gen/protos/btc_transaction_pb'
import { type DashTx_Input } from '../gen/chains/utxo/protos/dash_transaction_pb'
import { type Chain } from '../chains/utxo'
import { type PartialMessage } from '@bufbuild/protobuf'

export interface TronSignRequestProps {
  requestId: string
  signData: string
  path: string
  xfp: string
  tokenInfo?: TokenInfo
  address?: string
  origin?: string
}

export interface CosmosSignRequestProps {
  requestId: string
  signData: string
  dataType: CosmosDataType
  paths: string[]
  xfp: string
  addresses?: string[]
  origin?: string
}

export interface EthSignRequestProps {
  requestId: string
  signData: string
  dataType: EthDataType
  path: string
  xfp: string
  chainId?: number
  address?: string
  origin?: string
}

export interface SolSignRequestProps {
  requestId: string
  signData: string
  dataType: SolDataType
  path: string
  xfp: string
  address?: string
  origin?: string
}

export interface UTXOSignRequestBaseProps<T> {
  requestId: string
  signData: {
    inputs: T
    outputs: Array<PartialMessage<Output>>
    fee: string
  }
  xfp: string
  origin?: string
}

export interface UTXOSignRequestProps extends UTXOSignRequestBaseProps<Array<PartialMessage<Input>> | Array<PartialMessage<BchTx_Input>> | Array<PartialMessage<DashTx_Input>>> {
  chain: Chain
}

export type LTCSignRequestProps = UTXOSignRequestBaseProps<Array<PartialMessage<Input>>>

export type BCHSignRequestProps = UTXOSignRequestBaseProps<Array<PartialMessage<BchTx_Input>>>

export type DashSignRequestProps = UTXOSignRequestBaseProps<Array<PartialMessage<DashTx_Input>>>

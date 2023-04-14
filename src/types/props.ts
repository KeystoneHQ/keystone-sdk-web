import { type SignDataType as CosmosDataType } from '@keystonehq/bc-ur-registry-cosmos'
import { type DataType as EthDataType } from '@keystonehq/bc-ur-registry-eth'
import { type SignType as SolDataType } from '@keystonehq/bc-ur-registry-sol'
import { type TokenInfo } from './token'

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

import { type SignDataType as CosmosDataType } from '@keystonehq/bc-ur-registry-cosmos'
import { type DataType as EthDataType } from '@keystonehq/bc-ur-registry-eth'
import { type SignType as SolDataType } from '@keystonehq/bc-ur-registry-sol'
import { type SignType as StellarDataType } from '@keystonehq/bc-ur-registry-stellar'
import { type SignType as AptosSignType } from '@keystonehq/bc-ur-registry-aptos'
import { type TokenInfo } from './token'
import { type BchTx_Input } from '../gen/chains/keystone/protos/bch_transaction_pb'
import { type Input, type Output } from '../gen/protos/btc_transaction_pb'
import { type DashTx_Input } from '../gen/chains/keystone/protos/dash_transaction_pb'
import { type Chain } from '../chains/keystone'
import { type PartialMessage } from '@bufbuild/protobuf'
import { type CosmosAccount, type AptosAccount, type SuiAccount, type EvmAccount, type BtcAccount, IotaAccount } from './account'
import { type SaltLen, type SignType as ArweaveSignType } from '@keystonehq/bc-ur-registry-arweave'
import { type CardanoCertKeyData, type CardanoUtxoData, type CardanoCatalystRawDelegationsProps } from '@keystonehq/bc-ur-registry-cardano'
import { type SignDataType as EvmDataType } from '@keystonehq/bc-ur-registry-evm'
import { type DataType as BtcDataType } from '@keystonehq/bc-ur-registry-btc'
import { type DataType as TonDataType } from '@keystonehq/bc-ur-registry-ton'
import { MessageAddressFieldType } from '@keystonehq/bc-ur-registry-cardano'
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
  accounts: CosmosAccount[]
  origin?: string
}

export interface EvmSignRequestProps {
  requestId: string
  signData: string
  dataType: EvmDataType
  customChainIdentifier: number
  account: EvmAccount
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

export interface StellarSignRequestProps {
  requestId: string
  signData: string
  dataType: StellarDataType
  path: string
  xfp: string
  address?: string
  origin?: string
}

export interface AvalancheSignRequestProps {
  requestId?: string
  signData: string
  mfp: string
  xpub: string
  walletIndex: number
}

export interface KeystoneSignRequestBaseProps<T> {
  requestId: string
  signData: {
    inputs: T
    outputs: Array<PartialMessage<Output>>
    fee: string
  }
  xfp: string
  origin?: string
}

export interface KeystoneSignRequestProps extends KeystoneSignRequestBaseProps<Array<PartialMessage<Input>> | Array<PartialMessage<BchTx_Input>> | Array<PartialMessage<DashTx_Input>>> {
  chain: Chain
}

export type LTCSignRequestProps = KeystoneSignRequestBaseProps<Array<PartialMessage<Input>>>

export type DOGESignRequestProps = KeystoneSignRequestBaseProps<Array<PartialMessage<Input>>>
export type BCHSignRequestProps = KeystoneSignRequestBaseProps<Array<PartialMessage<BchTx_Input>>>

export type DashSignRequestProps = KeystoneSignRequestBaseProps<Array<PartialMessage<DashTx_Input>>>

export interface AptosSignRequestProps {
  requestId: string
  signData: string
  signType: AptosSignType
  accounts: AptosAccount[]
  origin?: string
}

export interface NearSignRequestProps {
  requestId: string
  signData: string[]
  path: string
  xfp: string
  account?: string
  origin?: string
}

export interface CardanoSignRequestProps {
  requestId: string
  signData: Buffer
  utxos: CardanoUtxoData[]
  extraSigners: CardanoCertKeyData[]
  origin?: string
}

export interface CardanoCatalystRequestProps {
  requestId: string
  path: string
  delegations: CardanoCatalystRawDelegationsProps
  stakePub: string
  paymentAddress: string
  nonce: number
  voting_purpose: number
  xfp: string
  origin?: string
}

interface BaseSignDataRequestProps {
  requestId: string;
  path: string;
  xfp: string;
  origin?: string;
}

interface NextGenSignDataRequestInterface extends BaseSignDataRequestProps {
  pubKey: string;
  xpub?: never;
  sigStructure: string;
  payload?: never;
}

interface LegacySignDataRequestInterface extends BaseSignDataRequestProps {
  /** @deprecated Use `pubKey` instead. */
  xpub: string;
  pubKey?: never;
  /** @deprecated Use `sigStructure` instead. */
  payload: string;
  sigStructure?: never;
}


export type CardanoSignCip8MessageData = {
  requestId: string;
  path: string;
  xfp: string;
  xpub: string;
  origin?: string;
  messageHex: string;
  signingPath: string;
  hashPayload: boolean;
  preferHexDisplay?: boolean;
} & ({
  addressFieldType: MessageAddressFieldType.ADDRESS;
  address: string;
} | {
  addressFieldType: MessageAddressFieldType.KEY_HASH;
});


export type CardanoSignDataRequestProps = NextGenSignDataRequestInterface | LegacySignDataRequestInterface;

export interface ArweaveSignRequestProps {
  requestId: string
  signData: string
  signType: ArweaveSignType
  saltLen: SaltLen
  masterFingerprint: string
  account?: string
  origin?: string
}

export interface SuiSignRequestProps {
  requestId: string
  intentMessage: string
  accounts: SuiAccount[]
  origin?: string
}

export interface SuiSignHashRequestProps {
  requestId: string
  messageHash: string
  accounts: SuiAccount[]
  origin?: string
}

export interface IotaSignHashRequestProps {
  requestId: string
  messageHash: string
  accounts: IotaAccount[]
  origin?: string
}

export interface IotaSignRequestProps {
  requestId: string
  intentMessage: string
  accounts: IotaAccount[]
  origin?: string
}

export interface BtcSignRequestProps {
  requestId: string
  signData: string
  dataType: BtcDataType
  accounts: BtcAccount[]
  origin?: string
}

export interface TonSignRequestProps {
  requestId?: string
  signData: string
  dataType: TonDataType
  address: string
  xfp?: string
  derivationPath?: string
}

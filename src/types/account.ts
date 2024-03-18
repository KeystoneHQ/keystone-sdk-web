export interface AccountExtra {
  okx: {
    chainId: number
  }
}

export interface Account {
  chain: string
  path: string
  publicKey: string
  name?: string
  chainCode: string
  extendedPublicKey?: string
  xfp?: string
  note?: string
  extra: AccountExtra
}

export enum AccountNote {
  Standard = 'account.standard',
  LedgerLegacy = 'account.ledger_legacy',
  LedgerLive = 'account.ledger_live'
}

export interface MultiAccounts {
  masterFingerprint: string
  keys: Account[]
  device?: string
  deviceId?: string
  deviceVersion?: string
}

export interface AccountDescriptor {
  masterFingerprint: string
  keys: Account[]
}

export interface PathComponent {
  index: number
  hardened: boolean
}

export interface SignAccount {
  path: string
  xfp: string
  address?: string
}

export interface CosmosAccount {
  path: string
  xfp: string
  address: string
}

export interface EvmAccount extends SignAccount {}

export interface AptosAccount {
  path: string
  xfp: string
  key?: string
}

export interface ArweaveAccount {
  masterFingerprint: string
  keyData: string
  device: string
}

export interface SuiAccount extends SignAccount {}

export interface BtcAccount extends SignAccount {}

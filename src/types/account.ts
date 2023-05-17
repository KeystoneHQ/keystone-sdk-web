export interface AccountProps {
  chain?: string
  path: string
  publicKey: string
  name?: string
  xfp?: string
  chainCode?: string
  extendedPublicKey?: string
}

export interface Account {
  chain: string
  path: string
  publicKey: string
  name: string
  getChainCode: () => string
  getExtendedPublicKey: () => string
}

export interface MultiAccounts {
  device: string
  masterFingerprint: string
  keys: Account[]
}

export interface PathComponent {
  index: number
  hardened: boolean
}

export interface CosmosAccount {
  path: string
  xfp: string
  address: string
}

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

export interface SuiAccount {
  path: string
  xfp: string
  address: string
}

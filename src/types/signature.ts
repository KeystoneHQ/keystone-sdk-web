export interface Signature {
  requestId: string
  signature: string
}

export interface CardanoSignature {
  requestId: string
  witnessSet: string
}

export interface CardanoSignDataSignature {
  signature: string
  publicKey: string
  requestId: string
}

export interface CardanoSignCip8DataSignature {
  signature: string
  publicKey: string
  addressField: string
  requestId: string
}

export interface CardanoCatalystSignature {
  requestId: string
  signature: string
}

export interface EthSignature {
  signature: string
  requestId?: string
  origin?: string
}

export interface SolSignature {
  signature: string
  requestId?: string
}

export interface StellarSignature {
  signature: string
  requestId?: string
}

export interface CosmosSignature extends Signature {
  publicKey: string
}

export interface TronSignature {
  raw: string
  txId: string
  requestId?: string
}

export interface KeystoneSignResult {
  requestId?: string
  rawData: string
}

export interface AptosSignature extends Signature {
  authenticationPublicKey: string
}

export interface NearSignature {
  signature: string[]
  requestId?: string
}

export interface SuiSignature extends Signature {
  publicKey: string
}

export interface TonSignature {
  requestId?: string
  signature: string
  origin?: string
}

export interface BtcSignature extends Signature {
  publicKey: string
}

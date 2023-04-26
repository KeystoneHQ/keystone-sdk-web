export interface Signature {
  requestId: string
  signature: string
}

export interface AdaSignature {
  requestId: string
  witnessSet: string
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

export interface CosmosSignature extends Signature {
  publicKey: string
}

export interface TronSignature {
  signature: string
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

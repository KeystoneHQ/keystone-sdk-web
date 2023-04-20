export interface Signature {
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

export interface CosmosSignature extends Signature {
  publicKey: string
}

export interface TronSignature {
  signature: string
  requestId?: string
}

export interface UTXOSignResult {
  requestId?: string
  rawData: string
}

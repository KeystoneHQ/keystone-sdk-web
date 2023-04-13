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

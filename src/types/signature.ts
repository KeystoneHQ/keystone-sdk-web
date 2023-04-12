export interface Signature {
  requestId: string
  signature: string
}

export interface EthSignature {
  signature: string
  requestId?: string
  origin?: string
}

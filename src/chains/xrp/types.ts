export interface XrpAccount {
  address: string
  key: string
}

export interface XrpTransaction extends Record<string, any> {
  Account: string
  TransactionType: string
  Fee: string
  Sequence: number
  Flags: number
  Amount: string
  SigningPubKey: string
  Destination: string
  DestinationTag?: number
  TxnSignature?: string
  LastLedgerSequence?: number
}

export { UR } from '@ngraveio/bc-ur'

export enum URType {
  CryptoPSBT = 'crypto-psbt',
  CryptoMultiAccounts = 'crypto-multi-accounts',
  ArweaveCryptoAccount = 'arweave-crypto-account',
  EthSignature = 'eth-signature',
  SolSignature = 'sol-signature',
  CosmosSignature = 'cosmos-signature',
  AptosSignature = 'aptos-signature',
  TronSignature = 'tron-signature',
  KeystoneSignResult = 'keystone-sign-result',
  NearSignature = 'near-signature',
  ArweaveSignature = 'arweave-signature',
  SuiSignature = 'sui-signature',
}

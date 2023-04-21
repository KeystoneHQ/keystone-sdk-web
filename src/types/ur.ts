export { UR } from '@ngraveio/bc-ur'

export enum URType {
  CryptoPSBT = 'crypto-psbt',
  CryptoMultiAccounts = 'crypto-multi-accounts',
  EthSignature = 'eth-signature',
  SolSignature = 'sol-signature',
  CosmosSignature = 'cosmos-signature',
  AptosSignature = 'aptos-signature',
  TronSignature = 'tron-signature',
  KeystoneSignResult = 'keystone-sign-result',
}

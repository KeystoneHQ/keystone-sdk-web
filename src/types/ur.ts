export { UR } from '@ngraveio/bc-ur'

export enum URType {
  CryptoPSBT = 'crypto-psbt',
  CryptoMultiAccounts = 'crypto-multi-accounts',
  CryptoHDKey = 'crypto-hdkey',
  ArweaveCryptoAccount = 'arweave-crypto-account',
  EthSignature = 'eth-signature',
  SolSignature = 'sol-signature',
  CosmosSignature = 'cosmos-signature',
  EvmSignature = 'evm-signature',
  AptosSignature = 'aptos-signature',
  CardanoSignature = 'cardano-signature',
  TronSignature = 'keystone-sign-result',
  KeystoneSignResult = 'keystone-sign-result',
  NearSignature = 'near-signature',
  ArweaveSignature = 'arweave-signature',
  SuiSignature = 'sui-signature',
  XrpAccount = 'bytes',
  XrpSignRequest = 'bytes',
  XrpSignature = 'bytes',
}

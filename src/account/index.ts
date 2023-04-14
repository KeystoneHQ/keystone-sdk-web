import { type AccountProps, type Account as AccountInterface } from '../types/account'

export class Account implements AccountInterface {
  chain
  path
  publicKey
  name
  private readonly chainCode
  private readonly extendedPublicKey

  constructor ({ chain, path, publicKey, name, chainCode, extendedPublicKey }: AccountProps) {
    this.chain = chain ?? ''
    this.path = path
    this.publicKey = publicKey
    this.name = name ?? ''
    this.chainCode = chainCode ?? ''
    this.extendedPublicKey = extendedPublicKey ?? ''
  }

  getChainCode (): string {
    return this.chainCode
  }

  getExtendedPublicKey (): string {
    return this.extendedPublicKey
  }
}

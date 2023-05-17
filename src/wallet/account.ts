import { type AccountProps, type Account as AccountInterface } from '../types/account'

export class Account implements AccountInterface {
  chain
  path
  publicKey
  name
  xfp
  private readonly chainCode
  private readonly extendedPublicKey

  constructor ({ chain, path, publicKey, name, xfp, chainCode, extendedPublicKey }: AccountProps) {
    this.chain = chain ?? ''
    this.path = path
    this.publicKey = publicKey
    this.name = name ?? ''
    this.xfp = xfp ?? ''
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

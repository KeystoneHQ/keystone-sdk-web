import {
  CryptoKeypath,
  DataItem,
  type DataItemMap,
  extend,
  RegistryItem,
  RegistryType,
} from '@keystonehq/bc-ur-registry'

const { RegistryTypes } = extend
const ETH_SIGN_REQUEST = new RegistryType('eth-sign-request', 401)

enum Keys {
  requestId = 1,
  signData,
  dataType,
  chainId,
  derivationPath,
  address,
  origin,
}

type SignRequestProps = {
  requestId?: Buffer
  signData: Buffer
  dataType: number
  chainId?: number
  derivationPath: CryptoKeypath
  address?: Buffer
  origin?: string
}

export class EthSignRequest extends RegistryItem {
  private readonly requestId?: Buffer
  private readonly signData: Buffer
  private readonly dataType: number
  private readonly chainId?: number
  private readonly derivationPath: CryptoKeypath
  private readonly address?: Buffer
  private readonly origin?: string

  constructor(args: SignRequestProps) {
    super()
    this.requestId = args.requestId
    this.signData = args.signData
    this.dataType = args.dataType
    this.chainId = args.chainId
    this.derivationPath = args.derivationPath
    this.address = args.address
    this.origin = args.origin
  }

  getRegistryType = (): RegistryType => ETH_SIGN_REQUEST

  toDataItem = (): DataItem => {
    const map: DataItemMap = {}
    if (this.requestId) {
      map[Keys.requestId] = new DataItem(this.requestId, RegistryTypes.UUID.getTag())
    }
    if (this.address) {
      map[Keys.address] = this.address
    }
    if (this.chainId) {
      map[Keys.chainId] = Number(this.chainId)
    }
    if (this.origin) {
      map[Keys.origin] = this.origin
    }

    map[Keys.signData] = this.signData
    map[Keys.dataType] = this.dataType

    const keyPath = this.derivationPath.toDataItem()
    keyPath.setTag(this.derivationPath.getRegistryType().getTag())
    map[Keys.derivationPath] = keyPath

    return new DataItem(map)
  }

  static fromDataItem = (dataItem: DataItem): EthSignRequest => {
    const map = dataItem.getData()
    return new EthSignRequest({
      requestId: map[Keys.requestId] ? map[Keys.requestId].getData() : undefined,
      signData: map[Keys.signData],
      dataType: map[Keys.dataType],
      chainId: map[Keys.chainId] ? map[Keys.chainId] : undefined,
      derivationPath: CryptoKeypath.fromDataItem(map[Keys.derivationPath]),
      address: map[Keys.address] ? map[Keys.address] : undefined,
      origin: map[Keys.origin] ? map[Keys.origin] : undefined,
    })
  }
}

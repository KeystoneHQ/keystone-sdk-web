import { type DOGESignRequestProps } from '../types/props'
import { type UR } from '../types/ur'
import { Chain, Keystone } from './keystone'

export class KeystoneDogecoinSDK extends Keystone {
  generateSignRequest (props: DOGESignRequestProps): UR {
    return super.generateSignRequest({
      chain: Chain.DOGE,
      ...props
    })
  }
}

import { type LTCSignRequestProps } from '../types/props'
import { type UR } from '../types/ur'
import { Chain, Keystone } from './keystone'

export class KeystoneLitecoinSDK extends Keystone {
  generateSignRequest (props: LTCSignRequestProps): UR {
    return super.generateSignRequest({
      chain: Chain.LTC,
      ...props
    })
  }
}

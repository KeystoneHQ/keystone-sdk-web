import { type DashSignRequestProps } from '../types/props'
import { type UR } from '../types/ur'
import { Chain, Keystone } from './keystone'

export class KeystoneDashSDK extends Keystone {
  generateSignRequest (props: DashSignRequestProps): UR {
    return super.generateSignRequest({
      chain: Chain.DASH,
      ...props
    })
  }
}

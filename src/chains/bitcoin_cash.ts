import { type BCHSignRequestProps } from '../types/props'
import { type UR } from '../types/ur'
import { Chain, Keystone } from './keystone'

export class KeystoneBitcoinCashSDK extends Keystone {
  generateSignRequest (props: BCHSignRequestProps): UR {
    return super.generateSignRequest({
      chain: Chain.BCH,
      ...props
    })
  }
}

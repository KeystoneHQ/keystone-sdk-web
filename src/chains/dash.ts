import { type DashSignRequestProps } from '../types/props'
import { type UR } from '../types/ur'
import { Chain, UTXO } from './utxo'

export class KeystoneDashSDK extends UTXO {
  generateSignRequest (props: DashSignRequestProps): UR {
    return super.generateSignRequest({
      chain: Chain.DASH,
      ...props
    })
  }
}

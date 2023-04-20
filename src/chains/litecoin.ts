import { type LTCSignRequestProps } from '../types/props'
import { type UR } from '../types/ur'
import { Chain, UTXO } from './utxo'

export class KeystoneLitecoinSDK extends UTXO {
  generateSignRequest (props: LTCSignRequestProps): UR {
    return super.generateSignRequest({
      chain: Chain.LTC,
      ...props
    })
  }
}

import { type BCHSignRequestProps } from '../types/props'
import { type UR } from '../types/ur'
import { Chain, UTXO } from './utxo'

export class KeystoneBitcoinCashSDK extends UTXO {
  generateSignRequest (props: BCHSignRequestProps): UR {
    return super.generateSignRequest({
      chain: Chain.BCH,
      ...props
    })
  }
}

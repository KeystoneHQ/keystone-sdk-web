import { type AvalancheSignRequestProps } from '../types'
import { type UR } from '../types/ur'
import { toBuffer } from '../utils'
import { AvalancheSignRequest } from '@keystonehq/bc-ur-registry-avalanche';

export class KeystoneAvalancheSDK {
  generateSignRequest({
    signData,
    mfp,
    xpub,
    walletIndex,
  }: AvalancheSignRequestProps): UR {
    return AvalancheSignRequest.constructAvalancheRequest(
      toBuffer(signData),
      mfp,
      xpub,
      walletIndex,
    ).toUR();
  }
}

import { type AccountExtra } from '../types'

const OKX_CHAIN_ID: Record<string, number | undefined> = {
  60: 1 // ETH
}

export const generateExtraData = (coinType: number): AccountExtra => ({
  okx: {
    chainId: OKX_CHAIN_ID[coinType] ?? coinType
  }
})

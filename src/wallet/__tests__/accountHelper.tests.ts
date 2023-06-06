import { generateExtraData } from '../accountHelper'

describe('accountExtra', () => {
  describe('addExtraDataForAccount', () => {
    it('should add extra chainId 1 for ETH in okx', () => {
      const coinType = 60
      const expectResult = {
        okx: {
          chainId: 1
        }
      }

      expect(generateExtraData(coinType)).toStrictEqual(expectResult)
    })

    it('should add extra chainId with coin type as default in okx', () => {
      const coinType = 0
      const expectResult = {
        okx: {
          chainId: 0
        }
      }

      expect(generateExtraData(coinType)).toStrictEqual(expectResult)
    })
  })
})

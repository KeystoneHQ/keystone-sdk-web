import { UR } from '../../types/ur'
import { toBuffer } from '../../utils'
import { parseAccount } from '../account'

test('parseAccount', () => {
  const type = 'crypto-account'
  const cborHex =
    'a2011a527447030284d90194d9012fa702f40358210238506dbd94e82166cb68536ffa0d0e145fcb87b975d9dbd0475fdb664f3daea6045820399c9a9c6b98711235a2484f8e44cbb5f1e656306ae15a0bb29a0d7ed227f0a805d90131a20100020006d90130a301861854f500f500f5021a52744703030307d90130a2018400f480f40300081a81ff3431d90193d9012fa702f403582103ebd552027b73adb1de1aa494ca7cedfe781434d6f102a55355b118a0c5da78bc045820517438aec2b78e81c275a41be63df6083358070cbefdb59de69bd2f99c003e8a05d90131a20100020006d90130a30186182cf500f500f5021a52744703030307d90130a2018400f480f40300081a7441f35cd90190d90194d9012fa702f403582102f3b97cf3f3387e2c4d8c7141a21529a90e0585e9f032706798d18f988a56e3f1045820ac31dee4dd3f4632f984e0a41e8728edc3ec67f614c8f03181490c8945d19d7405d90131a20100020006d90130a301861831f500f500f5021a52744703030307d90130a2018400f480f40300081a59fcb265d90199d9012fa702f4035821026c395e1763f5a6f07ade3557429c4bdab45d5487599ed283e78534ac1816408f045820af3a23ef7b1a54d3dbdb6c3e502382e55de5ff575f13ceacf52be01be37c0b4405d90131a20100020006d90130a301861856f500f500f5021a52744703030307d90130a2018400f480f40300081aa0682b01'
  const expectResult = {
    keys: [
      {
        chain: 'BTC',
        path: "m/84'/0'/0'",
        publicKey: '0238506dbd94e82166cb68536ffa0d0e145fcb87b975d9dbd0475fdb664f3daea6',
        chainCode: '399c9a9c6b98711235a2484f8e44cbb5f1e656306ae15a0bb29a0d7ed227f0a8',
        extendedPublicKey: 'xpub6CcBrNAXBhrdb29q4BFApXgKgCdnHevzGnwFKnDSYfWWMcqkbH17ay6vaUJDZxFdZx5y5AdcoEzLfURSdwtQEEZ93Y5VXUSJ9S8hm5SY7Si',
        name: undefined,
        note: undefined,
        extra: {
          okx: {
            chainId: 0
          }
        }
      },
      {
        chain: 'BTC',
        path: "m/44'/0'/0'",
        publicKey: '03ebd552027b73adb1de1aa494ca7cedfe781434d6f102a55355b118a0c5da78bc',
        chainCode: '517438aec2b78e81c275a41be63df6083358070cbefdb59de69bd2f99c003e8a',
        extendedPublicKey: 'xpub6CWL8m4zcbAPXjWkfFWkyjkorenkhBV8P6VFFCmoMn9WZZZhC3ehf7jovLr5HYXGnHZXZbEBFCWo6KqZiqzaV1gMMc5fdprGiWiaA6vynpA',
        name: undefined,
        note: undefined,
        extra: {
          okx: {
            chainId: 0
          }
        }
      },
      {
        chain: 'BTC',
        path: "m/49'/0'/0'",
        publicKey: '02f3b97cf3f3387e2c4d8c7141a21529a90e0585e9f032706798d18f988a56e3f1',
        chainCode: 'ac31dee4dd3f4632f984e0a41e8728edc3ec67f614c8f03181490c8945d19d74',
        extendedPublicKey: 'xpub6CK8ZyoANWjWk24vmGhZ3V5x28QinZ3C66P3es5oDgtrvZLDK8txJHXu88zKsGc3WA7HFUDPHYcoWir4j2cMNMKBBhfHCB37StVhxozA5Lp',
        name: undefined,
        note: undefined,
        extra: {
          okx: {
            chainId: 0
          }
        }
      },
      {
        chain: 'BTC',
        path: "m/86'/0'/0'",
        publicKey: '026c395e1763f5a6f07ade3557429c4bdab45d5487599ed283e78534ac1816408f',
        chainCode: 'af3a23ef7b1a54d3dbdb6c3e502382e55de5ff575f13ceacf52be01be37c0b44',
        extendedPublicKey: 'xpub6Cq9mdT8xwFe9LYQnt9y1hJXTyo7KQJM8pRH6K95F1mbELzgm825m3hyAZ97vsUV8Xh7VRwu7bKuLZEmUV1ABqCRQqFzZHAsfaJXTYSY1cf',
        name: undefined,
        note: undefined,
        extra: {
          okx: {
            chainId: 0
          }
        }
      }
    ],
    masterFingerprint: '52744703'
  }

  const accountDescriptor = parseAccount(new UR(toBuffer(cborHex), type))
  expect(accountDescriptor.keys).toMatchObject(expectResult.keys)
  expect(accountDescriptor.masterFingerprint).toBe(expectResult.masterFingerprint)
})

test('parseAccount throw error', () => {
  const type = 'crypto-account'
  const cborHex = 'a3011ae9181cf30281d9012fa203582102eae4b876a8696134b868f88cc2f51f'
  const parse = (): void => {
    parseAccount(new UR(toBuffer(cborHex), type))
  }

  expect(parse).toThrowError('account is invalid')
})

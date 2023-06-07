import { parseHDKey } from '../hdKey'
import { UR } from '../../types/ur'
import { toBuffer } from '../../utils'

test('parseHDKey', () => {
  const type = 'crypto-hdkey'
  const cborHex =
    'a902f403582102cc6d7834204653ff10e0047a2395343cc6df081e76c88d5eee83f346f0b21cb7045820712a9187e5c60c573a5acce855445376e1b74c240e417fe8cb2a8fdfd78d2d9d05d90131a201183c020006d90130a30186182cf5183cf500f5021af23f9fd2030307d90130a2018400f480f40300081a483c932809684b657973746f6e650a706163636f756e742e7374616e64617264'
  const expectResult = {
    chain: 'ETH',
    path: "m/44'/60'/0'",
    publicKey: '02cc6d7834204653ff10e0047a2395343cc6df081e76c88d5eee83f346f0b21cb7',
    name: 'Keystone',
    xfp: 'f23f9fd2',
    chainCode: '712a9187e5c60c573a5acce855445376e1b74c240e417fe8cb2a8fdfd78d2d9d',
    extendedPublicKey: 'xpub6CBZfsQuZgVnvTcScAAXSxtX5jdMHtX5LdRuygnTScMBbKyjsxznd8XMEqDntdY1jigmjunwRwHsQs3xusYQBVFbvLdN4YLzH8caLSSiAoV',
    note: 'account.standard'
  }

  expect(parseHDKey(new UR(toBuffer(cborHex), type))).toMatchObject(expectResult)
})

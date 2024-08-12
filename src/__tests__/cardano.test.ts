import KeystoneSDK, { type CardanoSignRequestProps, type CardanoSignature } from '../../src'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../utils'

test('parseSignature', () => {
  const keystoneSDK = new KeystoneSDK()

  const type = 'cardano-signature'
  const cborHex = 'a201d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d0258cda100828258207233f4cd5f24fa554e1ea4ed9251e39f4e18b2e0efd909b27ca01333c22ac49a5840725d8d98bab67eec8bf2704153f725f35ff7b0c9fabee135d97cf6c6b0885b14aa8748d9ba236abd19560b43afb0c5ac6d03359a1ef71b0712fc300d73e23e07825820c4af2472a9b27acad95967b1f5ff224cf3065824f6f1f0df7dbf4b52b819b1e85840c1ba75df625c7f657633f85f07d0bfd67f4e8ffb6b81b4b65a0ab186b459c4434971c25191b2725bff3f29bb9c1d247aabd60e63f0ea6ba53db0624ae1bcc101'
  const expectResult: CardanoSignature = {
    requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    witnessSet: 'a100828258207233f4cd5f24fa554e1ea4ed9251e39f4e18b2e0efd909b27ca01333c22ac49a5840725d8d98bab67eec8bf2704153f725f35ff7b0c9fabee135d97cf6c6b0885b14aa8748d9ba236abd19560b43afb0c5ac6d03359a1ef71b0712fc300d73e23e07825820c4af2472a9b27acad95967b1f5ff224cf3065824f6f1f0df7dbf4b52b819b1e85840c1ba75df625c7f657633f85f07d0bfd67f4e8ffb6b81b4b65a0ab186b459c4434971c25191b2725bff3f29bb9c1d247aabd60e63f0ea6ba53db0624ae1bcc101'
  }

  expect(keystoneSDK.cardano.parseSignature(new UR(toBuffer(cborHex), type))).toStrictEqual(expectResult)
})

test('generateSignRequest', () => {
  const keystoneSDK = new KeystoneSDK()

  const signRequest: CardanoSignRequestProps = {
    signData: Buffer.from('84a400828258204e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99038258204e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99040182a200581d6179df4c75f7616d7d1fd39cbc1a6ea6b40a0d7b89fea62fc0909b6c370119c350a200581d61c9b0c9761fd1dc0404abd55efc895026628b5035ac623c614fbad0310119c35002198ecb0300a0f5f6', 'hex'),
    utxos: [
      {
        transactionHash:
          '4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99',
        index: 3,
        amount: '10000000',
        xfp: '73c5da0a',
        hdPath: "m/1852'/1815'/0'/0/0",
        address:
          'addr1qy8ac7qqy0vtulyl7wntmsxc6wex80gvcyjy33qffrhm7sh927ysx5sftuw0dlft05dz3c7revpf7jx0xnlcjz3g69mq4afdhv'
      },
      {
        transactionHash:
          '4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99',
        index: 4,
        amount: '18020000',
        xfp: '73c5da0a',
        hdPath: "m/1852'/1815'/0'/0/1",
        address:
          'addr1qyz85693g4fr8c55mfyxhae8j2u04pydxrgqr73vmwpx3azv4dgkyrgylj5yl2m0jlpdpeswyyzjs0vhwvnl6xg9f7ssrxkz90'
      }
    ],
    extraSigners: [
      {
        keyHash: 'e557890352095f1cf6fd2b7d1a28e3c3cb029f48cf34ff890a28d176',
        xfp: '73c5da0a',
        keyPath: "m/1852'/1815'/0'/2/0"
      }
    ],
    requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    origin: 'cardano-wallet'
  }

  const type = 'cardano-sign-request'
  const cborHex = 'a501d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d0258a184a400828258204e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99038258204e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99040182a200581d6179df4c75f7616d7d1fd39cbc1a6ea6b40a0d7b89fea62fc0909b6c370119c350a200581d61c9b0c9761fd1dc0404abd55efc895026628b5035ac623c614fbad0310119c35002198ecb0300a0f5f60382d90899a50158204e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c9902030368313030303030303004d90130a2018a19073cf5190717f500f500f400f4021a73c5da0a0578676164647231717938616337717179307674756c796c37776e746d737863367765783830677663796a79333371666672686d37736839323779737835736674757730646c66743035647a3363377265767066376a7830786e6c636a7a336736396d71346166646876d90899a50158204e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c9902040368313830323030303004d90130a2018a19073cf5190717f500f500f401f4021a73c5da0a057867616464723171797a383536393367346672386335356d667978686165386a3275303470796478726771723733766d77707833617a763464676b797267796c6a35796c326d306a6c70647065737779797a6a7330766877766e6c367867396637737372786b7a39300481d9089ca201581ce557890352095f1cf6fd2b7d1a28e3c3cb029f48cf34ff890a28d17602d90130a2018a19073cf5190717f500f502f400f4021a73c5da0a056e63617264616e6f2d77616c6c6574'
  const expectResult = new UR(toBuffer(cborHex), type)
  expect(keystoneSDK.cardano.generateSignRequest(signRequest)).toStrictEqual(expectResult)
})

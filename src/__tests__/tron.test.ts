import KeystoneSDK from '../../src'
import { type TronSignature } from '../types'
import { UR } from '../../src/types/ur'
import { toBuffer } from '../utils'

describe('KeystoneTronSDK', () => {
  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date(1681871353647))
  })

  it('parseSignature', () => {
    const keystoneSDK = new KeystoneSDK()

    const type = 'keystone-sign-result'
    const cborHex = 'a1015901bd1f8b08000000000000008d523d8e94310cd54aac342024a429b7a2a0a019c9761c3ba6a24053738538761a24462c349c85821b5071324e80bf866e259c2acf3fc97bcfa7bbf3ab4ff9fdebb7dbe77cfde571dd221f7edd9f9e9f4f576a57bb7ea0773fef5fbc31c748e7b834d7b8b0cfb898475cc821d45b2c9738bf4708696e0b1612766308304cd71d996da5ae4d2e991464440b779f16da1c3a590eebfcf0fb19cc60409840a006443012dd227b3791be449161c062d361eeb4fa9c59f50337d2b4a3b3a1b29a82744a51d975549674c1c24c5ba1adb0a0ada0245bb96e07b2283b176255afd2957a93a82e52e6239f7a64519a321606133be3889d0b5724ee9469b9da98284b436a7acb563c46c70587205cfa14f36563f65c13eac54aeebdcd9a9930b5b545963527622e36dd963b3c112533a96df498b6577da746a1f7b61a88000de1de5a6a7baaff3f623331282c28d760e8a1b701e000e3f458d09018990edad967efe527378d12aa1c09d8f51b825d245bcf42dc04dd8753a9422327e8e251aa90501fd29a61b0899197db0344b725c0613cd7aa64d916633a1869bd85735755772df7dffef873472fff6df1c7c7db5f8509bb54d6020000'
    const expectResult: TronSignature = {
      signature: '42a9ece5a555a9437de74108d0fb5320f20835e108b961bb8b230228ea07c485412625863391d49692be558067f9e00559641f5ee63d8ab09275a51afe555b7e01',
      requestId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    }

    expect(keystoneSDK.tron.parseSignature(new UR(toBuffer(cborHex), type))).toStrictEqual(expectResult)
  })

  describe('generateSignRequest', () => {
    it('generateSignRequest TRC20', () => {
      const keystoneSDK = new KeystoneSDK()

      const requestId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      const signData = '0a0207902208e1b9de559665c6714080c49789bb2c5aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15418dfec1cde1fe6a9ec38a16c7d67073e3020851c0121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244a9059cbb0000000000000000000000009c0279f1bda9fc40a85f1b53c306602864533e7300000000000000000000000000000000000000000000000000000000000f424070c0b6e087bb2c90018094ebdc03'
      const path = "m/44'/195'/0'/0'/0"
      const xfp = 'F23F9FD2'
      const origin = ''
      const tokenInfo = {
        name: 'TRON_USDT',
        symbol: 'USDT',
        decimals: 6
      }

      const type = 'keystone-sign-request'
      const cborHex = 'a10159012e1f8b0800000000000003e36012e20f2c72ce4f49550828ca2fc94fcecf91dac9c4c124c4e16664ec66e9e662a4b48a898b2524c8df4f48c532c9302535c92445d738c93c45d724293145d732292545d728c920c53cc9382539c92c454a2857dfc4445ddfd0d2545ddf008214d6bf7bb0eba781069bd33d4621a59020733f8fc2ac54efc00af710e74c8b428ba84893021f8bfc92e0aaf42c9f2cb31229a510bf32c39072af6423a0e274d73ceff428df8cd254d7728fb0c824576fc7aa4a4725a5904067f300e3708fa2a2c430c748f7a494c4b00ab3fc62639f72bfac124ba7f4e2142376430330b0f2e172304003a986499629a9a6a6966666a6c966e686e8f2e8406002bfc4816d0fda77eb380973b18406bb8408718282251ec49460f36898f2fa0e3300fa87fe3c4f010000'
      const expectResult = new UR(toBuffer(cborHex), type)

      const signRequest = keystoneSDK.tron.generateSignRequest({ requestId, signData, path, xfp, tokenInfo, origin })
      expect(signRequest).toStrictEqual(expectResult)
    })

    it('generateSignRequest TRC10', () => {
      const keystoneSDK = new KeystoneSDK()

      const requestId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      const signData = '0a02e8152208ac3a94463ebf95f440b0b0f881ff305a75080212710a32747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e736665724173736574436f6e7472616374123b0a07313030323030301215418dfec1cde1fe6a9ec38a16c7d67073e3020851c01a15419c0279f1bda9fc40a85f1b53c306602864533e732080897a'
      const path = "m/44'/195'/0'/0/0"
      const xfp = 'F23F9FD2'
      const origin = ''
      const tokenInfo = {
        name: 'TRON_BTT',
        symbol: 'BTT',
        decimals: 6
      }

      const type = 'keystone-sign-request'
      const cborHex = 'a1015901101f8b0800000000000003e36012e20f2c72ce4f49550828ca2fc94fcecf919ac6c4c124c4e16664ec66e9e662a4d4cec4c51212e4ef27a462996498929a6492a26b9c649ea26b929498a26b999492a26b946490629e649c929c6496222598ab6f62a2ae6f6869aaae6f0044fa060aebdf3dd8f5d34083cd690f2317bba18181918181819452885f996148b957b251489079ba6b9e777a946f4669aa6bb947586492abb76355a5a3925248a0b3798071b8475151629863a47b524a625885597eb1b14fb95f5689a5537a718a113bc83420b0f2e57230400389c9c68996262666c6a9496996a66926e8f2e84060ea0566890f8b0e36fc377012e462760a0911e200793d1ec89260030045cdd7a22c010000'
      const expectResult = new UR(toBuffer(cborHex), type)

      const signRequest = keystoneSDK.tron.generateSignRequest({ requestId, signData, path, xfp, tokenInfo, origin })
      expect(signRequest).toStrictEqual(expectResult)
    })

    it('generateSignRequest TRX', () => {
      const keystoneSDK = new KeystoneSDK()

      const requestId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      const signData = '0a02665c2208ec27b63954f5913d40d887bdd4f72d5a67080112630a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412320a15418dfec1cde1fe6a9ec38a16c7d67073e3020851c01215419c0279f1bda9fc40a85f1b53c306602864533e7318eda201'
      const path = "m/44'/195'/0'/0/0"
      const xfp = 'F23F9FD2'
      const origin = ''

      const type = 'keystone-sign-request'
      const cborHex = 'a10158fd1f8b0800000000000003e36012e20f2c72ce4f49550828ca2fc94fcecf91facbc8c124c4e16664ec66e9e662a4f48e918b2524c8df4f48c532c9302535c92445d738c93c45d724293145d732292545d728c920c53cc9382539c92c454a3057dfc4445ddfd0d2545ddf0088f40d14d6bf7bb0eba781069bd362462ee690a00829a510bf32c39072af64a39020f374d73ceff428df8cd254d7728fb0c824576fc7aa4a4725a5904067f300e3708fa2a2c430c748f7a494c4b00ab3fc62639f72bfac124ba7f4e214235623030b13532b5f2e070334909a6c649e64666c696a92666a69689c822e8f0e04ee9c619498f1abf5f2775d0029b6721a13010000'
      const expectResult = new UR(toBuffer(cborHex), type)

      const signRequest = keystoneSDK.tron.generateSignRequest({ requestId, signData, path, xfp, origin })
      expect(signRequest).toStrictEqual(expectResult)
    })
  })
})

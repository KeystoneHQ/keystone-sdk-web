import KeystoneSDK from '../../src'
import { extend } from '@keystonehq/bc-ur-registry'

test('generateAvalancheUR', () => {
  const sdk = new KeystoneSDK();
  const avalancheTransaction = {
    signData: "00000000000000000001ed5f38341e436e5d46e2bb00b45d62ae97d1b050c64bc634ae10626739e35c4b0000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000007000000000089544000000000000000000000000100000001512e7191685398f00663e12197a3d8f6012d9ea300000001db720ad6707915cc4751fb7e5491a3af74e127a1d81817abe9438590c0833fe10000000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000000000989680000000010000000000000000",
    mfp: "12345678",
    xpub: "xpub-test",
    walletIndex: 0,
  }
  const ur = sdk.avalanche.generateSignRequest(avalancheTransaction);
  const dataItem = extend.decodeToDataItem(ur.cbor)
  const data = dataItem.getData()

  expect(ur.type).toBe("avax-sign-request");
  expect(data[1].getData()).toHaveLength(16);
  expect(data[2].toString("hex")).toBe(avalancheTransaction.signData);
  expect(data[3]).toBe(0x12345678);
  expect(data[6]).toBe(avalancheTransaction.xpub);
  expect(data[7]).toBe(avalancheTransaction.walletIndex);
});

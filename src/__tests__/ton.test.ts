import KeystoneSDK from "../../src";
import { KeystoneTonSDK } from '../chains'
import { type TonSignature } from "../types";
import { UR } from "../../src/types/ur";
import { toBuffer } from "../utils";

test("parseSignature", () => {
  const keystoneSDK = new KeystoneSDK();

  const type = "ton-signature";
  const cborHex =
    "a301d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d025840f4b79835417490958c72492723409289b444f3af18274ba484a9eeaca9e760520e453776e5975df058b537476932a45239685f694fc6362fe5af6ba714da650503684b657973746f6e65";
  const expectResult: TonSignature = {
    signature:
      "f4b79835417490958c72492723409289b444f3af18274ba484a9eeaca9e760520e453776e5975df058b537476932a45239685f694fc6362fe5af6ba714da6505",
    requestId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    origin: "Keystone",
  };

  expect(
    keystoneSDK.ton.parseSignature(new UR(toBuffer(cborHex), type))
  ).toStrictEqual(expectResult);
});

test("generateSignRequest", () => {
  const keystoneSDK = new KeystoneSDK({origin: "TonKeeper"});

  const requestId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
  const signData = Buffer.from(
    "te6cckEBAgEARwABHCmpoxdmOz6lAAAACAADAQBoQgArFnMvHAX9tOjTp4/RDd3vP2Bn8xG+U5MTuKRKUE1NoqHc1lAAAAAAAAAAAAAAAAAAAHBy4G8=",
    "base64"
  );

  const type = "ton-sign-request";
  const cborHex =
    "a501d825509b1deb4d3b7d4bad9bdd2b0d7b3dcb6d025856b5ee9c7241010201004700011c29a9a317663b3ea500000008000301006842002b16732f1c05fdb4e8d3a78fd10dddef3f6067f311be539313b8a44a504d4da2a1dcd65000000000000000000000000000007072e06f0301057830555143314979777951776978534f553870657a4f5a4443397276327843563443474a7a4f574836525838425473474a780669546f6e4b6565706572";
  const expectResult = new UR(toBuffer(cborHex), type);
  expect(
    keystoneSDK.ton.generateSignRequest({
      requestId,
      signData: signData.toString("hex"),
      dataType: KeystoneTonSDK.DataType.TRANSACTION,
      address: "UQC1IywyQwixSOU8pezOZDC9rv2xCV4CGJzOWH6RX8BTsGJx"
    })
  ).toStrictEqual(expectResult);
});

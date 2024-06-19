import {
  TonSignRequest,
  TonSignature,
  DataType,
} from "@keystonehq/bc-ur-registry-ton";
import { type TonSignature as TonSignatureType } from "../types/signature";
import { toBuffer, toHex, uuidStringify } from "../utils";
import { URType, type UR } from "../types/ur";
import { type TonSignRequestProps } from "../types/props";
import { type KeystoneSDKConfig } from "../types/config";

export class KeystoneTonSDK {
  static DataType = DataType;
  config: KeystoneSDKConfig | undefined;

  constructor(config?: KeystoneSDKConfig) {
    this.config = config;
  }

  parseSignature(ur: UR): TonSignatureType {
    if (ur.type !== URType.TonSignature) {
      throw new Error("type not match");
    }
    const sig = TonSignature.fromCBOR(ur.cbor);
    const requestId = sig.getRequestId();
    return {
      requestId: Buffer.isBuffer(requestId) ? uuidStringify(requestId) : "",
      signature: toHex(sig.getSignature()),
      origin: sig.getOrigin(),
    };
  }

  generateSignRequest({
    requestId,
    signData,
    dataType,
    xfp,
    derivationPath,
    address,
  }: TonSignRequestProps): UR {
    return TonSignRequest.constructTonRequest(
      toBuffer(signData),
      dataType,
      address,
      requestId,
      this.config?.origin,
      xfp,
      derivationPath
    ).toUR();
  }
}

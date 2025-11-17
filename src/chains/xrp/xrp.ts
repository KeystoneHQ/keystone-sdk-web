import { UR } from "@ngraveio/bc-ur";
import {
  XRPBatchSignRequest,
  XRPBatchSignature,
} from "@keystonehq/bc-ur-registry-xrp";
import { type XrpAccount, type XrpTransaction } from "./types";
import { decode } from "ripple-binary-codec";

export class KeystoneXrpSDK {
  parseAccount(ur: UR): XrpAccount {
    const accountInfo = ur.decodeCBOR().toString();
    return JSON.parse(accountInfo);
  }

  parseSignature(ur: UR): string {
    if (ur.type !== "bytes") {
      throw new Error("type not match");
    }
    try {
      const signedTxHex = ur.decodeCBOR().toString("hex");
      const signedTx = decode(signedTxHex);
      return signedTx.TxnSignature as string;
    } catch (e) {
      throw new Error("signature is invalid");
    }
  }

  generateSignRequest(tx: XrpTransaction): UR {
    const txStr = JSON.stringify(tx);
    return UR.fromBuffer(Buffer.from(txStr));
  }

  generateBatchSignRequest(txs: XrpTransaction[]): UR {
    const requests = txs.map((tx) => {
      Buffer.from(JSON.stringify(tx));
    });
    return new XRPBatchSignRequest(requests).toUR();
  }

  parseBatchSignature(ur: UR): string[] {
    if (ur.type !== XRPBatchSignature.type) {
      throw new Error("type not match");
    }
    const batchSig = XRPBatchSignature.fromCBOR(ur.cbor);
    return batchSig.getSignatures().map((_signature) => {
      return _signature.toString("hex");
    });
  }
}

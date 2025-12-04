import { ZcashPCZT } from "@keystonehq/bc-ur-registry-zcash";
import { toHex } from "../utils";
import { URType, type UR } from "../types/ur";

export class KeystoneZcashSDK {

  generatePczt(pczt: Buffer): UR {
    return new ZcashPCZT(pczt).toUR();
  }

  parsePczt(ur: UR): string {
    if (ur.type !== URType.ZcashPCZT) {
      throw new Error("type not match");
    }
    return toHex(ZcashPCZT.fromCBOR(ur.cbor).getData());
  }
}

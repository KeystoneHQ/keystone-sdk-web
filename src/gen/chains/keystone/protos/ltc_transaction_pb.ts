// @generated by protoc-gen-es v1.10.0 with parameter "target=ts,import_extension="
// @generated from file chains/keystone/protos/ltc_transaction.proto (package protoc, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Input, Output } from "../../../protos/btc_transaction_pb";

/**
 * @generated from message protoc.LtcTx
 */
export class LtcTx extends Message<LtcTx> {
  /**
   * fee = outputs.size > 1 ? fee = sum(input.value) - sum(output.value) : fee
   *
   * @generated from field: int64 fee = 1;
   */
  fee = protoInt64.zero;

  /**
   * @generated from field: int32 dustThreshold = 2;
   */
  dustThreshold = 0;

  /**
   * @generated from field: string memo = 3;
   */
  memo = "";

  /**
   * @generated from field: repeated protoc.Input inputs = 4;
   */
  inputs: Input[] = [];

  /**
   * @generated from field: repeated protoc.Output outputs = 5;
   */
  outputs: Output[] = [];

  constructor(data?: PartialMessage<LtcTx>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protoc.LtcTx";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "fee", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "dustThreshold", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "memo", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "inputs", kind: "message", T: Input, repeated: true },
    { no: 5, name: "outputs", kind: "message", T: Output, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LtcTx {
    return new LtcTx().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LtcTx {
    return new LtcTx().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LtcTx {
    return new LtcTx().fromJsonString(jsonString, options);
  }

  static equals(a: LtcTx | PlainMessage<LtcTx> | undefined, b: LtcTx | PlainMessage<LtcTx> | undefined): boolean {
    return proto3.util.equals(LtcTx, a, b);
  }
}


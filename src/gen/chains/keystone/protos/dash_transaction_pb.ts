// @generated by protoc-gen-es v1.2.0 with parameter "target=ts,import_extension="
// @generated from file chains/keystone/protos/dash_transaction.proto (package protoc, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";
import { Output } from "../../../protos/btc_transaction_pb";

/**
 * @generated from message protoc.DashTx
 */
export class DashTx extends Message<DashTx> {
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
   * @generated from field: repeated protoc.DashTx.Input inputs = 4;
   */
  inputs: DashTx_Input[] = [];

  /**
   * @generated from field: repeated protoc.Output outputs = 5;
   */
  outputs: Output[] = [];

  constructor(data?: PartialMessage<DashTx>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protoc.DashTx";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "fee", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "dustThreshold", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "memo", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "inputs", kind: "message", T: DashTx_Input, repeated: true },
    { no: 5, name: "outputs", kind: "message", T: Output, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DashTx {
    return new DashTx().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DashTx {
    return new DashTx().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DashTx {
    return new DashTx().fromJsonString(jsonString, options);
  }

  static equals(a: DashTx | PlainMessage<DashTx> | undefined, b: DashTx | PlainMessage<DashTx> | undefined): boolean {
    return proto3.util.equals(DashTx, a, b);
  }
}

/**
 * @generated from message protoc.DashTx.Input
 */
export class DashTx_Input extends Message<DashTx_Input> {
  /**
   * @generated from field: string hash = 1;
   */
  hash = "";

  /**
   * @generated from field: int32 index = 2;
   */
  index = 0;

  /**
   * @generated from field: int64 value = 3;
   */
  value = protoInt64.zero;

  /**
   * @generated from field: string pubkey = 4;
   */
  pubkey = "";

  /**
   * @generated from field: string ownerKeyPath = 5;
   */
  ownerKeyPath = "";

  constructor(data?: PartialMessage<DashTx_Input>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protoc.DashTx.Input";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "hash", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "index", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "value", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 4, name: "pubkey", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "ownerKeyPath", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DashTx_Input {
    return new DashTx_Input().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DashTx_Input {
    return new DashTx_Input().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DashTx_Input {
    return new DashTx_Input().fromJsonString(jsonString, options);
  }

  static equals(a: DashTx_Input | PlainMessage<DashTx_Input> | undefined, b: DashTx_Input | PlainMessage<DashTx_Input> | undefined): boolean {
    return proto3.util.equals(DashTx_Input, a, b);
  }
}

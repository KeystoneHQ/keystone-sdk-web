// @generated by protoc-gen-es v1.10.0 with parameter "target=ts,import_extension="
// @generated from file chains/keystone/protos/tron_transaction.proto (package protoc, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from message protoc.LatestBlock
 */
export class LatestBlock extends Message<LatestBlock> {
  /**
   * @generated from field: string hash = 1;
   */
  hash = "";

  /**
   * @generated from field: int32 number = 2;
   */
  number = 0;

  /**
   * @generated from field: int64 timestamp = 3;
   */
  timestamp = protoInt64.zero;

  constructor(data?: PartialMessage<LatestBlock>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protoc.LatestBlock";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "hash", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "number", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "timestamp", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LatestBlock {
    return new LatestBlock().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LatestBlock {
    return new LatestBlock().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LatestBlock {
    return new LatestBlock().fromJsonString(jsonString, options);
  }

  static equals(a: LatestBlock | PlainMessage<LatestBlock> | undefined, b: LatestBlock | PlainMessage<LatestBlock> | undefined): boolean {
    return proto3.util.equals(LatestBlock, a, b);
  }
}

/**
 * @generated from message protoc.Override
 */
export class Override extends Message<Override> {
  /**
   * @generated from field: string tokenShortName = 1;
   */
  tokenShortName = "";

  /**
   * @generated from field: string tokenFullName = 2;
   */
  tokenFullName = "";

  /**
   * @generated from field: int32 decimals = 3;
   */
  decimals = 0;

  constructor(data?: PartialMessage<Override>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protoc.Override";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "tokenShortName", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "tokenFullName", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "decimals", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Override {
    return new Override().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Override {
    return new Override().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Override {
    return new Override().fromJsonString(jsonString, options);
  }

  static equals(a: Override | PlainMessage<Override> | undefined, b: Override | PlainMessage<Override> | undefined): boolean {
    return proto3.util.equals(Override, a, b);
  }
}

/**
 * @generated from message protoc.TronTx
 */
export class TronTx extends Message<TronTx> {
  /**
   * required for TRC10 token, for example '1001090' for TRONONE
   *
   * @generated from field: string token = 1;
   */
  token = "";

  /**
   * required for TRC20 token
   *
   * @generated from field: string contractAddress = 2;
   */
  contractAddress = "";

  /**
   * @generated from field: string from = 3;
   */
  from = "";

  /**
   * @generated from field: string to = 4;
   */
  to = "";

  /**
   * @generated from field: string memo = 5;
   */
  memo = "";

  /**
   * @generated from field: string value = 6;
   */
  value = "";

  /**
   * @generated from field: protoc.LatestBlock latestBlock = 7;
   */
  latestBlock?: LatestBlock;

  /**
   * for display token info
   *
   * @generated from field: protoc.Override override = 8;
   */
  override?: Override;

  /**
   * @generated from field: int32 fee = 9;
   */
  fee = 0;

  constructor(data?: PartialMessage<TronTx>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protoc.TronTx";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "contractAddress", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "from", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "to", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "memo", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "value", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "latestBlock", kind: "message", T: LatestBlock },
    { no: 8, name: "override", kind: "message", T: Override },
    { no: 9, name: "fee", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TronTx {
    return new TronTx().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TronTx {
    return new TronTx().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TronTx {
    return new TronTx().fromJsonString(jsonString, options);
  }

  static equals(a: TronTx | PlainMessage<TronTx> | undefined, b: TronTx | PlainMessage<TronTx> | undefined): boolean {
    return proto3.util.equals(TronTx, a, b);
  }
}


// @generated by protoc-gen-es v1.10.0 with parameter "target=ts,import_extension="
// @generated from file chains/tron/protos/contract.proto (package protocol, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, protoInt64 } from "@bufbuild/protobuf";

/**
 * @generated from message protocol.TransferContract
 */
export class TransferContract extends Message<TransferContract> {
  /**
   * @generated from field: bytes owner_address = 1;
   */
  ownerAddress = new Uint8Array(0);

  /**
   * @generated from field: bytes to_address = 2;
   */
  toAddress = new Uint8Array(0);

  /**
   * @generated from field: int64 amount = 3;
   */
  amount = protoInt64.zero;

  constructor(data?: PartialMessage<TransferContract>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protocol.TransferContract";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "owner_address", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "to_address", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "amount", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TransferContract {
    return new TransferContract().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TransferContract {
    return new TransferContract().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TransferContract {
    return new TransferContract().fromJsonString(jsonString, options);
  }

  static equals(a: TransferContract | PlainMessage<TransferContract> | undefined, b: TransferContract | PlainMessage<TransferContract> | undefined): boolean {
    return proto3.util.equals(TransferContract, a, b);
  }
}

/**
 * @generated from message protocol.TransferAssetContract
 */
export class TransferAssetContract extends Message<TransferAssetContract> {
  /**
   * this field is token name before the proposal ALLOW_SAME_TOKEN_NAME is active, otherwise it is token id and token is should be in string format.
   *
   * @generated from field: bytes asset_name = 1;
   */
  assetName = new Uint8Array(0);

  /**
   * @generated from field: bytes owner_address = 2;
   */
  ownerAddress = new Uint8Array(0);

  /**
   * @generated from field: bytes to_address = 3;
   */
  toAddress = new Uint8Array(0);

  /**
   * @generated from field: int64 amount = 4;
   */
  amount = protoInt64.zero;

  constructor(data?: PartialMessage<TransferAssetContract>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protocol.TransferAssetContract";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "asset_name", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "owner_address", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "to_address", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 4, name: "amount", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TransferAssetContract {
    return new TransferAssetContract().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TransferAssetContract {
    return new TransferAssetContract().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TransferAssetContract {
    return new TransferAssetContract().fromJsonString(jsonString, options);
  }

  static equals(a: TransferAssetContract | PlainMessage<TransferAssetContract> | undefined, b: TransferAssetContract | PlainMessage<TransferAssetContract> | undefined): boolean {
    return proto3.util.equals(TransferAssetContract, a, b);
  }
}

/**
 * @generated from message protocol.TriggerSmartContract
 */
export class TriggerSmartContract extends Message<TriggerSmartContract> {
  /**
   * @generated from field: bytes owner_address = 1;
   */
  ownerAddress = new Uint8Array(0);

  /**
   * @generated from field: bytes contract_address = 2;
   */
  contractAddress = new Uint8Array(0);

  /**
   * @generated from field: int64 call_value = 3;
   */
  callValue = protoInt64.zero;

  /**
   * @generated from field: bytes data = 4;
   */
  data = new Uint8Array(0);

  /**
   * @generated from field: int64 call_token_value = 5;
   */
  callTokenValue = protoInt64.zero;

  /**
   * @generated from field: int64 token_id = 6;
   */
  tokenId = protoInt64.zero;

  constructor(data?: PartialMessage<TriggerSmartContract>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "protocol.TriggerSmartContract";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "owner_address", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 2, name: "contract_address", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 3, name: "call_value", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 4, name: "data", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
    { no: 5, name: "call_token_value", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 6, name: "token_id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TriggerSmartContract {
    return new TriggerSmartContract().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TriggerSmartContract {
    return new TriggerSmartContract().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TriggerSmartContract {
    return new TriggerSmartContract().fromJsonString(jsonString, options);
  }

  static equals(a: TriggerSmartContract | PlainMessage<TriggerSmartContract> | undefined, b: TriggerSmartContract | PlainMessage<TriggerSmartContract> | undefined): boolean {
    return proto3.util.equals(TriggerSmartContract, a, b);
  }
}


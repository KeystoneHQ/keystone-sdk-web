import { type Message, proto3 } from '@bufbuild/protobuf'
import { sha256 } from '@noble/hashes/sha256'
import pako from 'pako'
import { KeystoneSignResult } from '@keystonehq/bc-ur-registry-keystone'
import { Base } from '../../gen/protos/base_pb'
import { Payload_Type } from '../../gen/protos/payload_pb'
import { Transaction, Transaction_Contract_ContractType } from '../../gen/chains/tron/protos/tron_pb'
import { TransferContract, TransferAssetContract, TriggerSmartContract } from '../../gen/chains/tron/protos/contract_pb'
import { type TronSignature } from '../../types'

const MAX_RESULT_BYTES = 128 * 1024
const MAX_TRANSACTION_BYTES = 32 * 1024
const ZERO = BigInt(0)

function invalid (): never { throw new Error('Invalid TRON sign result') }

function knownFields (...messages: Message[]): void {
  if (messages.some(message => proto3.bin.listUnknownFields(message).length !== 0)) invalid()
}

function canonical (message: Message, bytes: Uint8Array): void {
  knownFields(message)
  // The supported legacy firmware emits canonical protobuf. This also rejects
  // duplicate fields and encodings that a permissive decoder would silently merge.
  if (!Buffer.from(message.toBinary()).equals(Buffer.from(bytes))) invalid()
}

function address (value: Uint8Array): void {
  if (value.length !== 21 || value[0] !== 0x41) invalid()
}

function inflateBounded (compressed: Uint8Array): Uint8Array {
  const inflater = new pako.Inflate({ chunkSize: 4096 })
  const chunks: Buffer[] = []
  let size = 0
  let complete = false
  inflater.onEnd = status => { complete = status === 0 }
  inflater.onData = chunk => {
    const bytes = Buffer.from(chunk as Uint8Array)
    size += bytes.length
    if (size > MAX_RESULT_BYTES) invalid()
    chunks.push(bytes)
  }
  if (!inflater.push(compressed, true) || !complete || inflater.err !== 0 || size === 0) invalid()
  return Buffer.concat(chunks)
}

/** Structure and txid validation only, not signature/intent verification. */
export function validateLegacyResult (cbor: Buffer): TronSignature {
  try {
    if (!Buffer.isBuffer(cbor) || cbor.length === 0 || cbor.length > MAX_RESULT_BYTES) invalid()
    const wrapped = KeystoneSignResult.fromCBOR(cbor)
    if (!Buffer.from(wrapped.toCBOR()).equals(cbor)) invalid()
    const decoded = inflateBounded(wrapped.getSignResult())
    const base = Base.fromBinary(decoded)
    canonical(base, decoded)
    if (base.data?.type !== Payload_Type.SIGN_TX_RESULT || base.data.Content.case !== 'signTxResult') invalid()
    const result = base.data.Content.value
    knownFields(base.data, result)
    const { rawTx, txId, signId } = result
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(signId) ||
        !/^[0-9a-f]{64}$/i.test(txId) || rawTx.length > MAX_TRANSACTION_BYTES * 2 ||
        !/^(?:[0-9a-f]{2})+$/i.test(rawTx)) invalid()

    const bytes = Buffer.from(rawTx, 'hex')
    const transaction = Transaction.fromBinary(bytes)
    canonical(transaction, bytes)
    const raw = transaction.rawData
    if (raw === undefined || transaction.signature.length !== 1 || transaction.signature[0].length !== 65) invalid()
    knownFields(raw)
    if (raw.refBlockBytes.length !== 2 || raw.refBlockHash.length !== 8 ||
        raw.timestamp <= ZERO || raw.expiration <= raw.timestamp || raw.feeLimit < ZERO ||
        raw.auths.length !== 0 || raw.scripts.length !== 0 || raw.contract.length !== 1) invalid()
    const contract = raw.contract[0]
    knownFields(contract)
    const parameter = contract.parameter
    if (parameter === undefined || contract.provider.length !== 0 || contract.ContractName.length !== 0 || contract.PermissionId < 0) invalid()
    knownFields(parameter)
    switch (contract.type) {
    case Transaction_Contract_ContractType.TransferContract: {
      if (parameter.typeUrl !== 'type.googleapis.com/protocol.TransferContract') invalid()
      const transfer = TransferContract.fromBinary(parameter.value)
      canonical(transfer, parameter.value)
      address(transfer.ownerAddress)
      address(transfer.toAddress)
      if (transfer.amount <= ZERO) invalid()
      break
    }
    case Transaction_Contract_ContractType.TransferAssetContract: {
      if (parameter.typeUrl !== 'type.googleapis.com/protocol.TransferAssetContract') invalid()
      const transfer = TransferAssetContract.fromBinary(parameter.value)
      canonical(transfer, parameter.value)
      address(transfer.ownerAddress)
      address(transfer.toAddress)
      if (transfer.amount <= ZERO || transfer.assetName.length === 0) invalid()
      break
    }
    case Transaction_Contract_ContractType.TriggerSmartContract: {
      if (parameter.typeUrl !== 'type.googleapis.com/protocol.TriggerSmartContract') invalid()
      const trigger = TriggerSmartContract.fromBinary(parameter.value)
      canonical(trigger, parameter.value)
      address(trigger.ownerAddress)
      address(trigger.contractAddress)
      if (trigger.data.length === 0 || trigger.callValue < ZERO || trigger.callTokenValue < ZERO || trigger.tokenId < ZERO) invalid()
      break
    }
    default: invalid()
    }
    const computedId = Buffer.from(sha256(raw.toBinary())).toString('hex')
    if (txId.toLowerCase() !== computedId) invalid()
    // Return the normalized transaction.
    return { requestId: signId, raw: Buffer.from(transaction.toBinary()).toString('hex'), txId: computedId }
  } catch {
    // Keep parser errors independent of input contents.
    return invalid()
  }
}

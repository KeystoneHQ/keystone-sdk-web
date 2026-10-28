import { Any } from '@bufbuild/protobuf'
import { sha256 } from '@noble/hashes/sha256'
import { KeystoneSignResult } from '@keystonehq/bc-ur-registry-keystone'
import pako from 'pako'
import { KeystoneTronSDK } from '../chains/tron'
import { UR, URType } from '../types'
import { Base } from '../gen/protos/base_pb'
import { Payload, Payload_Type } from '../gen/protos/payload_pb'
import { SignTransactionResult } from '../gen/protos/sign_transaction_result_pb'
import { Transaction, Transaction_raw, Transaction_Contract } from '../gen/chains/tron/protos/tron_pb'
import { TransferContract, TransferAssetContract, TriggerSmartContract } from '../gen/chains/tron/protos/contract_pb'

const sdk = new KeystoneTronSDK()
const signId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
const owner = Buffer.from('41' + '11'.repeat(20), 'hex')
const recipient = Buffer.from('41' + '22'.repeat(20), 'hex')
// Synthetic test bytes: this suite checks parsing, not cryptographic validity.
function transaction (): Transaction {
  return new Transaction({ rawData: new Transaction_raw({
    refBlockBytes: Buffer.from('1234', 'hex'), refBlockHash: Buffer.alloc(8, 1),
    timestamp: 1700000000000n, expiration: 1700000060000n,
    contract: [new Transaction_Contract({ type: 1, parameter: new Any({
      typeUrl: 'type.googleapis.com/protocol.TransferContract',
      value: new TransferContract({ ownerAddress: owner, toAddress: recipient, amount: 1n }).toBinary()
    }) })]
  }), signature: [Buffer.alloc(65, 1)] })
}
function id (tx: Transaction): string { return Buffer.from(sha256(tx.rawData!.toBinary())).toString('hex') }
function wrap (rawTx: string, txId: string, requestId = signId): UR {
  const base = new Base({ version: 1, data: new Payload({ type: Payload_Type.SIGN_TX_RESULT,
    Content: { case: 'signTxResult', value: new SignTransactionResult({ signId: requestId, rawTx, txId }) }
  }) })
  return new KeystoneSignResult(Buffer.from(pako.gzip(base.toBinary()))).toUR()
}
function response (tx = transaction()): UR { return wrap(Buffer.from(tx.toBinary()).toString('hex'), id(tx)) }
const error = 'Invalid TRON sign result'

it('returns a normalized transaction and locally recomputed txid', () => {
  const tx = transaction()
  expect(sdk.parseSignature(wrap(Buffer.from(tx.toBinary()).toString('hex').toUpperCase(), id(tx).toUpperCase())))
    .toEqual({ requestId: signId, raw: Buffer.from(tx.toBinary()).toString('hex'), txId: id(tx) })
})
it.each(['', '0', 'abzz', '0x0a0101', ' 0a0101', '0a0101',
  '{"example":{"value":"sample"}}',
  Buffer.from('{"example":"sample"}').toString('hex'), 'aa'.repeat(32769)
])('rejects invalid transaction encodings: %#', raw => {
  expect(() => sdk.parseSignature(wrap(raw, '00'.repeat(32)))).toThrow(error)
})
it.each(['', 'invalid-id', '00'.repeat(32)])('rejects invalid or mismatched txid: %#', txId => {
  expect(() => sdk.parseSignature(wrap(Buffer.from(transaction().toBinary()).toString('hex'), txId))).toThrow(error)
})
it('rejects arbitrary request IDs without exposing them', () => {
  expect(() => sdk.parseSignature(wrap(Buffer.from(transaction().toBinary()).toString('hex'), id(transaction()), 'invalid-id'))).toThrow(error)
})
it.each([0, 64, 66])('rejects signature length %i', length => {
  const tx = transaction(); tx.signature = [Buffer.alloc(length)]
  expect(() => sdk.parseSignature(response(tx))).toThrow(error)
})
it.each([0, 2])('rejects signature count %i', count => {
  const tx = transaction(); tx.signature = Array.from({ length: count }, () => Buffer.alloc(65))
  expect(() => sdk.parseSignature(response(tx))).toThrow(error)
})
it.each([
  (tx: Transaction) => { tx.rawData!.contract = [] },
  (tx: Transaction) => { tx.rawData!.contract.push(tx.rawData!.contract[0]) },
  (tx: Transaction) => { tx.rawData!.contract[0].type = 0 },
  (tx: Transaction) => { tx.rawData!.contract[0].parameter!.typeUrl = 'type.googleapis.com/protocol.TriggerSmartContract' },
  (tx: Transaction) => { tx.rawData!.refBlockBytes = Buffer.alloc(1) },
  (tx: Transaction) => { tx.rawData!.expiration = 1n },
  (tx: Transaction) => { tx.rawData!.contract[0].parameter!.value = new TransferContract({ ownerAddress: Buffer.alloc(21), toAddress: recipient, amount: 1n }).toBinary() }
])('rejects invalid transaction semantics: %#', mutate => {
  const tx = transaction(); mutate(tx)
  expect(() => sdk.parseSignature(response(tx))).toThrow(error)
})
it.each(['1801', '00'])('rejects unknown/trailing transaction data: %s', suffix => {
  const tx = transaction()
  expect(() => sdk.parseSignature(wrap(Buffer.from(tx.toBinary()).toString('hex') + suffix, id(tx)))).toThrow(error)
})
it('rejects duplicate raw_data fields', () => {
  const tx = transaction()
  const duplicate = new Transaction({ rawData: tx.rawData }).toBinary()
  expect(() => sdk.parseSignature(wrap(Buffer.concat([tx.toBinary(), duplicate]).toString('hex'), id(tx)))).toThrow(error)
})
it('rejects unknown fields inside the contract Any value', () => {
  const tx = transaction(), parameter = tx.rawData!.contract[0].parameter!
  parameter.value = Buffer.concat([parameter.value, Buffer.from('2001', 'hex')])
  expect(() => sdk.parseSignature(response(tx))).toThrow(error)
})
it('accepts supported TRC10 and contract-call structures', () => {
  for (const [type, name, value] of [
    [2, 'TransferAssetContract', new TransferAssetContract({ ownerAddress: owner, toAddress: recipient, amount: 1n, assetName: Buffer.from('1002000') })],
    [31, 'TriggerSmartContract', new TriggerSmartContract({ ownerAddress: owner, contractAddress: recipient, data: Buffer.from('a9059cbb' + '00'.repeat(64), 'hex') })]
  ] as const) {
    const tx = transaction()
    tx.rawData!.contract[0] = new Transaction_Contract({ type, parameter: new Any({ typeUrl: 'type.googleapis.com/protocol.' + name, value: value.toBinary() }) })
    expect(sdk.parseSignature(response(tx)).txId).toBe(id(tx))
  }
})
it('rejects CBOR extensions and trailing bytes', () => {
  const ur = response()
  expect(() => sdk.parseSignature(new UR(Buffer.concat([ur.cbor, Buffer.from('00', 'hex')]), URType.KeystoneSignResult))).toThrow(error)
  const extra = Buffer.concat([Buffer.from('a2', 'hex'), ur.cbor.subarray(1), Buffer.from('024100', 'hex')])
  expect(() => sdk.parseSignature(new UR(extra, URType.KeystoneSignResult))).toThrow(error)
})
it('rejects decompression bombs and truncated compressed data', () => {
  const bomb = new KeystoneSignResult(Buffer.from(pako.gzip(Buffer.alloc(128 * 1024 + 1)))).toUR()
  expect(() => sdk.parseSignature(bomb)).toThrow(error)
  const compressed = KeystoneSignResult.fromCBOR(response().cbor).getSignResult()
  expect(() => sdk.parseSignature(new KeystoneSignResult(compressed.subarray(0, compressed.length - 8)).toUR())).toThrow(error)
})

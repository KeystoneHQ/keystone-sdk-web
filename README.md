# keystone-sdk-web

## Signing API changes

The legacy `keystone-sign-request` / `keystone-sign-result` APIs have been removed. Use TRON Native for TRON and PSBT Extend for LTC, BCH, DASH and DOGE. These protocols require different transaction inputs and response handling; they are not drop-in replacements. Integrations that still require the removed APIs must pin an earlier SDK version.

## UTXO signing with PSBT Extend

| Chain | coinId | Current firmware input paths |
| --- | ---: | --- |
| Litecoin | 2 | `m/49'/2'/account'/change/index` or `m/84'/2'/account'/change/index` |
| Dogecoin | 3 | `m/44'/3'/account'/change/index` |
| Dash | 5 | `m/44'/5'/account'/change/index` |
| Bitcoin Cash | 145 | `m/44'/145'/account'/change/index` |

These paths describe the firmware's supported signing inputs, not a guarantee of support for every script or transaction type. Use a compatible multi-coin firmware. Standard Bitcoin PSBT remains available through `sdk.btc`.

The Web API is:

```ts
const ur = sdk.psbt.generatePSBT(psbtBytes, coinId) // Buffer -> UR
const returnedCoinId = sdk.psbt.parseCoinId(responseUR)
const signedPsbtHex = sdk.psbt.parsePSBT(responseUR) // UR -> hex string
```

Both request and response use `crypto-psbt-extend`. This envelope has no request ID. Save the original PSBT for each pending signing operation and compare the returned transaction against it. Parsing the UR does not verify signatures or produce a broadcast-ready transaction.

### BCH: migrating the request

Previously, `sdk.bch.generateSignRequest` accepted `requestId`, `xfp` and a transaction object containing `inputs`, `outputs` and `fee`. The caller must now construct the PSBT; the SDK does not convert that old object automatically.

| Old field | PSBT representation |
| --- | --- |
| Input transaction hash and index | Unsigned transaction outpoint |
| Input public key, path, fingerprint | Input `bip32Derivation` |
| Input amount | Referenced output in `nonWitnessUtxo` |
| Output address and amount | Output script and value |
| Change public key, path, fingerprint | Output `bip32Derivation` |
| Fee | Input total minus output total |
| Request ID / origin | No equivalent envelope field; track the pending operation locally |

The following reference uses **bitcoinjs-lib 6.x** to construct an unsigned PSBT (its value fields use JavaScript numbers). It is a separate application dependency. Use integer satoshi amounts within JavaScript's safe integer range.

Current firmware requires BCH P2PKH inputs and a full previous transaction (`nonWitnessUtxo`) for every input. A txid and amount alone are insufficient. BCH sighash is `SIGHASH_ALL | FORKID` (`0x41`).

```ts
import KeystoneSDK, { UR, URType } from '@keystonehq/keystone-sdk'
import { Psbt, Transaction, payments } from 'bitcoinjs-lib'
import { Buffer } from 'buffer'

const sdk = new KeystoneSDK()
const BCH = 145
const BCH_ALL_FORKID = 0x41

type Input = {
  txid: string
  vout: number
  previousTxHex: string // Full raw previous transaction, fetched by txid.
  publicKey: Buffer
  path: string
}
type Output = {
  script: Buffer // Decode the BCH recipient address using a BCH-aware library.
  value: number // Satoshis, not BCH.
  change?: { publicKey: Buffer; path: string }
}

function buildBchRequest(inputs: Input[], outputs: Output[], xfp: string) {
  if (!/^[0-9a-f]{8}$/i.test(xfp) || !inputs.length || !outputs.length) {
    throw new Error('Invalid BCH request')
  }
  const masterFingerprint = Buffer.from(xfp, 'hex')
  const psbt = new Psbt()
  psbt.setVersion(2)
  psbt.setLocktime(0)
  let inputTotal = 0
  let outputTotal = 0
  const seen = new Set<string>()
  const checkPath = (path: string) => {
    if (!/^m\/44'\/145'\/\d+'\/[01]\/\d+$/.test(path)) {
      throw new Error('Invalid BCH signing path')
    }
  }
  const addAmount = (total: number, value: number) => {
    if (!Number.isSafeInteger(value) || value < 0 || !Number.isSafeInteger(total + value)) {
      throw new Error('Invalid satoshi amount')
    }
    return total + value
  }
  for (const input of inputs) {
    checkPath(input.path)
    if (!/^(?:[0-9a-f]{2})+$/i.test(input.previousTxHex)) throw new Error('Invalid previous transaction hex')
    const previousBytes = Buffer.from(input.previousTxHex, 'hex')
    const previous = Transaction.fromBuffer(previousBytes)
    const prevout = previous.outs[input.vout]
    if (previous.getId() !== input.txid.toLowerCase() ||
        !Number.isInteger(input.vout) || input.vout < 0 || !prevout) {
      throw new Error('Previous transaction does not match outpoint')
    }
    const outpoint = `${previous.getId()}:${input.vout}`
    if (seen.has(outpoint)) throw new Error('Duplicate input')
    seen.add(outpoint)
    if (!payments.p2pkh({ pubkey: input.publicKey }).output!.equals(prevout.script)) {
      throw new Error('Input public key does not match P2PKH prevout')
    }
    inputTotal = addAmount(inputTotal, prevout.value)
    psbt.addInput({
      hash: input.txid, index: input.vout, sequence: 0xffffffff,
      nonWitnessUtxo: previousBytes,
      sighashType: BCH_ALL_FORKID,
      bip32Derivation: [{ masterFingerprint, path: input.path, pubkey: input.publicKey }],
    })
  }
  for (const output of outputs) {
    outputTotal = addAmount(outputTotal, output.value)
    if (output.change) {
      checkPath(output.change.path)
      if (!payments.p2pkh({ pubkey: output.change.publicKey }).output!.equals(output.script)) {
        throw new Error('Change script does not match public key')
      }
    }
    psbt.addOutput({
      script: output.script, value: output.value,
      ...(output.change ? {
        bip32Derivation: [{ masterFingerprint, path: output.change.path, pubkey: output.change.publicKey }],
      } : {}),
    })
  }
  if (outputTotal > inputTotal) throw new Error('Outputs exceed inputs')
  const originalPsbtHex = psbt.toHex()
  return {
    originalPsbtHex, // Keep privately with this pending signing operation.
    fee: inputTotal - outputTotal, // Apply the wallet's fee/dust policy before showing QR.
    ur: sdk.psbt.generatePSBT(Buffer.from(originalPsbtHex, 'hex'), BCH),
  }
}
```

`publicKey`, `path` and `xfp` must come from the connected wallet/account. Derive and validate them using your wallet's account data. Convert CashAddr/legacy BCH recipient addresses to output scripts with a BCH-aware address implementation; do not pass CashAddr strings to bitcoinjs-lib's Bitcoin address decoder.

Display the returned UR with your QR encoder. Configure the response scanner to accept only `URType.CryptoPSBTExtend`, and assemble multipart UR frames before calling the parser below.

### BCH: parsing the response and completing the transaction

```ts
function parseBchResponse(responseUR: UR): string {
  if (responseUR.type !== URType.CryptoPSBTExtend || sdk.psbt.parseCoinId(responseUR) !== BCH) {
    throw new Error('Unexpected signing response')
  }
  return sdk.psbt.parsePSBT(responseUR) // Signed PSBT hex, NOT raw transaction hex.
}
```

The next step belongs to the application's BCH transaction implementation. The following is an **integration contract**, not an SDK-provided helper:

```ts
type BchTransactionAdapter = {
  verifyAndFinalize(args: {
    originalPsbtHex: string
    signedPsbtHex: string
  }): Promise<{ txId: string; txHex: string }>
}

async function completeBchRequest(
  pending: { originalPsbtHex: string },
  responseUR: UR,
  bch: BchTransactionAdapter,
) {
  return bch.verifyAndFinalize({
    originalPsbtHex: pending.originalPsbtHex,
    signedPsbtHex: parseBchResponse(responseUR),
  })
}
```

Implement `verifyAndFinalize` with a BCH-aware library or your existing BCH transaction code. It must:

1. Decode the PSBT including BCH signatures ending in `0x41`.
2. Require the returned unsigned transaction to equal the saved request, including version, locktime, outpoints, sequences, output scripts and amounts.
3. Take previous transactions, amounts, scripts and expected signer keys from the saved request. Verify each signature using BCH's FORKID digest and the expected public key.
4. Assemble final input scripts using only verified signatures, extract the raw BCH transaction and compute its txid. Reject missing or unexpected signatures.
5. Return `txHex` for the application's existing broadcast flow after verification succeeds.

Do not assume bitcoinjs-lib's default Bitcoin signature decoder, verifier or `finalizeAllInputs()` supports BCH `0x41` signatures. In particular, do not change a BCH signature's trailing byte to `0x01` to broadcast it. The SDK's `parsePSBT()` only extracts the payload; it does not perform these checks.

### DOGE, LTC and DASH

The same `sdk.psbt.generatePSBT` / `parsePSBT` / `parseCoinId` APIs apply with their respective coin IDs. Always check the returned coin ID and retain the original request for transaction/signature verification.

DOGE and supported LTC single-signature transactions can use the standard Bitcoin-style PSBT signature workflow with the appropriate network/address parameters. DASH special previous transactions require DASH-aware serialization and txid handling. BCH's FORKID adapter above must not be reused for these chains.

## TRON: migrating to `tronNative`

| Before | After |
| --- | --- |
| `sdk.tron.generateSignRequest(...)` | `sdk.tronNative.generateSignRequest(...)` |
| `keystone-sign-request` | `tron-sign-request` |
| `sdk.tron.parseSignature(...)` | `sdk.tronNative.parseSignature(...)` |
| `keystone-sign-result` | `tron-signature` |
| Response: full transaction `raw`, `txId`, optional request ID | Response: `requestId` and a 65-byte `signature` as hex |
| `tokenInfo` supplied by caller | Removed; do not send `tokenInfo` |

The transaction input remains unsigned TRON **`raw_data_hex`**, not a JSON transaction, full serialized transaction, txid or precomputed hash. `requestId`, `signData`, `path`, `xfp`, `address` and `origin` retain their roles. The new optional `dataType` defaults to `1` (transaction); `2` signs a personal message. Hex may start with `0x` or `0X`.

### Generate a transaction request and track the pending operation

```ts
import KeystoneSDK, { UR, URType, TronNativeDataType } from '@keystonehq/keystone-sdk'
import { v4 as uuidv4 } from 'uuid'

const tronSdk = new KeystoneSDK()
type PendingTron = Readonly<{
  rawDataHex: string
  expectedAddress: string
}>
const pendingTron = new Map<string, PendingTron>()

function createTronTransactionRequest(args: {
  rawDataHex: string
  path: string
  xfp: string
  expectedAddress: string // Derive from the selected connected wallet account.
}) {
  const requestId = uuidv4()
  const rawDataHex = args.rawDataHex.replace(/^0x/i, '').toLowerCase()
  const ur = tronSdk.tronNative.generateSignRequest({
    requestId,
    signData: rawDataHex,
    path: args.path, // e.g. m/44'/195'/0'/0/0
    xfp: args.xfp,
    address: args.expectedAddress,
    origin: 'My Wallet',
    dataType: TronNativeDataType.Transaction,
  })
  pendingTron.set(requestId, Object.freeze({
    rawDataHex,
    expectedAddress: args.expectedAddress,
  }))
  return { requestId, ur }
}

// Pass request.ur directly to the animated QR encoder.
// Configure the response scanner to accept only URType.TronNativeSignature.
```

Use a new UUID for every request. Keep the expected request ID with the active scan screen; cancel/remove the pending operation when the user cancels it. The example stores requests in memory, so restarting the app requires a new signing request. It covers single-signature transactions, not TRON account-permission or multisig workflows.

### Parse the response, verify and construct the signed transaction

The SDK validates the response structure, but does not verify the cryptographic signature. Supply the following application adapter using your TRON transaction implementation. This is an **integration contract**, not an SDK method:

```ts
type TronTransactionAdapter = {
  verifyAndAssemble(args: {
    rawDataHex: string
    expectedAddress: string
    signatureHex: string
  }): Promise<{ txId: string; txHex: string }>
}

async function completeTronTransaction(
  expectedRequestId: string,
  responseUR: UR, // Complete decoded UR; assemble multipart frames first.
  tron: TronTransactionAdapter,
) {
  if (responseUR.type !== URType.TronNativeSignature) {
    throw new Error('Unexpected TRON response type')
  }
  const result = tronSdk.tronNative.parseSignature(responseUR)
  if (result.requestId !== expectedRequestId) {
    throw new Error('Response does not match the active signing request')
  }
  const pending = pendingTron.get(expectedRequestId)
  if (!pending) throw new Error('Signing request expired or already consumed')
  // Consume before awaiting verification to prevent concurrent/replayed completion.
  pendingTron.delete(expectedRequestId)
  return tron.verifyAndAssemble({
    rawDataHex: pending.rawDataHex,
    expectedAddress: pending.expectedAddress,
    signatureHex: result.signature,
  })
}
```

Implement `verifyAndAssemble` to:

1. Compute `txId = SHA256(original raw_data bytes)` using the saved hex, not a JSON reserialization.
2. Verify the recoverable secp256k1 signature against that digest and the expected account address; verify the transaction's owner matches the account for this single-signature flow.
3. Construct a TRON Transaction protobuf containing the **unchanged** original `raw_data` and the verified signature. Return its serialized hex and the computed txid.
4. Pass that transaction to the application's existing broadcast API only after verification succeeds. If your API expects a transaction object instead of hex, return the corresponding object from the adapter and confirm its serialized raw_data matches the saved bytes.

Never treat `result.signature` as a full transaction. Do not update timestamp, expiration, fee limit, memo or any other raw_data field after signing. An expired transaction must be rebuilt and signed again. If verification fails, create a new signing request rather than reusing the consumed one.

### Personal messages

```ts
import { Buffer } from 'buffer'

const messageRequest = tronSdk.tronNative.generateSignRequest({
  requestId: uuidv4(),
  signData: Buffer.from('Hello', 'utf8').toString('hex'),
  path: "m/44'/195'/0'/0/0",
  xfp: '73c5da0a', // Public abandon × 11 + about test wallet, empty passphrase.
  address: 'TUEZSdKsoDHQMeZwihtdoBiN46zxhGWYdH',
  dataType: TronNativeDataType.PersonalMessage,
})
```

Track the original message and request ID separately. Parse the response with the same `tronNative.parseSignature()` method and match its request ID, but verify it with TRON's personal-message signing rules. Do not send a message signature through the transaction adapter or broadcast it. The SDK does not perform personal-message signature verification.

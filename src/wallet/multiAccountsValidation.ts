import { Buffer } from 'buffer'
import { CryptoMultiAccounts, CryptoHDKey, CryptoKeypath, CryptoCoinInfo, PathComponent, DataItem, decodeToDataItem } from '@keystonehq/bc-ur-registry'
import { AccountNote } from '../types'
export const MAX_CONNECTION_CBOR_BYTES = 64 * 1024
type ConnectionValue = unknown

function invalidMultiAccounts (): never {
  throw new Error('multi accounts is invalid')
}

const MAX_KEYS = 256
const MAX_PATH_COMPONENTS = 32
const ETH_NOTES: string[] = Object.values(AccountNote)
type Fields = Map<number | string, ConnectionValue>

function fields (value: ConnectionValue, tag?: number): Fields {
  if (tag !== undefined) {
    if (!(value instanceof DataItem) || value.getTag() !== tag) return invalidMultiAccounts()
    value = value.getData()
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value) || Buffer.isBuffer(value) || value instanceof DataItem) {
    return invalidMultiAccounts()
  }
  // The registry decoder represents CBOR maps as objects. Only known fields are read below.
  return new Map(Object.entries(value).map(([key, data]) => [/^(0|[1-9][0-9]*)$/.test(key) ? Number(key) : key, data]))
}

function uint (value: ConnectionValue | undefined, max = 0xffffffff): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > max) return invalidMultiAccounts()
  return value
}

function fingerprint (value: ConnectionValue | undefined): Buffer {
  const result = Buffer.alloc(4)
  result.writeUInt32BE(uint(value), 0)
  return result
}

function bytes (value: ConnectionValue | undefined, lengths: number[]): Buffer {
  if (!Buffer.isBuffer(value) || !lengths.includes(value.length)) return invalidMultiAccounts()
  return Buffer.from(value)
}

function optionalText (map: Fields, key: number, maxBytes: number): string | undefined {
  if (!map.has(key)) return undefined
  const value = map.get(key)
  if (typeof value !== 'string' || Buffer.byteLength(value, 'utf8') > maxBytes || Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
    return invalidMultiAccounts()
  }
  return value
}

function keypath (value: ConnectionValue | undefined, mfp: Buffer, origin: boolean): CryptoKeypath {
  const map = fields(value, 304)
  const values = map.get(1)
  if (!Array.isArray(values) || values.length % 2 !== 0 || values.length > MAX_PATH_COMPONENTS * 2 ||
    values.length < (origin ? 4 : 2)) return invalidMultiAccounts()
  const components: PathComponent[] = []
  for (let i = 0; i < values.length; i += 2) {
    const index = values[i]
    const hardened = values[i + 1]
    if (typeof hardened !== 'boolean') return invalidMultiAccounts()
    const wildcard = Array.isArray(index) && index.length === 0
    if (wildcard && origin) return invalidMultiAccounts()
    components.push(new PathComponent({ index: wildcard ? undefined : uint(index, 0x7fffffff), hardened }))
  }
  const source = map.has(2) ? fingerprint(map.get(2)) : undefined
  if (source !== undefined && !source.equals(mfp)) return invalidMultiAccounts()
  const depth = map.has(3) ? uint(map.get(3), 255) : undefined
  // Reconstruct known fields only; do not forward extension maps.
  return new CryptoKeypath(components, source, depth)
}

function coinInfo (value: ConnectionValue | undefined): CryptoCoinInfo {
  const map = fields(value, 305)
  const type = map.has(1) ? uint(map.get(1)) : undefined
  const network = map.has(2) ? uint(map.get(2), 1) : undefined
  return new CryptoCoinInfo(type, network)
}

function note (map: Fields, coinType: number): string | undefined {
  const value = optionalText(map, 10, 1024)
  if (value === undefined) return undefined
  if (coinType === 60 && ETH_NOTES.includes(value)) return value
  if (coinType !== 133) return undefined
  // ZEC's note is an embedded object, not a free-form string to forward.
  let parsed: unknown
  try { parsed = JSON.parse(value) } catch { return invalidMultiAccounts() }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return invalidMultiAccounts()
  const sfp = (parsed as Record<string, unknown>).seed_fingerprint
  if (typeof sfp !== 'string' || !/^[0-9a-fA-F]{64}$/.test(sfp)) return invalidMultiAccounts()
  return JSON.stringify({ seed_fingerprint: sfp.toLowerCase() })
}

function hdkey (value: ConnectionValue, mfp: Buffer): CryptoHDKey {
  const map = fields(value, 303)
  for (const flag of [1, 2]) {
    // Missing flags are used by historical public-key exports; true is never allowed.
    if (map.has(flag) && map.get(flag) !== false) return invalidMultiAccounts()
  }
  const key = bytes(map.get(3), [32, 33])
  if (key.length === 33 && key[0] !== 2 && key[0] !== 3) return invalidMultiAccounts()
  const origin = keypath(map.get(6), mfp, true)
  const coinType = origin.getComponents()[1].getIndex()!
  const chainCode = map.has(4) ? bytes(map.get(4), [32]) : undefined
  const parent = map.has(8) ? fingerprint(map.get(8)) : undefined
  if (key.length !== 33 && parent !== undefined && chainCode !== undefined) return invalidMultiAccounts()
  return new CryptoHDKey({
    isMaster: false,
    isPrivateKey: false,
    key,
    chainCode,
    useInfo: map.has(5) ? coinInfo(map.get(5)) : undefined,
    origin,
    children: map.has(7) ? keypath(map.get(7), mfp, false) : undefined,
    parentFingerprint: parent,
    name: optionalText(map, 9, 128),
    note: note(map, coinType)
  })
}

/** Validates the public account exchange schema and drops all unrecognized fields. */
export function validatedMultiAccounts (cbor: Buffer): CryptoMultiAccounts {
  try {
    if (!Buffer.isBuffer(cbor) || cbor.length === 0 || cbor.length > MAX_CONNECTION_CBOR_BYTES) return invalidMultiAccounts()
    const map = fields(decodeToDataItem(cbor).getData())
    const mfp = fingerprint(map.get(1))
    const values = map.get(2)
    if (!Array.isArray(values) || values.length === 0 || values.length > MAX_KEYS) return invalidMultiAccounts()
    const keys = values.map(value => hdkey(value, mfp))
    const origins = new Set<string>()
    for (const key of keys) {
      const path = key.getOrigin()!.getPath()!
      if (origins.has(path)) return invalidMultiAccounts()
      origins.add(path)
    }
    return new CryptoMultiAccounts(
      mfp, keys, optionalText(map, 3, 128), optionalText(map, 4, 128), optionalText(map, 5, 64)
    )
  } catch {
    return invalidMultiAccounts()
  }
}

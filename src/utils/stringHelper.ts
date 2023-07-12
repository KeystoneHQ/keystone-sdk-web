import * as uuid from 'uuid'
import { type PathComponent } from '../types/account'

export * from './coin'
export {
  uuid
}

export function toHex (buf: Buffer | Uint8Array | undefined): string {
  return buf === undefined ? '' : Buffer.from(buf).toString('hex')
}

export function toBuffer (hex: string | undefined): Buffer {
  return Buffer.from(hex ?? '', 'hex')
}

export function uuidParse (id: string): Buffer {
  return Buffer.from(uuid.parse(id))
}

export function uuidStringify (id: Buffer): string {
  return uuid.stringify(id)
}

export function parsePath (path: string): PathComponent[] {
  const chunks = path.replace(/^m\//i, '').split('/')
  return chunks.map(chunk => {
    const hardened = chunk.endsWith("'")
    return {
      index: Number(hardened ? chunk.substring(0, chunk.length - 1) : chunk),
      hardened
    }
  })
}

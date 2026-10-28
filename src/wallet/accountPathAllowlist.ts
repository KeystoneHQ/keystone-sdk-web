import { type CryptoKeypath } from '@keystonehq/bc-ur-registry'

// Unified connection-origin allowlist for firmware 3.2.0.
const allowedPaths = new Set<string>([
  "m/44'/60'/0'", "m/44'/60'/0'/0", "m/44'/501'",
  "m/44'/607'/0'", "m/44'/195'/0'", "m/44'/144'/0'",
  "m/44'/3'/0'", "m/49'/2'/0'", "m/84'/2'/0'",
  "m/44'/145'/0'", "m/44'/5'/0'", "m/44'/133'/0'", "m/44'/931'/0'"
])
for (const purpose of [44, 49, 84, 86]) {
  for (const coin of [0, 1]) allowedPaths.add(`m/${purpose}'/${coin}'/0'`)
}
for (let account = 0; account <= 9; account++) {
  allowedPaths.add(`m/44'/60'/${account}'/0/0`)
  allowedPaths.add(`m/44'/501'/${account}'`)
  allowedPaths.add(`m/44'/501'/${account}'/0'`)
  for (const coin of [784, 637, 4218]) allowedPaths.add(`m/44'/${coin}'/${account}'/0'/0'`)
}
for (let account = 0; account <= 23; account++) allowedPaths.add(`m/1852'/1815'/${account}'`)
for (let account = 0; account <= 4; account++) allowedPaths.add(`m/44'/148'/${account}'`)

const cosmosCoins = new Set([118, 529, 394, 234, 564, 459, 60, 330])

/** Checks the complete origin, not descriptor children (which may contain wildcards). */
export function assertAllowedAccountPath (origin: CryptoKeypath | undefined): string {
  const invalid = (): never => { throw new Error('account path is not allowed') }
  if (origin === undefined) return invalid()
  const components = origin.getComponents()
  if (components.length < 2 || components.length > 5) return invalid()
  for (const component of components) {
    const index = component.getIndex()
    if (component.isWildcard() || typeof index !== 'number' || !Number.isInteger(index) ||
      index < 0 || index > 0x7fffffff || typeof component.isHardened() !== 'boolean') return invalid()
  }
  const path = 'm/' + components.map(c => `${c.getIndex()}${c.isHardened() ? "'" : ''}`).join('/')
  if (allowedPaths.has(path)) return path

  // Evmos (coin 60) intentionally shares this address-index range with EVM.
  if (components.length === 5 &&
    components[0].getIndex() === 44 && components[0].isHardened() &&
    cosmosCoins.has(components[1].getIndex()!) && components[1].isHardened() &&
    components[2].getIndex() === 0 && components[2].isHardened() &&
    components[3].getIndex() === 0 && !components[3].isHardened() &&
    !components[4].isHardened() && components[4].getIndex()! <= 999999999) return path
  return invalid()
}

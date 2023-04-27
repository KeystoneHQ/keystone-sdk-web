import { CryptoKeypath, PathComponent } from '@keystonehq/bc-ur-registry'

export const pathToKeypath = (path: string): CryptoKeypath => {
  const paths = path.replace(/[m|M]\//, '').split('/')
  const pathComponents = paths.map(path => {
    const index = parseInt(path.replace("'", ''), 10)
    const isHardened = path.endsWith("'")
    return new PathComponent({ index, hardened: isHardened })
  })
  return new CryptoKeypath(pathComponents)
}

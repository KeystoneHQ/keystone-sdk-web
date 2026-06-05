/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/cache/'],
  moduleNameMapper: {
    '^EthSignRequest$': '<rootDir>/jest/EthSignRequest.ts'
  }
}

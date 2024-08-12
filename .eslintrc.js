module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  extends: 'eslint:recommended',
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    indent: ['error', 2],
    "no-unused-vars": "warn",
  },
}

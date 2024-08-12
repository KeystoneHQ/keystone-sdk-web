import bs58check from 'bs58check'
import { TransferAssetContract, TransferContract, TriggerSmartContract } from '../../gen/chains/tron/protos/contract_pb'
import { Transaction_Contract_ContractType, Transaction_raw } from '../../gen/chains/tron/protos/tron_pb'
import { type TokenInfo } from '../../types'
import { toHex } from '../../utils'
import { LatestBlock, TronTx } from '../../gen/chains/keystone/protos/tron_transaction_pb'

function formatAddress (address: Uint8Array): string {
  return bs58check.encode(address)
}

export function raw2tx (signData: Buffer, tokenInfo?: TokenInfo): TronTx {
  let rawData
  try {
    rawData = Transaction_raw.fromBinary(signData)
  } catch (e) {
    throw new Error('Sign data is invalid')
  }

  const override = (tokenInfo !== undefined)
    ? {
      decimals: tokenInfo.decimals,
      tokenFullName: tokenInfo.name,
      tokenShortName: tokenInfo.symbol
    }
    : null

  const refBlockHash = Buffer.from([...new Uint8Array(8).fill(0), ...rawData.refBlockHash, ...new Uint8Array(16).fill(0)])
  const latestBlock = new LatestBlock({
    hash: toHex(refBlockHash),
    number: Number(`0x${toHex(rawData.refBlockBytes.slice(0, 2))}`),
    timestamp: BigInt(Number(rawData.expiration) - 600 * 5 * 1000)
  })

  const contractData = rawData.contract[0]
  if (contractData.parameter === undefined) {
    throw new Error('contract is invalid')
  }
  let contract
  switch (contractData.type) {
  case Transaction_Contract_ContractType.TransferContract:
    try {
      contract = TransferContract.fromBinary(contractData.parameter.value)
    } catch (e) {
      throw new Error('sign data is invalid')
    }
    return new TronTx({
      fee: Number(rawData.feeLimit),
      from: formatAddress(contract.ownerAddress),
      latestBlock,
      to: formatAddress(contract.toAddress),
      token: 'TRX',
      value: contract.amount.toString()
    })
  case Transaction_Contract_ContractType.TransferAssetContract:
    try {
      contract = TransferAssetContract.fromBinary(contractData.parameter.value)
    } catch (e) {
      throw new Error('sign data is invalid')
    }
    if (override == null) {
      throw new Error('token info is invalid')
    }
    return new TronTx({
      fee: Number(rawData.feeLimit),
      from: formatAddress(contract.ownerAddress),
      latestBlock,
      override,
      to: formatAddress(contract.toAddress),
      token: Buffer.from(contract.assetName).toString(),
      value: contract.amount.toString()
    })

  case Transaction_Contract_ContractType.TriggerSmartContract:
    try {
      contract = TriggerSmartContract.fromBinary(contractData.parameter.value)
    } catch (e) {
      throw new Error('sign data is invalid')
    }

    if (override == null) {
      throw new Error('token info is invalid')
    }
    return new TronTx({
      contractAddress: formatAddress(contract.contractAddress),
      fee: Number(rawData.feeLimit),
      from: formatAddress(contract.ownerAddress),
      latestBlock,
      override,
      to: formatAddress(Buffer.from([65, ...contract.data.slice(16, 36)])),
      value: BigInt(`0x${Buffer.from(contract.data.slice(36, 68)).toString('hex')}`).toString()
    })
  default:
    throw new Error('contract is not supported')
  }
}

import { V3Transaction } from 'src/v3transactions/v3transaction.model';

export type RedisV3TransactionsStreamTransaction = {
  id: number;
  pool_address: string;
  chain_id: number;
  tx_hash: string;
  tx_timestamp: number;
  block_number: number;
  amount0: number;
  amount1: number;
  archive_token0_usd_price: number;
  archive_token1_usd_price: number;
};

export const RedisV3TransactionsStreamTransactionToModel = (
  tx: RedisV3TransactionsStreamTransaction,
): V3Transaction => {
  return {
    id: tx.id,

    txHash: tx.tx_hash,

    txTimestamp: tx.tx_timestamp,

    blockNumber: tx.block_number,

    amount0: tx.amount0,

    amount1: tx.amount1,

    archiveToken0UsdPrice: tx.archive_token0_usd_price,

    archiveToken1UsdPrice: tx.archive_token1_usd_price,

    chainId: tx.chain_id,

    poolAddress: tx.pool_address,

    pool: null,
  };
};

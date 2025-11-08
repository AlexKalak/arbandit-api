import { V3Transaction } from 'src/v3transactions/v3transaction.model';

export type RedisV3TransactionsStreamTransaction = {
  id: number;
  pool_address: string;
  chain_id: number;
  tx_hash: string;
  block_number: number;
  amount0: string;
  amount1: string;
  archive_token0_usd_price: string;
  archive_token1_usd_price: string;
};

export const RedisV3TransactionsStreamTransactionToModel = (
  tx: RedisV3TransactionsStreamTransaction,
): V3Transaction => {
  return {
    id: tx.id,

    txHash: tx.tx_hash,

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

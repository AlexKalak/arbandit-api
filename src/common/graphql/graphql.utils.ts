export const getV3TransactionTrigger = (
  poolAddress: string,
  chainId: number,
): string => {
  return `transactionAdded_${chainId}_${poolAddress}`;
};

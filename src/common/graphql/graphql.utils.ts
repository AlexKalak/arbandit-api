export const getV3SwapTrigger = (
  poolAddress: string,
  chainId: number,
): string => {
  return `v3SwapAdded_${chainId}_${poolAddress}`;
};

export const getV2SwapTrigger = (
  pairAddress: string,
  chainId: number,
): string => {
  // return `v2SwapAdded_${chainId}_${pairAddress}`;
  return 'aaa';
};

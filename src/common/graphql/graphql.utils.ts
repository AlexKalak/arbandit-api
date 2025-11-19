export const getV3SwapTrigger = (
  poolAddress: string,
  chainId: number,
): string => {
  return `swapAdded_${chainId}_${poolAddress}`;
};

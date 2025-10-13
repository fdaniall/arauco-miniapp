"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TREE_NFT_CONFIG } from "../contracts/TreeNFT.config";
import { useAccount } from "wagmi";

export function useTreeNFT() {
  const { address } = useAccount();

  const { data: hasTree, refetch: refetchHasTree } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "hasTree",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: treeData, refetch: refetchTreeData } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "getTreeData",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasTree,
    },
  });

  const { data: canWaterToday, refetch: refetchCanWater } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "canWaterToday",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasTree,
    },
  });

  const { data: totalSupply } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "totalSupply",
  });

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintTree = () => {
    writeContract({
      ...TREE_NFT_CONFIG,
      functionName: "mintTree",
    });
  };

  const waterTree = () => {
    writeContract({
      ...TREE_NFT_CONFIG,
      functionName: "waterTree",
    });
  };

  const useExtraWater = () => {
    writeContract({
      ...TREE_NFT_CONFIG,
      functionName: "useExtraWater",
    });
  };

  const refetchAll = () => {
    refetchHasTree();
    refetchTreeData();
    refetchCanWater();
  };

  const parsedTreeData = treeData
    ? {
        waterCount: Number((treeData as unknown[])[0]),
        lastWateredDay: Number((treeData as unknown[])[1]),
        currentStreak: Number((treeData as unknown[])[2]),
        longestStreak: Number((treeData as unknown[])[3]),
        extraWater: Number((treeData as unknown[])[4]),
        stage: Number((treeData as unknown[])[5]),
        exists: Boolean((treeData as unknown[])[6]),
      }
    : null;

  return {
    hasTree: Boolean(hasTree),
    treeData: parsedTreeData,
    canWaterToday: Boolean(canWaterToday),
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    mintTree,
    waterTree,
    useExtraWater,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    refetchAll,
  };
}

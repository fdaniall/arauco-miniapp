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
      refetchInterval: 3000,
      gcTime: 0,
      staleTime: 0,
    },
  });

  const { data: treeData, refetch: refetchTreeData } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "getTreeData",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasTree,
      refetchInterval: 3000,
      gcTime: 0,
      staleTime: 0,
    },
  });

  const { data: canWaterToday, refetch: refetchCanWater } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "canWaterToday",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasTree,
      refetchInterval: 3000,
      gcTime: 0,
      staleTime: 0,
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
      gas: BigInt(200000),
    });
  };

  const waterTree = () => {
    writeContract({
      ...TREE_NFT_CONFIG,
      functionName: "waterTree",
      gas: BigInt(200000),
    });
  };

  const useExtraWater = () => {
    writeContract({
      ...TREE_NFT_CONFIG,
      functionName: "useExtraWater",
      gas: BigInt(200000),
    });
  };

  const refetchAll = async () => {
    await Promise.all([
      refetchHasTree(),
      refetchTreeData(),
      refetchCanWater(),
    ]);
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

  if (parsedTreeData) {
    console.log("🌳 Tree Data from Blockchain:", {
      waterCount: parsedTreeData.waterCount,
      stage: parsedTreeData.stage,
      currentStreak: parsedTreeData.currentStreak,
      raw: treeData,
    });
  }

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

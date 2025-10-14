"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TREE_NFT_CONFIG } from "../contracts/TreeNFT.config";
import { useAccount } from "wagmi";

export function useTreeNFT() {
  const { address } = useAccount();

  console.log("👛 Connected Wallet Address:", address);

  const { data: hasTree, refetch: refetchHasTree } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "hasTree",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // Reduced from 3s to 10s
      gcTime: 1000 * 60 * 5, // Cache for 5 minutes
      staleTime: 5000, // Consider fresh for 5 seconds
    },
  });

  const { data: treeData, refetch: refetchTreeData } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "getTreeData",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasTree,
      refetchInterval: 10000, // Reduced from 3s to 10s
      gcTime: 1000 * 60 * 5, // Cache for 5 minutes
      staleTime: 5000, // Consider fresh for 5 seconds
    },
  });

  const { data: canWaterToday, refetch: refetchCanWater } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "canWaterToday",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasTree,
      refetchInterval: 10000, // Reduced from 3s to 10s
      gcTime: 1000 * 60 * 5, // Cache for 5 minutes
      staleTime: 5000, // Consider fresh for 5 seconds
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
        waterCount: Number(BigInt((treeData as any).waterCount || 0)),
        lastWateredDay: Number(BigInt((treeData as any).lastWateredDay || 0)),
        currentStreak: Number(BigInt((treeData as any).currentStreak || 0)),
        longestStreak: Number(BigInt((treeData as any).longestStreak || 0)),
        extraWater: Number(BigInt((treeData as any).extraWater || 0)),
        stage: Number(BigInt((treeData as any).stage || 0)),
        titleRank: Number((treeData as any).titleRank || 0),
        exists: Boolean((treeData as any).exists),
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

"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TREE_NFT_CONFIG } from "../contracts/TreeNFT.config";
import { useAccount } from "wagmi";

export function useTreeNFT() {
  const { address } = useAccount();

  // ============ Read Functions ============

  /**
   * Check if user has a tree
   */
  const { data: hasTree, refetch: refetchHasTree } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "hasTree",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  /**
   * Get user's tree data
   */
  const { data: treeData, refetch: refetchTreeData } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "getTreeData",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasTree,
    },
  });

  /**
   * Check if user can water today
   */
  const { data: canWaterToday, refetch: refetchCanWater } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "canWaterToday",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!hasTree,
    },
  });

  /**
   * Get total supply
   */
  const { data: totalSupply } = useReadContract({
    ...TREE_NFT_CONFIG,
    functionName: "totalSupply",
  });

  // ============ Write Functions ============

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Mint a new tree NFT
   */
  const mintTree = () => {
    writeContract({
      ...TREE_NFT_CONFIG,
      functionName: "mintTree",
    });
  };

  /**
   * Water the tree
   */
  const waterTree = () => {
    writeContract({
      ...TREE_NFT_CONFIG,
      functionName: "waterTree",
    });
  };

  /**
   * Use extra water
   */
  const useExtraWater = () => {
    writeContract({
      ...TREE_NFT_CONFIG,
      functionName: "useExtraWater",
    });
  };

  // ============ Helpers ============

  /**
   * Refetch all data
   */
  const refetchAll = () => {
    refetchHasTree();
    refetchTreeData();
    refetchCanWater();
  };

  /**
   * Parse tree data from contract
   */
  const parsedTreeData = treeData
    ? {
        waterCount: Number(treeData[0]),
        lastWateredDay: Number(treeData[1]),
        currentStreak: Number(treeData[2]),
        longestStreak: Number(treeData[3]),
        extraWater: Number(treeData[4]),
        stage: Number(treeData[5]),
        exists: Boolean(treeData[6]),
      }
    : null;

  return {
    // State
    hasTree: Boolean(hasTree),
    treeData: parsedTreeData,
    canWaterToday: Boolean(canWaterToday),
    totalSupply: totalSupply ? Number(totalSupply) : 0,

    // Write functions
    mintTree,
    waterTree,
    useExtraWater,

    // Transaction state
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,

    // Utilities
    refetchAll,
  };
}

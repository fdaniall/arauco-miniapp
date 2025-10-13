import { baseSepolia } from "viem/chains";
import TreeNFTABIJson from "./TreeNFT.abi.json";

export const TreeNFTABI = TreeNFTABIJson;

export const TREE_NFT_CONFIG = {
  address: process.env.NEXT_PUBLIC_TREE_NFT_ADDRESS as `0x${string}`,
  abi: TreeNFTABI,
  chainId: baseSepolia.id,
};

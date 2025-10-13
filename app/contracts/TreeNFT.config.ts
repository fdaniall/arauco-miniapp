import { baseSepolia } from "viem/chains";
import { TreeNFTABI } from "./TreeNFT.abi";

export const TREE_NFT_CONFIG = {
  address: process.env.NEXT_PUBLIC_TREE_NFT_ADDRESS as `0x${string}`,
  abi: TreeNFTABI,
  chainId: baseSepolia.id,
} as const;

export { TreeNFTABI };

export const TREE_STAGES = ["Seed", "Sprout", "Young Tree", "Mature Tree", "Forest Tree"] as const;

export const MILESTONE_DAYS = {
  FIRST_WATERING: 1,
  SPROUT: 3,
  WEEK_STREAK: 7,
  MATURE_TREE: 14,
  FOREST_GUARDIAN: 30,
} as const;

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TREE_NFT_ADDRESS || "";
export const BASESCAN_URL = `https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`;

export const POLLING_INTERVAL = 10000;
export const CACHE_TIME = 1000 * 60 * 5;
export const STALE_TIME = 5000;

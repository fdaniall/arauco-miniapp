/**
 * Shared constants for Arauco Forest app
 */

// Tree stage names (shared between components)
export const TREE_STAGES = ["Seed", "Sprout", "Young Tree", "Mature Tree", "Forest Tree"] as const;

// Milestone days for celebrations
export const MILESTONE_DAYS = {
  FIRST_WATERING: 1,
  SPROUT: 3,
  WEEK_STREAK: 7,
  MATURE_TREE: 14,
  FOREST_GUARDIAN: 30,
} as const;

// Contract info
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TREE_NFT_ADDRESS || "";
export const BASESCAN_URL = `https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`;

// Polling intervals (milliseconds)
export const POLLING_INTERVAL = 10000; // 10 seconds
export const CACHE_TIME = 1000 * 60 * 5; // 5 minutes
export const STALE_TIME = 5000; // 5 seconds

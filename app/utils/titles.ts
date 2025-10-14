export interface TitleInfo {
  rank: number;
  name: string;
  emoji: string;
  requiredDays: number;
  nextRank?: {
    name: string;
    requiredDays: number;
  };
}

export const TITLE_RANKS: Record<number, TitleInfo> = {
  0: {
    rank: 0,
    name: "Seedling Keeper",
    emoji: "🌱",
    requiredDays: 0,
    nextRank: { name: "Novice Gardener", requiredDays: 7 },
  },
  1: {
    rank: 1,
    name: "Novice Gardener",
    emoji: "🌿",
    requiredDays: 7,
    nextRank: { name: "Expert Gardener", requiredDays: 30 },
  },
  2: {
    rank: 2,
    name: "Expert Gardener",
    emoji: "🌳",
    requiredDays: 30,
    nextRank: { name: "Master Gardener", requiredDays: 100 },
  },
  3: {
    rank: 3,
    name: "Master Gardener",
    emoji: "🏆",
    requiredDays: 100,
    nextRank: { name: "Forest Guardian", requiredDays: 365 },
  },
  4: {
    rank: 4,
    name: "Forest Guardian",
    emoji: "👑",
    requiredDays: 365,
  },
};

export function getTitleInfo(titleRank: number): TitleInfo {
  return TITLE_RANKS[titleRank] || TITLE_RANKS[0];
}

export function getProgressToNextTitle(
  waterCount: number,
  titleRank: number
): { current: number; total: number; percentage: number } | null {
  const titleInfo = getTitleInfo(titleRank);

  if (!titleInfo.nextRank) {
    return null;
  }

  const current = waterCount;
  const total = titleInfo.nextRank.requiredDays;
  const percentage = Math.min((current / total) * 100, 100);

  return { current, total, percentage };
}

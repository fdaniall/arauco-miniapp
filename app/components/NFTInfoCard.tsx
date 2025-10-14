"use client";

import { motion } from "framer-motion";
import { getTitleInfo } from "../utils/titles";
import styles from "./NFTInfoCard.module.css";

interface NFTInfoCardProps {
  stage: number;
  titleRank: number;
  waterCount: number;
  currentStreak: number;
  contractAddress: string;
}

const STAGE_NAMES = ["Seed", "Sprout", "Young Tree", "Mature Tree", "Forest Tree"];

export default function NFTInfoCard({
  stage,
  titleRank,
  waterCount,
  currentStreak,
  contractAddress,
}: NFTInfoCardProps) {
  const titleInfo = getTitleInfo(titleRank);
  const openSeaUrl = `https://testnets.opensea.io/assets/base-sepolia/${contractAddress}/0`;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h3 className={styles.title}>Your Tree NFT</h3>
      <div className={styles.divider} />

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Stage</span>
          <span className={styles.value}>{STAGE_NAMES[stage]}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Title</span>
          <span className={styles.value}>
            {titleInfo.emoji} {titleInfo.name}
          </span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Days Grown</span>
          <span className={styles.value}>{waterCount}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Current Streak</span>
          <span className={styles.value}>{currentStreak} 🔥</span>
        </div>
      </div>

      <motion.a
        href={openSeaUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.openSeaButton}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View on OpenSea →
      </motion.a>
    </motion.div>
  );
}

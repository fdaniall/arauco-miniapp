"use client";

import { motion } from "framer-motion";
import { getTitleInfo, getProgressToNextTitle } from "../utils/titles";
import styles from "./TitleProgress.module.css";

interface TitleProgressProps {
  titleRank: number;
  waterCount: number;
}

export default function TitleProgress({ titleRank, waterCount }: TitleProgressProps) {
  const titleInfo = getTitleInfo(titleRank);
  const progress = getProgressToNextTitle(waterCount, titleRank);

  if (!progress || !titleInfo.nextRank) {
    return (
      <div className={styles.maxRank}>
        <span className={styles.crown}>👑</span>
        <p>Maximum Rank Achieved!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>Next Title</span>
        <span className={styles.target}>{titleInfo.nextRank.name}</span>
      </div>
      <div className={styles.progressBar}>
        <motion.div
          className={styles.progressFill}
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className={styles.footer}>
        <span className={styles.days}>
          {progress.current} / {progress.total} days
        </span>
        <span className={styles.percentage}>{Math.floor(progress.percentage)}%</span>
      </div>
    </div>
  );
}

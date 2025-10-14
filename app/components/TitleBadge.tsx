"use client";

import { motion } from "framer-motion";
import { getTitleInfo } from "../utils/titles";
import styles from "./TitleBadge.module.css";

interface TitleBadgeProps {
  titleRank: number;
  waterCount: number;
}

export default function TitleBadge({ titleRank, waterCount }: TitleBadgeProps) {
  const titleInfo = getTitleInfo(titleRank);

  return (
    <motion.div
      className={styles.badge}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.emoji}>{titleInfo.emoji}</div>
      <div className={styles.content}>
        <h3 className={styles.title}>{titleInfo.name}</h3>
        <p className={styles.subtitle}>{waterCount} days milestone</p>
      </div>
    </motion.div>
  );
}
